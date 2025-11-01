import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Target, 
  CheckSquare, 
  Heart, 
  Eye,
  Edit,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  Filter,
  Search
} from 'lucide-react';
import VisionForm from './VisionForm';
import GoalForm from './GoalForm';
import TaskForm from './TaskForm';
import TodoForm from './TodoForm';
import WordForm from './WordForm';
import { visionAPI, goalAPI, taskAPI, todoAPI, wordAPI } from '../../services/api';

const YearlyPlanner: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedQuarter, setSelectedQuarter] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [showVisionForm, setShowVisionForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [showWordForm, setShowWordForm] = useState(false);
  const [editingVision, setEditingVision] = useState<any>(null);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [editingTodo, setEditingTodo] = useState<any>(null);
  const [editingWord, setEditingWord] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Data states
  const [visions, setVisions] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [todos, setTodos] = useState<any[]>([]);
  const [words, setWords] = useState<any[]>([]);

  useEffect(() => {
    loadYearlyData();
  }, [selectedYear]);

  const loadYearlyData = async () => {
    setLoading(true);
    try {
      const startDate = new Date(selectedYear, 0, 1); // January 1st of selected year
      const endDate = new Date(selectedYear, 11, 31); // December 31st of selected year
      
      const startDateStr = startDate.toISOString();
      const endDateStr = endDate.toISOString();
      
      const [visionsRes, goalsRes, tasksRes, todosRes, wordsRes] = await Promise.all([
        visionAPI.getAll(),
        goalAPI.getByDateRange ? goalAPI.getByDateRange(startDateStr, endDateStr) : goalAPI.getAll(),
        taskAPI.getByDateRange ? taskAPI.getByDateRange(startDateStr, endDateStr) : taskAPI.getAll(),
        todoAPI.getByDateRange ? todoAPI.getByDateRange(startDateStr, endDateStr) : todoAPI.getAll(),
        wordAPI.getByDateRange ? wordAPI.getByDateRange(startDateStr, endDateStr) : wordAPI.getAll()
      ]);
      
      // Filter visions that are active during the selected year
      const filteredVisions = Array.isArray(visionsRes) ? visionsRes.filter(vision => {
        if (!vision.startDate && !vision.endDate) return true; // No date restrictions
        
        const visionStart = vision.startDate ? new Date(vision.startDate) : null;
        const visionEnd = vision.endDate ? new Date(vision.endDate) : null;
        
        if (visionStart && visionEnd) {
          return visionStart.getFullYear() <= selectedYear && visionEnd.getFullYear() >= selectedYear;
        }
        
        if (visionStart && !visionEnd) {
          return visionStart.getFullYear() <= selectedYear;
        }
        
        if (!visionStart && visionEnd) {
          return visionEnd.getFullYear() >= selectedYear;
        }
        
        return true;
      }) : [];
      
      setVisions(filteredVisions);
      setGoals(Array.isArray(goalsRes) ? goalsRes : []);
      setTasks(Array.isArray(tasksRes) ? tasksRes : []);
      setTodos(Array.isArray(todosRes) ? todosRes : []);
      setWords(Array.isArray(wordsRes) ? wordsRes : []);
    } catch (error) {
      console.error('Error loading yearly data:', error);
      setVisions([]);
      setGoals([]);
      setTasks([]);
      setTodos([]);
      setWords([]);
    } finally {
      setLoading(false);
    }
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    setSelectedYear(prev => prev + (direction === 'next' ? 1 : -1));
    setSelectedQuarter(null);
    setSelectedMonth(null);
  };

  const handleQuarterClick = (quarter: number) => {
    setSelectedQuarter(selectedQuarter === quarter ? null : quarter);
    setSelectedMonth(null);
  };

  const handleMonthClick = (month: number) => {
    setSelectedMonth(selectedMonth === month ? null : month);
  };

  const getQuarterMonths = (quarter: number) => {
    const startMonth = (quarter - 1) * 3;
    return [startMonth, startMonth + 1, startMonth + 2];
  };

  const getMonthName = (month: number) => {
    return new Date(2000, month, 1).toLocaleString('default', { month: 'long' });
  };

  const getQuarterData = (quarter: number) => {
    const months = getQuarterMonths(quarter);
    const startDate = new Date(selectedYear, months[0], 1);
    const endDate = new Date(selectedYear, months[2] + 1, 0);
    
    const quarterGoals = goals.filter(goal => {
      if (!goal.startDate && !goal.endDate) return false;
      
      const goalStart = goal.startDate ? new Date(goal.startDate) : null;
      const goalEnd = goal.endDate ? new Date(goal.endDate) : null;
      
      if (goalStart && goalEnd) {
        return goalStart <= endDate && goalEnd >= startDate;
      }
      
      if (goalStart && !goalEnd) {
        return goalStart <= endDate && goalStart >= startDate;
      }
      
      if (!goalStart && goalEnd) {
        return goalEnd >= startDate && goalEnd <= endDate;
      }
      
      return false;
    });
    
    const quarterTasks = tasks.filter(task => {
      if (!task.date) return false;
      
      const taskDate = new Date(task.date);
      return taskDate >= startDate && taskDate <= endDate;
    });
    
    const quarterTodos = todos.filter(todo => {
      if (!todo.dueDate) return false;
      
      const todoDate = new Date(todo.dueDate);
      return todoDate >= startDate && todoDate <= endDate;
    });
    
    return {
      goals: quarterGoals.length,
      tasks: quarterTasks.length,
      todos: quarterTodos.length
    };
  };

  const getMonthData = (month: number) => {
    const startDate = new Date(selectedYear, month, 1);
    const endDate = new Date(selectedYear, month + 1, 0);
    
    const monthGoals = goals.filter(goal => {
      if (!goal.startDate && !goal.endDate) return false;
      
      const goalStart = goal.startDate ? new Date(goal.startDate) : null;
      const goalEnd = goal.endDate ? new Date(goal.endDate) : null;
      
      if (goalStart && goalEnd) {
        return goalStart <= endDate && goalEnd >= startDate;
      }
      
      if (goalStart && !goalEnd) {
        return goalStart <= endDate && goalStart >= startDate;
      }
      
      if (!goalStart && goalEnd) {
        return goalEnd >= startDate && goalEnd <= endDate;
      }
      
      return false;
    });
    
    const monthTasks = tasks.filter(task => {
      if (!task.date) return false;
      
      const taskDate = new Date(task.date);
      return taskDate >= startDate && taskDate <= endDate;
    });
    
    const monthTodos = todos.filter(todo => {
      if (!todo.dueDate) return false;
      
      const todoDate = new Date(todo.dueDate);
      return todoDate >= startDate && todoDate <= endDate;
    });
    
    return {
      goals: monthGoals.length,
      tasks: monthTasks.length,
      todos: monthTodos.length
    };
  };

  const handleAddVision = async (visionData: any) => {
    try {
      await visionAPI.create(visionData);
      setShowVisionForm(false);
      setEditingVision(null);
      loadYearlyData();
    } catch (error) {
      console.error('Error adding vision:', error);
    }
  };

  const handleUpdateVision = async (visionData: any) => {
    try {
      await visionAPI.update(editingVision._id, visionData);
      setShowVisionForm(false);
      setEditingVision(null);
      loadYearlyData();
    } catch (error) {
      console.error('Error updating vision:', error);
    }
  };

  const handleDeleteVision = async (id: string) => {
    if (confirm('Are you sure you want to delete this vision?')) {
      try {
        await visionAPI.delete(id);
        loadYearlyData();
      } catch (error) {
        console.error('Error deleting vision:', error);
      }
    }
  };

  const handleAddGoal = async (goalData: any) => {
    try {
      await goalAPI.create(goalData);
      setShowGoalForm(false);
      setEditingGoal(null);
      loadYearlyData();
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const handleUpdateGoal = async (goalData: any) => {
    try {
      await goalAPI.update(editingGoal._id, goalData);
      setShowGoalForm(false);
      setEditingGoal(null);
      loadYearlyData();
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      try {
        await goalAPI.delete(id);
        loadYearlyData();
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  const filteredVisions = visions.filter(vision => {
    if (filter === 'all') return true;
    if (filter === 'active' && vision.status === 'In Progress') return true;
    if (filter === 'completed' && vision.status === 'Completed') return true;
    if (filter === 'not-started' && vision.status === 'Not Started') return true;
    if (filter === vision.category?.toLowerCase()) return true;
    
    return false;
  }).filter(vision => {
    if (!searchTerm) return true;
    
    return (
      vision.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vision.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vision.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const visionCategories = ['Health', 'Wealth', 'Success', 'Respect', 'Pleasure', 'Prosperity', 'Luxurious', 'Habit', 'Spirituality', 'About Life'];

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-4 sm:p-6 text-white shadow-xl">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">Yearly Planner</h1>
          <p className="text-indigo-100 text-sm sm:text-lg">{selectedYear}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateYear('prev')}
            className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={() => setSelectedYear(new Date().getFullYear())}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
          >
            This Year
          </button>
          
          <button
            onClick={() => navigateYear('next')}
            className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Visions' },
                { id: 'active', label: 'Active' },
                { id: 'completed', label: 'Completed' },
                { id: 'not-started', label: 'Not Started' },
                ...visionCategories.map(cat => ({ id: cat.toLowerCase(), label: cat }))
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterOption.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search visions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Year Overview */}
      <div className="bg-white rounded-xl shadow-lg border border-indigo-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-indigo-600" />
            <span>Year at a Glance</span>
          </h3>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setShowVisionForm(true)}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Vision</span>
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Download className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Printer className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Quarters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(quarter => {
            const quarterData = getQuarterData(quarter);
            const isSelected = selectedQuarter === quarter;
            
            return (
              <div
                key={quarter}
                onClick={() => handleQuarterClick(quarter)}
                className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-300 shadow-md'
                    : 'bg-white border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 hover:shadow-md'
                }`}
              >
                <h4 className="text-lg font-bold text-gray-800 mb-3">Q{quarter}</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Goals</span>
                    <span className="text-sm font-semibold text-indigo-600">{quarterData.goals}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tasks</span>
                    <span className="text-sm font-semibold text-green-600">{quarterData.tasks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">To-Do's</span>
                    <span className="text-sm font-semibold text-orange-600">{quarterData.todos}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Months for selected quarter */}
        {selectedQuarter && (
          <div className="mb-8">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Months in Q{selectedQuarter}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getQuarterMonths(selectedQuarter).map(month => {
                const monthData = getMonthData(month);
                const isSelected = selectedMonth === month;
                
                return (
                  <div
                    key={month}
                    onClick={() => handleMonthClick(month)}
                    className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-300 shadow-md'
                        : 'bg-white border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 hover:shadow-md'
                    }`}
                  >
                    <h5 className="text-md font-bold text-gray-800 mb-2">{getMonthName(month)}</h5>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Goals</span>
                        <span className="text-xs font-semibold text-indigo-600">{monthData.goals}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Tasks</span>
                        <span className="text-xs font-semibold text-green-600">{monthData.tasks}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">To-Do's</span>
                        <span className="text-xs font-semibold text-orange-600">{monthData.todos}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Yearly Visions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <Eye className="h-6 w-6 text-indigo-600" />
            <span>Yearly Visions</span>
          </h3>
          <button
            onClick={() => {
              setEditingVision(null);
              setShowVisionForm(true);
            }}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Vision</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVisions.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <Eye className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-800 mb-2">No visions found</h4>
              <p className="text-gray-500 mb-4">
                {searchTerm || filter !== 'all'
                  ? 'Try adjusting your filters or search terms'
                  : 'Create your first vision to start planning your year'}
              </p>
              {!searchTerm && filter === 'all' && (
                <button
                  onClick={() => {
                    setEditingVision(null);
                    setShowVisionForm(true);
                  }}
                  className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Your First Vision</span>
                </button>
              )}
            </div>
          ) : (
            filteredVisions.map(vision => (
              <div key={vision._id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
                {/* Vision Image */}
                {vision.imageUrl && (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={vision.imageUrl}
                      alt={vision.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Vision Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-bold text-gray-800">{vision.name}</h4>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => {
                          setEditingVision(vision);
                          setShowVisionForm(true);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 rounded"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteVision(vision._id)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{vision.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Progress</span>
                      <span className="text-sm font-semibold text-gray-800">{vision.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500"
                        style={{ width: `${vision.progress || 0}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Vision Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{vision.startDate ? new Date(vision.startDate).toLocaleDateString() : 'No start date'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{vision.endDate ? new Date(vision.endDate).toLocaleDateString() : 'No end date'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="h-3 w-3" />
                      <span>{goals.filter(g => g.visionTitle === vision.category).length} goals</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckSquare className="h-3 w-3" />
                      <span>{tasks.filter(t => t.category === vision.category).length} tasks</span>
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vision.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      vision.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {vision.status || 'Not Started'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vision.priority === 'High' ? 'bg-red-100 text-red-800' :
                      vision.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {vision.priority || 'Medium'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Yearly Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-indigo-600 mb-1">{visions.length}</div>
          <div className="text-gray-600 text-sm">Active Visions</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600 mb-1">{goals.length}</div>
          <div className="text-gray-600 text-sm">Yearly Goals</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600 mb-1">{tasks.length}</div>
          <div className="text-gray-600 text-sm">Planned Tasks</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-orange-600 mb-1">{todos.length}</div>
          <div className="text-gray-600 text-sm">To-Do Items</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button 
          onClick={() => {
            setEditingVision(null);
            setShowVisionForm(true);
          }}
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-3 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group"
        >
          <Eye className="h-5 w-5 group-hover:animate-pulse" />
          <span className="font-medium">Add Vision</span>
        </button>
        
        <button 
          onClick={() => {
            setEditingGoal(null);
            setShowGoalForm(true);
          }}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group"
        >
          <Target className="h-5 w-5 group-hover:animate-pulse" />
          <span className="font-medium">Add Goal</span>
        </button>
        
        <button 
          onClick={() => {
            setEditingTask(null);
            setShowTaskForm(true);
          }}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group"
        >
          <CheckSquare className="h-5 w-5 group-hover:animate-pulse" />
          <span className="font-medium">Add Task</span>
        </button>
        
        <button 
          onClick={() => {
            setEditingTodo(null);
            setShowTodoForm(true);
          }}
          className="flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-3 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group"
        >
          <CheckSquare className="h-5 w-5 group-hover:animate-pulse" />
          <span className="font-medium">Add Todo</span>
        </button>
        
        <button 
          onClick={() => {
            setEditingWord(null);
            setShowWordForm(true);
          }}
          className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-3 rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group"
        >
          <Heart className="h-5 w-5 group-hover:animate-pulse" />
          <span className="font-medium">Add Word</span>
        </button>
        
        <button 
          className="flex items-center space-x-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group ml-auto"
        >
          <Download className="h-5 w-5 group-hover:animate-pulse" />
          <span className="font-medium">Download</span>
        </button>
        
        <button 
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group"
        >
          <Printer className="h-5 w-5 group-hover:animate-pulse" />
          <span className="font-medium">Print</span>
        </button>
      </div>

      {/* Vision Form Modal */}
      {showVisionForm && (
        <VisionForm
          onSubmit={editingVision ? handleUpdateVision : handleAddVision}
          onCancel={() => {
            setShowVisionForm(false);
            setEditingVision(null);
          }}
          initialData={editingVision}
        />
      )}

      {/* Goal Form Modal */}
      {showGoalForm && (
        <GoalForm
          onSubmit={editingGoal ? handleUpdateGoal : handleAddGoal}
          onCancel={() => {
            setShowGoalForm(false);
            setEditingGoal(null);
          }}
          initialData={editingGoal}
        />
      )}
      
      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          onSubmit={editingTask ? 
            (data) => taskAPI.update(editingTask._id, data).then(() => {
              setShowTaskForm(false);
              setEditingTask(null);
              loadYearlyData();
            }) : 
            (data) => taskAPI.create(data).then(() => {
              setShowTaskForm(false);
              loadYearlyData();
            })
          }
          onCancel={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
          initialData={editingTask}
        />
      )}
      
      {/* Todo Form Modal */}
      {showTodoForm && (
        <TodoForm
          onSubmit={editingTodo ? 
            (data) => todoAPI.update(editingTodo._id, data).then(() => {
              setShowTodoForm(false);
              setEditingTodo(null);
              loadYearlyData();
            }) : 
            (data) => todoAPI.create(data).then(() => {
              setShowTodoForm(false);
              loadYearlyData();
            })
          }
          onCancel={() => {
            setShowTodoForm(false);
            setEditingTodo(null);
          }}
          initialData={editingTodo}
        />
      )}
      
      {/* Word Form Modal */}
      {showWordForm && (
        <WordForm
          onSubmit={editingWord ? 
            (data) => wordAPI.update(editingWord._id, data).then(() => {
              setShowWordForm(false);
              setEditingWord(null);
              loadYearlyData();
            }) : 
            (data) => wordAPI.create(data).then(() => {
              setShowWordForm(false);
              loadYearlyData();
            })
          }
          onCancel={() => {
            setShowWordForm(false);
            setEditingWord(null);
          }}
          initialData={editingWord}
        />
      )}
    </div>
  );
};

export default YearlyPlanner;