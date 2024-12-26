const mongoose = require('mongoose');
const mongooseSequence = require('mongoose-sequence');
const commentSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'Collection1', required: true},
    content: {type: String, required: true},
    date: {type: Date, default: Date.now}
})
const book = new mongoose.Schema({
    name:{
        type: String
    },
    type: {
        type: String
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    file: {
        type: String
    },
    status: {
        type: String, 
        enum: ['Completed', 'In progress'],
        default: 'Completed',
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    comments: [commentSchema]
    
}, 

)

book.plugin(mongooseSequence(mongoose), {inc_field: 'bookId'})
const collection = new mongoose.model("book", book)
module.exports = collection