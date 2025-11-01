import React, { useState } from 'react';
import { useEffect } from 'react';
import { 
  Plus, 
  Heart, 
  Edit, 
  Trash2, 
  Calendar,
  Clock,
  Filter,
  Search,
  Eye
} from 'lucide-react';

interface WordEntry {
  _id: string;
  id: number;
  word: string;
  commitment: string;
  date: string;
  timeframe: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  completed: boolean;
  completedAt?: string;
  reflection?: string;
}

import { wordAPI } from '../../services/api';

const MyWord: React.FC = () => {
  const [wordEntries, setWordEntries] = useState<WordEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadWords();
  }, []);

  const loadWords = async () => {
    setLoading(true);
    try {
      const response = await wordAPI.getAll();
      setWordEntries(Array.isArray(response) ? response : []);
    } finally {
      setLoading(false);
    }
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WordEntry | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [newEntry, setNewEntry] = useState({
    word: '',
    commitment: '',
    date: new Date().toISOString().split('T')[0],
    timeframe: 'Daily',
    reflection: ''
  });

  const filteredEntries = wordEntries.filter(entry => {
    const matchesFilter = filter === 'all' || 
      (filter === 'completed' && entry.completed) ||
      (filter === 'pending' && !entry.completed) ||
      (filter === entry.timeframe.toLowerCase());
    
    const matchesSearch = entry.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.commitment.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleAddEntry = async () => {
    if (newEntry.word.trim() && newEntry.commitment.trim()) {
      try {
        await wordAPI.create(newEntry);
        setNewEntry({
          word: '',
          commitment: '',
          date: new Date().toISOString().split('T')[0],
          timeframe: 'Daily',
          reflection: ''
        });
        setShowAddModal(false);
        loadWords();
      } catch (error) {
        console.error('Error adding word:', error);
      }
    }
  };

  const handleUpdateEntry = async () => {
    if (editingEntry && newEntry.word.trim() && newEntry.commitment.trim()) {
      try {
        await wordAPI.update(editingEntry._id, newEntry);
        setEditingEntry(null);
        setNewEntry({
          word: '',
          commitment: '',
          date: new Date().toISOString().split('T')[0],
          timeframe: 'Daily',
          reflection: ''
        });
        setShowAddModal(false);
        loadWords();
      } catch (error) {
        console.error('Error updating word:', error);
      }
    }
  };

  const handleDeleteEntry = async (id: string) => {
    if (confirm('Are you sure you want to delete this word entry?')) {
      try {
        await wordAPI.delete(id);
        loadWords();
      } catch (error) {
        console.error('Error deleting word:', error);
      }
    }
  };

  const handleEditEntry = (entry: WordEntry) => {
    setEditingEntry(entry);
    setNewEntry({
      word: entry.word,
      commitment: entry.commitment,
      date: entry.date,
      timeframe: entry.timeframe,
      reflection: entry.reflection || ''
    });
    setShowAddModal(true);
  };

  const toggleCompletion = async (id: string, completed: boolean) => {
    try {
      await wordAPI.update(id, { 
        completed: !completed,
        completedAt: !completed ? new Date().toISOString() : undefined
      });
      loadWords();
    } catch (error) {
      console.error('Error updating word:', error);
    }
  };

  const getTimeframeColor = (timeframe: string) => {
    const colors: { [key: string]: string } = {
      'Daily': 'bg-blue-100 text-blue-800',
      'Weekly': 'bg-green-100 text-green-800',
      'Monthly': 'bg-purple-100 text-purple-800',
      'Yearly': 'bg-orange-100 text-orange-800'
    };
    return colors[timeframe] || 'bg-gray-100 text-gray-800';
  };

  const completedEntries = wordEntries.filter(entry => entry.completed).length;
  const totalEntries = wordEntries.length;
  const pendingEntries = wordEntries.filter(entry => !entry.completed).length;
  const dailyEntries = wordEntries.filter(entry => entry.timeframe === 'Daily').length;

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Word (Integrity)</h1>
          <p className="text-gray-600">Track your integrity commitments and personal values</p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-red-700 hover:to-pink-700 transition-all shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Add Word</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-red-600 mb-1">{totalEntries}</div>
          <div className="text-gray-600 text-sm">Total Commitments</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600 mb-1">{completedEntries}</div>
          <div className="text-gray-600 text-sm">Completed</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600 mb-1">{pendingEntries}</div>
          <div className="text-gray-600 text-sm">Pending</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600 mb-1">{dailyEntries}</div>
          <div className="text-gray-600 text-sm">Daily Words</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All' },
                { id: 'completed', label: 'Completed' },
                { id: 'pending', label: 'Pending' },
                { id: 'daily', label: 'Daily' },
                { id: 'weekly', label: 'Weekly' },
                { id: 'monthly', label: 'Monthly' },
                { id: 'yearly', label: 'Yearly' }
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterOption.id
                      ? 'bg-red-600 text-white'
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
              placeholder="Search words..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent w-full sm:w-64 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Word Entries */}
      <div className="space-y-6">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry, index) => (
            <div key={entry._id || index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-all duration-300 transform hover:scale-[1.01]">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={entry.completed}
                    onChange={() => toggleCompletion(entry._id, entry.completed)}
                    className="w-5 h-5 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 mt-1"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className={`text-2xl font-bold ${entry.completed ? 'text-green-600' : 'text-red-600'}`}>
                        {entry.word}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTimeframeColor(entry.timeframe)}`}>
                        {entry.timeframe}
                      </span>
                      {entry.completed && entry.completedAt && (
                        <div className="flex items-center space-x-1 text-xs text-green-600">
                          <Clock className="h-3 w-3" />
                          <span>Completed {new Date(entry.completedAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className={`text-gray-700 mb-3 ${entry.completed ? 'line-through text-gray-500' : ''}`}>
                      {entry.commitment}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(entry.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    {entry.reflection && (
                      <div className="bg-gray-50 rounded-lg p-3 mt-3">
                        <h4 className="text-sm font-medium text-gray-800 mb-1">Reflection:</h4>
                        <p className="text-sm text-gray-600">{entry.reflection}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditEntry(entry)}
                    className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors group"
                    title="Edit Word"
                  >
                    <Edit className="h-4 w-4 group-hover:animate-pulse" />
                  </button>
                  <button
                    onClick={() => handleDeleteEntry(entry._id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors group"
                    title="Delete Word"
                  >
                    <Trash2 className="h-4 w-4 group-hover:animate-pulse" />
                  </button>
                  <button
                    className="p-2 text-gray-400 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition-colors group"
                    title="Preview Word"
                  >
                    <Eye className="h-4 w-4 group-hover:animate-pulse" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No word entries found</h3>
            <p className="text-gray-600 mb-4">Add your first integrity commitment to get started.</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Your First Word</span>
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {editingEntry ? 'Edit Word' : 'Add New Word'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingEntry(null);
                  setNewEntry({
                    word: '',
                    commitment: '',
                    date: new Date().toISOString().split('T')[0],
                    timeframe: 'Daily',
                    reflection: ''
                  });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Word *
                </label>
                <input
                  type="text"
                  value={newEntry.word}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, word: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  placeholder="e.g., Honesty, Courage, Kindness"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commitment *
                </label>
                <textarea
                  value={newEntry.commitment}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, commitment: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 resize-none"
                  placeholder="Describe how you will embody this word..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeframe
                  </label>
                  <select
                    value={newEntry.timeframe}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, timeframe: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reflection (Optional)
                </label>
                <textarea
                  value={newEntry.reflection}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, reflection: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 resize-none"
                  placeholder="Add any thoughts or reflections..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingEntry(null);
                    setNewEntry({
                      word: '',
                      commitment: '',
                      date: new Date().toISOString().split('T')[0],
                      timeframe: 'Daily',
                      reflection: ''
                    });
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingEntry ? handleUpdateEntry : handleAddEntry}
                  className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  {editingEntry ? 'Update Word' : 'Add Word'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyWord;