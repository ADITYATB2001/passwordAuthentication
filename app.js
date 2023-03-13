//jshint esversion:6
require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const ejs=require("ejs");
const encrypt=require("mongoose-encryption");


const app=express();


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine','ejs');

mongoose.connect("mongodb://127.0.0.1:27017/userDB").then(function(){console.log("connected successfully")}).catch(function(err){console.log(err)});

const userSchema=new mongoose.Schema({
    username:String,
    password:String
});



userSchema.plugin(encrypt,{secret:process.env.secret,encryptedFields:["password"]});

const User=mongoose.model("user",userSchema);


app.get("/",function(req,res){
    res.render("home");
});


app.get("/register",function(req,res){
    res.render("register");
});


app.get("/login",function(req,res){
    res.render("login");
});


app.post("/register",function(req,res){

    const newUser=new User({
        username:req.body.username,
        password:req.body.password
    });

    newUser.save().then(function(){
        console.log("saved");
        res.render("secrets");
    })
    .catch(function(err){
        console.log(err);
    });
});


app.post("/login",function(req,res){
    User.findOne({username:req.body.username}).then(function(found){
        if(found.password===req.body.password){
            res.render("secrets");
        }
    })
    .catch(function(err){
        console.log(err);
    });
});





app.listen(3000,function(){

    console.log("server running wwith port 3000");
});













