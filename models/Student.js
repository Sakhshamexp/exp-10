const mongoose = require('mongoose');

/**
 * Student Schema
 * Defines the structure for student documents in MongoDB
 */
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  course: {
    type: String,
    required: [true, 'Course is required'],
    trim: true
  }
}, {
  timestamps: true
});

// Export the Student model
module.exports = mongoose.model('Student', studentSchema);