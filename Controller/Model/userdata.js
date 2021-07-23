const mongoose=require("mongoose")
const userdata=new mongoose.Schema({
    userName:{
        type:String
    },
    userEmail:{
        type:String
    }

})
const userdetails=mongoose.model("userDetails",userdata)
module.exports=userdetails;