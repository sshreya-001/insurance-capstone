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

// Debug agents
const debugAgents = async () => {
  try {
    console.log('=== Debugging Agents ===');
    
    // Check all users
    const allUsers = await User.find({});
    console.log('Total users:', allUsers.length);
    
    // Check agents specifically
    const agents = await User.find({ role: 'agent' });
    console.log('Agents found:', agents.length);
    console.log('Agent details:', agents.map(a => ({ 
      name: a.name, 
      email: a.email, 
      role: a.role, 
      isActive: a.isActive 
    })));
    
    // Check active agents
    const activeAgents = await User.find({ role: 'agent', isActive: true });
    console.log('Active agents:', activeAgents.length);
    
    // Test the exact query from the API
    const apiQuery = await User.find({ 
      role: "agent", 
      isActive: true 
    }).select('_id name email');
    console.log('API query result:', apiQuery.length);
    console.log('API query details:', apiQuery);
    
  } catch (error) {
    console.error('Error debugging agents:', error);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await debugAgents();
  process.exit(0);
};

main();

