import React from 'react';
import { Todo, updateTodo, deleteTodo } from '../store/slices/todoSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Trash, CheckCircle, Circle, CloudOff, Clock } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useAppDispatch();
  const isOffline = useAppSelector(state => state.todos.isOffline);

  const handleToggleComplete = async () => {
    try {
      await dispatch(updateTodo({ 
        id: todo._id, 
        updates: { completed: !todo.completed } 
      })).unwrap();
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteTodo(todo._id)).unwrap();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  // Check if this todo is local-only (not yet synced with server)
  const isLocalOnly = todo.isLocal || todo._id.startsWith('local_');

  return (
    <div className={`flex items-center justify-between p-4 mb-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow ${
      todo.completed ? 'opacity-70' : ''
    } ${isLocalOnly ? 'border-l-4 border-yellow-400' : ''}`}>
      <div className="flex items-center">
        <button
          onClick={handleToggleComplete}
          className="mr-3 text-gray-500 hover:text-green-500 transition-colors"
        >
          {todo.completed ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5" />
          )}
        </button>
        <div>
          <div className="flex items-center">
            <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {todo.title}
            </h3>
            {isLocalOnly && (
              <span className="ml-2 inline-flex items-center" title="This item hasn't synced with the server yet">
                <Clock className="h-3 w-3 text-yellow-500" />
              </span>
            )}
            {isOffline && !isLocalOnly && (
              <span className="ml-2 inline-flex items-center" title="Working offline">
                <CloudOff className="h-3 w-3 text-gray-400" />
              </span>
            )}
          </div>
          <div className="flex items-center mt-1">
            <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[todo.priority]}`}>
              {todo.priority}
            </span>
            <span className="text-xs text-gray-500 ml-2">
              {new Date(todo.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={handleDelete}
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        <Trash className="h-5 w-5" />
      </button>
    </div>
  );
};

export default TodoItem;
