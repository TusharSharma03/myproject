const dbconnect = require("./connect");
let mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = mongoose.Schema({
        fname :String,
        lname : String,
        email : String,
        phoneNo : Number,
        password : String,
        profilepic:{
                type:String,
                default:null
        },
        address:String
})

userSchema.pre("save",async function(){
        try {
                this.password= await bcrypt.hash(this.password,10);     
        } catch (error) {
           console.log(error);     
        }   
})
const newuser=mongoose.model("newUser",userSchema);

module.exports = newuser;