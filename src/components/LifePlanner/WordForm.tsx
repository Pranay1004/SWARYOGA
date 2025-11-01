import React, { useState } from 'react';
import { X, Heart, Calendar, Clock } from 'lucide-react';

interface WordFormProps {
  onSubmit: (wordData: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const WordForm: React.FC<WordFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [word, setWord] = useState({
    word: initialData?.word || '',
    commitment: initialData?.commitment || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    timeframe: initialData?.timeframe || 'Daily',
    reflection: initialData?.reflection || '',
    completed: initialData?.completed || false
  });

  const timeframeOptions = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (word.word.trim() && word.commitment.trim()) {
      console.log('Submitting word:', word);
      onSubmit(word);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-600" />
            <span>{initialData ? 'Edit Word' : 'Add New Word'}</span>
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
              Your Word *
            </label>
            <input
              type="text"
              value={word.word}
              onChange={(e) => setWord(prev => ({ ...prev, word: e.target.value }))}
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
              value={word.commitment}
              onChange={(e) => setWord(prev => ({ ...prev, commitment: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 resize-none"
              placeholder="Describe how you will embody this word..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-red-500" />
                <span>Date</span>
              </label>
              <input
                type="date"
                value={word.date}
                onChange={(e) => setWord(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                <Clock className="h-4 w-4 text-red-500" />
                <span>Timeframe</span>
              </label>
              <select
                value={word.timeframe}
                onChange={(e) => setWord(prev => ({ ...prev, timeframe: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
              >
                {timeframeOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reflection (Optional)
            </label>
            <textarea
              value={word.reflection}
              onChange={(e) => setWord(prev => ({ ...prev, reflection: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 resize-none"
              placeholder="Add any thoughts or reflections..."
            />
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <input
              type="checkbox"
              id="completed"
              checked={word.completed}
              onChange={(e) => setWord(prev => ({ ...prev, completed: e.target.checked }))}
              className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
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
              className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors touch-manipulation"
            >
              {initialData ? 'Update Word' : 'Add Word'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WordForm;