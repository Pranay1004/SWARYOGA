import React, { useState } from 'react';
import { X, Calendar, Flag, Bell } from 'lucide-react';

interface TodoFormProps {
  onSubmit: (todoData: any) => void;
  onCancel: () => void;
  initialData?: any;
  todo?: any;
  categories?: string[];
}

const TodoForm: React.FC<TodoFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData, 
  todo,
  categories = ['Personal', 'Work', 'Health', 'Finance', 'Career', 'Learning', 'Home', 'Social']
}) => {
  const [formData, setFormData] = useState({
    text: initialData?.text || todo?.text || '',
    category: initialData?.category || todo?.category || 'Personal',
    priority: initialData?.priority || todo?.priority || 'Medium',
    dueDate: initialData?.dueDate || todo?.dueDate || '',
    reminder: initialData?.reminder || todo?.reminder || false,
    reminderTime: initialData?.reminderTime || todo?.reminderTime || '',
    completed: initialData?.completed || todo?.completed || false
  });

  const priorityOptions = ['Low', 'Medium', 'High'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.text.trim()) {
      console.log('Submitting todo:', formData);
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <Flag className="h-5 w-5 text-orange-600" />
            <span>{initialData || todo ? 'Edit To-Do' : 'Add New To-Do'}</span>
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To-Do Text *
            </label>
            <input
              type="text"
              value={formData.text}
              onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
              placeholder="Enter your to-do..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
              >
                {priorityOptions.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4" />
              <span>Due Date (Optional)</span>
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="reminder"
                checked={formData.reminder}
                onChange={(e) => setFormData(prev => ({ ...prev, reminder: e.target.checked }))}
                className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="reminder" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Bell className="h-4 w-4 text-orange-500" />
                <span>Set reminder</span>
              </label>
            </div>

            {formData.reminder && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reminder time
                </label>
                <input
                  type="time"
                  value={formData.reminderTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, reminderTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="completed"
              checked={formData.completed}
              onChange={(e) => setFormData(prev => ({ ...prev, completed: e.target.checked }))}
              className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="completed" className="text-sm font-medium text-gray-700">
              Mark as completed
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors touch-manipulation"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 transition-colors touch-manipulation"
            >
              {initialData || todo ? 'Update To-Do' : 'Add To-Do'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoForm;