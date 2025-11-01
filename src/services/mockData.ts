// Mock data for development when server is not available

export const mockVisions = [
  {
    _id: '1',
    name: 'Health & Wellness',
    description: 'Achieve optimal physical and mental health through consistent habits',
    category: 'Health',
    imageUrl: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=400',
    progress: 75,
    status: 'In Progress',
    priority: 'High',
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString(), // Jan 1 of current year
    endDate: new Date(new Date().getFullYear(), 11, 31).toISOString(), // Dec 31 of current year
    budget: '5000',
    note: 'Focus on daily exercise and nutrition',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    _id: '2',
    name: 'Financial Freedom',
    description: 'Build wealth and achieve financial independence',
    category: 'Wealth',
    imageUrl: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=400',
    progress: 60,
    status: 'In Progress',
    priority: 'High',
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString(), // Jan 1 of current year
    endDate: new Date(new Date().getFullYear(), 11, 31).toISOString(), // Dec 31 of current year
    budget: '10000',
    note: 'Save and invest consistently',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    _id: '3',
    name: 'Career Growth',
    description: 'Advance in my career and achieve professional excellence',
    category: 'Success',
    imageUrl: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400',
    progress: 80,
    status: 'In Progress',
    priority: 'Medium',
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString(), // Jan 1 of current year
    endDate: new Date(new Date().getFullYear(), 11, 31).toISOString(), // Dec 31 of current year
    budget: '2000',
    note: 'Focus on skill development and networking',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  }
];

export const mockGoals = [
  {
    _id: '1',
    name: 'Complete 30-day fitness challenge',
    description: 'Follow a structured workout plan for 30 consecutive days',
    visionTitle: 'Health',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(), // 1st of current month
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(), // Last day of current month
    startTime: '06:00',
    endTime: '07:00',
    budget: '500',
    priority: 'High',
    status: 'In Progress',
    progress: 50,
    imageUrl: '',
    note: 'Morning workouts preferred',
    completed: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    _id: '2',
    name: 'Save $10,000 for emergency fund',
    description: 'Build a financial safety net',
    visionTitle: 'Wealth',
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString(), // Jan 1 of current year
    endDate: new Date(new Date().getFullYear(), 11, 31).toISOString(), // Dec 31 of current year
    startTime: '',
    endTime: '',
    budget: '10000',
    priority: 'High',
    status: 'In Progress',
    progress: 30,
    imageUrl: '',
    note: 'Set up automatic transfers',
    completed: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    _id: '3',
    name: 'Complete online certification',
    description: 'Finish the advanced web development course',
    visionTitle: 'Success',
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 15).toISOString(), // 15th of current month
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 2, 15).toISOString(), // 15th of month after next
    startTime: '19:00',
    endTime: '21:00',
    budget: '1000',
    priority: 'Medium',
    status: 'Not Started',
    progress: 0,
    imageUrl: '',
    note: 'Study 3 times per week',
    completed: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  }
];

export const mockTasks = [
  {
    _id: '1',
    particulars: 'Morning workout routine',
    date: new Date().toISOString(), // Today
    time: '06:30',
    priority: 'High',
    status: 'Pending',
    completed: false,
    repeat: 'Daily',
    customRepeatDays: null,
    reminder: true,
    reminderTime: '06:15',
    category: 'Health',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    _id: '2',
    particulars: 'Review monthly budget',
    date: new Date().toISOString(), // Today
    time: '19:00',
    priority: 'Medium',
    status: 'Pending',
    completed: false,
    repeat: 'Monthly',
    customRepeatDays: null,
    reminder: true,
    reminderTime: '18:45',
    category: 'Finance',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    _id: '3',
    particulars: 'Study for certification',
    date: new Date().toISOString(), // Today
    time: '20:00',
    priority: 'Medium',
    status: 'Pending',
    completed: false,
    repeat: 'Weekly',
    customRepeatDays: null,
    reminder: false,
    reminderTime: '',
    category: 'Career',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  }
];

export const mockTodos = [
  {
    _id: '1',
    text: 'Buy new running shoes',
    completed: false,
    category: 'Health',
    dueDate: new Date().toISOString(), // Today
    priority: 'Medium',
    reminder: false,
    reminderTime: '',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    _id: '2',
    text: 'Schedule annual health checkup',
    completed: true,
    category: 'Health',
    dueDate: new Date().toISOString(), // Today
    priority: 'High',
    reminder: true,
    reminderTime: '09:00',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    _id: '3',
    text: 'Research investment options',
    completed: false,
    category: 'Finance',
    dueDate: new Date().toISOString(), // Today
    priority: 'Medium',
    reminder: false,
    reminderTime: '',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  }
];

export const mockWords = [
  {
    _id: '1',
    word: 'Discipline',
    commitment: 'I commit to maintaining consistent healthy habits every day',
    date: new Date().toISOString(), // Today
    timeframe: 'Daily',
    completed: false,
    completedAt: null,
    reflection: 'Working on building better habits one day at a time',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    _id: '2',
    word: 'Abundance',
    commitment: 'I attract wealth and financial opportunities into my life',
    date: new Date().toISOString(), // Today
    timeframe: 'Weekly',
    completed: false,
    completedAt: null,
    reflection: 'Focusing on abundance mindset rather than scarcity',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    _id: '3',
    word: 'Excellence',
    commitment: 'I strive for excellence in everything I do professionally',
    date: new Date().toISOString(), // Today
    timeframe: 'Monthly',
    completed: false,
    completedAt: null,
    reflection: 'Pushing myself to deliver high-quality work consistently',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  }
];

export const mockAffirmations = [
  {
    _id: '1',
    text: 'I am healthy, strong, and full of energy',
    imageUrl: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Health',
    isActive: true,
    timesViewed: 15,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    _id: '2',
    text: 'Money flows to me easily and abundantly',
    imageUrl: 'https://images.pexels.com/photos/259027/pexels-photo-259027.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Wealth',
    isActive: true,
    timesViewed: 12,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    _id: '3',
    text: 'I am worthy of success and recognition',
    imageUrl: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Success',
    isActive: true,
    timesViewed: 8,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  }
];

export const mockDiamondPeople = [
  {
    _id: '1',
    name: 'John Smith',
    mobile: '+1 (555) 123-4567',
    address: '123 Main St, New York, NY 10001',
    headlines: 'Senior Software Engineer at Tech Corp',
    notes: 'Met at tech conference. Interested in AI and machine learning. Great networking contact for future opportunities.',
    category: 'Professional',
    rating: 5,
    lastContact: '2024-01-14',
    createdAt: '2024-01-10T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    _id: '2',
    name: 'Sarah Johnson',
    mobile: '+1 (555) 987-6543',
    address: '456 Oak Ave, Los Angeles, CA 90210',
    headlines: 'Marketing Director & Business Coach',
    notes: 'Amazing mentor who helped me with career guidance. Always available for advice and has great industry insights.',
    category: 'Mentor',
    rating: 5,
    lastContact: '2024-01-15',
    createdAt: '2024-01-12T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  },
  {
    _id: '3',
    name: 'Michael Chen',
    mobile: '+1 (555) 456-7890',
    address: '789 Pine St, San Francisco, CA 94102',
    headlines: 'Entrepreneur & Startup Founder',
    notes: 'Successful entrepreneur with multiple exits. Great for business advice and potential investment opportunities.',
    category: 'Business',
    rating: 4,
    lastContact: null,
    createdAt: '2024-01-13T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z'
  }
];