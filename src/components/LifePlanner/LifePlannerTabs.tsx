import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  CalendarDays, 
  CalendarRange, 
  CalendarCheck 
} from 'lucide-react';

interface LifePlannerTabsProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const LifePlannerTabs: React.FC<LifePlannerTabsProps> = ({ activeView, onViewChange }) => {
  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, gradient: 'from-blue-500 to-purple-600', bg: 'bg-blue-50' },
    { key: 'daily', label: 'Daily', icon: CalendarDays, gradient: 'from-green-500 to-emerald-600', bg: 'bg-green-50' },
    { key: 'weekly', label: 'Weekly', icon: CalendarRange, gradient: 'from-orange-500 to-red-600', bg: 'bg-orange-50' },
    { key: 'monthly', label: 'Monthly', icon: CalendarCheck, gradient: 'from-purple-500 to-pink-600', bg: 'bg-purple-50' },
    { key: 'yearly', label: 'Yearly', icon: Calendar, gradient: 'from-indigo-500 to-blue-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-4 sm:mb-6 overflow-x-auto py-2 px-1 -mx-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.key}
            onClick={() => onViewChange(tab.key)}
            className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 whitespace-nowrap flex-shrink-0 ${
              activeView === tab.key
                ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg scale-105`
                : `${tab.bg} text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-opacity-50`
            }`}
          >
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default LifePlannerTabs;