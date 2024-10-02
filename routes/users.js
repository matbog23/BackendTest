import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Create a new User
router.post('/', async (req, res) => {
  try {
    const User = new User(req.body);
    await User.save();
    res.status(201).send(User);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Read all Users
router.get('/', async (req, res) => {
  try {
    const Users = await User.find();
    res.status(200).send(Users);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Read a single User by ID
router.get('/:id', async (req, res) => {
  try {
    const User = await User.findById(req.params.id);
    if (!User) {
      return res.status(404).send();
    }
    res.status(200).send(User);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a User by ID
router.patch('/:id', async (req, res) => {
  try {
    const User = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!User) {
      return res.status(404).send();
    }
    res.status(200).send(User);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a User by ID
router.delete('/:id', async (req, res) => {
  try {
    const User = await User.findByIdAndDelete(req.params.id);
    if (!User) {
      return res.status(404).send();
    }
    res.status(200).send(User);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;