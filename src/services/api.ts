import axios from 'axios';
import { mockVisions, mockGoals, mockTasks, mockTodos, mockWords, mockAffirmations, mockDiamondPeople } from './mockData';

// Use a mock API for development
const useMockApi = true;
const API_BASE_URL = useMockApi ? '' : (import.meta.env.VITE_API_URL || '/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  console.log('API Request:', config.url, useMockApi ? '(using mock data)' : '');
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response and error logging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config?.url);
    return response;
  },
  (error) => {
    if (useMockApi) {
      console.log('Mock API Error - returning mock data');
      // Return appropriate mock data based on the URL
      const url = error.config?.url || '';
      let mockData = [];
      
      if (url.includes('/visions')) {
        mockData = mockVisions;
      } else if (url.includes('/goals')) {
        mockData = mockGoals;
      } else if (url.includes('/tasks')) {
        mockData = mockTasks;
      } else if (url.includes('/todos')) {
        mockData = mockTodos;
      } else if (url.includes('/words')) {
        mockData = mockWords;
      } else if (url.includes('/affirmations')) {
        mockData = mockAffirmations;
      } else if (url.includes('/diamond-people')) {
        mockData = mockDiamondPeople;
      }
      
      return Promise.resolve({ data: mockData });
    } else {
      console.error('API Error:', error.message, error.config?.url);
    }
    return Promise.reject(error);
  }
);

