
import React from 'react';
import { useTodos } from '../contexts/TodoContext';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const { todos, isLoading, error } = useTodos();

  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-6" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No todos yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div>
      {todos.map(todo => (
        <TodoItem key={todo._id} todo={todo} />
      ))}
    </div>
  );
};

export default TodoList;
