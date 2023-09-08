const mongoose = require('mongoose');
const dbconnect = require("./connect");

let categorySchema = mongoose.Schema({
    name:String,
    gender:String,
    src:String
});

let category = mongoose.model('categories',categorySchema);

module.exports = category;