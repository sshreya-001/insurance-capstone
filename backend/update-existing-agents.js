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

// Update existing agents
const updateExistingAgents = async () => {
  try {
    // Update all agents to have isActive: true
    const result = await User.updateMany(
      { role: 'agent' },
      { $set: { isActive: true } }
    );
    console.log('Updated agents:', result.modifiedCount);
    
    // Verify the update
    const activeAgents = await User.find({ role: 'agent', isActive: true });
    console.log('Active agents now:', activeAgents.length);
    console.log('Agent details:', activeAgents.map(a => ({ 
      name: a.name, 
      email: a.email, 
      isActive: a.isActive 
    })));
  } catch (error) {
    console.error('Error updating agents:', error);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await updateExistingAgents();
  process.exit(0);
};

main();

