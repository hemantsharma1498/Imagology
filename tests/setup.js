//Set up requirements for the testing suite: MongoDB, etc

/**
 * Dependencies
 */
const User=require('../models/User');
const keys=require('../config/keys');
const mongoose=require('mongoose');


jest.setTimeout(15000);

//Connect MongoDB
mongoose.Promise=global.Promise;
mongoose.connect(keys.mongoURI, {useMongoClient: true});