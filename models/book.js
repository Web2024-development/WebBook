const mongoose = require('mongoose');
const mongooseSequence = require('mongoose-sequence');
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
    
}, 
// {
//     _id: false
// }
)

book.plugin(mongooseSequence(mongoose), {inc_field: 'bookId'})
const collection = new mongoose.model("book", book)
module.exports = collection