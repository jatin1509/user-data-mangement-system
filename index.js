const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://jatingupta:150902@cluster0.qyysfnj.mongodb.net/usermodel?retryWrites=true&w=majority");

const express = require("express");

const app =  express();

app.listen(3000,function(){
    console.log("server is running");
})

// for user_routes
const userRoute = require('./Routes/userRoute');
app.use('/',userRoute);