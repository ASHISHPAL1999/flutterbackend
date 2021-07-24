const express=require("express")
const router = require("./Controller/router")
const app=express()
require('dotenv').config()
const cors=require("cors")
const route=require('./Controller/router')
const dbconnect=require('./Controller/dbconnect')

const host="localhost"
 app.use(cors());
const port=process.env.PORT || 2000
app.use(router);

app.listen(port,()=>{console.log(`app running at address http://${host}:${port}`)});