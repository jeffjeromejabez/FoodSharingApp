const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Recipe = require('./models/Recipe');
const Comment = require('./models/Comment');
const Rating = require('./models/Rating');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Recipe.deleteMany({});
    await Comment.deleteMany({});
    await Rating.deleteMany({});

    // Create sample users
    const users = await User.create([
      {
        name: 'John Chef',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 12)
      },
      {
        name: 'Sarah Baker',
        email: 'sarah@example.com',
        password: await bcrypt.hash('password123', 12)
      },
      {
        name: 'Mike Cook',
        email: 'mike@example.com',
        password: await bcrypt.hash('password123', 12)
      }
    ]);

    // Create sample recipes
    const recipes = await Recipe.create([
      {
        title: 'Classic Pancakes',
        description: 'Fluffy and delicious pancakes perfect for breakfast',
        ingredients: ['2 cups flour', '2 eggs', '1 cup milk', '2 tbsp sugar', '1 tsp baking powder', '1/2 tsp salt', '2 tbsp melted butter'],
        steps: ['Mix dry ingredients in a bowl', 'Whisk eggs and milk in another bowl', 'Combine wet and dry ingredients', 'Heat pan and cook pancakes for 2-3 minutes each side'],
        category: 'Breakfast',
        cookingTime: 20,
        author: users[0]._id,
        averageRating: 4.5,
        totalRatings: 12
      },
      {
        title: 'Spaghetti Carbonara',
        description: 'Creamy Italian pasta dish with eggs, cheese, and pancetta',
        ingredients: ['400g spaghetti', '200g pancetta', '4 eggs', '100g parmesan cheese', 'Black pepper', 'Salt'],
        steps: ['Cook spaghetti according to package instructions', 'Fry pancetta until crispy', 'Beat eggs with cheese and pepper', 'Mix hot pasta with pancetta', 'Add egg mixture and toss quickly'],
        category: 'Dinner',
        cookingTime: 25,
        author: users[1]._id,
        averageRating: 4.8,
        totalRatings: 18
      },
      {
        title: 'Chocolate Chip Cookies',
        description: 'Soft and chewy chocolate chip cookies that everyone loves',
        ingredients: ['2 cups flour', '1 cup butter', '3/4 cup brown sugar', '1/2 cup white sugar', '2 eggs', '1 tsp vanilla', '1 tsp baking soda', '1 cup chocolate chips'],
        steps: ['Preheat oven to 375°F', 'Cream butter and sugars', 'Add eggs and vanilla', 'Mix in flour and baking soda', 'Fold in chocolate chips', 'Bake for 9-11 minutes'],
        category: 'Dessert',
        cookingTime: 30,
        author: users[0]._id,
        averageRating: 4.7,
        totalRatings: 25
      },
      {
        title: 'Caesar Salad',
        description: 'Fresh and crispy Caesar salad with homemade dressing',
        ingredients: ['1 head romaine lettuce', '1/2 cup parmesan cheese', '1/4 cup olive oil', '2 tbsp lemon juice', '2 cloves garlic', '1 tsp worcestershire sauce', 'Croutons'],
        steps: ['Wash and chop romaine lettuce', 'Make dressing with oil, lemon, garlic, and worcestershire', 'Toss lettuce with dressing', 'Top with parmesan and croutons'],
        category: 'Lunch',
        cookingTime: 15,
        author: users[2]._id,
        averageRating: 4.2,
        totalRatings: 8
      },
      {
        title: 'Beef Tacos',
        description: 'Spicy ground beef tacos with fresh toppings',
        ingredients: ['1 lb ground beef', '8 taco shells', '1 onion', '2 cloves garlic', '1 tbsp chili powder', '1 tsp cumin', 'Lettuce', 'Tomatoes', 'Cheese', 'Sour cream'],
        steps: ['Brown ground beef with onion and garlic', 'Add spices and cook 5 minutes', 'Warm taco shells', 'Fill shells with beef', 'Top with lettuce, tomatoes, cheese, and sour cream'],
        category: 'Dinner',
        cookingTime: 20,
        author: users[1]._id,
        averageRating: 4.6,
        totalRatings: 15
      },
      {
        title: 'Fruit Smoothie',
        description: 'Healthy and refreshing mixed fruit smoothie',
        ingredients: ['1 banana', '1 cup mixed berries', '1 cup yogurt', '1/2 cup orange juice', '1 tbsp honey', 'Ice cubes'],
        steps: ['Add all ingredients to blender', 'Blend until smooth', 'Add ice if needed', 'Pour into glasses and serve'],
        category: 'Beverage',
        cookingTime: 5,
        author: users[2]._id,
        averageRating: 4.3,
        totalRatings: 10
      },
      {
        title: 'Grilled Cheese Sandwich',
        description: 'Perfect crispy grilled cheese sandwich',
        ingredients: ['4 slices bread', '4 slices cheese', '2 tbsp butter'],
        steps: ['Butter one side of each bread slice', 'Place cheese between bread, butter side out', 'Heat pan over medium heat', 'Cook 2-3 minutes per side until golden'],
        category: 'Lunch',
        cookingTime: 10,
        author: users[0]._id,
        averageRating: 4.1,
        totalRatings: 6
      },
      {
        title: 'Banana Bread',
        description: 'Moist and delicious homemade banana bread',
        ingredients: ['3 ripe bananas', '1/3 cup melted butter', '3/4 cup sugar', '1 egg', '1 tsp vanilla', '1 tsp baking soda', '1 1/2 cups flour', 'Pinch of salt'],
        steps: ['Preheat oven to 350°F', 'Mash bananas in large bowl', 'Mix in butter, sugar, egg, and vanilla', 'Add baking soda and salt', 'Mix in flour', 'Bake 60-65 minutes'],
        category: 'Dessert',
        cookingTime: 75,
        author: users[1]._id,
        averageRating: 4.4,
        totalRatings: 20
      },
      {
        title: 'Trail Mix',
        description: 'Healthy snack mix with nuts, dried fruit, and chocolate',
        ingredients: ['1 cup almonds', '1 cup cashews', '1/2 cup raisins', '1/2 cup dried cranberries', '1/4 cup chocolate chips'],
        steps: ['Mix all ingredients in a large bowl', 'Store in airtight container', 'Enjoy as needed'],
        category: 'Snack',
        cookingTime: 2,
        author: users[2]._id,
        averageRating: 4.0,
        totalRatings: 5
      },
      {
        title: 'French Toast',
        description: 'Classic French toast with cinnamon and vanilla',
        ingredients: ['4 slices thick bread', '3 eggs', '1/4 cup milk', '1 tsp vanilla', '1/2 tsp cinnamon', 'Butter for cooking', 'Maple syrup'],
        steps: ['Beat eggs, milk, vanilla, and cinnamon', 'Dip bread slices in mixture', 'Cook in buttered pan 2-3 minutes per side', 'Serve with maple syrup'],
        category: 'Breakfast',
        cookingTime: 15,
        author: users[0]._id,
        averageRating: 4.5,
        totalRatings: 14
      }
    ]);

    // Create sample comments
    await Comment.create([
      {
        content: 'These pancakes are amazing! My family loved them.',
        author: users[1]._id,
        recipe: recipes[0]._id
      },
      {
        content: 'Perfect carbonara recipe. Authentic and delicious!',
        author: users[2]._id,
        recipe: recipes[1]._id
      },
      {
        content: 'Best chocolate chip cookies ever. Will make again!',
        author: users[1]._id,
        recipe: recipes[2]._id
      },
      {
        content: 'Great salad for lunch. Fresh and tasty.',
        author: users[0]._id,
        recipe: recipes[3]._id
      },
      {
        content: 'Kids love these tacos. Easy to make too.',
        author: users[2]._id,
        recipe: recipes[4]._id
      }
    ]);

    // Create sample ratings
    await Rating.create([
      { rating: 5, author: users[1]._id, recipe: recipes[0]._id },
      { rating: 4, author: users[2]._id, recipe: recipes[0]._id },
      { rating: 5, author: users[0]._id, recipe: recipes[1]._id },
      { rating: 5, author: users[2]._id, recipe: recipes[1]._id },
      { rating: 4, author: users[1]._id, recipe: recipes[2]._id },
      { rating: 5, author: users[2]._id, recipe: recipes[2]._id },
      { rating: 4, author: users[0]._id, recipe: recipes[3]._id },
      { rating: 5, author: users[1]._id, recipe: recipes[4]._id },
      { rating: 4, author: users[0]._id, recipe: recipes[5]._id }
    ]);

    console.log('Database seeded successfully!');
    console.log(`Created ${users.length} users`);
    console.log(`Created ${recipes.length} recipes`);
    console.log('Sample login credentials:');
    console.log('Email: john@example.com, Password: password123');
    console.log('Email: sarah@example.com, Password: password123');
    console.log('Email: mike@example.com, Password: password123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();