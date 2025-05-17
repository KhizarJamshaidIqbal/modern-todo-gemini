
import React from 'react';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';

const TodoApp: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">My Todo App</h1>
        <p className="text-gray-600 mt-2">Organize your tasks simply and efficiently</p>
      </header>
      
      <main>
        <TodoForm />
        <div className="mt-6">
          <TodoList />
        </div>
      </main>
    </div>
  );
};

export default TodoApp;
