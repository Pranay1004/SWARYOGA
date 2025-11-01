import React, { useState, useEffect } from 'react';
import { 
  Plus,
  CheckSquare,
  Edit,
  Trash2,
  Filter,
  Search,
  Calendar,
  Check,
} from 'lucide-react';
import { todoAPI } from '../../services/api';
import TodoForm from './TodoForm';

interface Todo {
  id: string;
  _id: string;
  text: string;
  completed: boolean;
  category: string;
  createdAt: string;
  dueDate?: string;
}

const MyTodos: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const categories = ['Personal', 'Work', 'Health', 'Learning', 'Other'];

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await todoAPI.getAll();
      setTodos(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch todos');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (id: string) => {
    try {
      const todo = todos.find(t => t._id === id);
      if (!todo) return;

      const updatedTodo = await todoAPI.update(id, { 
        ...todo, 
        completed: !todo.completed 
      });
      
      setTodos(todos.map(t => t._id === id ? updatedTodo : t));
    } catch (err) {
      setError('Failed to update todo');
      console.error('Error updating todo:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await todoAPI.delete(id);
      setTodos(todos.filter(t => t._id !== id));
    } catch (err) {
      setError('Failed to delete todo');
      console.error('Error deleting todo:', err);
    }
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleSave = async (todoData: Partial<Todo>) => {
    try {
      if (editingTodo) {
        const updatedTodo = await todoAPI.update(editingTodo.id, {
          ...editingTodo, 
          ...todoData
        });
        setTodos(todos.map(t => t._id === editingTodo._id ? updatedTodo : t));
      } else {
        const newTodo = await todoAPI.create(todoData as Omit<Todo, 'id'>);
        setTodos([...todos, newTodo]);
      }
      setShowForm(false);
      setEditingTodo(null);
    } catch (err) {
      setError('Failed to save todo');
      console.error('Error saving todo:', err);
    }
  };

  const filteredTodos = todos.filter(todo => {
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && !todo.completed) ||
      (filter === 'completed' && todo.completed);
    
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || todo.category === selectedCategory;
    
    return matchesFilter && matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">My Todos</h2>
                <p className="text-sm text-gray-600">
                  {filteredTodos.length} of {todos.length} todos
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingTodo(null);
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Todo
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search todos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2">
              {(['all', 'active', 'completed'] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterType
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </div>

            {/* Category filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Todo List */}
        <div className="divide-y divide-gray-200">
          {filteredTodos.length === 0 ? (
            <div className="p-12 text-center">
              <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No todos found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedCategory !== 'all' || filter !== 'all'
                  ? 'Try adjusting your filters or search terms.'
                  : 'Get started by creating your first todo.'}
              </p>
              {(!searchTerm && selectedCategory === 'all' && filter === 'all') && (
                <button
                  onClick={() => {
                    setEditingTodo(null);
                    setShowForm(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Your First Todo
                </button>
              )}
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <div
                key={todo._id}
                className={`p-6 hover:bg-gray-50 transition-colors ${
                  todo.completed ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => handleToggleComplete(todo._id)}
                    className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      todo.completed
                        ? 'bg-green-500 border-green-500 text-white touch-manipulation'
                        : 'border-gray-300 hover:border-green-500 touch-manipulation'
                    }`}
                  >
                    {todo.completed && <Check className="w-3 h-3" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className={`text-gray-900 ${todo.completed ? 'line-through' : ''}`}>
                          {todo.text}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="inline-flex items-center gap-1">
                            <Filter className="w-3 h-3" />
                            {todo.category}
                          </span>
                          {todo.dueDate && (
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(todo.dueDate).toLocaleDateString()}
                            </span>
                          )}
                          <span>
                            Created {new Date(todo.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(todo)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit todo"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(todo._id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete todo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Todo Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingTodo ? 'Edit Todo' : 'Add New Todo'}
              </h3>
              <TodoForm
                todo={editingTodo}
                onSubmit={handleSave}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTodo(null);
                }}
                categories={categories}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTodos;