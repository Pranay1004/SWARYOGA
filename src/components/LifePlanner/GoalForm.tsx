import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  DollarSign, 
  Target, 
  Image, 
  Plus, 
  Trash2, 
  CheckSquare,
  Heart,
  Clock,
  FileText,
  Flag,
  Eye
} from 'lucide-react';

interface GoalFormProps {
  onSubmit: (goalData: any) => void;
  onCancel: () => void;
  initialData?: any;
}

const GoalForm: React.FC<GoalFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [goal, setGoal] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    visionTitle: initialData?.visionTitle || 'Health',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    startTime: initialData?.startTime || '',
    endTime: initialData?.endTime || '',
    budget: initialData?.budget || '',
    priority: initialData?.priority || 'Medium',
    status: initialData?.status || 'Not Started',
    imageUrl: initialData?.imageUrl || '',
    note: initialData?.note || '',
    milestones: initialData?.milestones || [],
  });

  const visionCategories = [
    'Health', 'Wealth', 'Success', 'Respect', 'Pleasure', 
    'Prosperity', 'Luxurious', 'Habit', 'Spirituality', 'About Life'
  ];

  const priorityOptions = ['Low', 'Medium', 'High'];
  const statusOptions = ['Not Started', 'In Progress', 'Completed', 'On Hold'];

  const addMilestone = () => {
    setGoal({
      ...goal,
      milestones: [
        ...goal.milestones,
        { 
          name: '', 
          startDate: '', 
          endDate: '', 
          budget: '',
          note: '',
          tasks: [],
          todos: [],
          myWord: { text: '', dateTime: '', completed: false }
        },
      ],
    });
  };

  const removeMilestone = (mIndex: number) => {
    const updated = { ...goal };
    updated.milestones.splice(mIndex, 1);
    setGoal(updated);
  };

  const addTask = (mIndex: number) => {
    const updated = { ...goal };
    updated.milestones[mIndex].tasks.push({
      name: '',
      date: '',
      time: '',
      note: '',
      budget: '',
      priority: 'Medium',
      completed: false,
    });
    setGoal(updated);
  };

  const removeTask = (mIndex: number, tIndex: number) => {
    const updated = { ...goal };
    updated.milestones[mIndex].tasks.splice(tIndex, 1);
    setGoal(updated);
  };

  const addTodo = (mIndex: number) => {
    const updated = { ...goal };
    updated.milestones[mIndex].todos.push({
      text: '',
      completed: false,
      dueDate: '',
      priority: 'Medium'
    });
    setGoal(updated);
  };

  const removeTodo = (mIndex: number, todoIndex: number) => {
    const updated = { ...goal };
    updated.milestones[mIndex].todos.splice(todoIndex, 1);
    setGoal(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(goal);
  };

  const updateGoalField = (field: string, value: any) => {
    setGoal(prev => ({ ...prev, [field]: value }));
  };

  const updateMilestone = (mIndex: number, field: string, value: any) => {
    const updated = { ...goal };
    updated.milestones[mIndex][field] = value;
    setGoal(updated);
  };

  const updateTask = (mIndex: number, tIndex: number, field: string, value: any) => {
    const updated = { ...goal };
    updated.milestones[mIndex].tasks[tIndex][field] = value;
    setGoal(updated);
  };

  const updateTodo = (mIndex: number, todoIndex: number, field: string, value: any) => {
    const updated = { ...goal };
    updated.milestones[mIndex].todos[todoIndex][field] = value;
    setGoal(updated);
  };

  const updateMyWord = (mIndex: number, field: string, value: any) => {
    const updated = { ...goal };
    updated.milestones[mIndex].myWord[field] = value;
    setGoal(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <Target className="h-6 w-6 text-blue-600" />
            <span>{initialData ? 'Edit Goal' : 'Create New Goal'}</span>
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Goal Basic Information */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span>Goal Details</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal Name *
                </label>
                <input
                  type="text"
                  value={goal.name}
                  onChange={(e) => updateGoalField('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Enter goal name..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Eye className="inline h-4 w-4 mr-1" />
                  Related Vision
                </label>
                <select
                  value={goal.visionTitle}
                  onChange={(e) => updateGoalField('visionTitle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  {visionCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Flag className="inline h-4 w-4 mr-1" />
                  Priority
                </label>
                <select
                  value={goal.priority}
                  onChange={(e) => updateGoalField('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  {priorityOptions.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={goal.startDate}
                  onChange={(e) => updateGoalField('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  End Date
                </label>
                <input
                  type="date"
                  value={goal.endDate}
                  onChange={(e) => updateGoalField('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  Start Time
                </label>
                <input
                  type="time"
                  value={goal.startTime}
                  onChange={(e) => updateGoalField('startTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="inline h-4 w-4 mr-1" />
                  End Time
                </label>
                <input
                  type="time"
                  value={goal.endTime}
                  onChange={(e) => updateGoalField('endTime', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  Budget (Needful Money)
                </label>
                <input
                  type="number"
                  value={goal.budget}
                  onChange={(e) => updateGoalField('budget', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={goal.status}
                  onChange={(e) => updateGoalField('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Image className="inline h-4 w-4 mr-1" />
                  Image URL
                </label>
                <input
                  type="url"
                  value={goal.imageUrl}
                  onChange={(e) => updateGoalField('imageUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline h-4 w-4 mr-1" />
                Goal Description
              </label>
              <textarea
                value={goal.description}
                onChange={(e) => updateGoalField('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 resize-none"
                placeholder="Describe your goal in detail..."
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline h-4 w-4 mr-1" />
                Goal Notes
              </label>
              <textarea
                value={goal.note}
                onChange={(e) => updateGoalField('note', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 resize-none"
                placeholder="Add any additional notes..."
              />
            </div>

            {goal.imageUrl && (
              <div className="mt-4">
                <img 
                  src={goal.imageUrl} 
                  alt="Goal preview" 
                  className="w-full h-48 object-cover rounded-xl shadow-md"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                  }}
                />
              </div>
            )}
          </div>

          {/* Milestones Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                <Target className="h-6 w-6 text-green-600" />
                <span>Milestones ({goal.milestones.length})</span>
              </h3>
              <button
                type="button"
                onClick={addMilestone}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                <Plus className="h-5 w-5" />
                <span>Add Milestone</span>
              </button>
            </div>

            {goal.milestones.length === 0 && (
              <div className="text-center py-8 bg-white rounded-xl border border-green-200">
                <Target className="h-12 w-12 text-green-300 mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-gray-700 mb-2">No Milestones Yet</h4>
                <p className="text-gray-500 mb-4">Break down your goal into achievable milestones</p>
                <button
                  type="button"
                  onClick={addMilestone}
                  className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Your First Milestone</span>
                </button>
              </div>
            )}

            <div className="space-y-6">
              {goal.milestones.map((milestone: any, mIndex: number) => (
                <div key={mIndex} className="bg-white rounded-2xl p-6 border border-green-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                        M{mIndex + 1}
                      </span>
                      <span>Milestone {mIndex + 1}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeMilestone(mIndex)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Remove Milestone"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Milestone Name *
                      </label>
                      <input
                        type="text"
                        value={milestone.name}
                        onChange={(e) => updateMilestone(mIndex, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                        placeholder="Enter milestone name..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={milestone.startDate}
                        onChange={(e) => updateMilestone(mIndex, 'startDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={milestone.endDate}
                        onChange={(e) => updateMilestone(mIndex, 'endDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget
                      </label>
                      <input
                        type="number"
                        value={milestone.budget}
                        onChange={(e) => updateMilestone(mIndex, 'budget', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Milestone Notes
                    </label>
                    <textarea
                      value={milestone.note}
                      onChange={(e) => updateMilestone(mIndex, 'note', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 resize-none"
                      placeholder="Add milestone notes..."
                    />
                  </div>

                  {/* My Word Section */}
                  <div className="mb-4 bg-red-50 rounded-lg p-4 border border-red-200">
                    <h6 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-red-600" />
                      <span>My Word (Integrity)</span>
                    </h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          value={milestone.myWord.text}
                          onChange={(e) => updateMyWord(mIndex, 'text', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                          placeholder="Enter your word/commitment..."
                        />
                      </div>
                      <div>
                        <input
                          type="datetime-local"
                          value={milestone.myWord.dateTime}
                          onChange={(e) => updateMyWord(mIndex, 'dateTime', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={milestone.myWord.completed}
                          onChange={(e) => updateMyWord(mIndex, 'completed', e.target.checked)}
                          className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                        />
                        <span className="text-sm text-gray-700">Completed</span>
                      </label>
                    </div>
                  </div>

                  {/* Tasks Section */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <h6 className="font-semibold text-gray-800 flex items-center space-x-2">
                        <CheckSquare className="h-4 w-4 text-purple-600" />
                        <span>Tasks ({milestone.tasks.length})</span>
                      </h6>
                      <button
                        type="button"
                        onClick={() => addTask(mIndex)}
                        className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Task</span>
                      </button>
                    </div>

                    {milestone.tasks.map((task: any, tIndex: number) => (
                      <div key={tIndex} className="bg-purple-50 rounded-lg p-3 mb-2 border border-purple-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-800 flex items-center space-x-2">
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-bold">
                              T{tIndex + 1}
                            </span>
                            <span>Task {tIndex + 1}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => removeTask(mIndex, tIndex)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                          <div className="md:col-span-2">
                            <input
                              type="text"
                              value={task.name}
                              onChange={(e) => updateTask(mIndex, tIndex, 'name', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 text-gray-900"
                              placeholder="Task name..."
                            />
                          </div>
                          <div>
                            <input
                              type="date"
                              value={task.date}
                              onChange={(e) => updateTask(mIndex, tIndex, 'date', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 text-gray-900"
                            />
                          </div>
                          <div>
                            <input
                              type="time"
                              value={task.time}
                              onChange={(e) => updateTask(mIndex, tIndex, 'time', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 text-gray-900"
                            />
                          </div>
                          <div>
                            <input
                              type="number"
                              value={task.budget}
                              onChange={(e) => updateTask(mIndex, tIndex, 'budget', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 text-gray-900"
                              placeholder="Budget..."
                            />
                          </div>
                          <div>
                            <select
                              value={task.priority}
                              onChange={(e) => updateTask(mIndex, tIndex, 'priority', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 text-gray-900"
                            >
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                          </div>
                        </div>
                        
                        <textarea
                          value={task.note}
                          onChange={(e) => updateTask(mIndex, tIndex, 'note', e.target.value)}
                          rows={1}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 text-gray-900 resize-none mb-2"
                          placeholder="Task notes..."
                        />
                        
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={(e) => updateTask(mIndex, tIndex, 'completed', e.target.checked)}
                            className="w-3 h-3 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                          />
                          <span className="text-xs text-gray-700">Completed</span>
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* To-Do's Section */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h6 className="font-semibold text-gray-800 flex items-center space-x-2">
                        <CheckSquare className="h-4 w-4 text-orange-600" />
                        <span>To-Do's ({milestone.todos.length})</span>
                      </h6>
                      <button
                        type="button"
                        onClick={() => addTodo(mIndex)}
                        className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add To-Do</span>
                      </button>
                    </div>

                    {milestone.todos.map((todo: any, todoIndex: number) => (
                      <div key={todoIndex} className="bg-orange-50 rounded-lg p-3 mb-2 border border-orange-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-800 flex items-center space-x-2">
                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-bold">
                              TD{todoIndex + 1}
                            </span>
                            <span>To-Do {todoIndex + 1}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => removeTodo(mIndex, todoIndex)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                          <div className="md:col-span-2">
                            <input
                              type="text"
                              value={todo.text}
                              onChange={(e) => updateTodo(mIndex, todoIndex, 'text', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900"
                              placeholder="To-do item..."
                            />
                          </div>
                          <div>
                            <input
                              type="date"
                              value={todo.dueDate}
                              onChange={(e) => updateTodo(mIndex, todoIndex, 'dueDate', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900"
                            />
                          </div>
                          <div>
                            <select
                              value={todo.priority}
                              onChange={(e) => updateTodo(mIndex, todoIndex, 'priority', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900"
                            >
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                          </div>
                        </div>
                        
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={(e) => updateTodo(mIndex, todoIndex, 'completed', e.target.checked)}
                            className="w-3 h-3 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <span className="text-xs text-gray-700">Completed</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium touch-manipulation"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg transform hover:scale-105 font-medium touch-manipulation"
            >
              {initialData ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;