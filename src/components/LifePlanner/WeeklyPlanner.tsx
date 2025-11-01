import React, { useState } from 'react';
import { useEffect } from 'react';
import { 
  Calendar, 
  Target, 
  CheckSquare,
  Check,
  Heart, 
  Eye,
  Edit,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Download,
  Printer
} from 'lucide-react';
import VisionForm from './VisionForm';
import GoalForm from './GoalForm';
import TaskForm from './TaskForm';
import TodoForm from './TodoForm';
import WordForm from './WordForm';
import { visionAPI, goalAPI, taskAPI, todoAPI, wordAPI } from '../../services/api';

const WeeklyPlanner: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
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

  // Data states
  const [visions, setVisions] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [todos, setTodos] = useState<any[]>([]);
  const [words, setWords] = useState<any[]>([]);

  useEffect(() => {
    loadWeeklyData();
  }, [selectedWeek]);

  const getWeekDates = (date: Date) => {
    const week = [];
    const startDate = new Date(date);
    const day = startDate.getDay();
    const diff = startDate.getDate() - day;
    startDate.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(selectedWeek);
  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];

  const loadWeeklyData = async () => {
    setLoading(true);
    try {
      const startDateStr = weekStart.toISOString();
      const endDateStr = weekEnd.toISOString();
      
      try {
        const [visionsRes, goalsRes, tasksRes, todosRes, wordsRes] = await Promise.all([
          visionAPI.getAll(),
          goalAPI.getByDateRange ? goalAPI.getByDateRange(startDateStr, endDateStr) : goalAPI.getAll(),
          taskAPI.getByDateRange ? taskAPI.getByDateRange(startDateStr, endDateStr) : taskAPI.getAll(),
          todoAPI.getByDateRange ? todoAPI.getByDateRange(startDateStr, endDateStr) : todoAPI.getAll(),
          wordAPI.getByDateRange ? wordAPI.getByDateRange(startDateStr, endDateStr) : wordAPI.getAll()
        ]);

        // Filter visions that are active during the selected week
        const filteredVisions = Array.isArray(visionsRes) ? visionsRes.filter(vision => {
          if (!vision.startDate && !vision.endDate) return true; // No date restrictions
          
          const startDate = vision.startDate ? new Date(vision.startDate) : null;
          const endDate = vision.endDate ? new Date(vision.endDate) : null;
          
          if (startDate && endDate) {
            return startDate <= weekEnd && endDate >= weekStart;
          }
          
          if (startDate && !endDate) {
            return startDate <= weekEnd;
          }
          
          if (!startDate && endDate) {
            return endDate >= weekStart;
          }
          
          return true;
        }) : [];
        
        setVisions(filteredVisions);
        setGoals(Array.isArray(goalsRes) ? goalsRes : []);
        setTasks(Array.isArray(tasksRes) ? tasksRes : []);
        setTodos(Array.isArray(todosRes) ? todosRes : []);
        setWords(Array.isArray(wordsRes) ? wordsRes : []);
      } catch (error) {
        console.error('Error loading weekly data:', error);
        // Set empty arrays as fallback
        setVisions([]);
        setGoals([]);
        setTasks([]);
        setTodos([]);
        setWords([]);
      }
    } catch (error) {
      console.error('Error loading weekly data:', error);
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

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setSelectedWeek(newDate);
    setSelectedDate(null);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddVision = async (visionData: any) => {
    try {
      await visionAPI.create(visionData);
      setShowVisionForm(false);
      setEditingVision(null);
      loadWeeklyData();
    } catch (error) {
      console.error('Error adding vision:', error);
    }
  };

  const handleEditVision = (vision: any) => {
    setEditingVision(vision);
    setShowVisionForm(true);
  };

  const handleUpdateVision = async (visionData: any) => {
    try {
      await visionAPI.update(editingVision._id, visionData);
      setShowVisionForm(false);
      setEditingVision(null);
      loadWeeklyData();
    } catch (error) {
      console.error('Error updating vision:', error);
    }
  };

  const handleDeleteVision = async (id: string) => {
    if (confirm('Are you sure you want to delete this vision?')) {
      try {
        await visionAPI.delete(id);
        loadWeeklyData();
      } catch (error) {
        console.error('Error deleting vision:', error);
      }
    }
  };

  const handleAddGoal = async (goalData: any) => {
    try {
      await goalAPI.create({
        ...goalData,
        weekStart: weekStart.toISOString().split('T')[0],
        weekEnd: weekEnd.toISOString().split('T')[0]
      });
      setShowGoalForm(false);
      setEditingGoal(null);
      loadWeeklyData();
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const handleEditGoal = (goal: any) => {
    setEditingGoal(goal);
    setShowGoalForm(true);
  };

  const handleUpdateGoal = async (goalData: any) => {
    try {
      await goalAPI.update(editingGoal._id, goalData);
      setShowGoalForm(false);
      setEditingGoal(null);
      loadWeeklyData();
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      try {
        await goalAPI.delete(id);
        loadWeeklyData();
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  const handleAddTask = async (taskData: any) => {
    try {
      await taskAPI.create({
        ...taskData,
        date: selectedDate ? selectedDate.toISOString().split('T')[0] : weekStart.toISOString().split('T')[0]
      });
      setShowTaskForm(false);
      setEditingTask(null);
      loadWeeklyData();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleUpdateTask = async (taskData: any) => {
    try {
      await taskAPI.update(editingTask._id, taskData);
      setShowTaskForm(false);
      setEditingTask(null);
      loadWeeklyData();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.delete(id);
        loadWeeklyData();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleAddTodo = async (todoData: any) => {
    try {
      await todoAPI.create({
        ...todoData,
        dueDate: selectedDate ? selectedDate.toISOString().split('T')[0] : weekStart.toISOString().split('T')[0]
      });
      setShowTodoForm(false);
      setEditingTodo(null);
      loadWeeklyData();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleEditTodo = (todo: any) => {
    setEditingTodo(todo);
    setShowTodoForm(true);
  };

  const handleUpdateTodo = async (todoData: any) => {
    try {
      await todoAPI.update(editingTodo._id, todoData);
      setShowTodoForm(false);
      setEditingTodo(null);
      loadWeeklyData();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (confirm('Are you sure you want to delete this todo?')) {
      try {
        await todoAPI.delete(id);
        loadWeeklyData();
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    }
  };

  const handleAddWord = async (wordData: any) => {
    try {
      await wordAPI.create({
        ...wordData,
        date: selectedDate ? selectedDate.toISOString().split('T')[0] : weekStart.toISOString().split('T')[0]
      });
      setShowWordForm(false);
      setEditingWord(null);
      loadWeeklyData();
    } catch (error) {
      console.error('Error adding word:', error);
    }
  };

  const handleEditWord = (word: any) => {
    setEditingWord(word);
    setShowWordForm(true);
  };

  const handleUpdateWord = async (wordData: any) => {
    try {
      await wordAPI.update(editingWord._id, wordData);
      setShowWordForm(false);
      setEditingWord(null);
      loadWeeklyData();
    } catch (error) {
      console.error('Error updating word:', error);
    }
  };

  const handleDeleteWord = async (id: string) => {
    if (confirm('Are you sure you want to delete this word?')) {
      try {
        await wordAPI.delete(id);
        loadWeeklyData();
      } catch (error) {
        console.error('Error deleting word:', error);
      }
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: '2-digit', 
      year: '2-digit' 
    });
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDateDetails = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const details = {
      tasks: tasks.filter(task => {
        const taskDate = task.date ? new Date(task.date).toISOString().split('T')[0] : null;
        return taskDate === dateStr;
      }) || [],
      todos: todos.filter(todo => {
        const todoDate = todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : null;
        return todoDate === dateStr;
      }) || [],
      goals: goals.filter(goal => {
        const startDate = goal.startDate ? new Date(goal.startDate).toISOString().split('T')[0] : null;
        const endDate = goal.endDate ? new Date(goal.endDate).toISOString().split('T')[0] : null;
        const deadline = goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : null;
        
        return startDate === dateStr || endDate === dateStr || deadline === dateStr;
      }) || [],
      words: words.filter(word => {
        const wordDate = word.date ? new Date(word.date).toISOString().split('T')[0] : null;
        return wordDate === dateStr;
      }) || []
    };

    return details;
  };

  const VisionCard = ({ vision }: { vision: any }) => (
    <div className={`bg-white rounded-xl shadow-md border border-gray-200 p-3 sm:p-6 hover:shadow-lg transition-all duration-300`}>
      {/* Vision Header */}
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
          <div className={`p-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg shadow-sm flex-shrink-0`}>
            <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-lg font-bold text-gray-800 truncate">{vision.title || vision.name}</h3>
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{vision.description}</p>
          </div>
        </div>
        <div className="flex space-x-1 flex-shrink-0 ml-2">
          <button 
            onClick={() => handleEditVision(vision)}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 touch-manipulation"
          >
            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          <button 
            onClick={() => handleDeleteVision(vision._id)}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-300 touch-manipulation"
          >
            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>

      {/* Vision Image */}
      {vision.imageUrl && (
        <div className="mb-3 sm:mb-4">
          <img 
            src={vision.imageUrl} 
            alt={vision.title}
            className="w-full h-24 sm:h-32 object-cover rounded-lg shadow-sm"
          />
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-3 sm:mb-4">
        <div className="flex justify-between items-center mb-1 sm:mb-2">
          <span className="text-xs sm:text-sm font-medium text-gray-700">Weekly Progress</span>
          <span className="text-xs sm:text-sm font-bold text-gray-800">{vision.progress || 0}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 shadow-inner">
          <div 
            className={`h-1.5 sm:h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 shadow-sm`}
            style={{ width: `${vision.progress || 0}%` }}
          />
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
    <div className="p-3 sm:p-6 max-w-7xl mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center justify-between mb-4 sm:mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-xl sm:rounded-2xl p-3 sm:p-6 text-white shadow-lg">
          <h1 className="text-xl sm:text-4xl font-bold mb-1 sm:mb-2">Weekly Planner</h1>
          <p className="text-blue-100 text-sm sm:text-lg">
            {weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        
        <div className="flex items-center justify-center space-x-2 sm:space-x-4">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 sm:p-3 text-gray-600 hover:text-gray-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 rounded-lg sm:rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 touch-manipulation"
          >
            <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
          </button>
          
          <button
            onClick={() => setSelectedWeek(new Date())}
            className="px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 font-semibold text-sm sm:text-base touch-manipulation"
          >
            This Week
          </button>
          
          <button
            onClick={() => navigateWeek('next')}
            className="p-2 sm:p-3 text-gray-600 hover:text-gray-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 rounded-lg sm:rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 touch-manipulation"
          >
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
          </button>
        </div>
      </div>

      {/* Weekly Calendar - 7 Days in a Row */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-blue-200 p-3 sm:p-8 mb-4 sm:mb-8 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-3 sm:mb-6">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1.5 sm:p-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
              <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <h3 className="text-base sm:text-2xl font-bold text-gray-800">Weekly Calendar</h3>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 sm:gap-4">
          {weekDates.map((date, index) => {
            const dayName = dayNames[index];
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            
            return (
              <div
                key={index}
                onClick={() => handleDateClick(date)}
                className={`p-1.5 sm:p-4 rounded-lg sm:rounded-2xl text-center transition-all duration-300 transform hover:scale-105 cursor-pointer touch-manipulation ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105'
                    : isToday
                    ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg' 
                    : 'bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 hover:from-blue-100 hover:to-green-100 hover:shadow-md'
                }`}
              >
                <div className={`text-xs font-bold mb-1 ${isSelected || isToday ? 'text-white' : 'text-gray-600'}`}>
                  {dayName.slice(0, 3)}
                </div>
                <div className={`text-lg sm:text-2xl font-bold mb-1 ${isSelected || isToday ? 'text-white' : 'text-gray-800'}`}>
                  {date.getDate()}
                </div>
                <div className={`text-xs ${isSelected || isToday ? 'text-white' : 'text-gray-500'}`}>
                  {date.toLocaleDateString('en-US', { month: 'short' })}
                </div>
                
                {/* Task indicators */}
                <div className="flex justify-center space-x-1 mt-1 sm:mt-3">
                  {getDateDetails(date).tasks.length > 0 && (
                    <div className={`w-1 h-1 sm:w-2 sm:h-2 rounded-full ${isSelected || isToday ? 'bg-white' : 'bg-blue-500'}`}></div>
                  )}
                  {getDateDetails(date).todos.length > 0 && (
                    <div className={`w-1 h-1 sm:w-2 sm:h-2 rounded-full ${isSelected || isToday ? 'bg-blue-200' : 'bg-green-500'}`}></div>
                  )}
                  {getDateDetails(date).goals.length > 0 && (
                    <div className={`w-1 h-1 sm:w-2 sm:h-2 rounded-full ${isSelected || isToday ? 'bg-green-200' : 'bg-cyan-500'}`}></div>
                  )}
                  {getDateDetails(date).words.length > 0 && (
                    <div className={`w-1 h-1 sm:w-2 sm:h-2 rounded-full ${isSelected || isToday ? 'bg-red-200' : 'bg-red-500'}`}></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-purple-200 p-3 sm:p-6 mb-4 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
            Details for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h3>
          
          {(() => {
            const details = getDateDetails(selectedDate);
            const hasDetails = details.tasks.length > 0 || details.todos.length > 0 || details.goals.length > 0;
            
            if (!hasDetails) {
              return (
                <div className="text-center py-4 sm:py-8 text-gray-500">
                  <Calendar className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-4 text-gray-300" />
                  <p className="text-sm sm:text-base">No activities scheduled for this date</p>
                </div>
              );
            }
            
            return (
              <div className="space-y-3 sm:space-y-4">
                {details.goals.length > 0 && (
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-blue-600 mb-2">Goals Due</h4>
                    <div className="space-y-1 sm:space-y-2">
                      {details.goals.map((goal, index) => (
                        <div key={index} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <Target className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-800">{goal.text || goal.title || goal.name}</p>
                            <p className="text-xs text-blue-600">{goal.visionTitle}</p>
                          </div>
                          <div className="flex space-x-1 flex-shrink-0">
                            <button 
                              onClick={() => handleEditGoal(goal)}
                              className="p-1 text-gray-400 hover:text-blue-600 rounded touch-manipulation"
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                            <button 
                              onClick={() => handleDeleteGoal(goal._id)}
                              className="p-1 text-gray-400 hover:text-red-600 rounded touch-manipulation"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {details.tasks.length > 0 && (
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-green-600 mb-2">Tasks</h4>
                    <div className="space-y-1 sm:space-y-2">
                      {details.tasks.map((task, index) => (
                        <div key={index} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200">
                          <CheckSquare className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-800">{task.text || task.particulars || task.name}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <span>{task.visionTitle}</span>
                              {task.time && (
                                <span className="flex items-center space-x-1">
                                  <Clock className="h-2.5 w-2.5" />
                                  <span>{formatTime(task.time)}</span>
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-1 flex-shrink-0">
                            <button 
                              onClick={() => handleEditTask(task)}
                              className="p-1 text-gray-400 hover:text-blue-600 rounded touch-manipulation"
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                            <button 
                              onClick={() => handleDeleteTask(task._id)}
                              className="p-1 text-gray-400 hover:text-red-600 rounded touch-manipulation"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {details.todos.length > 0 && (
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-purple-600 mb-2">To-Do's Due</h4>
                    <div className="space-y-1 sm:space-y-2">
                      {details.todos.map((todo, index) => (
                        <div key={index} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <CheckSquare className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-800">{todo.text}</p>
                            <p className="text-xs text-purple-600">{todo.visionTitle}</p>
                          </div>
                          <div className="flex space-x-1 flex-shrink-0">
                            <button 
                              onClick={() => handleEditTodo(todo)}
                              className="p-1 text-gray-400 hover:text-blue-600 rounded touch-manipulation"
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                            <button 
                              onClick={() => handleDeleteTodo(todo._id)}
                              className="p-1 text-gray-400 hover:text-red-600 rounded touch-manipulation"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {details.words.length > 0 && (
                  <div>
                    <h4 className="text-sm sm:text-base font-semibold text-red-600 mb-2">My Words</h4>
                    <div className="space-y-1 sm:space-y-2">
                      {details.words.map((word, index) => (
                        <div key={index} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-red-50 rounded-lg border border-red-200">
                          <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-800">{word.word}</p>
                            <p className="text-xs text-red-600 italic">"{word.commitment}"</p>
                          </div>
                          <div className="flex space-x-1 flex-shrink-0">
                            <button 
                              onClick={() => handleEditWord(word)}
                              className="p-1 text-gray-400 hover:text-blue-600 rounded touch-manipulation"
                            >
                              <Edit className="h-3 w-3" />
                            </button>
                            <button 
                              onClick={() => handleDeleteWord(word._id)}
                              className="p-1 text-gray-400 hover:text-red-600 rounded touch-manipulation"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Add New Vision Button */}
      <div className="mb-4 sm:mb-8 flex flex-wrap gap-3">
        <div>
          <button
            onClick={() => setShowVisionForm(true)}
            className="flex items-center justify-center space-x-2 sm:space-x-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 touch-manipulation relative group"
            title="Add Vision"
          >
            <Eye className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-pulse" />
            <span className="font-semibold text-sm sm:text-base">Add Vision</span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </button>
        </div>
        
        <div>
          <button 
            onClick={() => setShowGoalForm(true)}
            className="flex items-center justify-center space-x-2 sm:space-x-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 touch-manipulation relative group"
            title="Add Goal"
          >
            <Target className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-pulse" />
            <span className="font-semibold text-sm sm:text-base">Add Goal</span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </button>
        </div>
        
        <div>
          <button 
            onClick={() => setShowTaskForm(true)}
            className="flex items-center justify-center space-x-2 sm:space-x-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 touch-manipulation relative group"
            title="Add Task"
          >
            <CheckSquare className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-pulse" />
            <span className="font-semibold text-sm sm:text-base">Add Task</span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </button>
        </div>
        
        <div>
          <button 
            onClick={() => setShowTodoForm(true)}
            className="flex items-center justify-center space-x-2 sm:space-x-3 bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 touch-manipulation relative group"
            title="Add Todo"
          >
            <CheckSquare className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-pulse" />
            <span className="font-semibold text-sm sm:text-base">Add Todo</span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </button>
        </div>
        
        <div>
          <button 
            onClick={() => setShowWordForm(true)}
            className="flex items-center justify-center space-x-2 sm:space-x-3 bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:from-red-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 touch-manipulation relative group"
            title="Add Word"
          >
            <Heart className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-pulse" />
            <span className="font-semibold text-sm sm:text-base">Add Word</span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </button>
        </div>
        
        <div>
          <button 
            className="flex items-center justify-center space-x-2 sm:space-x-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 touch-manipulation relative group"
            title="Download Weekly Plan"
          >
            <Download className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-pulse" />
            <span className="font-semibold text-sm sm:text-base">Download</span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </button>
        </div>
        
        <div>
          <button 
            className="flex items-center justify-center space-x-2 sm:space-x-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 touch-manipulation relative group"
            title="Print Weekly Plan"
          >
            <Printer className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-pulse" />
            <span className="font-semibold text-sm sm:text-base">Print</span>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </button>
        </div>
      </div>

      {/* My Visions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-8">
        {visions.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-gray-500">
            <div className="flex flex-col items-center">
              <Eye className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">No visions created yet</p>
              <p className="text-gray-500 mb-4">Create your first vision to start planning your week</p>
              <button 
                onClick={() => setShowVisionForm(true)}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                <Plus className="h-4 w-4" />
                <span>Add Your First Vision</span>
              </button>
            </div>
          </div>
        ) : (
          visions.map(vision => (
            <div key={vision._id} className="bg-white rounded-xl shadow-md border border-gray-200 p-3 sm:p-6 hover:shadow-lg transition-all duration-300">
              {/* Vision Header */}
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg shadow-sm flex-shrink-0">
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-lg font-bold text-gray-800 truncate">{vision.title || vision.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{vision.description}</p>
                  </div>
                </div>
                <div className="flex space-x-1 flex-shrink-0 ml-2">
                  <button 
                    onClick={() => handleEditVision(vision)}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 touch-manipulation"
                    title="Edit Vision"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteVision(vision._id)}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-300 touch-manipulation"
                    title="Delete Vision"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  <button 
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-all duration-300 touch-manipulation"
                    title="Preview Vision"
                  >
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>

              {/* Vision Image */}
              {vision.imageUrl && (
                <div className="mb-3 sm:mb-4">
                  <img 
                    src={vision.imageUrl} 
                    alt={vision.title}
                    className="w-full h-24 sm:h-32 object-cover rounded-lg shadow-sm"
                  />
                </div>
              )}

              {/* Progress Bar */}
              <div className="mb-3 sm:mb-4">
                <div className="flex justify-between items-center mb-1 sm:mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">Weekly Progress</span>
                  <span className="text-xs sm:text-sm font-bold text-gray-800">{vision.progress || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 shadow-inner">
                  <div 
                    className="h-1.5 sm:h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 shadow-sm"
                    style={{ width: `${vision.progress || 0}%` }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
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
          onSubmit={editingTask ? handleUpdateTask : handleAddTask}
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
          onSubmit={editingTodo ? handleUpdateTodo : handleAddTodo}
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

export default WeeklyPlanner;