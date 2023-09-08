const mongoose = require('mongoose');
let dbconnect = mongoose.connect("mongodb+srv://sharmatushar2213:ecWTHstUSK6nDlt0@cluster0.wdjntjo.mongodb.net/test").then(()=>{
        console.log("database connected");
}).catch((err)=>{
        console.log(err);
})
module.exports = dbconnect;
