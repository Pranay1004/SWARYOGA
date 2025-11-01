import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Plus,
  Home,
  Bell, 
  Settings,
  Calendar,
  CalendarDays,
  CalendarRange,
  CalendarCheck,
  Sun,
  Moon,
  LayoutDashboard,
  LogOut,
  Eye
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import PDFDownloadButton from './PDFDownloadButton';
import PDFPreviewModal from './PDFPreviewModal';

interface TopNavigationProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onNewTask: () => void;
}

const TopNavigation: React.FC<TopNavigationProps> = ({ activeView, onViewChange, onNewTask }) => {
  const { setTheme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const [showPDFPreview, setShowPDFPreview] = useState(false);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  // Sample visions data for PDF generation
  const sampleVisions = [
    {
      id: 1,
      title: 'Health & Wellness',
      description: 'Achieve optimal physical and mental health through consistent habits',
      image: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=400',
      progress: 75,
      color: 'from-red-400 to-red-600',
      goals: [
        { id: 1, text: 'Complete 30-day fitness challenge', completed: true, priority: 'High' },
        { id: 2, text: 'Maintain healthy diet', completed: false, priority: 'Medium' },
        { id: 3, text: 'Get 8 hours sleep daily', completed: false, priority: 'High' }
      ],
      tasks: [
        { id: 1, text: 'Morning workout routine', completed: true, priority: 'High', date: '2024-01-15', time: '06:30' },
        { id: 2, text: 'Meal prep on Sundays', completed: false, priority: 'Medium', date: '2024-01-21', time: '10:00' },
        { id: 3, text: 'Track daily water intake', completed: true, priority: 'Low', date: '2024-01-15', time: '09:00' }
      ],
      todos: [
        { id: 1, text: 'Buy new workout gear', completed: false, dueDate: '2024-01-25', priority: 'Medium' },
        { id: 2, text: 'Schedule health checkup', completed: true, dueDate: '2024-01-20', priority: 'High' },
        { id: 3, text: 'Research healthy recipes', completed: false, dueDate: '2024-01-28', priority: 'Low' }
      ],
      word: 'Discipline: I commit to maintaining consistent healthy habits this month'
    },
    {
      id: 2,
      title: 'Financial Growth',
      description: 'Build wealth and improve financial stability',
      image: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=400',
      progress: 60,
      color: 'from-green-400 to-green-600',
      goals: [
        { id: 1, text: 'Save $2,000 this month', completed: false, priority: 'High' },
        { id: 2, text: 'Review investment portfolio', completed: true, priority: 'Medium' },
        { id: 3, text: 'Create monthly budget', completed: false, priority: 'High' }
      ],
      tasks: [
        { id: 1, text: 'Track daily expenses', completed: true, priority: 'High', date: '2024-01-15', time: '20:00' },
        { id: 2, text: 'Research new investments', completed: false, priority: 'Medium', date: '2024-01-22', time: '15:00' },
        { id: 3, text: 'Pay monthly bills', completed: true, priority: 'High', date: '2024-01-05', time: '10:00' }
      ],
      todos: [
        { id: 1, text: 'Open high-yield savings account', completed: true, dueDate: '2024-01-10', priority: 'High' },
        { id: 2, text: 'Meet with financial advisor', completed: false, dueDate: '2024-01-25', priority: 'Medium' },
        { id: 3, text: 'Review insurance policies', completed: false, dueDate: '2024-01-30', priority: 'Low' }
      ],
      word: 'Abundance: I attract financial opportunities and make wise money decisions'
    },
    {
      id: 3,
      title: 'Career Excellence',
      description: 'Advance professionally and achieve career milestones',
      image: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400',
      progress: 80,
      color: 'from-blue-400 to-blue-600',
      goals: [
        { id: 1, text: 'Complete project deliverables', completed: false, priority: 'High' },
        { id: 2, text: 'Attend 2 networking events', completed: true, priority: 'Medium' },
        { id: 3, text: 'Learn new skill', completed: false, priority: 'Medium' }
      ],
      tasks: [
        { id: 1, text: 'Daily team standup', completed: true, priority: 'High', date: '2024-01-15', time: '09:30' },
        { id: 2, text: 'Complete online course', completed: false, priority: 'Medium', date: '2024-01-25', time: '20:00' },
        { id: 3, text: 'Update LinkedIn profile', completed: true, priority: 'Low', date: '2024-01-10', time: '12:00' }
      ],
      todos: [
        { id: 1, text: 'Prepare monthly report', completed: false, dueDate: '2024-01-31', priority: 'High' },
        { id: 2, text: 'Schedule 1-on-1 with manager', completed: true, dueDate: '2024-01-15', priority: 'Medium' },
        { id: 3, text: 'Join professional association', completed: false, dueDate: '2024-01-28', priority: 'Low' }
      ],
      word: 'Excellence: I strive for excellence in all my professional endeavors'
    }
  ];

  const navigationItems = [
    { icon: LayoutDashboard, label: 'Dashboard', key: 'dashboard', gradient: 'from-blue-500 to-purple-600', bg: 'bg-blue-50' },
    { icon: CalendarDays, label: 'Daily', key: 'daily', gradient: 'from-green-500 to-emerald-600', bg: 'bg-green-50' },
    { icon: CalendarRange, label: 'Weekly', key: 'weekly', gradient: 'from-orange-500 to-red-600', bg: 'bg-orange-50' },
    { icon: CalendarCheck, label: 'Monthly', key: 'monthly', gradient: 'from-purple-500 to-pink-600', bg: 'bg-purple-50' },
    { icon: Calendar, label: 'Yearly', key: 'yearly', gradient: 'from-indigo-500 to-blue-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 sticky top-0 z-10 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Left Section - Navigation */}
        <div className="flex items-center space-x-2 sm:space-x-6">
          <div className="hidden lg:flex items-center space-x-4">
            {/* Go to Home Button */}
            <Link 
              to="/"
              className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 touch-manipulation group"
              aria-label="Go to Home"
            >
              <Home className="h-5 w-5 group-hover:animate-pulse" />
              <span className="font-medium">Home</span>
            </Link>

            <button
              onClick={logout}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 touch-manipulation group"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5 group-hover:animate-pulse" />
              <span className="font-medium">Logout</span>
            </button>
          </div>

          <div className="relative hidden sm:block">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="pl-8 sm:pl-12 pr-4 sm:pr-6 py-2 sm:py-3 w-48 sm:w-80 text-xs sm:text-sm bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 shadow-inner transition-all duration-300 hover:shadow-md"
            />
          </div>

          {/* Header Navigation */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            {navigationItems.map((item) => (
              <button
                key={item.key} 
                onClick={() => onViewChange(item.key)}
                className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg touch-manipulation ${
                  activeView === item.key
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg scale-105`
                    : `${item.bg} text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-opacity-50`
                }`}
              >
                <item.icon className="h-3 w-3 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:rotate-12" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-1 sm:space-x-4 ml-auto">
          {/* PDF Download Button */}
          <PDFDownloadButton
            visions={sampleVisions}
            title="My Life Planner"
            size="md"
            className="hidden md:flex"
          />

          {/* PDF Preview Button */}
          <button
            onClick={() => setShowPDFPreview(true)}
            className="hidden md:flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-semibold text-purple-600 bg-purple-50 rounded-lg md:rounded-xl hover:bg-purple-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 touch-manipulation"
          >
            <Eye className="h-3 w-3 md:h-5 md:w-5" />
            <span className="hidden md:inline">Preview PDF</span>
          </button>

          {/* New Task Button */}
          <button 
            onClick={() => { 
              console.log('New task button clicked');
              onNewTask();
            }}
            className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 touch-manipulation mr-2"
          >
            <Plus className="h-3 w-3 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">New Task</span>
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 sm:p-3 text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-md transform hover:scale-105 touch-manipulation"
          >
            {isDark ? (
              <Sun className="h-4 w-4 sm:h-6 sm:w-6" />
            ) : (
              <Moon className="h-4 w-4 sm:h-6 sm:w-6" />
            )}
          </button>

          {/* Notifications */}
          <button className="relative p-2 sm:p-3 text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-md transform hover:scale-105 touch-manipulation hidden sm:block">
            <Bell className="h-4 w-4 sm:h-6 sm:w-6" />
            <span className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">3</span>
            </span>
          </button>

          {/* Settings */}
          <button className="p-2 sm:p-3 text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-md transform hover:scale-105 touch-manipulation hidden sm:block">
            <Settings className="h-4 w-4 sm:h-6 sm:w-6" />
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs sm:text-sm font-medium text-gray-900">
                {user?.firstName || 'User'} {user?.lastName || ''}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <div className="w-6 h-6 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <span className="text-white text-xs sm:text-sm font-bold">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-1 sm:p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 touch-manipulation"
              title="Sign Out"
            >
              <LogOut className="h-3 w-3 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      <PDFPreviewModal
        isOpen={showPDFPreview}
        onClose={() => setShowPDFPreview(false)}
        visions={sampleVisions}
        title="My Life Planner"
      />
    </div>
  );
};

export default TopNavigation;