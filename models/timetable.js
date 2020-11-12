var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var TimetableSchema=new mongoose.Schema({
    username:String,
    name:String,
    monday: {
      eight: {
        subject:String,
        room:String
      },
      nine:{
        subject:String,
        room:String
      },
      ten:{
        subject:String,
        room:String
      },
      ele:{
        subject:String,
        room:String
      }
    },
    tuesday: {
      eight: {
        subject:String,
        room:String
      },
      nine:{
        subject:String,
        room:String
      },
      ten:{
        subject:String,
        room:String
      },
      ele:{
        subject:String,
        room:String
      }
    },
    wednesday: {
      eight: {
        subject:String,
        room:String
      },
      nine:{
        subject:String,
        room:String
      },
      ten:{
        subject:String,
        room:String
      },
      ele:{
        subject:String,
        room:String
      }
    },
    thursday: {
      eight: {
        subject:String,
        room:String
      },
      nine:{
        subject:String,
        room:String
      },
      ten:{
        subject:String,
        room:String
      },
      ele:{
        subject:String,
        room:String
      }
    },
    friday: {
      eight: {
        subject:String,
        room:String
      },
      nine:{
        subject:String,
        room:String
      },
      ten:{
        subject:String,
        room:String
      },
      ele:{
        subject:String,
        room:String
      }
    }
});

TimetableSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("Timetable",TimetableSchema);
