import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Target, 
  CheckSquare, 
  TrendingUp, 
  Heart, 
  Activity,
  Plus,
  Eye,
  Clock,
  Sparkles,
  Edit,
  Trash2,
  X,
  Bell,
  AlertCircle,
  Download,
  FileText,
  LogOut as LogOutIcon,
  Check
} from 'lucide-react';
import VisionForm from '../components/LifePlanner/VisionForm';
import PDFDownloadButton from '../components/LifePlanner/PDFDownloadButton';
import PDFPreviewModal from '../components/LifePlanner/PDFPreviewModal';
import { visionAPI, goalAPI, taskAPI, todoAPI, wordAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showVisionModal, setShowVisionModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Data states
  const [visions, setVisions] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [todos, setTodos] = useState<any[]>([]);
  const [words, setWords] = useState<any[]>([]);

  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    visionTitle: 'Health',
    startDate: '',
    endDate: '',
    priority: 'Medium',
    amountNeeded: ''
  });

  const [newTodo, setNewTodo] = useState({
    text: '',
    category: 'Personal',
    priority: 'Medium',
    dueDate: '',
    reminder: false,
    reminderTime: ''
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      try {
        const [visionsRes, goalsRes, tasksRes, todosRes, wordsRes] = await Promise.all([
          visionAPI.getAll(),
          goalAPI.getAll(),
          taskAPI.getAll(),
          todoAPI.getAll(),
          wordAPI.getAll()
        ]);

        // Ensure we handle both direct array responses and nested data objects
        setVisions(Array.isArray(visionsRes) ? visionsRes : (visionsRes?.data || []));
        setGoals(Array.isArray(goalsRes) ? goalsRes : (goalsRes?.data || []));
        setTasks(Array.isArray(tasksRes) ? tasksRes : (tasksRes?.data || []));
        setTodos(Array.isArray(todosRes) ? todosRes : (todosRes?.data || []));
        setWords(Array.isArray(wordsRes) ? wordsRes : (wordsRes?.data || []));
      } catch (error) {
        console.error('Error in API calls:', error);
        setVisions([]);
        setGoals([]);
        setTasks([]);
        setTodos([]);
        setWords([]);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Set empty arrays as fallback
      setVisions([]);
      setGoals([]);
      setTasks([]);
      setTodos([]);
      setWords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Stats Data
  const stats = {
    visions: { 
      total: visions.length, 
      working: visions.filter(v => v.status === 'In Progress').length, 
      pending: visions.filter(v => v.status === 'Not Started').length 
    },
    goals: { 
      total: goals.length, 
      working: goals.filter(g => g.status === 'In Progress').length, 
      pending: goals.filter(g => g.status === 'Not Started').length 
    },
    tasks: { 
      total: tasks.length, 
      working: tasks.filter(t => !t.completed).length, 
      pending: tasks.filter(t => t.completed).length 
    },
    todos: { 
      total: todos.length, 
      working: todos.filter(t => !t.completed).length, 
      pending: todos.filter(t => t.completed).length 
    },
    myWord: { 
      total: words.length, 
      working: words.filter(w => !w.completed).length, 
      pending: words.filter(w => w.completed).length 
    }
  };

  const visionCategories = ['Health', 'Wealth', 'Success', 'Respect', 'Pleasure', 'Prosperity', 'Luxurious', 'Habit', 'Spirituality', 'About Life'];
  const todoCategories = ['Personal', 'Work', 'Health', 'Finance', 'Career', 'Learning', 'Home', 'Social'];

  const handleAddVision = async (visionData: any) => {
    try {
      await visionAPI.create(visionData);
      setShowVisionModal(false);
      loadDashboardData();
    } catch (error) {
      console.error('Error adding vision:', error);
    }
  };

  const handleAddGoal = async () => {
    if (newGoal.title.trim() && newGoal.description.trim()) {
      try {
        await goalAPI.create(newGoal);
        setNewGoal({
          title: '',
          description: '',
          visionTitle: 'Health',
          startDate: '',
          endDate: '',
          priority: 'Medium',
          amountNeeded: ''
        });
        setShowGoalModal(false);
        loadDashboardData();
      } catch (error) {
        console.error('Error adding goal:', error);
      }
    }
  };

  const handleAddTodo = async () => {
    if (newTodo.text.trim()) {
      try {
        console.log('Adding todo:', newTodo);
        const todoData = {
          text: newTodo.text,
          category: newTodo.category,
          priority: newTodo.priority,
          dueDate: newTodo.dueDate,
          reminder: newTodo.reminder,
          reminderTime: newTodo.reminder ? newTodo.reminderTime : '',
          completed: false
        };
        
        await todoAPI.create(todoData);
        setNewTodo({
          text: '',
          category: 'Personal',
          priority: 'Medium',
          dueDate: '',
          reminder: false,
          reminderTime: ''
        });
        setShowTodoModal(false);
        loadDashboardData();
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
  };

  const toggleTodoCompletion = async (id: string, completed: boolean) => {
    try {
      console.log('Toggling todo completion:', id, !completed);
      await todoAPI.update(id, { completed: !completed });
      loadDashboardData();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id: string) => {
    if (confirm('Are you sure you want to delete this to-do?')) {
      try {
        await todoAPI.delete(id);
        loadDashboardData();
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && dueDate !== '';
  };

  const isDueToday = (dueDate: string) => {
    const today = new Date().toDateString();
    return new Date(dueDate).toDateString() === today;
  };

  const StatCard = ({ title, stats, icon: Icon, gradient, bg }: any) => (
    <div className={`${bg} rounded-2xl p-3 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-102`}>
      <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-4">
        <div className={`p-2 sm:p-3 bg-gradient-to-r ${gradient} rounded-xl shadow-lg`}>
          <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
        </div>
        <h3 className="text-sm sm:text-lg font-bold text-gray-800">{title}</h3>
      </div>
      
      <div className="space-y-1 sm:space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-gray-600">Total</span>
          <span className="text-lg sm:text-xl font-bold text-gray-800">{stats.total}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-gray-600">Working</span>
          <span className="text-sm sm:text-lg font-semibold text-blue-600">{stats.working}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-gray-600">Completed</span>
          <span className="text-sm sm:text-lg font-semibold text-green-600">{stats.pending}</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-4 sm:p-8 text-white shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">
                Good Morning! 🌅
              </h1>
              <p className="text-blue-100 text-sm sm:text-lg">
                Today is {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            {/* PDF Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-wrap justify-end">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 text-sm sm:text-base mb-2 sm:mb-0"
              >
                <LogOutIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Logout</span>
              </button>
              <div className="hidden md:block">
              <button
                onClick={() => setShowPDFPreview(true)}
                className="flex items-center space-x-1 sm:space-x-2 bg-white/20 hover:bg-white/30 text-white px-3 sm:px-4 py-2 rounded-xl transition-all duration-300 backdrop-blur-sm text-sm sm:text-base mb-2 sm:mb-0"
              >
                <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Preview PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>
              </div>
              <PDFDownloadButton
                visions={visions}
                title="My Life Planner Dashboard"
                subtitle={`Generated on ${new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}`}
                variant="outline"
                size="sm"
                className="bg-white/20 hover:bg-white/30 border-white/30 text-white hover:text-white backdrop-blur-sm text-sm hidden md:flex"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-8">
        <button 
          onClick={() => setShowVisionModal(true)}
          className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base group"
          title="Add Vision"
        >
          <Eye className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-pulse" />
          <span>Add Vision</span>
        </button>
        
        <button 
          onClick={() => setShowGoalModal(true)}
          className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base group"
          title="Add Goal"
        >
          <Target className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-pulse" />
          <span>Add Goal</span>
        </button>

        <button 
          onClick={() => setShowTodoModal(true)}
          className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base group"
          title="Add To-Do"
        >
          <CheckSquare className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-pulse" />
          <span>Add To-Do</span>
        </button>
        
        <button 
          onClick={() => setShowPDFPreview(true)}
          className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base md:hidden col-span-2 mt-2"
          title="Preview PDF"
        >
          <Download className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-pulse" />
          <span>Download PDF</span>
        </button>
        
        <button 
          className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-red-600 to-pink-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base group"
          title="Add Word"
        >
          <Heart className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-pulse" />
          <span>Add Word</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6 mb-4 sm:mb-8">
        <StatCard 
          title="Visions" 
          stats={stats.visions} 
          icon={Eye} 
          gradient="from-purple-500 to-indigo-600" 
          bg="bg-purple-50" 
        />
        <StatCard 
          title="Goals" 
          stats={stats.goals} 
          icon={Target} 
          gradient="from-blue-500 to-cyan-600" 
          bg="bg-blue-50" 
        />
        <StatCard 
          title="Tasks" 
          stats={stats.tasks} 
          icon={CheckSquare} 
          gradient="from-green-500 to-emerald-600" 
          bg="bg-green-50" 
        />
        <StatCard 
          title="To-Do's" 
          stats={stats.todos} 
          icon={CheckSquare} 
          gradient="from-orange-500 to-red-600" 
          bg="bg-orange-50" 
        />
        <StatCard 
          title="My Word" 
          stats={stats.myWord} 
          icon={Heart} 
          gradient="from-red-500 to-pink-600" 
          bg="bg-red-50" 
        />
      </div>

      {/* To-Do Section with Reminders */}
      <div className="mb-4 sm:mb-8 overflow-hidden">
        <div className="flex items-center justify-between mb-3 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Quick To-Do's & Reminders</h2>
          <button
            onClick={() => setShowTodoModal(true)}
            className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-102 text-sm sm:text-base group"
            title="Add To-Do"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-pulse" />
            <span>Add To-Do</span>
          </button>
        </div>
        
        <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg border border-gray-100 overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {todos.length === 0 ? (
              <div className="col-span-2 text-center py-8 text-gray-500">
                <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No to-dos created yet</p>
              </div>
            ) : (
              todos.map((todo) => (
                <div key={todo._id} className={`group flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-xl border transition-all duration-300 transform hover:scale-[1.02] ${
                  isOverdue(todo.dueDate) && !todo.completed
                    ? 'bg-red-50 border-red-200 hover:shadow-md'
                    : isDueToday(todo.dueDate) && !todo.completed
                    ? 'bg-yellow-50 border-yellow-200 hover:shadow-md'
                    : 'bg-gray-50 border-gray-200 hover:shadow-md'
                }`}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodoCompletion(todo._id, todo.completed)}
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className={`text-sm font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                        {todo.text}
                      </p>
                      {isOverdue(todo.dueDate) && !todo.completed && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                      {isDueToday(todo.dueDate) && !todo.completed && (
                        <Clock className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-xs text-blue-600">{todo.category}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        todo.priority === 'High' ? 'bg-red-100 text-red-700' :
                        todo.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {todo.priority}
                      </span>
                      
                      {todo.dueDate && (
                        <span className={`text-xs ${
                          isOverdue(todo.dueDate) && !todo.completed ? 'text-red-600 font-semibold' :
                          isDueToday(todo.dueDate) && !todo.completed ? 'text-yellow-600 font-semibold' :
                          'text-gray-500'
                        }`}>
                          Due: {new Date(todo.dueDate).toLocaleDateString()}
                        </span>
                      )}
                      
                      {todo.reminder && (
                        <div className="flex items-center space-x-1 text-xs text-indigo-600">
                          <Bell className="h-3 w-3" />
                          <span>{todo.reminderTime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="opacity-100 sm:opacity-0 group-hover:opacity-100 flex space-x-1 transition-opacity">
                    <button
                      onClick={() => deleteTodo(todo._id)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded transition-all duration-300 transform hover:scale-105 hover:bg-red-50"
                      title="Delete To-Do"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                    <button 
                      className="p-1 text-gray-400 hover:text-blue-600 rounded transition-all duration-300 transform hover:scale-105 hover:bg-blue-50"
                      title="Edit To-Do"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    <button 
                      className="p-1 text-gray-400 hover:text-green-600 rounded transition-all duration-300 transform hover:scale-105 hover:bg-green-50"
                      title="Mark Complete"
                    >
                      <Check className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Vision Form Modal */}
      {showVisionModal && (
        <VisionForm
          onSubmit={handleAddVision}
          onCancel={() => setShowVisionModal(false)}
        />
      )}

      {/* Add Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Add New Goal</h2>
              <button
                onClick={() => setShowGoalModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal Title *
                </label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Enter goal title..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 resize-none"
                  placeholder="Describe your goal..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Related Vision
                </label>
                <select
                  value={newGoal.visionTitle}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, visionTitle: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  {visionCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newGoal.startDate}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={newGoal.endDate}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount Needed
                  </label>
                  <input
                    type="text"
                    value={newGoal.amountNeeded}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, amountNeeded: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="e.g., $1,000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={newGoal.priority}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowGoalModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddGoal}
                  className="flex-1 px-4 py-2 text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg transform hover:scale-105"
                >
                  Add Goal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add To-Do Modal */}
      {showTodoModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Add New To-Do</h2>
              <button
                onClick={() => setShowTodoModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To-Do Text *
                </label>
                <input
                  type="text"
                  value={newTodo.text}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, text: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  placeholder="Enter your to-do..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newTodo.category}
                    onChange={(e) => setNewTodo(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  >
                    {todoCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={newTodo.priority}
                    onChange={(e) => setNewTodo(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  value={newTodo.dueDate}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="reminder"
                    checked={newTodo.reminder}
                    onChange={(e) => setNewTodo(prev => ({ ...prev, reminder: e.target.checked }))}
                    className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="reminder" className="text-sm font-medium text-gray-700">
                    Set reminder
                  </label>
                </div>

                {newTodo.reminder && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reminder time
                    </label>
                    <input
                      type="time"
                      value={newTodo.reminderTime}
                      onChange={(e) => setNewTodo(prev => ({ ...prev, reminderTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    />
                  </div>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowTodoModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTodo}
                  className="flex-1 px-4 py-2 text-white bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg transform hover:scale-105"
                >
                  Add To-Do
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Preview Modal */}
      <PDFPreviewModal
        isOpen={showPDFPreview}
        onClose={() => setShowPDFPreview(false)}
        visions={visions}
        title="My Life Planner Dashboard"
        subtitle={`Generated on ${new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}`}
      />
    </div>
  );
};

export default Dashboard;