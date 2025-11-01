import React, { useState } from 'react';
import { X, Calendar, Clock, Flag, CheckCircle, FileText } from 'lucide-react';

interface TaskCreationModalProps {
  onClose: () => void;
  onSave: (taskData: any) => void;
  initialData?: any | null;
}

const TaskCreationModal: React.FC<TaskCreationModalProps> = ({ onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    particulars: initialData ? initialData.particulars || '' : '',
    date: initialData ? initialData.date || '' : '',
    time: initialData ? initialData.time || '' : '',
    priority: initialData ? initialData.priority || 'Medium' : 'Medium',
    status: initialData ? initialData.status || 'Pending' : 'Pending',
    completed: initialData ? initialData.completed || false : false,
    repeat: initialData ? initialData.repeat || 'None' : 'None',
    customRepeatDays: initialData ? initialData.customRepeatDays || 1 : 1,
    reminder: initialData ? initialData.reminder || false : false,
    reminderTime: initialData ? initialData.reminderTime || '' : ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.particulars.trim()) {
      console.log('Submitting task form data:', formData);
      try {
        onSave(formData);
      } catch (error) {
        console.error('Error saving task:', error);
        alert('Error saving task. Please try again.');
      }
    }
  };

  const handleCompletedChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      completed: checked,
      status: checked ? 'Complete' : 'Pending'
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Create New Task</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors" 
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Particulars */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4" />
              <span>Particulars *</span>
            </label>
            <input
              type="text"
              value={formData.particulars}
              onChange={(e) => setFormData(prev => ({ ...prev, particulars: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Enter task details..."
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4" />
              <span>Date</span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>

          {/* Time */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Clock className="h-4 w-4" />
              <span>Time</span>
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Flag className="h-4 w-4" />
              <span>Priority</span>
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <CheckCircle className="h-4 w-4" />
              <span>Status</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              disabled={formData.completed}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 disabled:bg-gray-100"
            >
              <option value="Pending">Pending</option>
              <option value="In progress">In progress</option>
              <option value="Complete">Complete</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          {/* Completed Checkbox */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="completed"
              checked={formData.completed}
              onChange={(e) => handleCompletedChange(e.target.checked)}
              className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="completed" className="text-sm font-medium text-gray-700">
              Mark as completed
            </label>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors touch-manipulation" 
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors touch-manipulation"
            >
              {initialData ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskCreationModal;