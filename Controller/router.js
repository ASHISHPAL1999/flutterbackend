const express=require("express")
const app=express();
const { Mongoose, isValidObjectId } = require("mongoose")
const router=express.Router()
const database=require('./Model/userSignUp')
const usercontent=require("./Model/userdata")
const jwt=require("jsonwebtoken")
var validator = require('validator');
var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
  
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
        console.log("result="+result)
      
        if(result==null)
{
    console.log("user not exist block")
    db.save().then((success)=>{
       
        res.status(201).send({"_id":db._id,"userName":db.userName,"userEmail":db.userEmail
    })

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
            

           if(val==null){
               res.status(404).send("user not found")
           }
           else{
            res.status(200).send(val)
           }
        }).catch((err)=>{console.log(err)})
          
      }
  })

})

router.put("/user",express.json(),(req,res)=>{
console.log(req.headers)
console.log(req.body)

    if(req.headers.authorization==null){

        res.status(400).send("Invalid token")
        
    }
    else{
        if(validator.isEmail(req.body.userEmail)){
           
            database.findOne({token:req.headers.authorization}).then((result)=>{
                var email=result.userEmail
                database.findOne({token:req.headers.authorization}).then((result)=>{
                    if(result==null){
                        res.status(404).send("Invalid token")
                    }
                    else{
                        database.updateOne({token:req.headers.authorization},{$set:{userName:req.body.userName,userEmail:req.body.userEmail}}).then((val)=>{
                            usercontent.updateOne({userEmail:email},{$set:{userName:req.body.userName,userEmail:req.body.userEmail}}).then((result)=>{
                                res.send("updation done both places");
                            }).catch((err)=>{res.send("server error 1")})
                    
                            
                        }).catch((err)=>{res.send("server error 2")})
                    }
                }).catch((err)=>{res.send("server error 3")})
                
            }).catch((err)=>{res.send("server error 4")})
        }
        else{
            res.status(400).send("invalid email format")
        }

    }
})

router.delete("/user",express.json(), (req,res)=>{
    database.findOne({token:req.headers.authorization}).then((result)=>{
        if(result==null){
            res.status(404).send("invalid token or user not exist")
        }
        else{
            
          usercontent.deleteOne({userEmail:result.userEmail}).then((val)=>{
              res.status(200).send("user deleted successfully")
          }).catch((err)=>{console.log(err)})
            
        }
    })
  
  })

module.exports =router;