import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchTodos, syncPendingOperations } from '../store/slices/todoSlice';
import TodoItem from './TodoItem';

const TodoList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { todos, isLoading, error, isOffline, pendingOperations } = useAppSelector(state => state.todos);
  const [retryCount, setRetryCount] = useState(0);
  
  // Initial data fetch
  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);
  
  // Set up periodic retry when offline
  useEffect(() => {
    let retryTimer: number | undefined;
    
    if (isOffline) {
      retryTimer = window.setInterval(() => {
        dispatch(fetchTodos());
        setRetryCount(prev => prev + 1);
      }, 30000); // Try to reconnect every 30 seconds
    }
    
    return () => {
      if (retryTimer) clearInterval(retryTimer);
    };
  }, [isOffline, dispatch]);
  
  const handleManualRetry = () => {
    dispatch(fetchTodos());
    setRetryCount(prev => prev + 1);
  };

  if (isLoading && todos.length === 0) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {isOffline && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You are currently in offline mode. Changes will be saved locally and synced when connection is restored.
                {pendingOperations.length > 0 && (
                  <span className="font-medium"> ({pendingOperations.length} changes pending)</span>
                )}
              </p>
              <div className="mt-2">
                <button
                  onClick={handleManualRetry}
                  className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md bg-yellow-100 hover:bg-yellow-200 text-yellow-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Retry Connection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && !isOffline && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      {todos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No todos yet. Add one to get started!</p>
        </div>
      ) : (
        <div>
          {todos.map(todo => (
            <TodoItem 
              key={todo._id} 
              todo={todo} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;
