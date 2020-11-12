var urlencodedParser = bodyParser.urlencoded({ extended: false });
var mongoose = require('mongoose');
var passport = require('passport'); //for login authentication
LocalStrategy=require("passport-local"),
passportLocalMongoose=require("passport-local-mongoose"),

// Mongo URI
const mongoURI = 'mongodb+srv://"userid":"password"@cluster0.j3d04.mongodb.net/"database_name"?retryWrites=true&w=majority';
// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

var User = require('../models/user');

module.exports = function(app){
  //For login authentication using passport module of nodejs
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    function isLoggedIn(req,res,next){
      if(req.isAuthenticated()){
          return next();
      }
      res.redirect("/login");
    }
    //Login page
     app.get('/',function(req,res){

      res.render('main',{currentUser:req.user});
    });
    //@route GET / @desc Loads main page
    app.get('/homepage', function(req, res){
        res.render('homepage');
    });
});
