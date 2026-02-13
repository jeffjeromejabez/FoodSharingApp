const mongoose = require('mongoose');
const Recipe = require('./models/Recipe');
require('dotenv').config();

const deleteAllRecipes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    const result = await Recipe.deleteMany({});
    console.log(`Deleted ${result.deletedCount} recipes`);

    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error deleting recipes:', error);
  }
};

deleteAllRecipes();
