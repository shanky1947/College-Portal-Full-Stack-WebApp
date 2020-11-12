var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var mongoose = require('mongoose');
var passport = require('passport'); //for login authentication
LocalStrategy=require("passport-local");
var passportLocalMongoose=require("passport-local-mongoose");
//For file upload
var fs = require('fs');
var path = require('path')
var crypto = require('crypto');
var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');

// Mongo URI
mongoose.Promise = global.Promise;
mongoose.connect("mongodb+srv://shanky1947:shanky1947@cluster0.j3d04.mongodb.net/todo?retryWrites=true&w=majority", {useUnifiedTopology: true,useNewUrlParser: true});
// Create mongo connection
const mongoURI = "mongodb+srv://shanky1947:shanky1947@cluster0.j3d04.mongodb.net/todo?retryWrites=true&w=majority";
const conn = mongoose.createConnection("mongodb+srv://shanky1947:shanky1947@cluster0.j3d04.mongodb.net/todo?retryWrites=true&w=majority");

// Init gfs
let gfs;
conn.once('open', function(){
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads'); //uploads is a colllection name, set by us
});
// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        // var extension = path.extname(file.originalname);
        // var file = path.basename(file.originalname,extension);
        const filename = buf.toString('hex') + path.extname(file.originalname);
        // const filename = file;
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads' //bucket name should match the collection name
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });  //creating a varibale upload and passing the storage engine...used /upload in post request of form...its a middle ware
const arr=[];

var User = require('../models/user');
var Info = require('../models/info');
var flag = 0;
var Timetable = require('../models/timetable');
var Text = require('../models/text');
// var AdminInfo = require('../models/adminInfo');

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
    //Page before login
     app.get('/',function(req,res){
      res.render('main',{currentUser:req.user});
    });
    //@route GET / @desc Loads main page   //username: req.user.username
    app.get('/home',isLoggedIn,function(req,res){
      Info.find({},function(err,data){
          if(err){
              console.log(err);
          } else{
              res.render("home",{data:data,currentuser:req.user});
          }
      })
    });
    app.get('/thank',isLoggedIn,function(req,res){
        req.logOut();
        res.render("main");
    });
    app.get("/login",function(req,res){
        res.render("login",{currentUser:req.user});
    })
    app.get('/signup',function(req,res){
        res.render('signup');
    });
    app.get('/main',function(req,res){

        res.render('main');
    });
    app.post("/signup",urlencodedParser,function(req,res){
        // req.body.username;
        // req.body.password;
        User.register(new User({username:req.body.username}),req.body.password,function(err,user){
           if(err){
            console.log(err.message);
               return res.render("signup");
           }
           passport.authenticate("local")(req,res,function(){
                res.render("homenew");
               // res.redirect("/main");
           });
        });
    });
    app.get('/thank',isLoggedIn,function(req,res){
        req.logOut();
        res.render("main");
    });
    app.post("/login",urlencodedParser,passport.authenticate("local",{
        successRedirect:"/home",
        failureRedirect:"/"
    }),function(req,res){
    })
    app.get('/enter',function(req,res){
        res.render('enter');
    });
    app.post("/enter",isLoggedIn, urlencodedParser, function(req, res){
      var newInfo = Info({
          username:req.body.username,
          studentinfo:{
            fname: req.body.fname,
            lname:req.body.lname,
            rno:req.body.rno,
            pno:req.body.pno,
            email:req.body.email,
            stream:req.body.stream,
            csem:req.body.csem,
            cgpa:req.body.cgpa
          },
          hdetails: {
            htype:req.body.htype,
            hblock:req.body.hblock,
            mname:req.body.mname,
            mtype:req.body.mtype,
            wincharge:req.body.wincharge,
            cwarden:req.body.cwarden
          },
          deadline: {
            d1:req.body.d1,
            d2:req.body.d2,
            d3:req.body.d3
          }
         });

      //  save the user
        newInfo.save(function(err) {
           if (err) throw err;
           else {
               console.log('User details added');
               res.redirect('/home');
           }
        });
    });
    app.get("/admin_login",function(req,res){
        res.render('admin_login');
    });
    app.post("/admin",urlencodedParser,function(req,res){
        if(req.body.secretcode=='admin'){
            flag=1;
           res.redirect("/admin");
        } else{
            res.redirect("/admin_login")
        }
    })
    app.get("/admin",isAdminLoggedIn,function(req,res){
          res.render('admin');
    });
    function isAdminLoggedIn(req,res,next){
        if(flag===1){
            return next();
        }
        res.redirect("/admin_login");
    }
    app.get('/timetable',isLoggedIn,function(req,res){
      Timetable.find({},function(err,data){
          if(err){
              console.log(err);
          } else{
              res.render("timetable",{data:data,currentuser:req.user});
          }
      })
    });
    app.get('/coursepage',isLoggedIn,function(req,res){
        res.render('coursepage');
    });
    app.get('/about',isLoggedIn,function(req,res){
        res.render('about');
    });
    app.get('/submit',isLoggedIn,function(req,res){
        res.render('submit');
    });
    app.get('/teacher',isLoggedIn,function(req,res){
        res.render('teacherreview');
    });
    app.get('/attendance',isLoggedIn,function(req,res){
        res.render('attendance');
    });
    app.get('/teacherinfo',isLoggedIn,function(req,res){
        res.render('teacherinfo');
    });
    app.get('/teacherreviewsearch',isLoggedIn,function(req,res){
        res.render('teacherreviewsearch');
    });


    // @route POST /upload @desc  Uploads file to DB
    app.post('/upload',isLoggedIn, upload.single('file'), function(req, res){ //"file" hear is the name of file varibale we gave in form
        buffer="";
        var filename = req.file.filename;
        var readStream = gfs.createReadStream({ filename: filename });
        // var mywrite = fs.createWriteStream('E:/C/Plagarism/writeMe.txt');
        readStream.on("data", function (chunk) {
            buffer += chunk;
        });
        readStream.on("end", function () {
            arr.push(buffer);
        });
        res.redirect('/submit');
        // res.json({file: req.file})
    });
    app.post('/getdata', urlencodedParser, isAdminLoggedIn, function(req, res) {
        const pythonfile = ("E:/C/IWP_School_Portal/controllers/check.py"); // Path of python script folder
        const pythoninter = "C:/ProgramData/Anaconda3/envs/myenv/python.exe";
        var spawn = require("child_process").spawn;
        var process = spawn(pythoninter,[pythonfile, arr[0], arr[1]]);

        process.stdout.on('data', function(data) {
          data=data.toString();
            res.render('output', {data: data});
        } )
        // res.json({name: "name"})
    });
};
