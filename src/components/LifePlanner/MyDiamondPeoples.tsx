import React, { useState } from 'react';
import { 
  Plus, 
  Users, 
  Edit, 
  Trash2, 
  Phone,
  MapPin,
  FileText,
  Star,
  Filter,
  Search
} from 'lucide-react';

interface DiamondPerson {
  id: number;
  name: string;
  mobile: string;
  address: string;
  headlines: string;
  notes: string;
  category: string;
  rating: number;
  createdAt: string;
  lastContact?: string;
}

const MyDiamondPeoples: React.FC = () => {
  const [people, setPeople] = useState<DiamondPerson[]>([
    {
      id: 1,
      name: 'John Smith',
      mobile: '+1 (555) 123-4567',
      address: '123 Main St, New York, NY 10001',
      headlines: 'Senior Software Engineer at Tech Corp',
      notes: 'Met at tech conference. Interested in AI and machine learning. Great networking contact for future opportunities.',
      category: 'Professional',
      rating: 5,
      createdAt: '2024-01-10',
      lastContact: '2024-01-14'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      mobile: '+1 (555) 987-6543',
      address: '456 Oak Ave, Los Angeles, CA 90210',
      headlines: 'Marketing Director & Business Coach',
      notes: 'Amazing mentor who helped me with career guidance. Always available for advice and has great industry insights.',
      category: 'Mentor',
      rating: 5,
      createdAt: '2024-01-12',
      lastContact: '2024-01-15'
    },
    {
      id: 3,
      name: 'Michael Chen',
      mobile: '+1 (555) 456-7890',
      address: '789 Pine St, San Francisco, CA 94102',
      headlines: 'Entrepreneur & Startup Founder',
      notes: 'Successful entrepreneur with multiple exits. Great for business advice and potential investment opportunities.',
      category: 'Business',
      rating: 4,
      createdAt: '2024-01-13'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState<DiamondPerson | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [newPerson, setNewPerson] = useState({
    name: '',
    mobile: '',
    address: '',
    headlines: '',
    notes: '',
    category: 'Professional',
    rating: 5
  });

  const categories = ['Professional', 'Personal', 'Mentor', 'Business', 'Family', 'Friend', 'Client', 'Partner'];

  const filteredPeople = people.filter(person => {
    const matchesFilter = filter === 'all' || 
      (filter === person.category.toLowerCase()) ||
      (filter === 'high-rated' && person.rating >= 4);
    
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.headlines.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleAddPerson = () => {
    if (newPerson.name.trim()) {
      const person: DiamondPerson = {
        id: Date.now(),
        name: newPerson.name,
        mobile: newPerson.mobile,
        address: newPerson.address,
        headlines: newPerson.headlines,
        notes: newPerson.notes,
        category: newPerson.category,
        rating: newPerson.rating,
        createdAt: new Date().toISOString()
      };
      setPeople([...people, person]);
      setNewPerson({
        name: '',
        mobile: '',
        address: '',
        headlines: '',
        notes: '',
        category: 'Professional',
        rating: 5
      });
      setShowAddModal(false);
    }
  };

  const handleEditPerson = (person: DiamondPerson) => {
    setEditingPerson(person);
    setNewPerson({
      name: person.name,
      mobile: person.mobile,
      address: person.address,
      headlines: person.headlines,
      notes: person.notes,
      category: person.category,
      rating: person.rating
    });
    setShowAddModal(true);
  };

  const handleUpdatePerson = () => {
    if (editingPerson && newPerson.name.trim()) {
      setPeople(people.map(person => 
        person.id === editingPerson.id 
          ? { 
              ...person, 
              name: newPerson.name,
              mobile: newPerson.mobile,
              address: newPerson.address,
              headlines: newPerson.headlines,
              notes: newPerson.notes,
              category: newPerson.category,
              rating: newPerson.rating
            }
          : person
      ));
      setEditingPerson(null);
      setNewPerson({
        name: '',
        mobile: '',
        address: '',
        headlines: '',
        notes: '',
        category: 'Professional',
        rating: 5
      });
      setShowAddModal(false);
    }
  };

  const handleDeletePerson = (id: number) => {
    if (confirm('Are you sure you want to delete this person?')) {
      setPeople(people.filter(person => person.id !== id));
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Professional': 'bg-blue-100 text-blue-800',
      'Personal': 'bg-green-100 text-green-800',
      'Mentor': 'bg-purple-100 text-purple-800',
      'Business': 'bg-orange-100 text-orange-800',
      'Family': 'bg-pink-100 text-pink-800',
      'Friend': 'bg-yellow-100 text-yellow-800',
      'Client': 'bg-indigo-100 text-indigo-800',
      'Partner': 'bg-emerald-100 text-emerald-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const totalPeople = people.length;
  const highRatedPeople = people.filter(p => p.rating >= 4).length;
  const avgRating = totalPeople > 0 ? (people.reduce((sum, p) => sum + p.rating, 0) / totalPeople).toFixed(1) : '0';
  const recentContacts = people.filter(p => p.lastContact && 
    new Date(p.lastContact) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Diamond Peoples</h1>
          <p className="text-gray-600">Manage your valuable network and relationships</p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
        >
          <Plus className="h-5 w-5" />
          <span>Add Person</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-indigo-600 mb-1">{totalPeople}</div>
          <div className="text-gray-600 text-sm">Total People</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600 mb-1">{highRatedPeople}</div>
          <div className="text-gray-600 text-sm">High Rated (4+)</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600 mb-1">{avgRating}</div>
          <div className="text-gray-600 text-sm">Avg Rating</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-blue-600 mb-1">{recentContacts}</div>
          <div className="text-gray-600 text-sm">Recent Contacts</div>
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
                { id: 'high-rated', label: 'High Rated' },
                ...categories.map(cat => ({ id: cat.toLowerCase(), label: cat }))
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterOption.id
                      ? 'bg-indigo-600 text-white'
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
              placeholder="Search people..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-full sm:w-64 text-sm"
            />
          </div>
        </div>
      </div>

      {/* People Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPeople.length > 0 ? (
          filteredPeople.map(person => (
            <div key={person.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{person.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{person.headlines}</p>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(person.category)}`}>
                      {person.category}
                    </span>
                    <div className="flex items-center space-x-1">
                      {renderStars(person.rating)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleEditPerson(person)}
                    className="p-1 text-gray-400 hover:text-blue-600 rounded"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePerson(person.id)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {person.mobile && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{person.mobile}</span>
                  </div>
                )}
                
                {person.address && (
                  <div className="flex items-start space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{person.address}</span>
                  </div>
                )}
                
                {person.notes && (
                  <div className="flex items-start space-x-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-3">{person.notes}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  Added: {new Date(person.createdAt).toLocaleDateString()}
                </span>
                {person.lastContact && (
                  <span className="text-xs text-green-600">
                    Last contact: {new Date(person.lastContact).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No people found</h3>
            <p className="text-gray-600">Add your first diamond person to get started.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                {editingPerson ? 'Edit Person' : 'Add New Person'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingPerson(null);
                  setNewPerson({
                    name: '',
                    mobile: '',
                    address: '',
                    headlines: '',
                    notes: '',
                    category: 'Professional',
                    rating: 5
                  });
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={newPerson.name}
                    onChange={(e) => setNewPerson(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile
                  </label>
                  <input
                    type="tel"
                    value={newPerson.mobile}
                    onChange={(e) => setNewPerson(prev => ({ ...prev, mobile: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={newPerson.address}
                  onChange={(e) => setNewPerson(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                  placeholder="Enter address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Headlines
                </label>
                <input
                  type="text"
                  value={newPerson.headlines}
                  onChange={(e) => setNewPerson(prev => ({ ...prev, headlines: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                  placeholder="Job title, profession, or key description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={newPerson.notes}
                  onChange={(e) => setNewPerson(prev => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 resize-none"
                  placeholder="Add notes about this person, how you met, their interests, etc."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newPerson.category}
                    onChange={(e) => setNewPerson(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <select
                    value={newPerson.rating}
                    onChange={(e) => setNewPerson(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900"
                  >
                    {[5, 4, 3, 2, 1].map(rating => (
                      <option key={rating} value={rating}>
                        {rating} Star{rating !== 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingPerson(null);
                    setNewPerson({
                      name: '',
                      mobile: '',
                      address: '',
                      headlines: '',
                      notes: '',
                      category: 'Professional',
                      rating: 5
                    });
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingPerson ? handleUpdatePerson : handleAddPerson}
                  className="flex-1 px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingPerson ? 'Update Person' : 'Add Person'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDiamondPeoples;