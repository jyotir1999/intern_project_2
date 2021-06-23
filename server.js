//jshint esversion:6
const { response } = require("express");
const express = require("express");
const app = express();
app.use('/static',express.static('public'));
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));


app.get("/",function(request,response){
    // response.send(__dirname+"/index.html");
  response.sendFile(__dirname+"/index.html");
});
app.post("/",function(request,response){
    console.log(response.body);
    
});
app.listen(3000,function(){
    console.log("Server Started on port 3000")
});