const mongoose = require('mongoose');

const weeklyPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    weekStartDate: {
      type: Date,
      required: true
    },
    weekEndDate: {
      type: Date,
      required: true
    },
    subjects: {
      type: [String],
      default: []
    },
    goals: {
      type: [String],
      default: []
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
      }
    ]
  },
  {
    timestamps: true
  }
);

// Index for faster queries
weeklyPlanSchema.index({ userId: 1, weekStartDate: 1 });

module.exports = mongoose.model('WeeklyPlan', weeklyPlanSchema);
