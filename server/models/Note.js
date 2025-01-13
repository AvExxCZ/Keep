const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters']
    },
    pin: {
        type: Boolean,
        default: false
    },
    tags: {
        type: [String],
        default: []
    },
    color: {
        type: String,
        default: '#ffffff'
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true,
    }
})

module.exports = mongoose.model('Note', noteSchema)