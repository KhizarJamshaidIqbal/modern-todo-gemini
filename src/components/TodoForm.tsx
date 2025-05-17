
import React, { useState } from 'react';
import { useTodos } from '../contexts/TodoContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

const TodoForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const { addTodo } = useTodos();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    try {
      await addTodo(title, priority);
      setTitle('');
      setPriority('medium');
      toast({
        title: "Todo added",
        description: "Your todo has been added successfully",
      });
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded-lg shadow">
      <div className="mb-4">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new todo..."
          className="w-full"
        />
      </div>
      
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Priority:</p>
        <RadioGroup 
          value={priority} 
          onValueChange={(val) => setPriority(val as 'low' | 'medium' | 'high')}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="low" id="low" />
            <Label htmlFor="low" className="text-blue-600">Low</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="medium" />
            <Label htmlFor="medium" className="text-yellow-600">Medium</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="high" />
            <Label htmlFor="high" className="text-red-600">High</Label>
          </div>
        </RadioGroup>
      </div>
      
      <button 
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Add Todo
      </button>
    </form>
  );
};

export default TodoForm;
