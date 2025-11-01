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
  FileText,
  Milestone,
} from 'lucide-react';

interface MyWord {
  text: string;
  dateTime: string;
  completed: boolean;
}

interface Task {
  name: string;
  date: string;
  time: string;
  note: string;
  budget: string;
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
}

interface Todo {
  text: string;
  completed: boolean;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
}

interface Goal {
  name: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  note: string;
  budget: string;
  priority: 'Low' | 'Medium' | 'High';
  status: string;
  tasks: Task[];
  myWord: MyWord;
  todos: Todo[];
}

interface Milestone {
  name: string;
  startDate: string;
  endDate: string;
  budget: string;
  note: string;
  goals: Goal[];
}

interface Vision {
  name: string;
  category: string;
  imageUrl: string;
  note: string;
  startDate: string;
  endDate: string;
  budget: string;
  milestones: Milestone[];
}

interface VisionFormProps {
  onSubmit: (visionData: Vision) => void;
  onCancel: () => void;
  initialData?: Partial<Vision>;
}

const VisionForm: React.FC<VisionFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [vision, setVision] = useState<Vision>({
    name: initialData?.name || '',
    category: initialData?.category || 'Life',
    imageUrl: initialData?.imageUrl || '',
    note: initialData?.note || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    budget: initialData?.budget || '',
    milestones: initialData?.milestones || [],
  });

  const visionCategories = [
    'Life', 'Health', 'Wealth', 'Success', 'Respect', 'Pleasure', 
    'Prosperity', 'Luxurious', 'Habit', 'Spirituality', 'About Life'
  ];

  const addMilestone = () => {
    setVision({
      ...vision,
      milestones: [
        ...vision.milestones,
        { 
          name: '', 
          startDate: '', 
          endDate: '', 
          budget: '',
          note: '',
          goals: [] 
        },
      ],
    });
  };

  const removeMilestone = (mIndex: number) => {
    const updated = { ...vision };
    updated.milestones.splice(mIndex, 1);
    setVision(updated);
  };

  const addGoal = (mIndex: number) => {
    const updated = { ...vision };
    updated.milestones[mIndex].goals.push({
      name: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      note: '',
      budget: '',
      priority: 'Medium',
      status: 'Not Started',
      tasks: [],
      myWord: { text: '', dateTime: '', completed: false },
      todos: [],
    });
    setVision(updated);
  };

  const removeGoal = (mIndex: number, gIndex: number) => {
    const updated = { ...vision };
    updated.milestones[mIndex].goals.splice(gIndex, 1);
    setVision(updated);
  };

  const addTask = (mIndex: number, gIndex: number) => {
    const updated = { ...vision };
    updated.milestones[mIndex].goals[gIndex].tasks.push({
      name: '',
      date: '',
      time: '',
      note: '',
      budget: '',
      priority: 'Medium',
      completed: false,
    });
    setVision(updated);
  };

  const removeTask = (mIndex: number, gIndex: number, tIndex: number) => {
    const updated = { ...vision };
    updated.milestones[mIndex].goals[gIndex].tasks.splice(tIndex, 1);
    setVision(updated);
  };

  const addTodo = (mIndex: number, gIndex: number) => {
    const updated = { ...vision };
    updated.milestones[mIndex].goals[gIndex].todos.push({
      text: '',
      completed: false,
      dueDate: '',
      priority: 'Medium'
    });
    setVision(updated);
  };

  const removeTodo = (mIndex: number, gIndex: number, todoIndex: number) => {
    const updated = { ...vision };
    updated.milestones[mIndex].goals[gIndex].todos.splice(todoIndex, 1);
    setVision(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(vision);
  };

  const updateVisionField = (field: keyof Vision, value: any) => {
    setVision(prev => ({ ...prev, [field]: value }));
  };

  const updateMilestone = (mIndex: number, field: keyof Milestone, value: any) => {
    const updated = { ...vision };
    updated.milestones[mIndex][field] = value;
    setVision(updated);
  };

  const updateGoal = (mIndex: number, gIndex: number, field: keyof Goal, value: any) => {
    const updated = { ...vision };
    updated.milestones[mIndex].goals[gIndex][field] = value;
    setVision(updated);
  };

  const updateTask = (mIndex: number, gIndex: number, tIndex: number, field: keyof Task, value: any) => {
    const updated = { ...vision };
    (updated.milestones[mIndex].goals[gIndex].tasks[tIndex] as any)[field] = value;
    setVision(updated);
  };

  const updateTodo = (mIndex: number, gIndex: number, todoIndex: number, field: keyof Todo, value: any) => {
    const updated = { ...vision };
    (updated.milestones[mIndex].goals[gIndex].todos[todoIndex] as any)[field] = value;
    setVision(updated);
  };

  const updateMyWord = (mIndex: number, gIndex: number, field: keyof MyWord, value: any) => {
    const updated = { ...vision };
    (updated.milestones[mIndex].goals[gIndex].myWord as any)[field] = value;
    setVision(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
            <Target className="h-6 w-6 text-purple-600" />
            <span>{initialData ? 'Edit Vision' : 'Create New Vision'}</span>
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* Vision Basic Information */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-600" />
              <span>Vision Details</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vision Name *
                </label>
                <input
                  type="text"
                  value={vision.name}
                  onChange={(e) => updateVisionField('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                  placeholder="Enter vision name..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={vision.category}
                  onChange={(e) => updateVisionField('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                >
                  {visionCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
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
                  value={vision.startDate}
                  onChange={(e) => updateVisionField('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  End Date
                </label>
                <input
                  type="date"
                  value={vision.endDate}
                  onChange={(e) => updateVisionField('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline h-4 w-4 mr-1" />
                  Budget (Needful Money)
                </label>
                <input
                  type="number"
                  value={vision.budget}
                  onChange={(e) => updateVisionField('budget', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Image className="inline h-4 w-4 mr-1" />
                  Image URL
                </label>
                <input
                  type="url"
                  value={vision.imageUrl}
                  onChange={(e) => updateVisionField('imageUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="inline h-4 w-4 mr-1" />
                Vision Notes
              </label>
              <textarea
                value={vision.note}
                onChange={(e) => updateVisionField('note', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 resize-none"
                placeholder="Describe your vision in detail..."
              />
            </div>

            {vision.imageUrl && (
              <div className="mt-4">
                <img 
                  src={vision.imageUrl} 
                  alt="Vision preview" 
                  className="w-full h-48 object-cover rounded-xl shadow-md"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
                  }}
                />
              </div>
            )}
          </div>

          {/* Milestones Section - FIXED AND ENHANCED */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                <Milestone className="h-6 w-6 text-blue-600" />
                <span>Milestones ({vision.milestones.length})</span>
              </h3>
              <button
                type="button"
                onClick={addMilestone}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              >
                <Plus className="h-5 w-5" />
                <span>Add Milestone</span>
              </button>
            </div>

            {/* Show message when no milestones */}
            {vision.milestones.length === 0 && (
              <div className="text-center py-8 bg-white rounded-xl border border-blue-200">
                <Milestone className="h-12 w-12 text-blue-300 mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-gray-700 mb-2">No Milestones Yet</h4>
                <p className="text-gray-500 mb-4">Break down your vision into achievable milestones</p>
                <button
                  type="button"
                  onClick={addMilestone}
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Your First Milestone</span>
                </button>
              </div>
            )}

            {/* Milestones List */}
            <div className="space-y-6">
              {vision.milestones.map((milestone, mIndex) => (
                <div key={mIndex} className="bg-white rounded-2xl p-6 border border-blue-200 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
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
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Milestone Name *
                      </label>
                      <input
                        type="text"
                        value={milestone.name}
                        onChange={(e) => updateMilestone(mIndex, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        placeholder="Enter milestone name..."
                        required
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        placeholder="0.00"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 resize-none"
                      placeholder="Add milestone notes..."
                    />
                  </div>

                  {/* Goals Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
                        <Target className="h-4 w-4 text-green-600" />
                        <span>Goals ({milestone.goals.length})</span>
                      </h5>
                      <button
                        type="button"
                        onClick={() => addGoal(mIndex)}
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add Goal</span>
                      </button>
                    </div>

                    {milestone.goals.length === 0 && (
                      <div className="text-center py-4 bg-green-50 rounded-lg border border-green-200">
                        <Target className="h-8 w-8 text-green-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">No goals added yet</p>
                        <button
                          type="button"
                          onClick={() => addGoal(mIndex)}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          Add your first goal
                        </button>
                      </div>
                    )}

                    {milestone.goals.map((goal, gIndex) => (
                      <div key={gIndex} className="bg-green-50 rounded-xl p-4 border border-green-200">
                        <div className="flex items-center justify-between mb-3">
                          <h6 className="font-semibold text-gray-800 flex items-center space-x-2">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
                              G{gIndex + 1}
                            </span>
                            <span>Goal {gIndex + 1}</span>
                          </h6>
                          <button
                            type="button"
                            onClick={() => removeGoal(mIndex, gIndex)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Goal Name *
                            </label>
                            <input
                              type="text"
                              value={goal.name}
                              onChange={(e) => updateGoal(mIndex, gIndex, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                              placeholder="Enter goal name..."
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Start Date
                            </label>
                            <input
                              type="date"
                              value={goal.startDate}
                              onChange={(e) => updateGoal(mIndex, gIndex, 'startDate', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              End Date
                            </label>
                            <input
                              type="date"
                              value={goal.endDate}
                              onChange={(e) => updateGoal(mIndex, gIndex, 'endDate', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Start Time
                            </label>
                            <input
                              type="time"
                              value={goal.startTime}
                              onChange={(e) => updateGoal(mIndex, gIndex, 'startTime', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              End Time
                            </label>
                            <input
                              type="time"
                              value={goal.endTime}
                              onChange={(e) => updateGoal(mIndex, gIndex, 'endTime', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Budget
                            </label>
                            <input
                              type="number"
                              value={goal.budget}
                              onChange={(e) => updateGoal(mIndex, gIndex, 'budget', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                              placeholder="0.00"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Priority
                            </label>
                            <select
                              value={goal.priority}
                              onChange={(e) => updateGoal(mIndex, gIndex, 'priority', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                            >
                              <option value="Low">Low</option>
                              <option value="Medium">Medium</option>
                              <option value="High">High</option>
                            </select>
                          </div>
                        </div>

                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Goal Notes
                          </label>
                          <textarea
                            value={goal.note}
                            onChange={(e) => updateGoal(mIndex, gIndex, 'note', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 resize-none"
                            placeholder="Add goal notes..."
                          />
                        </div>

                        {/* My Word Section */}
                        <div className="mb-4 bg-red-50 rounded-lg p-3 border border-red-200">
                          <h6 className="font-semibold text-gray-800 mb-2 flex items-center space-x-2">
                            <Heart className="h-4 w-4 text-red-600" />
                            <span>My Word (Integrity)</span>
                          </h6>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <input
                                type="text"
                                value={goal.myWord.text}
                                onChange={(e) => updateMyWord(mIndex, gIndex, 'text', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                                placeholder="Enter your word/commitment..."
                              />
                            </div>
                            <div>
                              <input
                                type="datetime-local"
                                value={goal.myWord.dateTime}
                                onChange={(e) => updateMyWord(mIndex, gIndex, 'dateTime', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                              />
                            </div>
                          </div>
                          <div className="mt-2">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={goal.myWord.completed}
                                onChange={(e) => updateMyWord(mIndex, gIndex, 'completed', e.target.checked)}
                                className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                              />
                              <span className="text-sm text-gray-700">Completed</span>
                            </label>
                          </div>
                        </div>

                        {/* Tasks Section */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h6 className="font-semibold text-gray-800 flex items-center space-x-2">
                              <CheckSquare className="h-4 w-4 text-purple-600" />
                              <span>Tasks ({goal.tasks.length})</span>
                            </h6>
                            <button
                              type="button"
                              onClick={() => addTask(mIndex, gIndex)}
                              className="flex items-center space-x-1 bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Add Task</span>
                            </button>
                          </div>

                          {goal.tasks.map((task, tIndex) => (
                            <div key={tIndex} className="bg-purple-50 rounded-lg p-3 mb-2 border border-purple-200">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-800">Task {tIndex + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => removeTask(mIndex, gIndex, tIndex)}
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
                                    onChange={(e) => updateTask(mIndex, gIndex, tIndex, 'name', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 text-gray-900"
                                    placeholder="Task name..."
                                  />
                                </div>
                                <div>
                                  <input
                                    type="date"
                                    value={task.date}
                                    onChange={(e) => updateTask(mIndex, gIndex, tIndex, 'date', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 text-gray-900"
                                  />
                                </div>
                                <div>
                                  <input
                                    type="time"
                                    value={task.time}
                                    onChange={(e) => updateTask(mIndex, gIndex, tIndex, 'time', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 text-gray-900"
                                  />
                                </div>
                                <div>
                                  <input
                                    type="number"
                                    value={task.budget}
                                    onChange={(e) => updateTask(mIndex, gIndex, tIndex, 'budget', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 text-gray-900"
                                    placeholder="Budget..."
                                  />
                                </div>
                                <div>
                                  <select
                                    value={task.priority}
                                    onChange={(e) => updateTask(mIndex, gIndex, tIndex, 'priority', e.target.value)}
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
                                onChange={(e) => updateTask(mIndex, gIndex, tIndex, 'note', e.target.value)}
                                rows={1}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 text-gray-900 resize-none mb-2"
                                placeholder="Task notes..."
                              />
                              
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  checked={task.completed}
                                  onChange={(e) => updateTask(mIndex, gIndex, tIndex, 'completed', e.target.checked)}
                                  className="w-3 h-3 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                                />
                                <span className="text-xs text-gray-700">Completed</span>
                              </label>
                            </div>
                          ))}
                        </div>

                        {/* To-Do's Section */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h6 className="font-semibold text-gray-800 flex items-center space-x-2">
                              <CheckSquare className="h-4 w-4 text-orange-600" />
                              <span>To-Do's ({goal.todos.length})</span>
                            </h6>
                            <button
                              type="button"
                              onClick={() => addTodo(mIndex, gIndex)}
                              className="flex items-center space-x-1 bg-orange-600 hover:bg-orange-700 text-white px-2 py-1 rounded text-xs transition-colors"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Add To-Do</span>
                            </button>
                          </div>

                          {goal.todos.map((todo, todoIndex) => (
                            <div key={todoIndex} className="bg-orange-50 rounded-lg p-3 mb-2 border border-orange-200">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-800">To-Do {todoIndex + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => removeTodo(mIndex, gIndex, todoIndex)}
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
                                    onChange={(e) => updateTodo(mIndex, gIndex, todoIndex, 'text', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900"
                                    placeholder="To-do item..."
                                  />
                                </div>
                                <div>
                                  <input
                                    type="date"
                                    value={todo.dueDate}
                                    onChange={(e) => updateTodo(mIndex, gIndex, todoIndex, 'dueDate', e.target.value)}
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-gray-900"
                                  />
                                </div>
                                <div>
                                  <select
                                    value={todo.priority}
                                    onChange={(e) => updateTodo(mIndex, gIndex, todoIndex, 'priority', e.target.value)}
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
                                  onChange={(e) => updateTodo(mIndex, gIndex, todoIndex, 'completed', e.target.checked)}
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
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg transform hover:scale-105 font-medium touch-manipulation"
            >
              {initialData ? 'Update Vision' : 'Create Vision'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisionForm;