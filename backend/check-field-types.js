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

// Check field types
const checkFieldTypes = async () => {
  try {
    const agents = await User.find({ role: 'agent' });
    console.log('Agent field types:');
    agents.forEach((agent, index) => {
      console.log(`Agent ${index + 1}:`);
      console.log(`  isActive: ${agent.isActive} (type: ${typeof agent.isActive})`);
      console.log(`  isActive === true: ${agent.isActive === true}`);
      console.log(`  isActive === 'true': ${agent.isActive === 'true'}`);
      console.log(`  JSON: ${JSON.stringify(agent.toObject())}`);
    });
  } catch (error) {
    console.error('Error checking field types:', error);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await checkFieldTypes();
  process.exit(0);
};

main();

