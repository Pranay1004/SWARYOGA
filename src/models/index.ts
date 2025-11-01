// Mongoose models file
// Note: Models are defined here for reference but the app uses REST API with Express backend

// import mongoose from 'mongoose';

/*
// Vision Schema
const visionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, default: 'Life' },
  imageUrl: { type: String },
  progress: { type: Number, default: 0 },
  status: { type: String, default: 'Not Started' },
  priority: { type: String, default: 'Medium' },
  startDate: { type: Date },
  endDate: { type: Date },
  budget: { type: String },
  note: { type: String },
  milestones: [{
    name: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    budget: { type: String },
    note: { type: String },
    goals: [{
      name: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      startTime: { type: String },
      endTime: { type: String },
      note: { type: String },
      budget: { type: String },
      priority: { type: String },
      status: { type: String },
      tasks: [{
        name: { type: String },
        date: { type: Date },
        time: { type: String },
        note: { type: String },
        budget: { type: String },
        priority: { type: String },
        completed: { type: Boolean }
      }],
      myWord: {
        text: { type: String },
        dateTime: { type: Date },
        completed: { type: Boolean }
      },
      todos: [{
        text: { type: String },
        completed: { type: Boolean },
        dueDate: { type: Date },
        priority: { type: String }
      }]
    }]
  }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Goal Schema
const goalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  visionTitle: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  startTime: { type: String },
  endTime: { type: String },
  budget: { type: String },
  priority: { type: String, default: 'Medium' },
  status: { type: String, default: 'Not Started' },
  progress: { type: Number, default: 0 },
  imageUrl: { type: String },
  note: { type: String },
  completed: { type: Boolean, default: false },
  visionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vision' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Task Schema
const taskSchema = new mongoose.Schema({
  particulars: { type: String, required: true },
  date: { type: Date },
  time: { type: String },
  priority: { type: String, default: 'Medium' },
  status: { type: String, default: 'Pending' },
  completed: { type: Boolean, default: false },
  repeat: { type: String, default: 'None' },
  customRepeatDays: { type: Number },
  reminder: { type: Boolean, default: false },
  reminderTime: { type: String },
  category: { type: String },
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' },
  visionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vision' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Todo Schema
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
  category: { type: String, default: 'Personal' },
  dueDate: { type: Date },
  priority: { type: String, default: 'Medium' },
  reminder: { type: Boolean, default: false },
  reminderTime: { type: String },
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' },
  visionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vision' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Word Schema
const wordSchema = new mongoose.Schema({
  word: { type: String, required: true },
  commitment: { type: String, required: true },
  date: { type: Date },
  timeframe: { type: String, default: 'Daily' },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  reflection: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Affirmation Schema
const affirmationSchema = new mongoose.Schema({
  text: { type: String, required: true },
  imageUrl: { type: String },
  category: { type: String, default: 'Health' },
  isActive: { type: Boolean, default: true },
  timesViewed: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Diamond People Schema
const diamondPersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String },
  address: { type: String },
  headlines: { type: String },
  notes: { type: String },
  category: { type: String, default: 'Professional' },
  rating: { type: Number, default: 5 },
  lastContact: { type: Date },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Create models
const Vision = mongoose.model('Vision', visionSchema);
const Goal = mongoose.model('Goal', goalSchema);
const Task = mongoose.model('Task', taskSchema);
const Todo = mongoose.model('Todo', todoSchema);
const Word = mongoose.model('Word', wordSchema);
const Affirmation = mongoose.model('Affirmation', affirmationSchema);
const DiamondPerson = mongoose.model('DiamondPerson', diamondPersonSchema);

// Exported type definitions for reference
/*
export {
  Vision,
  Goal,
  Task,
  Todo,
  Word,
  Affirmation,
};
*/