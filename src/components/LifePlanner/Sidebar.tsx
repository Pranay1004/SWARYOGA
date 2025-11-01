import React from 'react';
import { 
  Calendar,
  Eye,
  Target,
  CheckSquare,
  Heart,
  Sparkles,
  Users,
  CalendarDays,
  X,
  LogOut,
  Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange, isOpen, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarItems = [
    { icon: Eye, label: 'My Vision', key: 'vision', gradient: 'from-purple-500 to-indigo-600', bg: 'bg-purple-50', border: 'border-purple-200' },
    { icon: Target, label: 'My Goals', key: 'goals', gradient: 'from-blue-500 to-cyan-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { icon: CheckSquare, label: 'My Tasks', key: 'tasks', gradient: 'from-green-500 to-emerald-600', bg: 'bg-green-50', border: 'border-green-200' },
    { icon: CheckSquare, label: 'My To-Do\'s', key: 'todos', gradient: 'from-orange-500 to-red-600', bg: 'bg-orange-50', border: 'border-orange-200' },
    { icon: Heart, label: 'My Word', key: 'word', gradient: 'from-red-500 to-pink-600', bg: 'bg-red-50', border: 'border-red-200' },
    { icon: Sparkles, label: 'My Affirmations', key: 'affirmations', gradient: 'from-pink-500 to-rose-600', bg: 'bg-pink-50', border: 'border-pink-200' },
    { icon: Users, label: 'My Diamond Peoples', key: 'diamond-peoples', gradient: 'from-indigo-500 to-purple-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    { icon: CalendarDays, label: 'Swar Calendar', key: 'swar-calendar', gradient: 'from-green-500 to-teal-600', bg: 'bg-green-50', border: 'border-green-200' },
  ];

  const handleItemClick = (key: string) => {
    onViewChange(key);
    onClose(); // Close sidebar on mobile after selection
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-xl transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-white">Life Planner</h1>
            </div>
            
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4 sm:py-6 overflow-y-auto">
          <nav className="space-y-1 sm:space-y-2 px-3 sm:px-4">
            {sidebarItems.map((item, index) => (
              <button 
                key={index}
                onClick={() => handleItemClick(item.key)}
                className={`w-full group flex items-center px-3 sm:px-4 py-3 sm:py-4 text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg touch-manipulation ${
                  activeView === item.key
                    ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg scale-105`
                    : `${item.bg} text-gray-700 hover:${item.bg} hover:text-gray-900 border ${item.border} hover:border-opacity-50`
                }`}
                aria-label={item.label}>
                <div className={`mr-2 sm:mr-3 p-1.5 sm:p-2 rounded-lg transition-all duration-300 ${
                  activeView === item.key 
                    ? 'bg-white bg-opacity-20' 
                    : 'bg-white shadow-sm group-hover:shadow-md'
                }`}>
                  <item.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${
                    activeView === item.key ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'
                  }`} />
                </div>
                <span className="font-semibold text-xs sm:text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="mt-auto p-4 sm:p-6 border-t border-gray-200">
          <div className="flex flex-col space-y-2">
            <Link 
              to="/" 
              className="flex items-center space-x-2 hover:text-green-600 transition-colors group"
            >
              <Home className="h-5 w-5 text-green-500 group-hover:rotate-12 transition-transform duration-300" />
              <span>Back to Home</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors group"
            >
              <LogOut className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;