const express=require("express")
const app=express();
const { Mongoose } = require("mongoose")
const router=express.Router()
const database=require('./Model/userSignUp')
const usercontent=require("./Model/userdata")
const jwt=require("jsonwebtoken")
  
router.get("/",(req,res)=>{
    res.send("Server running");
})

router.post("/register",express.json(), (req,res)=>{
   
    if(req.body.password==req.body.confirmPassword)
 
  {
    userData=req.body
    userData.token="";
    var db=new database(userData);
    database.findOne({userEmail:req.body.userEmail}).then((result)=>{
      
        if(result==null)
{
    db.save().then((success)=>{
       
        res.status(201).send(db)

    }).catch((err)=>{
        res.status(400).send(err);
    })
    udata={
        "userName":req.body.userName,
        "userEmail":req.body.userEmail
    }
    var user=new usercontent(udata)
    user.save().then((val)=>{
        console.log(val+"=user")
    }).catch((err)=>{
        console.log(err+"=error user")
    })

}  

else{

    if(result.userEmail==req.body.userEmail){
        res.status(400).send("user already exist")
    }
}
    })
    
   
  }
   else{
       res.status(400).send("password not matched")
   }
})



router.post("/signin",express.json(),(req,res)=>{
    console.log(req.body)
    database.findOne({userEmail:req.body.userEmail}).then((result)=>{
        // console.log(result)
        if(result==null){
            res.status(400).send("Invalid Email")
        }
        else{
            if(result.password==req.body.password){
                var token=    jwt.sign({_id:result._id},result._id.toString())
    console.log(token)
    database.updateOne({_id:result._id},{$set:{token:token}}).then((val)=>{
        // console.log(val);
    })
   

    res.status(200).send(token)
   
            }
            else{
                res.status(400).send("wrong password")
            }
        }
    }).catch((err)=>{
        console.log(err)
    })

}) 


router.get("/user",express.json(), (req,res)=>{
  database.findOne({token:req.headers.authorization}).then((result)=>{
      if(result==null){
          res.status(404).send("invalid token")
      }
      else{
          
        usercontent.findOne({userEmail:result.userEmail}).then((val)=>{
            res.status(200).send(val)
        }).catch((err)=>{console.log(err)})
          
      }
  })

})
module.exports =router;