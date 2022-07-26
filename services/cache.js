/**
 * Dependencies
 */
const e = require('express');
const mongoose=require('mongoose');
const { nextTick } = require('process');
const redis=require('redis');
const util=require('util');


//Set up cache server
const client=redis.createClient({
    socket:{
        host:'redis://127.0.0.1',
        port:6379
    }
});

//Promisify client.get for async ops
client.hget=util.promisify(client.hget);

//Override mongoose .exec function
const exec=mongoose.Query.prototype.exec;

//Create cache function 
mongoose.Query.prototype.cache=function(options={}){
    this.useCache=true;
   
     
    this.topLevelKey=JSON.stringify(options.key||'');
   
    return this;
}


//Logic for function
mongoose.Query.prototype.exec=async function(){
    console.log('Happening')

    //Check if query is to be cached
    if(!this.useCache){
        return exec.apply(this, arguments);
    }
    

    //Get query from the MongoDB query object
    let queryKey=JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));

    

    //Check if the query exists in Redis and return if exists
    let cacheValue=await client.hget(this.topLevelKey, queryKey);


    if(cacheValue){
        const data=JSON.parse(cacheValue);
        
        if(Array.isArray(data)){
            data.map((element)=>this.model(element));

        }else{
            return new this.model(data);
        }
    }    
    //Otherwise execute query and store inside Redis
    const result=await exec.apply(this, arguments);

    client.hset(this.topLevelKey, queryKey, JSON.stringify(result));

    return result;
};

//Functionality to clear hashKey for a Query
module.exports={
    clearHash(topLevelKey){
        
        client.del(topLevelKey.toString(), (error, result)=>{
            if(!error){
                console.log('Clear hash succesful');
            }else{
                console.log('Clear hash unsuccesful');
            }
        });
    
        
    }
};