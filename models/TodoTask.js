const mongoose = require('mongoose');

// Create database schema for tasks, by sending back the content (i.e. what is in the task) and the timestap that it was posted.
const todoTaskSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('TodoTask',todoTaskSchema);