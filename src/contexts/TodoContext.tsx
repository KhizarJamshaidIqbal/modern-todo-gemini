
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

interface TodoContextType {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  addTodo: (title: string, priority: 'low' | 'medium' | 'high') => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleComplete: (id: string, completed: boolean) => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};

interface TodoProviderProps {
  children: ReactNode;
}

const API_URL = 'http://localhost:5000/api/todos';

export const TodoProvider = ({ children }: TodoProviderProps) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      const data = await response.json();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError('Error fetching todos. Please try again later.');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addTodo = async (title: string, priority: 'low' | 'medium' | 'high') => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, priority }),
      });

      if (!response.ok) {
        throw new Error('Failed to add todo');
      }

      const newTodo = await response.json();
      setTodos(prevTodos => [newTodo, ...prevTodos]);
      return newTodo;
    } catch (err) {
      setError('Error adding todo. Please try again.');
      console.error('Add todo error:', err);
      throw err;
    }
  };

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      const updatedTodo = await response.json();
      setTodos(prevTodos =>
        prevTodos.map(todo => (todo._id === id ? updatedTodo : todo))
      );
    } catch (err) {
      setError('Error updating todo. Please try again.');
      console.error('Update error:', err);
      throw err;
    }
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    await updateTodo(id, { completed });
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      setTodos(prevTodos => prevTodos.filter(todo => todo._id !== id));
    } catch (err) {
      setError('Error deleting todo. Please try again.');
      console.error('Delete error:', err);
      throw err;
    }
  };

  const value = {
    todos,
    isLoading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};
