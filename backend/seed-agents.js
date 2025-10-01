import mongoose from 'mongoose';
import User from './src/models/User.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/insurance-capstone');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Create test agents
const createTestAgents = async () => {
  try {
    // Check if agents already exist
    const existingAgents = await User.find({ role: 'agent' });
    if (existingAgents.length > 0) {
      console.log('Agents already exist:', existingAgents.length);
      return;
    }

    // Create test agents
    const agents = [
      {
        name: 'John Smith',
        email: 'john@agent.com',
        passwordHash: 'password123', // In production, hash this
        role: 'agent',
        isActive: true
      },
      {
        name: 'Jane Doe',
        email: 'jane@agent.com',
        passwordHash: 'password123',
        role: 'agent',
        isActive: true
      },
      {
        name: 'Mike Johnson',
        email: 'mike@agent.com',
        passwordHash: 'password123',
        role: 'agent',
        isActive: true
      }
    ];

    const createdAgents = await User.insertMany(agents);
    console.log('Created agents:', createdAgents.length);
    console.log('Agent emails:', createdAgents.map(a => a.email));
  } catch (error) {
    console.error('Error creating agents:', error);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await createTestAgents();
  process.exit(0);
};

main();

