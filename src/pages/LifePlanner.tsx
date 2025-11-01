import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { Menu, Home, X, LayoutDashboard, CalendarDays, Plus, Eye, Target, CheckSquare, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/LifePlanner/Sidebar';
import LifePlannerTabs from '../components/LifePlanner/LifePlannerTabs';
import TopNavigation from '../components/LifePlanner/TopNavigation';
import Dashboard from '../pages/LifePlannerDashboard';
import DailyPlanner from '../components/LifePlanner/DailyPlanner';
import WeeklyPlanner from '../components/LifePlanner/WeeklyPlanner';
import MonthlyPlanner from '../components/LifePlanner/MonthlyPlanner';
import YearlyPlanner from '../components/LifePlanner/YearlyPlanner';
import MyVision from '../components/LifePlanner/MyVision';
import MyGoals from '../components/LifePlanner/MyGoal';
import MyTasks from '../components/LifePlanner/MyTasks';
import MyTodos from '../components/LifePlanner/MyTodos';
import MyWord from '../components/LifePlanner/MyWord';
import MyAffirmations from '../components/LifePlanner/MyAffirmations';
import MyDiamondPeoples from '../components/LifePlanner/MyDiamondPeoples';
import SwarCalendar from '../components/SwarCalendar/Swarcalendar';
import TaskCreationModal from '../components/LifePlanner/TaskCreationModal';

const LifePlanner: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const handleNewTask = () => {
    setShowNewTaskModal(true);
  };

  const handleTaskCreated = (taskData: any) => {
    console.log('New task created:', taskData);
    setShowNewTaskModal(false);
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'daily':
        return <DailyPlanner />;
      case 'weekly':
        return <WeeklyPlanner />;
      case 'monthly':
        return <MonthlyPlanner />;
      case 'yearly':
        return <YearlyPlanner />;
      case 'vision':
        return <MyVision />;
      case 'goals':
        return <MyGoals />;
      case 'tasks':
        return <MyTasks />;
      case 'todos':
        return <MyTodos />;
      case 'word':
        return <MyWord />;
      case 'affirmations':
        return <MyAffirmations />;
      case 'diamond-peoples':
        return <MyDiamondPeoples />;
      case 'swar-calendar':
        return <SwarCalendar />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white shadow-md px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors touch-manipulation"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </button>
          
          <div className="text-center flex-1">
            <h1 className="text-lg font-bold text-green-600">Life Planner</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link
              to="/"
              className="p-2 rounded-full bg-green-100 hover:bg-green-200 transition-colors touch-manipulation"
              aria-label="Go to home"
            >
              <Home className="h-6 w-6 text-green-600" />
            </Link>
            
            <button
              onClick={handleLogout}
              className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors touch-manipulation"
              aria-label="Logout"
            >
              <LogOut className="h-6 w-6 text-red-600" />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <Sidebar 
          activeView={activeView} 
          onViewChange={setActiveView}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0 pt-16 lg:pt-0">
          <TopNavigation 
            activeView={activeView} 
            onViewChange={setActiveView}
            onNewTask={handleNewTask}
          />
          <main className="flex-1 overflow-auto bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
            <LifePlannerTabs activeView={activeView} onViewChange={setActiveView} />
            {renderMainContent()}
          </main>
        </div>
        
        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-30 flex justify-around items-center py-2">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`p-2 rounded-lg ${activeView === 'dashboard' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
          >
            <LayoutDashboard className="h-6 w-6" />
          </button>
          <button
            onClick={() => setActiveView('daily')}
            className={`p-2 rounded-lg ${activeView === 'daily' ? 'bg-green-100 text-green-600' : 'text-gray-600'}`}
          >
            <CalendarDays className="h-6 w-6" />
          </button>
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-lg text-gray-600 relative"
          >
            {showMobileMenu ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Task Creation Modal */}
      {showNewTaskModal && (
        <TaskCreationModal
          onClose={() => setShowNewTaskModal(false)}
          onSave={handleTaskCreated}
        />
      )}
      
      {/* Mobile Menu Popup */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-end justify-center">
          <div className="bg-white rounded-t-2xl w-full max-h-[70vh] overflow-y-auto p-4 animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Quick Actions</h3>
              <button onClick={() => setShowMobileMenu(false)} className="p-2 text-gray-500">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <button onClick={() => { setActiveView('vision'); setShowMobileMenu(false); }}
                className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                <Eye className="h-8 w-8 text-purple-600 mb-2" />
                <span className="text-sm font-medium">My Vision</span>
              </button>
              <button onClick={() => { setActiveView('goals'); setShowMobileMenu(false); }}
                className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                <Target className="h-8 w-8 text-blue-600 mb-2" />
                <span className="text-sm font-medium">My Goals</span>
              </button>
              <button onClick={() => { setActiveView('tasks'); setShowMobileMenu(false); }}
                className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-xl border border-green-200">
                <CheckSquare className="h-8 w-8 text-green-600 mb-2" />
                <span className="text-sm font-medium">My Tasks</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </ThemeProvider>
  );
};

export default LifePlanner;