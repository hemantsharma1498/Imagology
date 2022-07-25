/**
 * Dependencies
 */

const {clearHash}=require('../services/cache');


//Clear hash middleware
module.exports= async function(req, res, next){
    //Wait for new Post to be created
    await next();

    clearHash(req.user.id);
}