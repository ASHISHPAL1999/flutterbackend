const e = require('express');
const mongoose=require('mongoose');
const validator=require("validator")


var userRegistration=mongoose.Schema({
    
    userName:{
        type:String,
        require:true   
    },

    userEmail:{
        type:String,
        require:true ,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email format")
            }
        }
    },
   
    password:{
        type:String,
        require:true  ,
        minlength: 8
    },
    confirmPassword:{
        type:String,
        require:true ,  
        minlength:8
    },
   
        token:{
            type:String,
            
        }
   
})

// userRegistration.method.generateToken=async function(){
//     var token=    jwt.sign({_id:result._id},result._id.toString())
//     console.log(token)
//     this.tokens=this.tokens.concat({token:token})

//     res.status(200).send(token)
   
// }
const User=new mongoose.model('UserSignUp',userRegistration)
module.exports=User;