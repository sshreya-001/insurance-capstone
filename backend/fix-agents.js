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

// Fix agents
const fixAgents = async () => {
  try {
    const result = await User.updateMany(
      { role: 'agent' },
      { $set: { isActive: true } }
    );
    console.log('Updated agents:', result.modifiedCount);
    
    const activeAgents = await User.find({ role: 'agent', isActive: true });
    console.log('Active agents now:', activeAgents.length);
  } catch (error) {
    console.error('Error fixing agents:', error);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await fixAgents();
  process.exit(0);
};

main();

