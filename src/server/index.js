import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Enable more detailed logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for development
const storage = {
  visions: [],
  goals: [],
  tasks: [],
  todos: [],
  words: [],
  affirmations: [],
  diamondPeople: []
};

// Helper function to generate IDs
const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

console.log('Server starting with in-memory storage...');

// Simple routes for testing
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working with in-memory storage!' });
});

// Visions API
app.get('/api/visions', (req, res) => {
  res.json({ success: true, data: storage.visions });
});

app.post('/api/visions', (req, res) => {
  const vision = {
    _id: generateId(),
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  storage.visions.push(vision);
  console.log('Vision created:', vision);
  res.status(201).json({ success: true, data: vision });
});

app.put('/api/visions/:id', (req, res) => {
  const index = storage.visions.findIndex(v => v._id === req.params.id);
  if (index !== -1) {
    storage.visions[index] = {
      ...storage.visions[index],
      ...req.body,
      updatedAt: new Date()
    };
    console.log('Vision updated:', storage.visions[index]);
    res.json({ success: true, data: storage.visions[index] });
  } else {
    res.status(404).json({ success: false, message: 'Vision not found' });
  }
});

app.delete('/api/visions/:id', (req, res) => {
  const index = storage.visions.findIndex(v => v._id === req.params.id);
  if (index !== -1) {
    storage.visions.splice(index, 1);
    console.log('Vision deleted:', req.params.id);
    res.json({ success: true, data: {} });
  } else {
    res.status(404).json({ success: false, message: 'Vision not found' });
  }
});

// Goals API
app.get('/api/goals', (req, res) => {
  res.json({ success: true, data: storage.goals });
});

app.post('/api/goals', (req, res) => {
  const goal = {
    _id: generateId(),
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  storage.goals.push(goal);
  console.log('Goal created:', goal);
  res.status(201).json({ success: true, data: goal });
});

app.put('/api/goals/:id', (req, res) => {
  const index = storage.goals.findIndex(g => g._id === req.params.id);
  if (index !== -1) {
    storage.goals[index] = {
      ...storage.goals[index],
      ...req.body,
      updatedAt: new Date()
    };
    console.log('Goal updated:', storage.goals[index]);
    res.json({ success: true, data: storage.goals[index] });
  } else {
    res.status(404).json({ success: false, message: 'Goal not found' });
  }
});

app.delete('/api/goals/:id', (req, res) => {
  const index = storage.goals.findIndex(g => g._id === req.params.id);
  if (index !== -1) {
    storage.goals.splice(index, 1);
    console.log('Goal deleted:', req.params.id);
    res.json({ success: true, data: {} });
  } else {
    res.status(404).json({ success: false, message: 'Goal not found' });
  }
});

// Tasks API
app.get('/api/tasks', (req, res) => {
  res.json({ success: true, data: storage.tasks });
});

app.get('/api/tasks/date/:date', (req, res) => {
  console.log('Getting tasks for date:', req.params.date);
  const date = new Date(req.params.date);
  date.setHours(0, 0, 0, 0);
  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);
  
  const dateTasks = storage.tasks.filter(task => {
    if (!task.date) return false;
    const taskDate = new Date(task.date);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate >= date && taskDate < nextDay;
  });
  
  console.log('Getting tasks for date:', req.params.date, 'Found:', dateTasks.length);
  res.json({ success: true, data: dateTasks });
});

app.post('/api/tasks', (req, res) => {
  const task = {
    _id: generateId(),
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  storage.tasks.push(task);
  console.log('Task created:', task);
  res.status(201).json({ success: true, data: task });
});

app.put('/api/tasks/:id', (req, res) => {
  const index = storage.tasks.findIndex(t => t._id === req.params.id);
  if (index !== -1) {
    storage.tasks[index] = {
      ...storage.tasks[index],
      ...req.body,
      updatedAt: new Date()
    };
    console.log('Task updated:', storage.tasks[index]);
    res.json({ success: true, data: storage.tasks[index] });
  } else {
    res.status(404).json({ success: false, message: 'Task not found' });
  }
});

app.delete('/api/tasks/:id', (req, res) => {
  const index = storage.tasks.findIndex(t => t._id === req.params.id);
  if (index !== -1) {
    storage.tasks.splice(index, 1);
    console.log('Task deleted:', req.params.id);
    res.json({ success: true, data: {} });
  } else {
    res.status(404).json({ success: false, message: 'Task not found' });
  }
});

// Todos API
app.get('/api/todos', (req, res) => {
  res.json({ success: true, data: storage.todos });
});

app.get('/api/todos/date/:date', (req, res) => {
  console.log('Getting todos for date:', req.params.date);
  const date = new Date(req.params.date);
  date.setHours(0, 0, 0, 0);
  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);
  
  const dateTodos = storage.todos.filter(todo => {
    if (!todo.dueDate) return false;
    const todoDate = new Date(todo.dueDate);
    todoDate.setHours(0, 0, 0, 0);
    return todoDate >= date && todoDate < nextDay;
  });
  
  console.log('Getting todos for date:', req.params.date, 'Found:', dateTodos.length);
  res.json({ success: true, data: dateTodos });
});

app.post('/api/todos', (req, res) => {
  const todo = {
    _id: generateId(),
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  storage.todos.push(todo);
  console.log('Todo created:', todo);
  res.status(201).json({ success: true, data: todo });
});

app.put('/api/todos/:id', (req, res) => {
  const index = storage.todos.findIndex(t => t._id === req.params.id);
  if (index !== -1) {
    storage.todos[index] = {
      ...storage.todos[index],
      ...req.body,
      updatedAt: new Date()
    };
    console.log('Todo updated:', storage.todos[index]);
    res.json({ success: true, data: storage.todos[index] });
  } else {
    res.status(404).json({ success: false, message: 'Todo not found' });
  }
});

app.delete('/api/todos/:id', (req, res) => {
  const index = storage.todos.findIndex(t => t._id === req.params.id);
  if (index !== -1) {
    storage.todos.splice(index, 1);
    console.log('Todo deleted:', req.params.id);
    res.json({ success: true, data: {} });
  } else {
    res.status(404).json({ success: false, message: 'Todo not found' });
  }
});

// Words API
app.get('/api/words', (req, res) => {
  res.json({ success: true, data: storage.words });
});

app.post('/api/words', (req, res) => {
  const word = {
    _id: generateId(),
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  storage.words.push(word);
  console.log('Word created:', word);
  res.status(201).json({ success: true, data: word });
});

app.put('/api/words/:id', (req, res) => {
  const index = storage.words.findIndex(w => w._id === req.params.id);
  if (index !== -1) {
    storage.words[index] = {
      ...storage.words[index],
      ...req.body,
      updatedAt: new Date()
    };
    console.log('Word updated:', storage.words[index]);
    res.json({ success: true, data: storage.words[index] });
  } else {
    res.status(404).json({ success: false, message: 'Word not found' });
  }
});

app.delete('/api/words/:id', (req, res) => {
  const index = storage.words.findIndex(w => w._id === req.params.id);
  if (index !== -1) {
    storage.words.splice(index, 1);
    console.log('Word deleted:', req.params.id);
    res.json({ success: true, data: {} });
  } else {
    res.status(404).json({ success: false, message: 'Word not found' });
  }
});

// Affirmations API
app.get('/api/affirmations', (req, res) => {
  res.json({ success: true, data: storage.affirmations });
});

app.post('/api/affirmations', (req, res) => {
  const affirmation = {
    _id: generateId(),
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  storage.affirmations.push(affirmation);
  console.log('Affirmation created:', affirmation);
  res.status(201).json({ success: true, data: affirmation });
});

app.put('/api/affirmations/:id', (req, res) => {
  const index = storage.affirmations.findIndex(a => a._id === req.params.id);
  if (index !== -1) {
    storage.affirmations[index] = {
      ...storage.affirmations[index],
      ...req.body,
      updatedAt: new Date()
    };
    console.log('Affirmation updated:', storage.affirmations[index]);
    res.json({ success: true, data: storage.affirmations[index] });
  } else {
    res.status(404).json({ success: false, message: 'Affirmation not found' });
  }
});

app.delete('/api/affirmations/:id', (req, res) => {
  const index = storage.affirmations.findIndex(a => a._id === req.params.id);
  if (index !== -1) {
    storage.affirmations.splice(index, 1);
    console.log('Affirmation deleted:', req.params.id);
    res.json({ success: true, data: {} });
  } else {
    res.status(404).json({ success: false, message: 'Affirmation not found' });
  }
});

// Diamond People API
app.get('/api/diamond-people', (req, res) => {
  res.json({ success: true, data: storage.diamondPeople });
});

app.post('/api/diamond-people', (req, res) => {
  const person = {
    _id: generateId(),
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  storage.diamondPeople.push(person);
  console.log('Diamond person created:', person);
  res.status(201).json({ success: true, data: person });
});

app.put('/api/diamond-people/:id', (req, res) => {
  const index = storage.diamondPeople.findIndex(p => p._id === req.params.id);
  if (index !== -1) {
    storage.diamondPeople[index] = {
      ...storage.diamondPeople[index],
      ...req.body,
      updatedAt: new Date()
    };
    console.log('Diamond person updated:', storage.diamondPeople[index]);
    res.json({ success: true, data: storage.diamondPeople[index] });
  } else {
    res.status(404).json({ success: false, message: 'Diamond person not found' });
  }
});

app.delete('/api/diamond-people/:id', (req, res) => {
  const index = storage.diamondPeople.findIndex(p => p._id === req.params.id);
  if (index !== -1) {
    storage.diamondPeople.splice(index, 1);
    console.log('Diamond person deleted:', req.params.id);
    res.json({ success: true, data: {} });
  } else {
    res.status(404).json({ success: false, message: 'Diamond person not found' });
  }
});
app.get('/api/tasks/date-range', (req, res) => {
  try {
    const { start, end } = req.query;
    
    if (!start || !end) {
      return res.status(400).json({ success: false, error: 'Start and end dates are required' });
    }
    
    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);
    
    console.log(`Getting tasks from ${startDate.toISOString()} to ${endDate.toISOString()}`);
    
    const filteredTasks = storage.tasks.filter(task => {
      if (!task.date) return false;
      const taskDate = new Date(task.date);
      return taskDate >= startDate && taskDate <= endDate;
    });
    
    console.log(`Found ${filteredTasks.length} tasks in date range`);
    res.json({ success: true, data: filteredTasks });
  } catch (error) {
    console.error('Error getting tasks by date range:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/todos/date-range', (req, res) => {
  try {
    const { start, end } = req.query;
    
    if (!start || !end) {
      return res.status(400).json({ success: false, error: 'Start and end dates are required' });
    }
    
    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);
    
    console.log(`Getting todos from ${startDate.toISOString()} to ${endDate.toISOString()}`);
    
    const filteredTodos = storage.todos.filter(todo => {
      if (!todo.dueDate) return false;
      const todoDate = new Date(todo.dueDate);
      return todoDate >= startDate && todoDate <= endDate;
    });
    
    console.log(`Found ${filteredTodos.length} todos in date range`);
    res.json({ success: true, data: filteredTodos });
  } catch (error) {
    console.error('Error getting todos by date range:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/goals/date-range', (req, res) => {
  try {
    const { start, end } = req.query;
    
    if (!start || !end) {
      return res.status(400).json({ success: false, error: 'Start and end dates are required' });
    }
    
    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);
    
    console.log(`Getting goals from ${startDate.toISOString()} to ${endDate.toISOString()}`);
    
    const filteredGoals = storage.goals.filter(goal => {
      // Check if goal's date range overlaps with the requested range
      if (goal.startDate && goal.endDate) {
        const goalStart = new Date(goal.startDate);
        const goalEnd = new Date(goal.endDate);
        return (goalStart <= endDate && goalEnd >= startDate);
      }
      
      // If no date range, check individual dates
      if (goal.startDate) {
        const goalStart = new Date(goal.startDate);
        return goalStart >= startDate && goalStart <= endDate;
      }
      
      if (goal.endDate) {
        const goalEnd = new Date(goal.endDate);
        return goalEnd >= startDate && goalEnd <= endDate;
      }
      
      return false;
    });
    
    console.log(`Found ${filteredGoals.length} goals in date range`);
    res.json({ success: true, data: filteredGoals });
  } catch (error) {
    console.error('Error getting goals by date range:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/words/date-range', (req, res) => {
  try {
    const { start, end } = req.query;
    
    if (!start || !end) {
      return res.status(400).json({ success: false, error: 'Start and end dates are required' });
    }
    
    const startDate = new Date(start);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);
    
    console.log(`Getting words from ${startDate.toISOString()} to ${endDate.toISOString()}`);
    
    const filteredWords = storage.words.filter(word => {
      if (!word.date) return false;
      const wordDate = new Date(word.date);
      return wordDate >= startDate && wordDate <= endDate;
    });
    
    console.log(`Found ${filteredWords.length} words in date range`);
    res.json({ success: true, data: filteredWords });
  } catch (error) {
    console.error('Error getting words by date range:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running with in-memory storage',
    storage: {
      visions: storage.visions.length,
      goals: storage.goals.length,
      tasks: storage.tasks.length,
      todos: storage.todos.length,
      words: storage.words.length,
      affirmations: storage.affirmations.length,
      diamondPeople: storage.diamondPeople.length
    }
  });
});

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.json({ message: 'API endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} with in-memory storage`);
});

export default app;