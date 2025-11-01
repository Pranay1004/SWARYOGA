import React, { useState } from 'react';
import { X, Clock, Plus, Trash2 } from 'lucide-react';
import * as Icons from 'lucide-react';

interface RoutineItem {
  id: number;
  time: string;
  activity: string;
  icon: string;
  color: string;
  completed: boolean;
}

interface DailyRoutineFormProps {
  onSubmit: (routineItems: RoutineItem[]) => void;
  onCancel: () => void;
  initialData: RoutineItem[];
}

const DailyRoutineForm: React.FC<DailyRoutineFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [routineItems, setRoutineItems] = useState<RoutineItem[]>(initialData || []);

  // Available icons from lucide-react
  const iconOptions = [
    'Sun', 'Moon', 'Coffee', 'Utensils', 'Dumbbell', 'Book', 
    'Briefcase', 'Home', 'Users', 'Heart', 'Music', 'Tv', 
    'Smartphone', 'Car', 'Bus', 'Bike', 'Walk', 'Bath', 
    'ShoppingBag', 'Scissors', 'Brush', 'Palette'
  ];

  // Color options
  const colorOptions = [
    { name: 'Red', value: 'bg-red-500' },
    { name: 'Orange', value: 'bg-orange-500' },
    { name: 'Yellow', value: 'bg-yellow-500' },
    { name: 'Green', value: 'bg-green-500' },
    { name: 'Teal', value: 'bg-teal-500' },
    { name: 'Blue', value: 'bg-blue-500' },
    { name: 'Indigo', value: 'bg-indigo-500' },
    { name: 'Purple', value: 'bg-purple-500' },
    { name: 'Pink', value: 'bg-pink-500' },
    { name: 'Gray', value: 'bg-gray-500' }
  ];

  const addRoutineItem = () => {
    const newId = routineItems.length > 0 
      ? Math.max(...routineItems.map(item => item.id)) + 1 
      : 1;
    
    setRoutineItems([
      ...routineItems,
      {
        id: newId,
        time: '',
        activity: '',
        icon: 'Sun',
        color: 'bg-blue-500',
        completed: false
      }
    ]);
  };

  const removeRoutineItem = (id: number) => {
    setRoutineItems(routineItems.filter(item => item.id !== id));
  };

  const updateRoutineItem = (id: number, field: string, value: string | boolean) => {
    setRoutineItems(routineItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate that all items have time and activity
    const isValid = routineItems.every(item => item.time && item.activity);
    if (isValid) {
      onSubmit(routineItems);
    } else {
      alert('Please fill in all time and activity fields');
    }
  };

  // Sort routine items by time
  const sortedRoutineItems = [...routineItems].sort((a, b) => {
    if (!a.time) return 1;
    if (!b.time) return -1;
    return a.time.localeCompare(b.time);
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span>Daily Routine</span>
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Create your daily routine by adding activities with specific times.
              </p>
              <button
                type="button"
                onClick={addRoutineItem}
                className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Activity</span>
              </button>
            </div>

            {sortedRoutineItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="mb-4">No routine activities added yet</p>
                <button
                  type="button"
                  onClick={addRoutineItem}
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Your First Activity</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedRoutineItems.map((item) => {
                  const IconComponent = (Icons[item.icon as keyof typeof Icons] || Icons.Activity) as React.ElementType;
                  
                  return (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-lg ${item.color} shadow-sm`}>
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <span className="font-medium text-gray-800">Activity {item.id}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeRoutineItem(item.id)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Time *
                          </label>
                          <input
                            type="time"
                            value={item.time}
                            onChange={(e) => updateRoutineItem(item.id, 'time', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Activity *
                          </label>
                          <input
                            type="text"
                            value={item.activity}
                            onChange={(e) => updateRoutineItem(item.id, 'activity', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            placeholder="e.g., Morning Workout"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Icon
                          </label>
                          <select
                            value={item.icon}
                            onChange={(e) => updateRoutineItem(item.id, 'icon', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                          >
                            {iconOptions.map(icon => (
                              <option key={icon} value={icon}>{icon}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Color
                          </label>
                          <select
                            value={item.color}
                            onChange={(e) => updateRoutineItem(item.id, 'color', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                          >
                            {colorOptions.map(color => (
                              <option key={color.value} value={color.value}>{color.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Routine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DailyRoutineForm;