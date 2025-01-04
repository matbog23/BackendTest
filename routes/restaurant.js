import express from 'express';
import Restaurant from '../models/Restaurant.js';

const router = express.Router();

// Create a new restaurant
router.post('/', async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).send(restaurant);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Read all restaurants
router.get('/', async (req, res) => {
  const { name } = req.query;
  try {
    if (name) {
      const regex = new RegExp(name, 'i'); // Case-insensitive match
      const restaurants = await Restaurant.find({ name: regex });
      return res.status(200).json(restaurants);
    }
    const restaurants = await Restaurant.find(); // Return all restaurants if no query
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Read a single restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).send();
    }
    res.status(200).send(restaurant);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a restaurant by ID
router.patch('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!restaurant) {
      return res.status(404).send();
    }
    res.status(200).send(restaurant);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a restaurant by ID
router.delete('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      return res.status(404).send();
    }
    res.status(200).send(restaurant);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
