import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  isLocal?: boolean; // Flag for locally stored todos
}

interface TodoState {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  isOffline: boolean;
  pendingOperations: PendingOperation[];
}

// For tracking operations that need to be synced with the server
type OperationType = 'add' | 'update' | 'delete';
interface PendingOperation {
  type: OperationType;
  data: any;
  timestamp: number;
}

// Load any saved todos from localStorage
const loadLocalTodos = (): Todo[] => {
  try {
    const localTodos = localStorage.getItem('todos');
    return localTodos ? JSON.parse(localTodos) : [];
  } catch (error) {
    console.error('Error loading local todos:', error);
    return [];
  }
};

// Load any pending operations from localStorage
const loadPendingOperations = (): PendingOperation[] => {
  try {
    const pendingOps = localStorage.getItem('pendingOperations');
    return pendingOps ? JSON.parse(pendingOps) : [];
  } catch (error) {
    console.error('Error loading pending operations:', error);
    return [];
  }
};

const initialState: TodoState = {
  todos: loadLocalTodos(),
  isLoading: false,
  error: null,
  isOffline: false,
  pendingOperations: loadPendingOperations(),
};

const API_URL = 'http://localhost:5000/api/todos';

// Helper to save todos to localStorage
const saveLocalTodos = (todos: Todo[]) => {
  try {
    localStorage.setItem('todos', JSON.stringify(todos));
  } catch (error) {
    console.error('Error saving todos to localStorage:', error);
  }
};

// Helper to save pending operations to localStorage
const savePendingOperations = (operations: PendingOperation[]) => {
  try {
    localStorage.setItem('pendingOperations', JSON.stringify(operations));
  } catch (error) {
    console.error('Error saving pending operations to localStorage:', error);
  }
};

// Function to generate temporary ID
const generateTempId = () => `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Async thunks
export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await fetch(API_URL);
      
      if (response.status === 503) {
        dispatch(setOfflineMode(true));
        return rejectWithValue('Database connection unavailable. Using offline mode.');
      }
      
      if (!response.ok) {
        return rejectWithValue(`Failed to fetch todos: ${response.status}`);
      }
      
      const data = await response.json();
      
      // If we were offline and now we're online, try to sync pending operations
      const state = getState() as { todos: TodoState };
      if (state.todos.isOffline) {
        dispatch(setOfflineMode(false));
        dispatch(syncPendingOperations());
      }
      
      return data;
    } catch (error) {
      dispatch(setOfflineMode(true));
      return rejectWithValue('Error connecting to the server. Using offline mode.');
    }
  }
);

export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async (
    { title, priority }: { title: string; priority: 'low' | 'medium' | 'high' },
    { rejectWithValue, dispatch, getState }
  ) => {
    const state = getState() as { todos: TodoState };
    
    // Create a local todo
    const localTodo: Todo = {
      _id: generateTempId(),
      title,
      priority,
      completed: false,
      createdAt: new Date(),
      isLocal: true
    };
    
    // If we're offline, just save locally
    if (state.todos.isOffline) {
      dispatch(addPendingOperation({
        type: 'add',
        data: { title, priority },
        timestamp: Date.now()
      }));
      return localTodo;
    }
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, priority }),
      });

      if (response.status === 503) {
        dispatch(setOfflineMode(true));
        dispatch(addPendingOperation({
          type: 'add',
          data: { title, priority },
          timestamp: Date.now()
        }));
        return localTodo;
      }

      if (!response.ok) {
        return rejectWithValue(`Failed to add todo: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      dispatch(setOfflineMode(true));
      dispatch(addPendingOperation({
        type: 'add',
        data: { title, priority },
        timestamp: Date.now()
      }));
      return localTodo;
    }
  }
);

export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async (
    { id, updates }: { id: string; updates: Partial<Todo> },
    { rejectWithValue, dispatch, getState }
  ) => {
    const state = getState() as { todos: TodoState };
    
    // If we're offline or it's a local todo, just update locally
    if (state.todos.isOffline || id.startsWith('local_')) {
      const todo = state.todos.todos.find(t => t._id === id);
      if (!todo) {
        return rejectWithValue('Todo not found');
      }
      
      const updatedTodo = { ...todo, ...updates, isLocal: true };
      
      // Only add to pending operations if it's not already a local todo
      if (!id.startsWith('local_')) {
        dispatch(addPendingOperation({
          type: 'update',
          data: { id, updates },
          timestamp: Date.now()
        }));
      }
      
      return updatedTodo;
    }
    
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.status === 503) {
        dispatch(setOfflineMode(true));
        
        const todo = state.todos.todos.find(t => t._id === id);
        if (!todo) {
          return rejectWithValue('Todo not found');
        }
        
        const updatedTodo = { ...todo, ...updates, isLocal: true };
        
        dispatch(addPendingOperation({
          type: 'update',
          data: { id, updates },
          timestamp: Date.now()
        }));
        
        return updatedTodo;
      }

      if (!response.ok) {
        return rejectWithValue('Failed to update todo');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      dispatch(setOfflineMode(true));
      
      const todo = state.todos.todos.find(t => t._id === id);
      if (!todo) {
        return rejectWithValue('Todo not found');
      }
      
      const updatedTodo = { ...todo, ...updates, isLocal: true };
      
      dispatch(addPendingOperation({
        type: 'update',
        data: { id, updates },
        timestamp: Date.now()
      }));
      
      return updatedTodo;
    }
  }
);

