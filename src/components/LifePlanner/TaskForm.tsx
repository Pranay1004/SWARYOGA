import React, { useState } from 'react';
import { X, Calendar, Clock, Flag, CheckCircle, FileText, Bell, Repeat } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (taskData: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [task, setTask] = useState({
    particulars: initialData?.particulars || '',
    date: initialData?.date || '',
    time: initialData?.time || '',
    priority: initialData?.priority || 'Medium',
    status: initialData?.status || 'Pending',
    completed: initialData?.completed || false,
    repeat: initialData?.repeat || 'None',
    customRepeatDays: initialData?.customRepeatDays || 1,
    reminder: initialData?.reminder || false,
    reminderTime: initialData?.reminderTime || ''
  });

  const priorityOptions = ['Low', 'Medium', 'High'];
  const statusOptions = ['Pending', 'In Progress', 'Complete', 'Blocked'];
  const repeatOptions = ['None', 'Daily', 'Weekly', 'Monthly', 'Yearly', 'Custom'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.particulars.trim()) {
      console.log('Submitting task:', task);
      onSubmit(task);
    }
  };

  const handleCompletedChange = (checked: boolean) => {
    setTask(prev => ({
      ...prev,
      completed: checked,
      status: checked ? 'Complete' : 'Pending'
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <FileText className="h-5 w-5 text-green-600" />
            <span>{initialData ? 'Edit Task' : 'Create New Task'}</span>
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Particulars */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 text-green-500" />
              <span>Task Details *</span>
            </label>
            <input
              type="text"
              value={task.particulars}
              onChange={(e) => setTask(prev => ({ ...prev, particulars: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              placeholder="Enter task details..."
              required
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 text-green-500" />
                <span>Date</span>
              </label>
              <input
                type="date"
                value={task.date}
                onChange={(e) => setTask(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              />
            </div>
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 text-green-500" />
                <span>Time</span>
              </label>
              <input
                type="time"
                value={task.time}
                onChange={(e) => setTask(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              />
            </div>
          </div>

          {/* Priority and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Flag className="h-4 w-4 text-green-500" />
                <span>Priority</span>
              </label>
              <select
                value={task.priority}
                onChange={(e) => setTask(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
              >
                {priorityOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Status</span>
              </label>
              <select
                value={task.status}
                onChange={(e) => setTask(prev => ({ ...prev, status: e.target.value }))}
                disabled={task.completed}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 disabled:bg-gray-100"
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Repeat Section */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Repeat className="h-4 w-4 text-green-500" />
              <span>Repeat</span>
            </label>
            <select
              value={task.repeat}
              onChange={(e) => setTask(prev => ({ ...prev, repeat: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
            >
              {repeatOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {task.repeat === 'Custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repeat every (days)
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={task.customRepeatDays}
                onChange={(e) => setTask(prev => ({ ...prev, customRepeatDays: parseInt(e.target.value) || 1 }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                placeholder="Enter number of days"
              />
            </div>
          )}

          {/* Reminder Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="reminder"
                checked={task.reminder}
                onChange={(e) => setTask(prev => ({ ...prev, reminder: e.target.checked }))}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="reminder" className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <Bell className="h-4 w-4 text-green-500" />
                <span>Set reminder</span>
              </label>
            </div>

            {task.reminder && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reminder time
                </label>
                <input
                  type="time"
                  value={task.reminderTime}
                  onChange={(e) => setTask(prev => ({ ...prev, reminderTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                />
              </div>
            )}
          </div>

          {/* Completed Checkbox */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="completed"
              checked={task.completed}
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
              onClick={onCancel}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
            >
              {initialData ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;