import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  foodItemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodItem',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'completed'],
    default: 'pending',
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  items: [orderItemSchema],
  estimatedReadyTime: {
    type: Date
  }
}, { timestamps: true });

 const Order = mongoose.model('Order', orderSchema);
 const OrderItem = mongoose.model('OrderItem', orderItemSchema);
 export default {Order,OrderItem};