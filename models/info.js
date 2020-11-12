var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var InfoSchema=new mongoose.Schema({
    username:String,
    studentinfo: {
      fname:String,
      lname:String,
      rno:String,
      pno:Number,
      email:String,
      stream:String,
      csem:Number,
      cgpa:Number
    },
    hdetails: {
      htype:String,
      hblock:String,
      mname:String,
      mtype:String,
      wincharge:String,
      cwarden:String
    },
    deadline: {
      d1:String,
      d2:String,
      d3:String
    }
});

InfoSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("Info",InfoSchema);
