import express from 'express';
import { 
  getAllTodos, 
  createTodo, 
  updateTodo, 
  deleteTodo 
} from '../controllers/todoController.js';
import dbConnectionCheck from '../middleware/dbConnectionCheck.js';

const router = express.Router();

// Apply middleware to all routes
router.use(dbConnectionCheck);

// Get all todos
router.get('/', getAllTodos);

// Create a new todo
router.post('/', createTodo);

// Update a todo
router.put('/:id', updateTodo);

// Delete a todo
router.delete('/:id', deleteTodo);

export default router; 