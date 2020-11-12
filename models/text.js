var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

var Text=new mongoose.Schema({
    username:String,
    text:String
});

Text.plugin(passportLocalMongoose);

module.exports=mongoose.model("text",Text);
