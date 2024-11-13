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
  try {
    const restaurants = await Restaurant.find();
    res.status(200).send(restaurants);
  } catch (error) {
    res.status(500).send(error);
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
