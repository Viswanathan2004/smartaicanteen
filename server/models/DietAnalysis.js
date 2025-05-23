import mongoose from 'mongoose';

const dietAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalCalories: {
    type: Number,
    required: true
  },
  totalProtein: {
    type: Number,
    required: true
  },
  totalCarbs: {
    type: Number,
    required: true
  },
  totalFats: {
    type: Number,
    required: true
  },
  aiRecommendation: {
    type: String
  }
}, { timestamps: true });

const DietAnalysis = mongoose.model('DietAnalysis', dietAnalysisSchema);

export default DietAnalysis;