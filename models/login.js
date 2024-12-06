const mongoose = require('mongoose');
const SignUpSchema = new mongoose.Schema({
    name:{
        type: String
    },
    password:{
        type: String
    }
})
const collection = new mongoose.model("Collection1", SignUpSchema)
module.exports = collection