import Todo from '../models/Todo.js';

// Get all todos
export const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new todo
export const createTodo = async (req, res) => {
  try {
    const { title, priority } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const newTodo = new Todo({
      title,
      priority: priority || 'medium',
      completed: false
    });
    
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a todo
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    );
    
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a todo
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedTodo = await Todo.findByIdAndDelete(id);
    
    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 