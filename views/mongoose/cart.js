const mongoose = require('mongoose');
const dbconnect = require('./connect');
const productSchema = mongoose.Schema({
    name:String,
    price:String,
    src:String,
    username:String,
    quantity:{
        type:String,
        default:"1"
    }
})

const cartProduct = mongoose.model("cartProduct",productSchema);
module.exports = cartProduct;
