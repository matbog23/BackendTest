import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// Create a new message
router.post('/', async (req, res) => {
  try {
    const message = new Message(req.body);
    await message.save();
    res.status(201).send(message);
  } catch (error) {
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