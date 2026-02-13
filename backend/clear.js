const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Recipe = require('./models/Recipe');
const Comment = require('./models/Comment');
const Rating = require('./models/Rating');

const clearDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear all data
    await Recipe.deleteMany({});
    await Comment.deleteMany({});
    await Rating.deleteMany({});
    await User.deleteMany({});

    console.log('All sample data cleared successfully!');
    console.log('Database is now empty and ready for real users.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

clearDatabase();