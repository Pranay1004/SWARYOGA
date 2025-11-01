import React, { useState, useEffect } from 'react';
import { 
  Target, 
  CheckSquare, 
  Heart,
  User,
  Eye,
  Edit,
  Trash2, 
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  Activity,
  Droplets,
  Moon,
  Dumbbell,
  Award,
  Zap,
  FileText,
  Save,
  X
} from 'lucide-react';
import * as Icons from 'lucide-react';
import VisionForm from './VisionForm';
import GoalForm from './GoalForm';
import TaskCreationModal from './TaskCreationModal';
import TodoForm from './TodoForm';
import WordForm from './WordForm';
import DailyRoutineForm from './DailyRoutineForm';

import { visionAPI, goalAPI, taskAPI, todoAPI, wordAPI } from '../../services/api';

type HealthMetric = 'water' | 'sleep' | 'exercise' | 'meditation' | 'steps' | 'calories';

interface HealthProfile {
  height: string;
  weight: string;
  age: string;
  bmi?: number;
  bmiCategory?: string;
  bmr?: number;
  idealWeight?: string;
}

const DailyPlanner: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showVisionForm, setShowVisionForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showTodoForm, setShowTodoForm] = useState(false);
  const [showWordForm, setShowWordForm] = useState(false);
  const [showRoutineForm, setShowRoutineForm] = useState(false);
  const [aboutMyToday, setAboutMyToday] = useState('');
  const [isEditingAboutMyToday, setIsEditingAboutMyToday] = useState(false);
  const [savedAboutMyToday, setSavedAboutMyToday] = useState('');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Health profile state
  const [healthProfile, setHealthProfile] = useState<HealthProfile>({
    height: '',
    weight: '',
    age: '',
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Data states
  const [visions, setVisions] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [todos, setTodos] = useState<any[]>([]);
  const [words, setWords] = useState<any[]>([]);

  // Health tracker state
  const [healthData, setHealthData] = useState({
    water: { target: 8, current: 0, unit: 'glasses' },
    sleep: { target: 8, current: 0, unit: 'hours' },
    exercise: { target: 60, current: 0, unit: 'minutes' },
    meditation: { target: 20, current: 0, unit: 'minutes' },
    steps: { target: 10000, current: 0, unit: 'steps' },
    calories: { target: 2000, current: 0, unit: 'kcal' }
  });
  
  // Load saved about my today text from localStorage
  useEffect(() => {
    const savedText = localStorage.getItem(`aboutMyToday_${selectedDate.toISOString().split('T')[0]}`);
    if (savedText) {
      setSavedAboutMyToday(savedText);
    } else {
      setSavedAboutMyToday('');
    }
  }, [selectedDate]);

  // Daily routine state
  const [dailyRoutine, setDailyRoutine] = useState([
    { id: 1, time: '06:00', activity: 'Wake Up & Morning Routine', icon: 'Sun', color: 'bg-yellow-500', completed: false },
    { id: 2, time: '06:30', activity: 'Exercise/Workout', icon: 'Dumbbell', color: 'bg-red-500', completed: false },
    { id: 3, time: '07:30', activity: 'Breakfast', icon: 'Coffee', color: 'bg-orange-500', completed: false },
    { id: 4, time: '08:00', activity: 'Work/Study Time', icon: 'Briefcase', color: 'bg-blue-500', completed: false },
    { id: 5, time: '12:00', activity: 'Lunch Break', icon: 'Utensils', color: 'bg-green-500', completed: false },
    { id: 6, time: '13:00', activity: 'Work/Study Continued', icon: 'Book', color: 'bg-purple-500', completed: false },
    { id: 7, time: '18:00', activity: 'Personal Time', icon: 'Home', color: 'bg-pink-500', completed: false },
    { id: 8, time: '19:00', activity: 'Dinner', icon: 'Utensils', color: 'bg-indigo-500', completed: false },
    { id: 9, time: '20:00', activity: 'Family/Social Time', icon: 'Users', color: 'bg-teal-500', completed: false },
    { id: 10, time: '21:00', activity: 'Relaxation/Reading', icon: 'Book', color: 'bg-cyan-500', completed: false },
    { id: 11, time: '22:00', activity: 'Sleep Preparation', icon: 'Moon', color: 'bg-gray-600', completed: false }
  ]);

  useEffect(() => {
    loadDailyData();
  }, [selectedDate]);

  const loadDailyData = async () => {
    setLoading(true);
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      const [visionsRes, goalsRes, tasksRes, todosRes, wordsRes] = await Promise.all([
        visionAPI.getAll(),
        goalAPI.getAll(), // We'll filter goals client-side based on date
        taskAPI.getByDate(formattedDate),
        todoAPI.getByDate(formattedDate),
        wordAPI.getAll()
      ]);

      // Filter visions that are active on the selected date
      const filteredVisions = Array.isArray(visionsRes) ? visionsRes.filter(vision => {
        if (!vision.startDate && !vision.endDate) return true; // No date restrictions
        
        const startDate = vision.startDate ? new Date(vision.startDate) : null;
        const endDate = vision.endDate ? new Date(vision.endDate) : null;
        
        if (startDate && endDate) {
          return selectedDate >= startDate && selectedDate <= endDate;
        }
        
        if (startDate && !endDate) {
          return selectedDate >= startDate;
        }
        
        if (!startDate && endDate) {
          return selectedDate <= endDate;
        }
        
        return true;
      }) : [];
      
      // Filter goals that are active on the selected date
      const filteredGoals = Array.isArray(goalsRes) ? goalsRes.filter(goal => {
        if (!goal.startDate && !goal.endDate) return true; // No date restrictions
        
        const startDate = goal.startDate ? new Date(goal.startDate) : null;
        const endDate = goal.endDate ? new Date(goal.endDate) : null;
        
        if (startDate && endDate) {
          return selectedDate >= startDate && selectedDate <= endDate;
        }
        
        if (startDate && !endDate) {
          return selectedDate >= startDate;
        }
        
        if (!startDate && endDate) {
          return selectedDate <= endDate;
        }
        
        return true;
      }) : [];
      
      setVisions(filteredVisions);
      setGoals(filteredGoals);
      setTasks(Array.isArray(tasksRes) ? tasksRes : []);
      setTodos(Array.isArray(todosRes) ? todosRes : []);
      
      // Filter words that are active on the selected date
      const filteredWords = Array.isArray(wordsRes) ? wordsRes.filter(word => {
        if (!word.date) return true; // No date restrictions
        
        const wordDate = new Date(word.date);
        wordDate.setHours(0, 0, 0, 0);
        
        const selectedDateCopy = new Date(selectedDate);
        selectedDateCopy.setHours(0, 0, 0, 0);
        
        return wordDate.getTime() === selectedDateCopy.getTime();
      }) : [];
      
      setWords(filteredWords);
    } catch (error) {
      console.error('Error loading daily data:', error);
      setVisions([]);
      setGoals([]);
      setTasks([]);
      setTodos([]);
      setWords([]);
    } finally {
      setLoading(false);
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(newDate);
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  const handleAddVision = async (visionData: any) => {
    try {
      await visionAPI.create(visionData);
      setShowVisionForm(false);
      setEditingItem(null);
      loadDailyData();
    } catch (error) {
      console.error('Error adding vision:', error);
    }
  };

  const handleAddGoal = async (goalData: any) => {
    try {
      await goalAPI.create({
        ...goalData,
        date: selectedDate.toISOString().split('T')[0]
      });
      setShowGoalForm(false);
      setEditingItem(null);
      loadDailyData();
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const handleAddTask = async (taskData: any) => {
    try {
      await taskAPI.create({
        ...taskData,
        date: selectedDate.toISOString().split('T')[0]
      });
      setShowTaskForm(false);
      setEditingItem(null);
      loadDailyData();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleAddTodo = async (todoData: any) => {
    try {
      await todoAPI.create({
        ...todoData,
        dueDate: selectedDate.toISOString().split('T')[0]
      });
      setShowTodoForm(false);
      setEditingItem(null);
      loadDailyData();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleAddWord = async (wordData: any) => {
    try {
      await wordAPI.create({
        ...wordData,
        date: selectedDate.toISOString().split('T')[0]
      });
      setShowWordForm(false);
      setEditingItem(null);
      loadDailyData();
    } catch (error) {
      console.error('Error adding word:', error);
    }
  };

  const handleDelete = async (type: string, id: string) => {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        switch (type) {
          case 'vision':
            await visionAPI.delete(id);
            break;
          case 'goal':
            await goalAPI.delete(id);
            break;
          case 'task':
            await taskAPI.delete(id);
            break;
          case 'todo':
            await todoAPI.delete(id);
            break;
          case 'word':
            await wordAPI.delete(id);
            break;
        }
        loadDailyData();
      } catch (error) {
        console.error(`Error deleting ${type}:`, error);
      }
    }
  };

  const updateHealthData = (type: string, value: number) => {
    setHealthData(prev => ({
      ...prev,
      [type as HealthMetric]: { ...prev[type as HealthMetric], current: value }
    }));
    
    // Save to localStorage
    const savedData = JSON.parse(localStorage.getItem('healthData') || '{}');
    savedData[type] = { ...savedData[type], current: value };
    localStorage.setItem('healthData', JSON.stringify(savedData));
  };

  const toggleRoutineItem = (id: number) => {
    setDailyRoutine(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };
  
  const handleSaveAboutMyToday = () => {
    setSavedAboutMyToday(aboutMyToday);
    localStorage.setItem(`aboutMyToday_${selectedDate.toISOString().split('T')[0]}`, aboutMyToday);
    setIsEditingAboutMyToday(false);
  };
  
  const handleEditAboutMyToday = () => {
    setAboutMyToday(savedAboutMyToday);
    setIsEditingAboutMyToday(true);
  };
  
  const handleCancelAboutMyToday = () => {
    setAboutMyToday(savedAboutMyToday);
    setIsEditingAboutMyToday(false);
  };
  
  const handleDeleteAboutMyToday = () => {
    if (confirm('Are you sure you want to delete your notes for today?')) {
      setSavedAboutMyToday('');
      setAboutMyToday('');
      localStorage.removeItem(`aboutMyToday_${selectedDate.toISOString().split('T')[0]}`);
      setIsEditingAboutMyToday(false);
    }
  };

  // Load health data from localStorage
  useEffect(() => {
    const savedHealthData = localStorage.getItem('healthData');
    if (savedHealthData) {
      setHealthData(JSON.parse(savedHealthData));
    }
    
    const savedProfile = localStorage.getItem('healthProfile');
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setHealthProfile(profile);
      
      // If we have a saved profile, calculate health metrics
      if (profile.height && profile.weight && profile.age) {
        calculateHealthMetrics(profile);
      }
    }
  }, []);

  // Calculate BMI, BMR, and ideal weight
  const calculateHealthMetrics = (profile: HealthProfile) => {
    const height = parseFloat(profile.height);
    const weight = parseFloat(profile.weight);
    const age = parseInt(profile.age);
    
    if (isNaN(height) || isNaN(weight) || isNaN(age)) {
      return profile;
    }
    
    // Calculate BMI (weight in kg / height in m^2)
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    // Determine BMI category
    let bmiCategory = '';
    if (bmi < 18.5) bmiCategory = 'Underweight';
    else if (bmi < 25) bmiCategory = 'Normal weight';
    else if (bmi < 30) bmiCategory = 'Overweight';
    else bmiCategory = 'Obese';
    
    // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
    // For men: BMR = 10W + 6.25H - 5A + 5
    // For women: BMR = 10W + 6.25H - 5A - 161
    // We'll use the male formula for simplicity
    const bmr = Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    
    // Calculate ideal weight range (BMI between 18.5 and 24.9)
    const minIdealWeight = Math.round(18.5 * heightInMeters * heightInMeters);
    const maxIdealWeight = Math.round(24.9 * heightInMeters * heightInMeters);
    const idealWeight = `${minIdealWeight}-${maxIdealWeight} kg`;
    
    const updatedProfile = {
      ...profile,
      bmi: Math.round(bmi * 10) / 10,
      bmiCategory,
      bmr,
      idealWeight
    };
    
    setHealthProfile(updatedProfile);
    localStorage.setItem('healthProfile', JSON.stringify(updatedProfile));
    
    return updatedProfile;
  };

  const handleHealthProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateHealthMetrics(healthProfile);
    setIsEditingProfile(false);
  };

  const getHealthProgress = (type: HealthMetric) => {
    const data = healthData[type];
    return Math.min((data.current / data.target) * 100, 100);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

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
      {/* Header with Date Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-4 sm:p-6 text-white shadow-xl flex-1">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">Daily Planner</h1>
          <p className="text-blue-100 text-sm sm:text-lg">{formatDate(selectedDate)}</p>
          {isToday && (
            <p className="text-blue-200 text-xs sm:text-sm mt-1">Today</p>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateDate('prev')}
            className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={() => setSelectedDate(new Date())}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
          >
            Today
          </button>
          
          <button
            onClick={() => navigateDate('next')}
            className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Health Tracker */}
      <div className="space-y-6 mb-8">
        {/* Health Profile */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <User className="h-6 w-6 text-blue-600 mr-3" />
              Health Profile
            </h2>
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
          </div>
          
          {isEditingProfile ? (
            <form onSubmit={handleHealthProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (cm) *
                  </label>
                  <input
                    type="number"
                    value={healthProfile.height}
                    onChange={(e) => setHealthProfile(prev => ({ ...prev, height: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="e.g., 175"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    value={healthProfile.weight}
                    onChange={(e) => setHealthProfile(prev => ({ ...prev, weight: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="e.g., 70"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age *
                  </label>
                  <input
                    type="number"
                    value={healthProfile.age}
                    onChange={(e) => setHealthProfile(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    placeholder="e.g., 35"
                    required
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors touch-manipulation"
                >
                  Save Profile
                </button>
              </div>
            </form>
          ) : (
            <div>
              {healthProfile.height && healthProfile.weight && healthProfile.age ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <div className="text-sm text-blue-600 mb-1">Height</div>
                    <div className="text-xl font-bold text-gray-800">{healthProfile.height} cm</div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <div className="text-sm text-green-600 mb-1">Weight</div>
                    <div className="text-xl font-bold text-gray-800">{healthProfile.weight} kg</div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <div className="text-sm text-purple-600 mb-1">Age</div>
                    <div className="text-xl font-bold text-gray-800">{healthProfile.age} years</div>
                  </div>
                  
                  <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                    <div className="text-sm text-yellow-600 mb-1">BMI</div>
                    <div className="text-xl font-bold text-gray-800">{healthProfile.bmi}</div>
                    <div className="text-xs text-gray-500">{healthProfile.bmiCategory}</div>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <div className="text-sm text-red-600 mb-1">BMR</div>
                    <div className="text-xl font-bold text-gray-800">{healthProfile.bmr} kcal</div>
                    <div className="text-xs text-gray-500">Daily calories at rest</div>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                    <div className="text-sm text-indigo-600 mb-1">Ideal Weight</div>
                    <div className="text-xl font-bold text-gray-800">{healthProfile.idealWeight}</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-blue-50 rounded-xl">
                  <User className="h-12 w-12 text-blue-300 mx-auto mb-3" />
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">No Health Profile</h4>
                  <p className="text-gray-500 mb-4">Add your health details to see personalized metrics</p>
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors touch-manipulation"
                  >
                    Add Health Profile
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Health Tracker */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Activity className="h-6 w-6 text-green-600 mr-3" />
              Health Tracker
            </h2>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600">Daily Goals</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(healthData).map(([key, data]) => {
              const progress = getHealthProgress(key as HealthMetric);
              const icons = {
                water: Droplets,
                sleep: Moon,
                exercise: Dumbbell,
                meditation: Heart,
                steps: Activity,
                calories: Zap
              };
              const Icon = icons[key as HealthMetric];
              
              return (
                <div key={key} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="h-6 w-6 text-blue-600" />
                    <span className="text-xs font-medium text-gray-500 capitalize">{key}</span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg font-bold text-gray-800">{data.current}</span>
                      <span className="text-xs text-gray-500">/{data.target}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <button
                      onClick={() => updateHealthData(key as HealthMetric, Math.max(0, data.current - 1))}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 py-1 rounded text-xs font-medium transition-colors touch-manipulation"
                    >
                      -
                    </button>
                    <button
                      onClick={() => updateHealthData(key as HealthMetric, data.current + 1)}
                      className="flex-1 bg-green-100 hover:bg-green-200 text-green-600 py-1 rounded text-xs font-medium transition-colors touch-manipulation"
                    >
                      +
                    </button>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-1 text-center">{data.unit}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* About My Today Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FileText className="h-6 w-6 text-blue-600 mr-3" />
            About My Today
          </h2>
          <div className="flex items-center space-x-2">
            {isEditingAboutMyToday ? (
              <>
                <button
                  onClick={handleSaveAboutMyToday}
                  className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors flex items-center space-x-1"
                >
                  <Save className="h-4 w-4" />
                  <span className="text-sm">Save</span>
                </button>
                <button
                  onClick={handleCancelAboutMyToday}
                  className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleEditAboutMyToday}
                  className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                {savedAboutMyToday && (
                  <button
                    onClick={handleDeleteAboutMyToday}
                    className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        
        {isEditingAboutMyToday ? (
          <div className="space-y-4">
            <textarea
              value={aboutMyToday}
              onChange={(e) => setAboutMyToday(e.target.value)}
              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px] text-gray-700"
              placeholder="Write your thoughts, goals, or reflections for today..."
            />
            <div className="text-right text-sm text-gray-500">
              {aboutMyToday.length} characters
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 min-h-[120px]">
            {savedAboutMyToday ? (
              <p className="text-gray-700 whitespace-pre-wrap">{savedAboutMyToday}</p>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No notes for today</p>
                <button 
                  onClick={handleEditAboutMyToday}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Add your thoughts
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Daily Routine */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Clock className="h-6 w-6 text-purple-600 mr-3" />
            Daily Routine
          </h2>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600">
              {dailyRoutine.filter(item => item.completed).length} / {dailyRoutine.length} completed
            </div>
            <button
              onClick={() => setShowRoutineForm(true)}
              className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {dailyRoutine.map((item) => {
            const Icon = (Icons[item.icon as keyof typeof Icons] || Icons.Circle) as React.ElementType;
            return (
              <div 
                key={item.id} 
                className={`flex items-center space-x-4 p-4 rounded-xl border transition-all duration-300 ${
                  item.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className={`p-3 rounded-xl ${item.color} shadow-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold text-gray-800">{item.time}</span>
                    <span className={`${item.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                      {item.activity}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => toggleRoutineItem(item.id)}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    item.completed
                      ? 'bg-green-100 text-green-600 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <CheckSquare className="h-5 w-5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Data Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Eye className="h-5 w-5 text-purple-600 mr-2" />
              My Visions ({visions.length})
            </h2>
            <button 
              onClick={() => setShowVisionForm(true)}
              className="p-2 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {visions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No visions for today</p>
              </div>
            ) : (
              visions.slice(0, 3).map((vision) => (
                <div key={vision._id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{vision.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-1">{vision.description}</p>
                  </div>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => {
                        setEditingItem(vision);
                        setShowVisionForm(true);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 rounded"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    <button 
                      onClick={() => handleDelete('vision', vision._id)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Goals */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Target className="h-5 w-5 text-blue-600 mr-2" />
              Goals ({goals.length})
            </h2>
            <button 
              onClick={() => setShowGoalForm(true)}
              className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {goals.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Target className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No goals for today</p>
              </div>
            ) : (
              goals.slice(0, 3).map((goal) => (
                <div key={goal._id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{goal.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-1">{goal.description}</p>
                  </div>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => {
                        setEditingItem(goal);
                        setShowGoalForm(true);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 rounded"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    <button 
                      onClick={() => handleDelete('goal', goal._id)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <CheckSquare className="h-5 w-5 text-green-600 mr-2" />
              Tasks ({tasks.length})
            </h2>
            <button 
              onClick={() => setShowTaskForm(true)}
              className="p-2 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No tasks for today</p>
              </div>
            ) : (
              tasks.slice(0, 5).map((task) => (
                <div key={task._id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-3 flex-1">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => {
                        try {
                          taskAPI.update(task._id, { 
                            completed: !task.completed,
                            status: !task.completed ? 'Complete' : 'Pending'
                          }).then(() => loadDailyData());
                        } catch (error) {
                          console.error('Error updating task completion:', error);
                        }
                      }}
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                    />
                    <div className="flex-1">
                      <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {task.particulars}
                      </h3>
                      {task.time && (
                        <p className="text-sm text-gray-600">{task.time}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => {
                        setEditingItem(task);
                        setShowTaskForm(true);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 rounded"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    <button 
                      onClick={() => handleDelete('task', task._id)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Todos */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <CheckSquare className="h-5 w-5 text-orange-600 mr-2" />
              To-Do's ({todos.length})
            </h2>
            <button 
              onClick={() => setShowTodoForm(true)}
              className="p-2 bg-orange-100 hover:bg-orange-200 text-orange-600 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-3">
            {todos.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No todos for today</p>
              </div>
            ) : (
              todos.slice(0, 5).map((todo) => (
                <div key={todo._id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center space-x-3 flex-1">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => {
                        try {
                          todoAPI.update(todo._id, { completed: !todo.completed })
                            .then(() => loadDailyData());
                        } catch (error) {
                          console.error('Error updating todo completion:', error);
                        }
                      }}
                      className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <div className="flex-1">
                      <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {todo.text}
                      </h3>
                      <p className="text-sm text-gray-600">{todo.category}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => {
                        setEditingItem(todo);
                        setShowTodoForm(true);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 rounded"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    <button 
                      onClick={() => handleDelete('todo', todo._id)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* My Words Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Heart className="h-5 w-5 text-red-600 mr-2" />
            My Words ({words.length})
          </h2>
          <button 
            onClick={() => setShowWordForm(true)}
            className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <div className="space-y-3">
          {words.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No words for today</p>
            </div>
          ) : (
            words.slice(0, 3).map((word) => (
              <div key={word._id} className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-red-800">{word.word}</h3>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => {
                        setEditingItem(word);
                        setShowWordForm(true);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 rounded"
                    >
                      <Edit className="h-3 w-3" />
                    </button>
                    <button 
                      onClick={() => handleDelete('word', word._id)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-700 italic">"{word.commitment}"</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{word.timeframe}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    word.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {word.completed ? 'Completed' : 'In Progress'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      {showVisionForm && (
        <VisionForm
          onSubmit={editingItem ? 
            (data) => visionAPI.update(editingItem._id, data).then(() => {
              setShowVisionForm(false);
              setEditingItem(null);
              loadDailyData();
            }) : 
            handleAddVision
          }
          onCancel={() => {
            setShowVisionForm(false);
            setEditingItem(null);
          }}
          initialData={editingItem}
        />
      )}

      {showGoalForm && (
        <GoalForm
          onSubmit={editingItem ? 
            (data) => goalAPI.update(editingItem._id, data).then(() => {
              setShowGoalForm(false);
              setEditingItem(null);
              loadDailyData();
            }) : 
            handleAddGoal
          }
          onCancel={() => {
            setShowGoalForm(false);
            setEditingItem(null);
          }}
          initialData={editingItem}
        />
      )}

      {showTaskForm && (
        <TaskCreationModal
          onClose={() => {
            setShowTaskForm(false);
            setEditingItem(null);
          }}
          onSave={editingItem ? 
            (data) => taskAPI.update(editingItem._id, data).then(() => {
              setShowTaskForm(false);
              setEditingItem(null);
              loadDailyData();
            }) : 
            handleAddTask
          }
          initialData={editingItem}
        />
      )}

      {/* Todo Form Modal */}
      {showTodoForm && (
        <TodoForm
          onSubmit={editingItem ? 
            (data) => todoAPI.update(editingItem._id, data).then(() => {
              setShowTodoForm(false);
              setEditingItem(null);
              loadDailyData();
            }) : 
            handleAddTodo
          }
          onCancel={() => {
            setShowTodoForm(false);
            setEditingItem(null);
          }}
          initialData={editingItem}
        />
      )}

      {/* Word Form Modal */}
      {showWordForm && (
        <WordForm
          onSubmit={editingItem ? 
            (data) => wordAPI.update(editingItem?._id, data).then(() => {
              setShowWordForm(false);
              setEditingItem(null);
              loadDailyData();
            }) : 
            handleAddWord
          }
          onCancel={() => {
            setShowWordForm(false);
            setEditingItem(null);
          }}
          initialData={editingItem}
        />
      )}
      
      {/* Daily Routine Form Modal */}
      {showRoutineForm && (
        <DailyRoutineForm
          onSubmit={(routineItems) => {
            setDailyRoutine(routineItems);
            setShowRoutineForm(false);
          }}
          onCancel={() => setShowRoutineForm(false)}
          initialData={dailyRoutine}
        />
      )}
    </div>
  );
};

export default DailyPlanner;