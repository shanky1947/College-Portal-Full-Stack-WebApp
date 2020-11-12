var express = require('express');
var todoController = require('./controllers/todoControllerNew.js');
var cookieParser = require('cookie-parser');
LocalStrategy=require("passport-local");
passportLocalMongoose=require("passport-local-mongoose");

var app = express();
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));
app.use(cookieParser());
app.use(require("express-session")({
    secret:"Love hates fear",
    resave:false,
    saveUninitialized:false
 }));



todoController(app);

app.listen(3000);
console.log("You are listening to port 3000");
