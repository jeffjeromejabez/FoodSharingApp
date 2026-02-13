# FoodstaGram

A modern Recipe Sharing Application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- **User Authentication**: Register, login, logout with JWT
- **Recipe Management**: Create, edit, delete, and view recipes
- **Recipe Discovery**: Search, filter by category, sort by rating/date
- **Ratings & Comments**: Rate recipes (1-5 stars) and add comments
- **User Profile**: View personal recipes and profile information
- **Image Upload**: Upload recipe images using multer
- **Modern UI/UX**: Food-themed design with warm colors and smooth animations

## Tech Stack

**Frontend:**
- React.js with Vite
- React Router DOM
- Axios for API calls
- Custom CSS with food-themed styling
- Context API for state management

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- multer for file uploads

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your configuration:
```
MONGODB_URI=mongodb://localhost:27017/recipe-app
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on http://localhost:5173

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Recipes
- `GET /api/recipes` - Get all recipes (with search/filter)
- `GET /api/recipes/:id` - Get single recipe
- `POST /api/recipes` - Create recipe (protected)
- `PUT /api/recipes/:id` - Update recipe (protected)
- `DELETE /api/recipes/:id` - Delete recipe (protected)
- `GET /api/recipes/my-recipes` - Get user's recipes (protected)

### Comments
- `GET /api/comments/:recipeId` - Get recipe comments
- `POST /api/comments/:recipeId` - Add comment (protected)
- `DELETE /api/comments/:id` - Delete comment (protected)

### Ratings
- `POST /api/ratings/:recipeId` - Rate recipe (protected)
- `GET /api/ratings/:recipeId` - Get user's rating (protected)

## Database Schema

### User
- name, email, password (hashed)

### Recipe
- title, description, ingredients[], steps[], category, cookingTime, image, author, averageRating, totalRatings

### Comment
- content, author, recipe

### Rating
- rating (1-5), author, recipe

## Usage

1. Register a new account or login
2. Browse recipes on the home page
3. Use search and filters to find specific recipes
4. Click on a recipe to view details, rate, and comment
5. Create new recipes using the "Create Recipe" button
6. Manage your recipes from the profile page
7. Edit or delete your own recipes

## Project Structure

```
/backend
  /models          # Database schemas
  /controllers     # Business logic
  /routes          # API routes
  /middleware      # Auth & error handling
  /uploads         # Recipe images
  server.js        # Main server file

/frontend
  /src
    /components    # Reusable components
    /pages         # Page components
    /context       # Auth context
    /api           # API service
    App.jsx        # Main app component
    main.jsx       # Entry point
```

This application follows clean architecture principles with minimal, functional code that directly serves the core features.