// Vision API
export const visionAPI = {
  getAll: async () => {
    if (useMockApi) {
      return mockVisions;
    }
    const response = await api.get('/visions');
    return response.data?.data || response.data || [];
  },
  getById: async (id: string) => {
    if (useMockApi) {
      return mockVisions.find(v => v._id === id) || null;
    }
    const response = await api.get(`/visions/${id}`);
    return response.data?.data || response.data || null;
  },
  create: async (data: any) => {
    if (useMockApi) {
      const newVision = { _id: Date.now().toString(), ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      mockVisions.push(newVision);
      return newVision;
    }
    const response = await api.post('/visions', data);
    return response.data?.data || response.data;
  },
  update: async (id: string, data: any) => {
    if (useMockApi) {
      const index = mockVisions.findIndex(v => v._id === id);
      if (index !== -1) {
        mockVisions[index] = { ...mockVisions[index], ...data, updatedAt: new Date().toISOString() };
        return mockVisions[index];
      }
      throw new Error('Vision not found');
    }
    const response = await api.put(`/visions/${id}`, data);
    return response.data?.data || response.data;
  },
  delete: async (id: string) => {
    if (useMockApi) {
      const index = mockVisions.findIndex(v => v._id === id);
      if (index !== -1) {
        mockVisions.splice(index, 1);
        return { success: true };
      }
      throw new Error('Vision not found');
    }
    const response = await api.delete(`/visions/${id}`);
    return response.data?.data || response.data || { success: true };
  },
};

// Goal API
export const goalAPI = {
  getAll: async () => {
    if (useMockApi) {
      return mockGoals;
    }
    const response = await api.get('/goals');
    return response.data?.data || response.data || [];
  },
  getById: async (id: string) => {
    if (useMockApi) {
      return mockGoals.find(g => g._id === id) || null;
    }
    const response = await api.get(`/goals/${id}`);
    return response.data?.data || response.data || null;
  },
  create: async (data: any) => {
    if (useMockApi) {
      const newGoal = { _id: Date.now().toString(), ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      mockGoals.push(newGoal);
      return newGoal;
    }
    const response = await api.post('/goals', data);
    return response.data?.data || response.data;
  },
  update: async (id: string, data: any) => {
    if (useMockApi) {
      const index = mockGoals.findIndex(g => g._id === id);
      if (index !== -1) {
        mockGoals[index] = { ...mockGoals[index], ...data, updatedAt: new Date().toISOString() };
        return mockGoals[index];
      }
      throw new Error('Goal not found');
    }
    const response = await api.put(`/goals/${id}`, data);
    return response.data?.data || response.data;
  },
  delete: async (id: string) => {
    if (useMockApi) {
      const index = mockGoals.findIndex(g => g._id === id);
      if (index !== -1) {
        mockGoals.splice(index, 1);
        return { success: true };
      }
      throw new Error('Goal not found');
    }
    const response = await api.delete(`/goals/${id}`);
    return response.data?.data || response.data || { success: true };
  },
  getByDateRange: async (startDate: string, endDate: string) => {
    if (useMockApi) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      const filteredGoals = mockGoals.filter(goal => {
        if (!goal.startDate && !goal.endDate) return false;
        
        const goalStart = goal.startDate ? new Date(goal.startDate) : null;
        const goalEnd = goal.endDate ? new Date(goal.endDate) : null;
        
        if (goalStart && goalEnd) {
          return (goalStart <= end && goalEnd >= start);
        }
        
        if (goalStart) {
          return goalStart >= start && goalStart <= end;
        }
        
        if (goalEnd) {
          return goalEnd >= start && goalEnd <= end;
        }
        
        return false;
      });
      
      return filteredGoals;
    }
    const response = await api.get(`/goals/date-range?start=${startDate}&end=${endDate}`);
    return response.data?.data || response.data || [];
  },
};

// Task API
export const taskAPI = {
  getAll: async () => {
    if (useMockApi) {
      return mockTasks;
    }
    const response = await api.get('/tasks');
    return response.data?.data || response.data || [];
  },
  getById: async (id: string) => {
    console.log('Getting task by ID:', id);
    if (useMockApi) {
      return mockTasks.find(t => t._id === id) || null;
    }
    const response = await api.get(`/tasks/${id}`);
    return response.data?.data || response.data || null;
  },
  create: async (data: any) => {
    console.log('Creating task with data:', data);
    if (useMockApi) {
      const newTask = { _id: Date.now().toString(), ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      mockTasks.push(newTask);
      return newTask;
    }
    const response = await api.post('/tasks', data);
    return response.data?.data || response.data;
  },
  update: async (id: string, data: any) => {
    console.log('Updating task:', id, data);
    if (useMockApi) {
      const index = mockTasks.findIndex(t => t._id === id);
      if (index !== -1) {
        mockTasks[index] = { ...mockTasks[index], ...data, updatedAt: new Date().toISOString() };
        return mockTasks[index];
      }
      throw new Error('Task not found');
    }
    const response = await api.put(`/tasks/${id}`, data);
    return response.data?.data || response.data;
  },
  delete: async (id: string) => {
    console.log('Deleting task:', id);
    if (useMockApi) {
      const index = mockTasks.findIndex(t => t._id === id);
      if (index !== -1) {
        mockTasks.splice(index, 1);
        return { success: true };
      }
      throw new Error('Task not found');
    }
    const response = await api.delete(`/tasks/${id}`);
    return response.data?.data || response.data || { success: true };
  },
  getByDate: async (date: string) => {
    console.log('Getting tasks by date:', date);
    if (useMockApi) {
      const dateObj = new Date(date);
      dateObj.setHours(0, 0, 0, 0);
      const nextDay = new Date(dateObj);
      nextDay.setDate(dateObj.getDate() + 1);
      
      const filteredTasks = mockTasks.filter(task => {
        if (!task.date) return false;
        const taskDate = new Date(task.date);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate >= dateObj && taskDate < nextDay;
      });
      
      return filteredTasks;
    }
    const response = await api.get(`/tasks/date/${date}`);
    return response.data?.data || response.data || [];
  },
  getByDateRange: async (startDate: string, endDate: string) => {
    console.log('Getting tasks by date range:', startDate, endDate);
    if (useMockApi) {
      const start = new Date(startDate); // First day of range
      start.setHours(0, 0, 0, 0); // Start of day
      const end = new Date(endDate); // Last day of range
      end.setHours(23, 59, 59, 999); // End of day
      
      const filteredTasks = mockTasks.filter(task => {
        if (!task.date) return false;
        const taskDate = new Date(task.date);
        return taskDate >= start && taskDate <= end;
      });
      
      return filteredTasks;
    }
    const response = await api.get(`/tasks/date-range?start=${startDate}&end=${endDate}`);
    return response.data?.data || response.data || [];
  },
};

// Todo API
export const todoAPI = {
  getAll: async () => {
    if (useMockApi) {
      return mockTodos;
    }
    const response = await api.get('/todos');
    return response.data?.data || response.data || [];
  },
  getById: async (id: string) => {
    if (useMockApi) {
      return mockTodos.find(t => t._id === id) || null;
    }
    const response = await api.get(`/todos/${id}`);
    return response.data?.data || response.data || null;
  },
  create: async (data: any) => {
    if (useMockApi) {
      const newTodo = { _id: Date.now().toString(), ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      mockTodos.push(newTodo);
      return newTodo;
    }
    const response = await api.post('/todos', data);
    return response.data?.data || response.data;
  },
  update: async (id: string, data: any) => {
    if (useMockApi) {
      const index = mockTodos.findIndex(t => t._id === id);
      if (index !== -1) {
        mockTodos[index] = { ...mockTodos[index], ...data, updatedAt: new Date().toISOString() };
        return mockTodos[index];
      }
      throw new Error('Todo not found');
    }
    const response = await api.put(`/todos/${id}`, data);
    return response.data?.data || response.data;
  },
  delete: async (id: string) => {
    if (useMockApi) {
      const index = mockTodos.findIndex(t => t._id === id);
      if (index !== -1) {
        mockTodos.splice(index, 1);
        return { success: true };
      }
      throw new Error('Todo not found');
    }
    const response = await api.delete(`/todos/${id}`);
    return response.data?.data || response.data || { success: true };
  },
  getByDate: async (date: string) => {
    if (useMockApi) {
      const dateObj = new Date(date);
      dateObj.setHours(0, 0, 0, 0);
      const nextDay = new Date(dateObj);
      nextDay.setDate(dateObj.getDate() + 1);
      
      const filteredTodos = mockTodos.filter(todo => {
        if (!todo.dueDate) return false;
        const todoDate = new Date(todo.dueDate);
        todoDate.setHours(0, 0, 0, 0);
        return todoDate >= dateObj && todoDate < nextDay;
      });
      
      return filteredTodos;
    }
    const response = await api.get(`/todos/date/${date}`);
    return response.data?.data || response.data || [];
  },
  getByDateRange: async (startDate: string, endDate: string) => {
    if (useMockApi) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0); // Start of day
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of day
      
      const filteredTodos = mockTodos.filter(todo => {
        if (!todo.dueDate) return false;
        const todoDate = new Date(todo.dueDate);
        return todoDate >= start && todoDate <= end;
      });
      
      return filteredTodos;
    }
    const response = await api.get(`/todos/date-range?start=${startDate}&end=${endDate}`);
    return response.data?.data || response.data || [];
  },
};

// Word API
export const wordAPI = {
  getAll: async () => {
    if (useMockApi) {
      return mockWords;
    }
    const response = await api.get('/words');
    return response.data?.data || response.data || [];
  },
  getById: async (id: string) => {
    if (useMockApi) {
      return mockWords.find(w => w._id === id) || null;
    }
    const response = await api.get(`/words/${id}`);
    return response.data?.data || response.data || null;
  },
  create: async (data: any) => {
    if (useMockApi) {
      const newWord = { _id: Date.now().toString(), ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      mockWords.push(newWord);
      return newWord;
    }
    const response = await api.post('/words', data);
    return response.data?.data || response.data;
  },
  update: async (id: string, data: any) => {
    if (useMockApi) {
      const index = mockWords.findIndex(w => w._id === id);
      if (index !== -1) {
        mockWords[index] = { ...mockWords[index], ...data, updatedAt: new Date().toISOString() };
        return mockWords[index];
      }
      throw new Error('Word not found');
    }
    const response = await api.put(`/words/${id}`, data);
    return response.data?.data || response.data;
  },
  delete: async (id: string) => {
    if (useMockApi) {
      const index = mockWords.findIndex(w => w._id === id);
      if (index !== -1) {
        mockWords.splice(index, 1);
        return { success: true };
      }
      throw new Error('Word not found');
    }
    const response = await api.delete(`/words/${id}`);
    return response.data?.data || response.data || { success: true };
  },
  getByDateRange: async (startDate: string, endDate: string) => {
    if (useMockApi) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0); // Start of day
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // End of day
      
      const filteredWords = mockWords.filter(word => {
        if (!word.date) return false;
        const wordDate = new Date(word.date);
        return wordDate >= start && wordDate <= end;
      });
      
      return filteredWords;
    }
    const response = await api.get(`/words/date-range?start=${startDate}&end=${endDate}`);
    return response.data?.data || response.data || [];
  },
};