export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (id: string, { rejectWithValue, dispatch, getState }) => {
    const state = getState() as { todos: TodoState };
    
    // If we're offline or it's a local todo, just delete locally
    if (state.todos.isOffline || id.startsWith('local_')) {
      // If it's not a local todo, add to pending operations
      if (!id.startsWith('local_')) {
        dispatch(addPendingOperation({
          type: 'delete',
          data: { id },
          timestamp: Date.now()
        }));
      }
      return id;
    }
    
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (response.status === 503) {
        dispatch(setOfflineMode(true));
        dispatch(addPendingOperation({
          type: 'delete',
          data: { id },
          timestamp: Date.now()
        }));
        return id;
      }

      if (!response.ok) {
        return rejectWithValue('Failed to delete todo');
      }

      return id;
    } catch (error) {
      dispatch(setOfflineMode(true));
      dispatch(addPendingOperation({
        type: 'delete',
        data: { id },
        timestamp: Date.now()
      }));
      return id;
    }
  }
);

// Thunk to sync pending operations with the server
export const syncPendingOperations = createAsyncThunk(
  'todos/syncPendingOperations',
  async (_, { getState, dispatch }) => {
    const state = getState() as { todos: TodoState };
    const { pendingOperations } = state.todos;
    
    if (pendingOperations.length === 0) return;
    
    // Process each pending operation in order
    for (const operation of pendingOperations) {
      try {
        switch (operation.type) {
          case 'add':
            await dispatch(addTodo(operation.data)).unwrap();
            break;
          case 'update':
            await dispatch(updateTodo(operation.data)).unwrap();
            break;
          case 'delete':
            await dispatch(deleteTodo(operation.data.id)).unwrap();
            break;
        }
        
        // Remove this operation from pending
        dispatch(removePendingOperation(operation));
      } catch (error) {
        // If we hit an error, stop syncing (we'll try again later)
        console.error('Error syncing operation:', operation, error);
        break;
      }
    }
  }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setOfflineMode: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload;
    },
    addPendingOperation: (state, action: PayloadAction<PendingOperation>) => {
      state.pendingOperations.push(action.payload);
      savePendingOperations(state.pendingOperations);
    },
    removePendingOperation: (state, action: PayloadAction<PendingOperation>) => {
      const index = state.pendingOperations.findIndex(
        op => op.timestamp === action.payload.timestamp
      );
      if (index !== -1) {
        state.pendingOperations.splice(index, 1);
        savePendingOperations(state.pendingOperations);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch todos cases
      .addCase(fetchTodos.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.isLoading = false;
        
        // Merge server todos with local todos
        const serverTodoIds = action.payload.map(todo => todo._id);
        const localOnlyTodos = state.todos.filter(
          todo => todo.isLocal && !serverTodoIds.includes(todo._id)
        );
        
        state.todos = [...action.payload, ...localOnlyTodos];
        saveLocalTodos(state.todos);
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add todo cases
      .addCase(addTodo.pending, (state) => {
        state.error = null;
      })
      .addCase(addTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        // If it's replacing a local todo, remove the local one
        if (!action.payload.isLocal) {
          state.todos = state.todos.filter(
            todo => !todo.isLocal || todo._id !== action.payload._id
          );
        }
        
        state.todos.unshift(action.payload);
        saveLocalTodos(state.todos);
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Update todo cases
      .addCase(updateTodo.pending, (state) => {
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        const index = state.todos.findIndex((todo) => todo._id === action.payload._id);
        if (index !== -1) {
          state.todos[index] = action.payload;
          saveLocalTodos(state.todos);
        }
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Delete todo cases
      .addCase(deleteTodo.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteTodo.fulfilled, (state, action: PayloadAction<string>) => {
        state.todos = state.todos.filter((todo) => todo._id !== action.payload);
        saveLocalTodos(state.todos);
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setOfflineMode, addPendingOperation, removePendingOperation } = todoSlice.actions;
export default todoSlice.reducer; 