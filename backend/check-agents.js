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

// Check agents
const checkAgents = async () => {
  try {
    const allUsers = await User.find({});
    console.log('All users:', allUsers.length);
    
    const agents = await User.find({ role: 'agent' });
    console.log('Agents found:', agents.length);
    console.log('Agent details:', agents.map(a => ({ name: a.name, email: a.email, role: a.role })));
    
    const activeAgents = await User.find({ role: 'agent', isActive: true });
    console.log('Active agents:', activeAgents.length);
  } catch (error) {
    console.error('Error checking agents:', error);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await checkAgents();
  process.exit(0);
};

main();

