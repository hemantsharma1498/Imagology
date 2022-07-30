/**
 * Dependencies
 */
const Buffer=require('safe-buffer').Buffer;
const Keygrip=require('keygrip');
const keys=require('../../config/keys');
const keygrip=new Keygrip([keys.cookieKey]);    

//Factory object to export
let lib={};

lib.createSession=function(user){
    const sessionObject={
        passport:{
            user: user._id.toString()
        }
    }

    const session=Buffer.from(JSON.stringify(sessionObject)).toString('base64');

    const sig=keygrip.sign('session='+session);

    return {session, sig};
}


//Export object
module.exports=lib;