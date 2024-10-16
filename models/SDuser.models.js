const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({

    institute_type: {
        type: String,
        required: true
    },
    medium: {
        type: String,
        required: true
    },
    education_board: {
        type: String,
        required: true
    },
    class_category: {
        type: String,
        required: false,
        default: ''
    },
    standards: {
        type: String,
        required: false,
        default: ''
    },
    subjects: {
        type: String,
        required: false,
        default: ''
    }
});


module.exports = mongoose.model('User', userSchema);