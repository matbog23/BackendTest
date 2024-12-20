import express from 'express';
import Review from '../models/Review.js';
import Restaurant from '../models/Restaurant.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { user, rating, comment } = req.body;

    // Check if the restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Check if the user has already reviewed this restaurant
    const existingReview = await Review.findOne({ restaurant: restaurantId, user });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this restaurant" });
    }

    // Create and save the review
    const review = new Review({
      restaurant: restaurantId,
      user,
      rating,
      comment,
    });
    await review.save();

    res.status(201).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(400).json({ error: error.message });
  }
});


// Get all reviews for a specific restaurant
router.get('/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Validate the restaurantId to ensure it's a valid ObjectId
    console.log("Checking restaurantId:", restaurantId); // Log the restaurantId

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      console.error("Invalid restaurant ID:", restaurantId); // Log invalid IDs
      return res.status(400).json({ error: 'Invalid restaurant ID' });
    }

    // Fetch reviews linked to the restaurant
    const reviews = await Review.find({ restaurant: restaurantId })
      .populate('user', 'username') // Optionally populate user info
      .exec();

    console.log("Found reviews:", reviews); // Log the found reviews
    res.status(200).json(reviews); // Return the reviews
  } catch (error) {
    console.error("Error fetching reviews:", error); // Log the error in more detail
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});





router.get('/:restaurantId/:reviewId', async (req, res) => {
  try {
    const { restaurantId, reviewId } = req.params;

    // Find the review and ensure it belongs to the specified restaurant
    const review = await Review.findOne({ _id: reviewId, restaurant: restaurantId }).populate('user', 'username');
    if (!review) {
      return res.status(404).json({ message: "Review not found for this restaurant" });
    }

    res.status(200).json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ error: error.message });
  }
});


router.patch('/:restaurantId/:reviewId', async (req, res) => {
  try {
    const { restaurantId, reviewId } = req.params;
    const { user, ...updateFields } = req.body;

    // Ensure the review exists and belongs to the user
    const review = await Review.findOne({ _id: reviewId, restaurant: restaurantId, user });
    if (!review) {
      return res.status(404).json({ message: "Review not found or unauthorized" });
    }

    // Update the review
    Object.assign(review, updateFields);
    await review.save();

    res.status(200).json(review);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(400).json({ error: error.message });
  }
});


router.delete('/:restaurantId/:reviewId', async (req, res) => {
  try {
    const { restaurantId, reviewId } = req.params;
    const { user } = req.body; // Assuming user info is passed in the request

    // Ensure the review exists and belongs to the user
    const review = await Review.findOneAndDelete({ _id: reviewId, restaurant: restaurantId, user });
    if (!review) {
      return res.status(404).json({ message: "Review not found or unauthorized" });
    }

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ error: error.message });
  }
});


export default router;
