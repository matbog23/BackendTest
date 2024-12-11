import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        coordinates: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true }
        }
    },
    cuisine: { type: String, required: true },  // e.g., 'Italian', 'Mexican', etc.
    tags: { type: [String], default: [] }, // New field to store tags
    createdAt: { type: Date, default: Date.now },
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
