
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TodoProvider } from './contexts/TodoContext';
import { Toaster } from "@/components/ui/toaster";
import TodoApp from './pages/TodoApp';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <TodoProvider>
      <Router>
        <Routes>
          <Route path="/" element={<TodoApp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </TodoProvider>
  );
}

export default App;
