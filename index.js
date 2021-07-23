const express=require("express")
const router = require("./Controller/router")
const app=express()
require('dotenv').config()
const route=require('./Controller/router')
const dbconnect=require('./Controller/dbconnect')

const host="localhost"
 
const port=process.env.PORT || 2000
app.use(router);

app.listen(port,()=>{console.log(`app running at address http://${host}:${port}`)});