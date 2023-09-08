const dbconnect = require('./connect');
let  mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name:String,
    price:String,
    src:String,
    description:String,
    category:String,
    type:String,
    gender:String,
    stock:String
})

const products = mongoose.model("product",productSchema);

module.exports = products;