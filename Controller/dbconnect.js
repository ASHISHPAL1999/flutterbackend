const express=require("express")
const mongoose=require("mongoose")
require('dotenv').config()
const MONGOURL="mongodb+srv://Ashish:Mango133@698@cluster0.qpupi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
module.exports =mongoose.connect(MONGOURL,{ useNewUrlParser: true,useUnifiedTopology: true  },(error,sucess)=>{
    if(sucess){
        console.log("DB connected")
    }
    else{
        console.log("connection failed"+error)
    }

})
