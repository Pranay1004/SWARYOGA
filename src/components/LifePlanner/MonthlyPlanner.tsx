import React, { useState } from 'react';
import { useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Target as TargetIcon, 
  CheckSquare as CheckSquareIcon, 
  Heart as HeartIcon,
  Eye as EyeIcon,
  Edit as EditIcon,
  Trash2 as Trash2Icon,
  Plus as PlusIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Clock as ClockIcon,
  Download as DownloadIcon,
  Printer as PrinterIcon
} from 'lucide-react';
import VisionForm from './VisionForm';
import GoalForm from './GoalForm';
import TaskForm from './TaskForm';
import TodoForm from './TodoForm';
import WordForm from './WordForm';

import { visionAPI, goalAPI, taskAPI, todoAPI, wordAPI } from '../../services/api';

const MonthlyPlanner: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Modal states
  const [showVisionForm, setShowVisionForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [showWordForm, setShowWordForm] = useState(false);
  
  // Editing states
  const [editingVision, setEditingVision] = useState<any>(null);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [editingTodo, setEditingTodo] = useState<any>(null);
  const [editingWord, setEditingWord] = useState<any>(null);
  
  // Data states
  const [visions, setVisions] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [todos, setTodos] = useState<any[]>([]);
  const [words, setWords] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [selectedMonth, selectedYear]);

  const loadData = async () => {
    setLoading(true);
    try {
      const startDate = new Date(selectedYear, selectedMonth, 1); // First day of month
      const endDate = new Date(selectedYear, selectedMonth + 1, 0); // Last day of month
      
      const startDateStr = startDate.toISOString();
      const endDateStr = endDate.toISOString();
      
      const [visionsRes, goalsRes, tasksRes, todosRes, wordsRes] = await Promise.all([
        visionAPI.getAll(),
        goalAPI.getByDateRange ? goalAPI.getByDateRange(startDateStr, endDateStr) : goalAPI.getAll(),
        taskAPI.getByDateRange ? taskAPI.getByDateRange(startDateStr, endDateStr) : taskAPI.getAll(),
        todoAPI.getByDateRange ? todoAPI.getByDateRange(startDateStr, endDateStr) : todoAPI.getAll(),
        wordAPI.getByDateRange ? wordAPI.getByDateRange(startDateStr, endDateStr) : wordAPI.getAll()
      ]);
      
      // Filter visions that are active during the selected month
      const filteredVisions = Array.isArray(visionsRes) ? visionsRes.filter(vision => {
        if (!vision.startDate && !vision.endDate) return true; // No date restrictions
        
        const visionStart = vision.startDate ? new Date(vision.startDate) : null;
        const visionEnd = vision.endDate ? new Date(vision.endDate) : null;
        
        if (visionStart && visionEnd) {
          return visionStart <= endDate && visionEnd >= startDate;
        }
        
        if (visionStart && !visionEnd) {
          return visionStart <= endDate;
        }
        
        if (!visionStart && visionEnd) {
          return visionEnd >= startDate;
        }
        
        return true;
      }) : [];
      
      setVisions(filteredVisions);
      setGoals(Array.isArray(goalsRes) ? goalsRes : []);
      setTasks(Array.isArray(tasksRes) ? tasksRes : []);
      setTodos(Array.isArray(todosRes) ? todosRes : []);
      setWords(Array.isArray(wordsRes) ? wordsRes : []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
    setSelectedDate(null);
  };

  const handleDateClick = (day: number) => {
    const date = new Date(selectedYear, selectedMonth, day);
    setSelectedDate(date);
  };

  // Form submission handlers
  const handleAddVision = async (visionData: any) => {
    try {
      await visionAPI.create(visionData);
      setShowVisionForm(false);
      setEditingVision(null);
      loadData();
    } catch (error) {
      console.error('Error adding vision:', error);
    }
  };

  const handleUpdateVision = async (visionData: any) => {
    try {
      await visionAPI.update(editingVision._id, visionData);
      setShowVisionForm(false);
      setEditingVision(null);
      loadData();
    } catch (error) {
      console.error('Error updating vision:', error);
    }
  };

  const handleDeleteVision = async (id: string) => {
    if (confirm('Are you sure you want to delete this vision?')) {
      try {
        await visionAPI.delete(id);
        loadData();
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
      loadData();
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const handleUpdateGoal = async (goalData: any) => {
    try {
      await goalAPI.update(editingGoal._id, goalData);
      setShowGoalForm(false);
      setEditingGoal(null);
      loadData();
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      try {
        await goalAPI.delete(id);
        loadData();
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  const handleAddTask = async (taskData: any) => {
    try {
      await taskAPI.create({
        ...taskData,
        date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date(selectedYear, selectedMonth, 1).toISOString().split('T')[0]
      });
      setShowTaskForm(false);
      setEditingTask(null);
      loadData();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleUpdateTask = async (taskData: any) => {
    try {
      await taskAPI.update(editingTask._id, taskData);
      setShowTaskForm(false);
      setEditingTask(null);
      loadData();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.delete(id);
        loadData();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleAddTodo = async (todoData: any) => {
    try {
      await todoAPI.create({
        ...todoData,
        dueDate: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date(selectedYear, selectedMonth, 1).toISOString().split('T')[0]
      });
      setShowTodoForm(false);
      setEditingTodo(null);
      loadData();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleUpdateTodo = async (todoData: any) => {
    try {
      await todoAPI.update(editingTodo._id, todoData);
      setShowTodoForm(false);
      setEditingTodo(null);
      loadData();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (confirm('Are you sure you want to delete this todo?')) {
      try {
        await todoAPI.delete(id);
        loadData();
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    }
  };

  const handleAddWord = async (wordData: any) => {
    try {
      await wordAPI.create({
        ...wordData,
        date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date(selectedYear, selectedMonth, 1).toISOString().split('T')[0]
      });
      setShowWordForm(false);
      setEditingWord(null);
      loadData();
    } catch (error) {
      console.error('Error adding word:', error);
    }
  };

  const handleUpdateWord = async (wordData: any) => {
    try {
      await wordAPI.update(editingWord._id, wordData);
      setShowWordForm(false);
      setEditingWord(null);
      loadData();
    } catch (error) {
      console.error('Error updating word:', error);
    }
  };

  const handleDeleteWord = async (id: string) => {
    if (confirm('Are you sure you want to delete this word?')) {
      try {
        await wordAPI.delete(id);
        loadData();
      } catch (error) {
        console.error('Error deleting word:', error);
      }
    }
  };

  // Helper functions
  const getDaysInMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getDateDetails = (day: number) => {
    if (!day) return { tasks: [], todos: [], goals: [], words: [] };
    
    const date = new Date(selectedYear, selectedMonth, day);
    const dateStr = date.toISOString().split('T')[0];
    
    return {
      tasks: tasks.filter(task => {
        if (!task.date) return false;
        const taskDate = new Date(task.date).toISOString().split('T')[0];
        return taskDate === dateStr;
      }),
      todos: todos.filter(todo => {
        if (!todo.dueDate) return false;
        const todoDate = new Date(todo.dueDate).toISOString().split('T')[0];
        return todoDate === dateStr;
      }),
      goals: goals.filter(goal => {
        const startDate = goal.startDate ? new Date(goal.startDate).toISOString().split('T')[0] : null;
        const endDate = goal.endDate ? new Date(goal.endDate).toISOString().split('T')[0] : null;
        
        return startDate === dateStr || endDate === dateStr;
      }),
      words: words.filter(word => {
        if (!word.date) return false;
        const wordDate = new Date(word.date).toISOString().split('T')[0];
        return wordDate === dateStr;
      })
    };
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      day: 'numeric', 
      month: 'short'
    });
  };

  const days = getDaysInMonth(selectedYear, selectedMonth);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      {/* Header with Month Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 sm:p-6 text-white shadow-xl">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">Monthly Planner</h1>
          <p className="text-purple-100 text-sm sm:text-lg">{monthNames[selectedMonth]} {selectedYear}</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 touch-manipulation"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          
          <button
            onClick={() => {
              setSelectedMonth(new Date().getMonth());
              setSelectedYear(new Date().getFullYear());
              setSelectedDate(null);
            }}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-base touch-manipulation"
          >
            This Month
          </button>
          
          <button
            onClick={() => navigateMonth('next')}
            className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 touch-manipulation"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Monthly Calendar View */}
      <div className="bg-white rounded-2xl shadow-lg border border-purple-200 p-6 mb-8 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Monthly Calendar</h3>
          </div>
          
          <div className="flex space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <DownloadIcon className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <PrinterIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map((day) => (
            <div key={day} className="p-3 text-center text-sm font-bold text-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="p-3 h-24 border border-gray-100 rounded-lg bg-gray-50"></div>;
            }
            
            const isToday = day === new Date().getDate() && 
                           selectedMonth === new Date().getMonth() && 
                           selectedYear === new Date().getFullYear();
                           
            const isSelected = selectedDate && 
                              day === selectedDate.getDate() && 
                              selectedMonth === selectedDate.getMonth() && 
                              selectedYear === selectedDate.getFullYear();
            
            const details = getDateDetails(day);
            const hasEvents = details.tasks.length > 0 || 
                             details.todos.length > 0 || 
                             details.goals.length > 0 || 
                             details.words.length > 0;
            
            return (
              <div
                key={`day-${day}`}
                onClick={() => handleDateClick(day)}
                className={`p-3 h-24 border rounded-lg text-center transition-all duration-300 cursor-pointer hover:shadow-md transform hover:scale-105 overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105 border-transparent'
                    : isToday
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg border-transparent' 
                    : hasEvents
                    ? 'bg-white border-purple-200 hover:border-purple-300'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`text-sm font-bold ${isSelected || isToday ? 'text-white' : 'text-gray-800'}`}>
                  {day}
                </div>
                
                <div className="mt-1 flex flex-wrap justify-center gap-1">
                  {details.tasks.length > 0 && (
                    <div className={`w-2 h-2 rounded-full ${isSelected || isToday ? 'bg-white/70' : 'bg-green-500'}`}></div>
                  )}
                  {details.todos.length > 0 && (
                    <div className={`w-2 h-2 rounded-full ${isSelected || isToday ? 'bg-white/70' : 'bg-blue-500'}`}></div>
                  )}
                  {details.goals.length > 0 && (
                    <div className={`w-2 h-2 rounded-full ${isSelected || isToday ? 'bg-white/70' : 'bg-orange-500'}`}></div>
                  )}
                  {details.words.length > 0 && (
                    <div className={`w-2 h-2 rounded-full ${isSelected || isToday ? 'bg-white/70' : 'bg-red-500'}`}></div>
                  )}
                </div>
                
                {hasEvents && !isSelected && !isToday && (
                  <div className="mt-1 text-xs text-gray-500 truncate">
                    {details.tasks.length + details.todos.length + details.goals.length + details.words.length} items
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="bg-white rounded-2xl shadow-lg border border-purple-200 p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-purple-600" />
            <span>
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </h3>
          
          <div className="space-y-6">
            {/* Date Goals */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <TargetIcon className="h-5 w-5 text-blue-600" />
                  <span>Goals</span>
                </h4>
                <button
                  onClick={() => {
                    setEditingGoal(null);
                    setShowGoalForm(true);
                  }}
                  className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
              
              {getDateDetails(selectedDate.getDate()).goals.length === 0 ? (
                <p className="text-gray-500 text-center py-3">No goals for this date</p>
              ) : (
                <div className="space-y-2">
                  {getDateDetails(selectedDate.getDate()).goals.map((goal) => (
                    <div key={goal._id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-gray-800">{goal.name}</h5>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => {
                              setEditingGoal(goal);
                              setShowGoalForm(true);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 rounded"
                          >
                            <EditIcon className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteGoal(goal._id)}
                            className="p-1 text-gray-400 hover:text-red-600 rounded"
                          >
                            <Trash2Icon className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                      <div className="flex items-center space-x-3 mt-2 text-xs">
                        <span className="text-blue-600">{goal.visionTitle}</span>
                        <span className={`px-2 py-0.5 rounded-full ${
                          goal.priority === 'High' ? 'bg-red-100 text-red-700' :
                          goal.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {goal.priority}
                        </span>
                        <div className="flex items-center space-x-1 ml-auto">
                          <ClockIcon className="h-3 w-3 text-gray-500" />
                          <span className="text-gray-500">
                            {goal.startTime && goal.endTime ? 
                              `${goal.startTime} - ${goal.endTime}` : 
                              'No time set'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Date Tasks */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <CheckSquareIcon className="h-5 w-5 text-green-600" />
                  <span>Tasks</span>
                </h4>
                <button
                  onClick={() => {
                    setEditingTask(null);
                    setShowTaskForm(true);
                  }}
                  className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
              
              {getDateDetails(selectedDate.getDate()).tasks.length === 0 ? (
                <p className="text-gray-500 text-center py-3">No tasks for this date</p>
              ) : (
                <div className="space-y-2">
                  {getDateDetails(selectedDate.getDate()).tasks.map((task) => (
                    <div key={task._id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => {
                            taskAPI.update(task._id, { 
                              completed: !task.completed,
                              status: !task.completed ? 'Complete' : 'Pending'
                            }).then(() => loadData());
                          }}
                          className="w-4 h-4 text-green-600 rounded"
                        />
                        <div className="flex-1">
                          <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                            {task.particulars}
                          </p>
                          <div className="flex items-center space-x-3 mt-1 text-xs">
                            {task.time && (
                              <div className="flex items-center space-x-1">
                                <ClockIcon className="h-3 w-3 text-gray-500" />
                                <span className="text-gray-500">{task.time}</span>
                              </div>
                            )}
                            <span className={`px-2 py-0.5 rounded-full ${
                              task.priority === 'High' ? 'bg-red-100 text-red-700' :
                              task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => {
                              setEditingTask(task);
                              setShowTaskForm(true);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 rounded"
                          >
                            <EditIcon className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="p-1 text-gray-400 hover:text-red-600 rounded"
                          >
                            <Trash2Icon className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Date Todos */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <CheckSquareIcon className="h-5 w-5 text-orange-600" />
                  <span>To-Do's</span>
                </h4>
                <button
                  onClick={() => {
                    setEditingTodo(null);
                    setShowTodoForm(true);
                  }}
                  className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
              
              {getDateDetails(selectedDate.getDate()).todos.length === 0 ? (
                <p className="text-gray-500 text-center py-3">No to-do's for this date</p>
              ) : (
                <div className="space-y-2">
                  {getDateDetails(selectedDate.getDate()).todos.map((todo) => (
                    <div key={todo._id} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => {
                            todoAPI.update(todo._id, { completed: !todo.completed })
                              .then(() => loadData());
                          }}
                          className="w-4 h-4 text-orange-600 rounded"
                        />
                        <div className="flex-1">
                          <p className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                            {todo.text}
                          </p>
                          <div className="flex items-center space-x-3 mt-1 text-xs">
                            <span className="text-orange-600">{todo.category}</span>
                            <span className={`px-2 py-0.5 rounded-full ${
                              todo.priority === 'High' ? 'bg-red-100 text-red-700' :
                              todo.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {todo.priority}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => {
                              setEditingTodo(todo);
                              setShowTodoForm(true);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 rounded"
                          >
                            <EditIcon className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteTodo(todo._id)}
                            className="p-1 text-gray-400 hover:text-red-600 rounded"
                          >
                            <Trash2Icon className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Date Words */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                  <HeartIcon className="h-5 w-5 text-red-600" />
                  <span>My Words</span>
                </h4>
                <button
                  onClick={() => {
                    setEditingWord(null);
                    setShowWordForm(true);
                  }}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
              
              {getDateDetails(selectedDate.getDate()).words.length === 0 ? (
                <p className="text-gray-500 text-center py-3">No words for this date</p>
              ) : (
                <div className="space-y-2">
                  {getDateDetails(selectedDate.getDate()).words.map((word) => (
                    <div key={word._id} className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-red-700">{word.word}</h5>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => {
                              setEditingWord(word);
                              setShowWordForm(true);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-600 rounded"
                          >
                            <EditIcon className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDeleteWord(word._id)}
                            className="p-1 text-gray-400 hover:text-red-600 rounded"
                          >
                            <Trash2Icon className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 italic">"{word.commitment}"</p>
                      <div className="flex items-center justify-between mt-2 text-xs">
                        <span className="text-gray-500">{word.timeframe}</span>
                        <div className="flex items-center space-x-1">
                          <input
                            type="checkbox"
                            checked={word.completed}
                            onChange={() => {
                              wordAPI.update(word._id, { 
                                completed: !word.completed,
                                completedAt: !word.completed ? new Date().toISOString() : null
                              }).then(() => loadData());
                            }}
                            className="w-3 h-3 text-red-600 rounded"
                          />
                          <span className="text-gray-500">Completed</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Monthly Visions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <EyeIcon className="h-6 w-6 text-purple-600" />
            <span>Monthly Visions</span>
          </h3>
          <button
            onClick={() => {
              setEditingVision(null);
              setShowVisionForm(true);
            }}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Add Vision</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visions.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <EyeIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-800 mb-2">No visions created yet</h4>
              <p className="text-gray-500 mb-4">Create your first vision to start planning your month</p>
              <button
                onClick={() => {
                  setEditingVision(null);
                  setShowVisionForm(true);
                }}
                className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add Your First Vision</span>
              </button>
            </div>
          ) : (
            visions.map((vision) => (
              <div key={vision._id} className="bg-white rounded-xl shadow-md border border-purple-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
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
                        <EditIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteVision(vision._id)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded"
                      >
                        <Trash2Icon className="h-4 w-4" />
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
                        className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                        style={{ width: `${vision.progress || 0}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Vision Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="h-3 w-3" />
                      <span>{vision.startDate ? formatDate(vision.startDate) : 'No start'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="h-3 w-3" />
                      <span>{vision.endDate ? formatDate(vision.endDate) : 'No end'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TargetIcon className="h-3 w-3" />
                      <span>{goals.filter(g => g.visionTitle === vision.category).length} goals</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckSquareIcon className="h-3 w-3" />
                      <span>{tasks.filter(t => t.category === vision.category).length} tasks</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingGoal({
                          visionTitle: vision.category
                        });
                        setShowGoalForm(true);
                      }}
                      className="flex-1 text-center py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                    >
                      Add Goal
                    </button>
                    <button
                      onClick={() => {
                        setEditingTask({
                          category: vision.category
                        });
                        setShowTaskForm(true);
                      }}
                      className="flex-1 text-center py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                    >
                      Add Task
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button 
          onClick={() => {
            setEditingVision(null);
            setShowVisionForm(true);
          }}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group"
        >
          <EyeIcon className="h-5 w-5 group-hover:animate-pulse" />
          <span className="font-medium">Add Vision</span>
        </button>
        
        <button 
          onClick={() => {
            setEditingGoal(null);
            setShowGoalForm(true);
          }}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group"
        >
          <TargetIcon className="h-5 w-5 group-hover:animate-pulse" />
          <span className="font-medium">Add Goal</span>
        </button>
        
        <button 
          onClick={() => {
            setEditingTask(null);
            setShowTaskForm(true);
          }}
          className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group"
        >
          <CheckSquareIcon className="h-5 w-5 group-hover:animate-pulse" />
          <span className="font-medium">Add Task</span>
        </button>
        
        <button 
          onClick={() => {
            setEditingTodo(null);
            setShowTodoForm(true);
          }}
          className="flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-3 rounded-xl hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group"
        >
          <CheckSquareIcon className="h-5 w-5 group-hover:animate-pulse" />
          <span className="font-medium">Add Todo</span>
        </button>
        
        <button 
          onClick={() => {
            setEditingWord(null);
            setShowWordForm(true);
          }}
          className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-3 rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group"
        >
          <HeartIcon className="h-5 w-5 group-hover:animate-pulse" />
          <span className="font-medium">Add Word</span>
        </button>
        
        <button 
          className="flex items-center space-x-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-3 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group ml-auto"
        >
          <DownloadIcon className="h-5 w-5 group-hover:animate-pulse" />
          <span className="font-medium">Download</span>
        </button>
        
        <button 
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group"
        >
          <PrinterIcon className="h-5 w-5 group-hover:animate-pulse" />
          <span className="font-medium">Print</span>
        </button>
      </div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-purple-600 mb-1">{visions.length}</div>
          <div className="text-gray-600 text-sm">Active Visions</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {goals.filter(g => {
              const goalMonth = g.startDate ? new Date(g.startDate).getMonth() : null;
              const goalYear = g.startDate ? new Date(g.startDate).getFullYear() : null;
              return goalMonth === selectedMonth && goalYear === selectedYear;
            }).length}
          </div>
          <div className="text-gray-600 text-sm">Monthly Goals</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {tasks.filter(t => {
              const taskMonth = t.date ? new Date(t.date).getMonth() : null;
              const taskYear = t.date ? new Date(t.date).getFullYear() : null;
              return taskMonth === selectedMonth && taskYear === selectedYear;
            }).length}
          </div>
          <div className="text-gray-600 text-sm">Monthly Tasks</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {todos.filter(t => {
              const todoMonth = t.dueDate ? new Date(t.dueDate).getMonth() : null;
              const todoYear = t.dueDate ? new Date(t.dueDate).getFullYear() : null;
              return todoMonth === selectedMonth && todoYear === selectedYear;
            }).length}
          </div>
          <div className="text-gray-600 text-sm">Monthly To-Do's</div>
        </div>
      </div>

      {/* Modals */}
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
      
      {showTaskForm && (
        <TaskForm
          onSubmit={editingTask ? handleUpdateTask : handleAddTask}
          onCancel={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
          initialData={editingTask}
        />
      )}
      
      {showTodoForm && (
        <TodoForm
          onSubmit={editingTodo ? handleUpdateTodo : handleAddTodo}
          onCancel={() => {
            setShowTodoForm(false);
            setEditingTodo(null);
          }}
          initialData={editingTodo}
        />
      )}
      
      {showWordForm && (
        <WordForm
          onSubmit={editingWord ? handleUpdateWord : handleAddWord}
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

export default MonthlyPlanner;