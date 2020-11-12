var bodyParser = require('body-parser');
var mongoose = require('mongoose');
//For file upload
var fs = require('fs');
var path = require('path')
var crypto = require('crypto');
var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');

var urlencodedParser = bodyParser.urlencoded({extended: false});

// Mongo URI
const mongoURI = 'mongodb+srv://shanky1947:shanky1947@cluster0.j3d04.mongodb.net/todo?retryWrites=true&w=majority';

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Init gfs
let gfs;

conn.once('open', function(){
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads'); //uploads is a colllection name, set by us
});

// Create storage engine
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload')
    },
    filename: (req, file, cb) => {
        var extension = path.extname(file.originalname);
        var file = path.basename(file.originalname,extension);
        cb(null, file);
    }
});

const upload = multer({ storage: storage });
// const upload = multer({ storage });  //creating a varibale upload and passing the storage engine...used /upload in post request of form...its a middle ware
var imgModel = require('../models/file');

module.exports = function(app){
    // @route GET /
    // @desc Loads main page
    app.get('/submit', function(req, res){
        res.render('submit');
    });
    // @route POST /upload
    // @desc  Uploads file to DB
    app.post('/upload', upload.single('file'), function(req, res){ //"file" hear is the name of file varibale we gave in form
          var obj = {
          filename: req.file.filename,
          img: {
              data: fs.readFileSync(path.join(__dirname + '/upload/' + req.file.filename)),
              contentType: res.file.mimetype;
          }
        }
        imgModel.create(obj, (err, item) => {
          if (err) {
              console.log(err);
          }
          else {
              item.save();
              buffer="";
              var filename = req.file.filename;
              var readStream = gfs.createReadStream({ filename: filename });
              var mywrite = fs.createWriteStream('E:/C/Plagarism/writeMe.txt');
              readStream.on("data", function (chunk) {
                  buffer += chunk;
              });
              readStream.on("end", function () {
                  mywrite.write(buffer);
                  console.log("contents of file:\n\n", buffer);
              });
              res.redirect('/submit');
          }
        });

        // res.json({file: req.file})
    });
};