// Affirmation API
export const affirmationAPI = {
  getAll: async () => {
    if (useMockApi) {
      return mockAffirmations;
    }
    const response = await api.get('/affirmations');
    return response.data?.data || response.data || [];
  },
  getById: async (id: string) => {
    if (useMockApi) {
      return mockAffirmations.find(a => a._id === id) || null;
    }
    const response = await api.get(`/affirmations/${id}`);
    return response.data?.data || response.data || null;
  },
  create: async (data: any) => {
    if (useMockApi) {
      const newAffirmation = { _id: Date.now().toString(), ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      mockAffirmations.push(newAffirmation);
      return newAffirmation;
    }
    const response = await api.post('/affirmations', data);
    return response.data?.data || response.data;
  },
  update: async (id: string, data: any) => {
    if (useMockApi) {
      const index = mockAffirmations.findIndex(a => a._id === id);
      if (index !== -1) {
        mockAffirmations[index] = { ...mockAffirmations[index], ...data, updatedAt: new Date().toISOString() };
        return mockAffirmations[index];
      }
      throw new Error('Affirmation not found');
    }
    const response = await api.put(`/affirmations/${id}`, data);
    return response.data?.data || response.data;
  },
  delete: async (id: string) => {
    if (useMockApi) {
      const index = mockAffirmations.findIndex(a => a._id === id);
      if (index !== -1) {
        mockAffirmations.splice(index, 1);
        return { success: true };
      }
      throw new Error('Affirmation not found');
    }
    const response = await api.delete(`/affirmations/${id}`);
    return response.data?.data || response.data || { success: true };
  },
};

export default api;