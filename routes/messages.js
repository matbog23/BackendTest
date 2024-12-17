import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// Create a new message
router.post('/', async (req, res) => {
  try {
    const { text, sender, restaurant } = req.body;

    if (!restaurant) {
      return res.status(400).send({ error: 'Restaurant ID is required' });
    }

    const message = new Message({ text, sender, restaurant });
    await message.save();

    res.status(201).send(message);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(400).send(error);
  }
});


// Read all messages
router.get('/', async (req, res) => {
  try {
    const messages = await Message.find().populate('sender', 'username email').populate('recipients', 'username email');
    res.status(200).send(messages);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Read a single message by ID
router.get('/:id', async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).send();
    }
    res.status(200).send(message);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get messages by restaurant ID
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const messages = await Message.find({ restaurant: req.params.restaurantId })
      .populate('sender', 'username')
      .sort({ createdAt: -1 }); // Sort by newest
    res.status(200).send(messages);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a message by ID
router.patch('/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!message) {
      return res.status(404).send();
    }
    res.status(200).send(message);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a message by ID
router.delete('/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).send();
    }
    res.status(200).send(message);
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;