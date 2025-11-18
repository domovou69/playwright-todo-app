import { Router, Response } from 'express';
import {
  getTodosByUser,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  getAllTags,
} from '../db/storage.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

// Get all todos with optional filters
router.get('/', (req: AuthRequest, res: Response): void => {
  try {
    const userId = req.user!.id;
    const { status, priority, search, tag } = req.query;

    let todos = getTodosByUser(userId);

    // Apply filters
    if (status) {
      todos = todos.filter(t => t.status === status);
    }
    if (priority) {
      todos = todos.filter(t => t.priority === priority);
    }
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase();
      todos = todos.filter(
        t =>
          t.title.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower)
      );
    }
    if (tag && typeof tag === 'string') {
      todos = todos.filter(t => t.tags.includes(tag));
    }

    res.json(todos);
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single todo
router.get('/:id', (req: AuthRequest, res: Response): void => {
  try {
    const userId = req.user!.id;
    const todo = getTodoById(req.params.id, userId);

    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.json(todo);
  } catch (error) {
    console.error('Get todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new todo
router.post('/', (req: AuthRequest, res: Response): void => {
  try {
    const userId = req.user!.id;
    const { title, description, priority, dueDate, tags } = req.body;

    if (!title || !description) {
      res.status(400).json({ error: 'Title and description are required' });
      return;
    }

    const todo = createTodo({
      title,
      description,
      status: 'pending',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      tags: tags || [],
      userId,
    });

    res.status(201).json(todo);
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update todo
router.put('/:id', (req: AuthRequest, res: Response): void => {
  try {
    const userId = req.user!.id;
    const { title, description, status, priority, dueDate, tags } = req.body;

    const todo = updateTodo(req.params.id, userId, {
      title,
      description,
      status,
      priority,
      dueDate,
      tags,
    });

    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.json(todo);
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update todo status
router.patch('/:id/status', (req: AuthRequest, res: Response): void => {
  try {
    const userId = req.user!.id;
    const { status } = req.body;

    if (!status || !['pending', 'in-progress', 'completed'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const todo = updateTodo(req.params.id, userId, { status });

    if (!todo) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.json(todo);
  } catch (error) {
    console.error('Update todo status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete todo
router.delete('/:id', (req: AuthRequest, res: Response): void => {
  try {
    const userId = req.user!.id;
    const success = deleteTodo(req.params.id, userId);

    if (!success) {
      res.status(404).json({ error: 'Todo not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all tags
router.get('/tags/all', (req: AuthRequest, res: Response): void => {
  try {
    const userId = req.user!.id;
    const tags = getAllTags(userId);
    res.json(tags);
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clear all todos (for testing)
router.delete('/', (req: AuthRequest, res: Response): void => {
  try {
    const userId = req.user!.id;
    const todos = getTodosByUser(userId);

    // Delete each todo
    todos.forEach(todo => {
      deleteTodo(todo.id, userId);
    });

    res.json({ message: 'All todos cleared', count: todos.length });
  } catch (error) {
    console.error('Clear todos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
