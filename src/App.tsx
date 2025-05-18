import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import TodoApp from './pages/TodoApp';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<TodoApp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
