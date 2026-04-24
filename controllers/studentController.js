const Student = require('../models/Student');

/**
 * @desc Create a new student
 * @route POST /api/students
 * @access Public
 */
const createStudent = async (req, res) => {
  try {
    const { name, email, course } = req.body;

    // Check if student already exists with this email
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        error: 'Student with this email already exists'
      });
    }

    const student = await Student.create({ name, email, course });

    res.status(201).json({
      success: true,
      data: student
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
    throw error;
  }
};

/**
 * @desc Get all students
 * @route GET /api/students
 * @access Public
 */
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    throw error;
  }
};

/**
 * @desc Get a single student by ID
 * @route GET /api/students/:id
 * @access Public
 */
const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format'
      });
    }

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    throw error;
  }
};

/**
 * @desc Update a student
 * @route PUT /api/students/:id
 * @access Public
 */
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, course } = req.body;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format'
      });
    }

    // Check if student exists
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== student.email) {
      const existingStudent = await Student.findOne({ email });
      if (existingStudent) {
        return res.status(400).json({
          success: false,
          error: 'Email already in use by another student'
        });
      }
    }

    // Update the student
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, email, course },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedStudent
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }
    throw error;
  }
};

/**
 * @desc Delete a student
 * @route DELETE /api/students/:id
 * @access Public
 */
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format'
      });
    }

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }

    await Student.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Record Deleted Successfully'
    });
  } catch (error) {
    throw error;
  }
};

// Import mongoose for ObjectId validation
const mongoose = require('mongoose');

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
};