
import React from 'react';
import { Todo, useTodos } from '../contexts/TodoContext';
import { Trash, CheckCircle, Circle } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { toggleComplete, deleteTodo } = useTodos();

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  return (
    <div className={`flex items-center justify-between p-4 mb-3 bg-white rounded-lg shadow hover:shadow-md transition-shadow ${todo.completed ? 'opacity-70' : ''}`}>
      <div className="flex items-center">
        <button
          onClick={() => toggleComplete(todo._id, !todo.completed)}
          className="mr-3 text-gray-500 hover:text-green-500 transition-colors"
        >
          {todo.completed ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <Circle className="h-5 w-5" />
          )}
        </button>
        <div>
          <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {todo.title}
          </h3>
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
        onClick={() => deleteTodo(todo._id)}
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        <Trash className="h-5 w-5" />
      </button>
    </div>
  );
};

export default TodoItem;
