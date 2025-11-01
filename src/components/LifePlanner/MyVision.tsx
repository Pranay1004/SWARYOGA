import React, { useState } from 'react';
import { useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, Target, Calendar, DollarSign, Clock } from 'lucide-react';
import VisionForm from './VisionForm';
import { visionAPI } from '../../services/api';

const MyVision: React.FC = () => {
  const [visions, setVisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadVisions();
  }, []);

  const loadVisions = async () => {
    setLoading(true);
    try {
      const response = await visionAPI.getAll();
      setVisions(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error loading visions:', error);
      setVisions([]);
    } finally {
      setLoading(false);
    }
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVision, setEditingVision] = useState<any>(null);

  const handleAddVision = async (visionData: any) => {
    try {
      await visionAPI.create(visionData);
      setShowAddModal(false);
      setEditingVision(null);
      loadVisions();
    } catch (error) {
      console.error('Error adding vision:', error);
    }
  };

  const handleUpdateVision = async (visionData: any) => {
    try {
      await visionAPI.update(editingVision._id, visionData);
      setShowAddModal(false);
      setEditingVision(null);
      loadVisions();
    } catch (error) {
      console.error('Error updating vision:', error);
    }
  };

  const handleDeleteVision = async (id: string) => {
    if (confirm('Are you sure you want to delete this vision?')) {
      try {
        await visionAPI.delete(id);
        loadVisions();
      } catch (error) {
        console.error('Error deleting vision:', error);
      }
    }
  };

  const handleEditVision = (vision: any) => {
    setEditingVision(vision);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingVision(null);
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

  const visionTemplates = [
    { title: 'Health', color: 'bg-red-500', image: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { title: 'Wealth', color: 'bg-green-500', image: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { title: 'Success', color: 'bg-yellow-500', image: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { title: 'Respect', color: 'bg-purple-500', image: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { title: 'Pleasure', color: 'bg-pink-500', image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { title: 'Prosperity', color: 'bg-indigo-500', image: 'https://images.pexels.com/photos/1181772/pexels-photo-1181772.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { title: 'Luxurious', color: 'bg-orange-500', image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { title: 'Habit', color: 'bg-gray-500', image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { title: 'Spirituality', color: 'bg-purple-600', image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { title: 'About Life', color: 'bg-blue-500', image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400' }
  ];

  if (loading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 sm:p-6 text-white shadow-xl">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">My Vision Board</h1>
          <p className="text-purple-100 text-sm sm:text-base">Create and manage your 10 core life visions</p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 sm:px-6 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
        >
          <Plus className="h-5 w-5" />
          <span className="font-semibold">Add Vision</span>
        </button>
      </div>

      {/* Vision Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">{visions.length}</div>
          <div className="text-gray-600 text-xs sm:text-sm">Total Visions</div>
        </div>
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
            {visions.filter(v => v.status === 'Completed').length}
          </div>
          <div className="text-gray-600 text-xs sm:text-sm">Completed</div>
        </div>
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
            {visions.filter(v => v.status === 'In Progress').length}
          </div>
          <div className="text-gray-600 text-xs sm:text-sm">In Progress</div>
        </div>
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 text-center">
          <div className="text-2xl sm:text-3xl font-bold text-indigo-600 mb-1">
            {visions.length > 0 ? Math.round(visions.reduce((acc, v) => acc + v.progress, 0) / visions.length) : 0}%
          </div>
          <div className="text-gray-600 text-xs sm:text-sm">Average Progress</div>
        </div>
      </div>

      {/* Vision Templates */}
      {visions.length === 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 sm:p-8 mb-6 sm:mb-8 border border-purple-100">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">Start with Core 10 Life Categories</h2>
            <p className="text-gray-600 text-sm sm:text-base">Choose from the fundamental life areas to begin your vision journey</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {visionTemplates.map((template, index) => (
              <button
                key={index}
                onClick={() => {
                  setEditingVision({
                    name: template.title,
                    category: template.title,
                    imageUrl: template.image
                  });
                  setShowAddModal(true);
                }}
                className="p-3 sm:p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 text-center group transform hover:scale-105"
              >
                <div className={`w-8 h-8 sm:w-12 sm:h-12 ${template.color} rounded-xl mx-auto mb-2 sm:mb-3 flex items-center justify-center`}>
                  <span className="text-white font-bold text-sm sm:text-base">{template.title.charAt(0)}</span>
                </div>
                <div className="font-semibold text-gray-800 text-xs sm:text-sm">{template.title}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {visions.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-gray-500">
            <div className="flex flex-col items-center">
              <Eye className="h-12 w-12 text-gray-300 mb-4 animate-pulse" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No visions created yet</h3>
              <p className="text-gray-600 mb-4">Create your first vision to start planning your life goals</p>
              <button 
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                <span>Add Your First Vision</span>
              </button>
            </div>
          </div>
        ) : (
          visions.map(vision => (
          <div key={vision._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
            {/* Vision Image */}
            <div className="relative h-40 sm:h-48 overflow-hidden">
              <img 
                src={vision.imageUrl || 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=400'} 
                alt={vision.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vision.status)}`}>
                  {vision.status}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(vision.priority)}`}>
                  {vision.priority}
                </span>
              </div>
            </div>

            {/* Vision Content */}
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-800 flex-1">{vision.name}</h3>
                <div className="flex space-x-1 ml-2">
                  <button 
                    onClick={() => handleEditVision(vision)}
                    className="p-1 text-gray-400 hover:text-blue-600 rounded hover:bg-blue-50 transition-colors"
                    aria-label="Edit Vision"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteVision(vision._id)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                    aria-label="Delete Vision"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button 
                    className="p-1 text-gray-400 hover:text-purple-600 rounded hover:bg-purple-50 transition-colors"
                    aria-label="Preview Vision"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4">{vision.description}</p>

              {/* Vision Details */}
              <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 mb-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{vision.startDate ? new Date(vision.startDate).toLocaleDateString() : 'No date'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{vision.endDate ? new Date(vision.endDate).toLocaleDateString() : 'No end date'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-3 w-3" />
                  <span>{vision.budget ? `₹${vision.budget}` : 'No budget'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Target className="h-3 w-3" />
                  <span>{vision.milestones?.length || 0} milestones</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-semibold text-gray-800">{vision.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-purple-400 to-indigo-600 transition-all duration-300"
                    style={{ width: `${vision.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          ))
        )}
      </div>

      {/* Vision Form Modal */}
      {showAddModal && (
        <VisionForm
          onSubmit={editingVision?.id ? handleUpdateVision : handleAddVision}
          onCancel={handleCloseModal}
          initialData={editingVision}
        />
      )}
    </div>
  );
};

export default MyVision;