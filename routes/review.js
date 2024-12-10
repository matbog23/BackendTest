import express from 'express';
import Review from '../models/Review.js';
import Restaurant from '../models/Restaurant.js';

const router = express.Router();

// Create a new review for a restaurant
router.post('/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { user, rating, comment } = req.body;

    // Check if the restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).send({ message: "Restaurant not found" });
    }

    // Create and save the review
    const review = new Review({
      restaurant: restaurantId,
      user,
      rating,
      comment
    });
    await review.save();
    
    res.status(201).send(review);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all reviews for a specific restaurant
router.get('/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Fetch all reviews for the specified restaurant
    const reviews = await Review.find({ restaurant: restaurantId }).populate('user', 'username');
    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a single review by ID
router.get('/:restaurantId/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Find the review by ID
    const review = await Review.findById(reviewId).populate('user', 'username');
    if (!review) {
      return res.status(404).send({ message: "Review not found" });
    }

    res.status(200).send(review);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Update a review by ID
router.patch('/:restaurantId/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Update the review
    const review = await Review.findByIdAndUpdate(reviewId, req.body, { new: true, runValidators: true });
    if (!review) {
      return res.status(404).send({ message: "Review not found" });
    }

    res.status(200).send(review);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a review by ID
router.delete('/:restaurantId/:reviewId', async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Find and delete the review
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
      return res.status(404).send({ message: "Review not found" });
    }

    res.status(200).send({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
