/**
 * Routing facility for image uploads
 */
//Dependencies
let AWS=require('aws-sdk');
let keys=require('../config/keys');
let uuid=require('uuid').v1;
let requireLogin=require('../middlewares/requireLogin');
//Functionality
const s3= new AWS.S3({
    credentials:{
        accessKeyId:keys.accessKeyID,
        secretAccessKey:keys.SecretAccessKey
    }, 
    region:'ap-south-1'
});


module.exports=app=>{
    app.get('/api/upload', requireLogin, (req, res)=>{
        
        let key=`${req.user.id}/${uuid()}.jpeg`;
        
        s3.getSignedUrl('putObject', {
            Bucket: 'imagology',
            ContentType:'image/jpeg',
            Key: key
        }, (err, url)=>{
            if(err){
                console.log(err);
            }
            else{
                res.send({key, url});
            }

        });
        
    });
};