import mongoose from "mongoose";
console.log("jsd")
const userschema= new mongoose.Schema({
    email:{type:String,required:true,unique:true},
    name:{type:String,required:true},
    password:{type:String,required:true,minlength:6},
    bio:{type:String,default:""},
    profilePic:{type:String,default:""}
},{timestamps:true})

const User=await mongoose.model("User",userschema)
export default User