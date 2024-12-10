const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 5000;
const JWT_SECRET = "recipeKey";

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/recipe_manager')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));


const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const User = mongoose.model('User', UserSchema);
const Recipe = mongoose.model('Recipe', RecipeSchema);

// Authentication Routes
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: 'User already exists' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, JWT_SECRET);
  res.json({ token });
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Unauthorized' });
    req.userId = decoded.id;
    next();
  });
};

// Recipe Routes
app.get('/api/recipes', verifyToken, async (req, res) => {
  const recipes = await Recipe.find({ creator: req.userId });
  res.json(recipes);
});

app.post('/api/recipes', verifyToken, async (req, res) => {
  const { title, description, ingredients, instructions } = req.body;
  try {
    const recipe = await Recipe.create({
      title,
      description,
      ingredients,
      instructions,
      creator: req.userId,
    });
    res.status(201).json(recipe);
  } catch (error) {
    res.status(400).json({ error: 'Error creating recipe' });
  }
});

app.get('/api/recipes/:id', verifyToken, async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe || recipe.creator.toString() !== req.userId)
    return res.status(404).json({ error: 'Recipe not found' });
  res.json(recipe);
});

app.put('/api/recipes/:id', verifyToken, async (req, res) => {
  const { title, description, ingredients, instructions } = req.body;
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe || recipe.creator.toString() !== req.userId)
    return res.status(404).json({ error: 'Recipe not found' });

  recipe.title = title;
  recipe.description = description;
  recipe.ingredients = ingredients;
  recipe.instructions = instructions;
  await recipe.save();
  res.json(recipe);
});

app.delete('/api/recipes/:id', verifyToken, async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe || recipe.creator.toString() !== req.userId)
    return res.status(404).json({ error: 'Recipe not found' });

  await recipe.delete();
  res.json({ message: 'Recipe deleted' });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));