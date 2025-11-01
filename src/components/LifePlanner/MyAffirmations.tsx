import React, { useState } from 'react';
import { useEffect } from 'react';
import { 
  Plus, 
  Sparkles, 
  Edit, 
  Trash2, 
  Image,
  Filter,
  Search,
  Eye
} from 'lucide-react';

interface Affirmation {
  _id: string;
  id?: number;
  text: string;
  imageUrl: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  timesViewed: number;
}

import { affirmationAPI } from '../../services/api';

const MyAffirmations: React.FC = () => {
  const [affirmations, setAffirmations] = useState<Affirmation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAffirmations();
  }, []);

  const loadAffirmations = async () => {
    setLoading(true);
    try {
      const response = await affirmationAPI.getAll();
      setAffirmations(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error('Error loading affirmations:', error);
      setAffirmations([]);
    } finally {
      setLoading(false);
    }
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAffirmation, setEditingAffirmation] = useState<Affirmation | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [newAffirmation, setNewAffirmation] = useState({
    text: '',
    imageUrl: '',
    category: 'Health'
  });

  // Vision categories (same as vision categories)
  const categories = ['Health', 'Wealth', 'Success', 'Respect', 'Pleasure', 'Prosperity', 'Luxurious', 'Habit', 'Spirituality', 'About Life'];

  const filteredAffirmations = affirmations.filter(affirmation => {
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && affirmation.isActive) ||
      (filter === 'inactive' && !affirmation.isActive) ||
      (filter === affirmation.category.toLowerCase());
    
    const matchesSearch = affirmation.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affirmation.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleAddAffirmation = async () => {
    if (newAffirmation.text.trim()) {
      try {
        await affirmationAPI.create({
          ...newAffirmation,
          isActive: true,
          timesViewed: 0
        });
        setNewAffirmation({
          text: '',
          imageUrl: '',
          category: 'Health'
        });
        setShowAddModal(false);
        loadAffirmations();
      } catch (error) {
        console.error('Error adding affirmation:', error);
      }
    }
  };

  const handleUpdateAffirmation = async () => {
    if (editingAffirmation && newAffirmation.text.trim()) {
      try {
        await affirmationAPI.update(editingAffirmation._id, newAffirmation);
        setEditingAffirmation(null);
        setNewAffirmation({
          text: '',
          imageUrl: '',
          category: 'Health'
        });
        setShowAddModal(false);
        loadAffirmations();
      } catch (error) {
        console.error('Error updating affirmation:', error);
      }
    }
  };

  const handleDeleteAffirmation = async (id: string) => {
    if (confirm('Are you sure you want to delete this affirmation?')) {
      try {
        await affirmationAPI.delete(id);
        loadAffirmations();
      } catch (error) {
        console.error('Error deleting affirmation:', error);
      }
    }
  };

  const handleEditAffirmation = (affirmation: Affirmation) => {
    setEditingAffirmation(affirmation);
    setNewAffirmation({
      text: affirmation.text,
      imageUrl: affirmation.imageUrl,
      category: affirmation.category
    });
    setShowAddModal(true);
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      await affirmationAPI.update(id, { isActive: !isActive });
      loadAffirmations();
    } catch (error) {
      console.error('Error updating affirmation:', error);
    }
  };

  const incrementViews = async (id: string, currentViews: number) => {
    try {
      await affirmationAPI.update(id, { timesViewed: currentViews + 1 });
      loadAffirmations();
    } catch (error) {
      console.error('Error updating views:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Health': 'bg-red-100 text-red-800',
      'Wealth': 'bg-green-100 text-green-800',
      'Success': 'bg-yellow-100 text-yellow-800',
      'Respect': 'bg-purple-100 text-purple-800',
      'Pleasure': 'bg-pink-100 text-pink-800',
      'Prosperity': 'bg-emerald-100 text-emerald-800',
      'Luxurious': 'bg-orange-100 text-orange-800',
      'Habit': 'bg-gray-100 text-gray-800',
      'Spirituality': 'bg-indigo-100 text-indigo-800',
      'About Life': 'bg-blue-100 text-blue-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const totalAffirmations = affirmations.length;
  const activeAffirmations = affirmations.filter(a => a.isActive).length;
  const totalViews = affirmations.reduce((sum, a) => sum + a.timesViewed, 0);
  const avgViews = totalAffirmations > 0 ? Math.round(totalViews / totalAffirmations) : 0;

  if (loading) {
    return (
      <div className="p-3 sm:p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center justify-between mb-4 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">My Affirmations</h1>
          <p className="text-sm sm:text-base text-gray-600">Create positive affirmations with inspiring images</p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 sm:px-6 py-3 rounded-lg hover:from-pink-700 hover:to-purple-700 transition-all shadow-lg w-full sm:w-auto touch-manipulation"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Add Affirmation</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-8">
        <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm border border-gray-200">
          <div className="text-lg sm:text-2xl font-bold text-pink-600 mb-1">{totalAffirmations}</div>
          <div className="text-gray-600 text-xs sm:text-sm">Total Affirmations</div>
        </div>
        <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm border border-gray-200">
          <div className="text-lg sm:text-2xl font-bold text-green-600 mb-1">{activeAffirmations}</div>
          <div className="text-gray-600 text-xs sm:text-sm">Active</div>
        </div>
        <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm border border-gray-200">
          <div className="text-lg sm:text-2xl font-bold text-blue-600 mb-1">{totalViews}</div>
          <div className="text-gray-600 text-xs sm:text-sm">Total Views</div>
        </div>
        <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm border border-gray-200">
          <div className="text-lg sm:text-2xl font-bold text-purple-600 mb-1">{avgViews}</div>
          <div className="text-gray-600 text-xs sm:text-sm">Avg Views</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm border border-gray-200 mb-4 sm:mb-8">
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {[
                { id: 'all', label: 'All' },
                { id: 'active', label: 'Active' },
                { id: 'inactive', label: 'Inactive' },
                ...categories.map(cat => ({ id: cat.toLowerCase(), label: cat }))
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id)}
                  className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors touch-manipulation ${
                    filter === filterOption.id
                      ? 'bg-pink-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search affirmations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 sm:pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent w-full sm:w-64 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Affirmations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {filteredAffirmations.length > 0 ? (
          filteredAffirmations.map((affirmation, index) => (
            <div key={affirmation._id || index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Image */}
              <div className="relative h-32 sm:h-48 overflow-hidden">
                <img 
                  src={affirmation.imageUrl || 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400'} 
                  alt="Affirmation"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400';
                  }}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-2 sm:p-4">
                  <p className="text-white text-center font-semibold text-sm sm:text-lg leading-relaxed">
                    "{affirmation.text}"
                  </p>
                </div>
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex flex-col space-y-1 sm:space-y-2">
                  <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium ${getCategoryColor(affirmation.category)}`}>
                    {affirmation.category}
                  </span>
                  <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium ${
                    affirmation.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {affirmation.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600">
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{affirmation.timesViewed || 0} views</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => incrementViews(affirmation._id, affirmation.timesViewed || 0)}
                      className="p-1 text-gray-400 hover:text-blue-600 rounded touch-manipulation"
                      aria-label="View Affirmation"
                    >
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                    <button
                      onClick={() => handleEditAffirmation(affirmation)}
                      className="p-1 text-gray-400 hover:text-blue-600 rounded touch-manipulation"
                      aria-label="Edit Affirmation"
                    >
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAffirmation(affirmation._id)}
                      className="p-1 text-gray-400 hover:text-red-600 rounded touch-manipulation"
                      aria-label="Delete Affirmation"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Created: {affirmation.createdAt ? new Date(affirmation.createdAt).toLocaleDateString() : 'Unknown'}
                  </span>
                  <button
                    onClick={() => toggleActive(affirmation._id, affirmation.isActive)}
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-colors touch-manipulation ${
                      affirmation.isActive
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {affirmation.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 sm:py-12">
            <Sparkles className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No affirmations found</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4">Create your first positive affirmation to get started.</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Your First Affirmation</span>
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {editingAffirmation ? 'Edit Affirmation' : 'Add New Affirmation'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingAffirmation(null);
                  setNewAffirmation({
                    text: '',
                    imageUrl: '',
                    category: 'Health'
                  });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
              >
                ×
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Affirmation Text *
                </label>
                <textarea
                  value={newAffirmation.text}
                  onChange={(e) => setNewAffirmation(prev => ({ ...prev, text: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 resize-none"
                  placeholder="Enter your positive affirmation..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <div className="flex space-x-2">
                  <input
                    type="url"
                    value={newAffirmation.imageUrl}
                    onChange={(e) => setNewAffirmation(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    className="p-2 text-gray-400 hover:text-pink-600 border border-gray-300 rounded-lg touch-manipulation"
                  >
                    <Image className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                </div>
                {newAffirmation.imageUrl && (
                  <div className="mt-2">
                    <img 
                      src={newAffirmation.imageUrl} 
                      alt="Preview" 
                      className="w-full h-24 sm:h-32 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400';
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newAffirmation.category}
                  onChange={(e) => setNewAffirmation(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingAffirmation(null);
                    setNewAffirmation({
                      text: '',
                      imageUrl: '',
                      category: 'Health'
                    });
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  onClick={editingAffirmation ? handleUpdateAffirmation : handleAddAffirmation}
                  className="flex-1 px-4 py-2 text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors touch-manipulation"
                >
                  {editingAffirmation ? 'Update Affirmation' : 'Add Affirmation'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAffirmations;