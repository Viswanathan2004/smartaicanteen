import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isHealthy: {
    type: Boolean,
    default: false
  },
  calories: {
    type: Number
  },
  protein: {
    type: Number
  },
  carbs: {
    type: Number
  },
  fats: {
    type: Number
  },
  rating: {
    type: Number,
    default: 45
  }
}, { timestamps: true });

 const FoodItem = mongoose.model('FoodItem', foodItemSchema);


export default  FoodItem ;