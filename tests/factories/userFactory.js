/**
 * Dependencies
 */
const mongoose=require('mongoose');
const User=mongoose.model('User');

//Function export object
let lib={};

//Functionality
lib.createUser=function(){
    return new User({}).save();
};





//Export object
module.exports=lib;