import React, { useState } from 'react';
import { useEffect } from 'react';
import { 
  Plus, 
  Target, 
  Edit, 
  Trash2, 
  Calendar, 
  Clock, 
  DollarSign,
  Filter,
  Search,
  CheckSquare,
  Eye
} from 'lucide-react';
import GoalForm from './GoalForm';
import { goalAPI } from '../../services/api';

const MyGoals: React.FC = () => {
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    setLoading(true);
    try {
      const response = await goalAPI.getAll();
      setGoals(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error loading goals:', error);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGoals = goals.filter(goal => {
    const matchesFilter = filter === 'all' || 
      (filter === 'completed' && goal.completed) ||
      (filter === 'in-progress' && goal.status === 'In Progress') ||
      (filter === 'not-started' && goal.status === 'Not Started') ||
      (filter === 'high' && goal.priority === 'High') ||
      (filter === goal.visionTitle?.toLowerCase());
    
    const matchesSearch = goal.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.visionTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleAddGoal = async (goalData: any) => {
    try {
      await goalAPI.create(goalData);
      setShowAddModal(false);
      setEditingGoal(null);
      loadGoals();
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const handleUpdateGoal = async (goalData: any) => {
    try {
      await goalAPI.update(editingGoal._id, goalData);
      setShowAddModal(false);
      setEditingGoal(null);
      loadGoals();
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      try {
        await goalAPI.delete(id);
        loadGoals();
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  const handleEditGoal = (goal: any) => {
    setEditingGoal(goal);
    setShowAddModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Not Started': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const visionCategories = ['Health', 'Wealth', 'Success', 'Respect', 'Pleasure', 'Prosperity', 'Luxurious', 'Habit', 'Spirituality', 'About Life'];

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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white shadow-xl">
          <h1 className="text-3xl font-bold mb-2">My Goals</h1>
          <p className="text-blue-100">Track and manage your goals across all life areas</p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="h-5 w-5" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Goal Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600 mb-1">{goals.length}</div>
          <div className="text-gray-600 text-sm">Total Goals</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {goals.filter(g => g.status === 'Completed').length}
          </div>
          <div className="text-gray-600 text-sm">Completed</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600 mb-1">
            {goals.filter(g => g.status === 'In Progress').length}
          </div>
          <div className="text-gray-600 text-sm">In Progress</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-red-600 mb-1">
            {goals.filter(g => g.priority === 'High').length}
          </div>
          <div className="text-gray-600 text-sm">High Priority</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Goals' },
                { id: 'completed', label: 'Completed' },
                { id: 'in-progress', label: 'In Progress' },
                { id: 'not-started', label: 'Not Started' },
                { id: 'high', label: 'High Priority' },
                ...visionCategories.map(cat => ({ id: cat.toLowerCase(), label: cat }))
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterOption.id
                      ? 'bg-blue-600 text-white'
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
              placeholder="Search goals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGoals.length > 0 ? (
          filteredGoals.map(goal => (
            <div key={goal._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
              {/* Goal Image */}
              {goal.imageUrl && (
                <div className="h-40 overflow-hidden">
                  <img
                    src={goal.imageUrl}
                    alt={goal.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Goal+Image';
                    }}
                  />
                </div>
              )}

              {/* Goal Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-800">{goal.name}</h3>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEditGoal(goal)}
                      className="p-1 text-gray-400 hover:text-blue-600 rounded"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal._id)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      className="p-1 text-gray-400 hover:text-purple-600 rounded"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{goal.description}</p>

                {/* Goal Details */}
                <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{goal.startDate ? new Date(goal.startDate).toLocaleDateString() : 'No start date'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{goal.endDate ? new Date(goal.endDate).toLocaleDateString() : 'No end date'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{goal.startTime || 'No start time'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{goal.endTime || 'No end time'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-3 w-3" />
                    <span>{goal.budget ? `₹${goal.budget}` : 'No budget'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="h-3 w-3" />
                    <span>{goal.visionTitle || 'No vision'}</span>
                  </div>
                </div>

                {/* Status and Priority */}
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                    {goal.status || 'Not Started'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                    {goal.priority || 'Medium'}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-700">Progress</span>
                    <span className="text-xs font-semibold text-gray-800">{goal.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-600 transition-all duration-300"
                      style={{ width: `${goal.progress || 0}%` }}
                    />
                  </div>
                </div>

                {/* Tasks and Todos */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-1">
                    <CheckSquare className="h-4 w-4 text-green-600" />
                    <span className="text-xs text-gray-600">{goal.tasks?.length || 0} tasks</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckSquare className="h-4 w-4 text-orange-600" />
                    <span className="text-xs text-gray-600">{goal.todos?.length || 0} todos</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No goals found</h3>
            <p className="text-gray-600 mb-4">Add your first goal to get started.</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Your First Goal</span>
            </button>
          </div>
        )}
      </div>

      {/* Goal Form Modal */}
      {showAddModal && (
        <GoalForm
          onSubmit={editingGoal ? handleUpdateGoal : handleAddGoal}
          onCancel={() => {
            setShowAddModal(false);
            setEditingGoal(null);
          }}
          initialData={editingGoal}
        />
      )}
    </div>
  );
};

export default MyGoals;