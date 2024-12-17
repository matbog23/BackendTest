import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    restaurant: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Restaurant', 
        required: [true, 'Restaurant is required'],
        index: true,  // Index for faster lookups
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: [true, 'User is required'], 
        index: true,  // Index for user-specific queries
    },
    rating: { 
        type: Number, 
        required: [true, 'Rating is required'], 
        min: [1, 'Rating must be at least 1'], 
        max: [5, 'Rating cannot exceed 5'] 
    },
    comment: { 
        type: String, 
        required: [true, 'Comment is required'],
        maxlength: [500, 'Comment cannot exceed 500 characters'], // Optional length limit
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
});

// Optional: compound index for restaurant-user pairs to prevent duplicate reviews
reviewSchema.index({ restaurant: 1, user: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
