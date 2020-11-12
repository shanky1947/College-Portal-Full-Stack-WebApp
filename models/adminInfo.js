var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var AdminInfoSchema=new mongoose.Schema({
    username:String,
    studentinfo: {
      fname:String,
      lname:String,
      fid:String,
      pno:Number,
      email:String,
      department:String,
      position:Number,
    },
    hdetails: {
      hno:String,
      locality:String,
      area:String,
      pincode:String,
      city:String,
      state:String
    },
    deadline: {
      d1:String,
      d2:String,
      d3:String
    }
});

AdminInfoSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("adminInfo",AdminInfoSchema);
