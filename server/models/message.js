import mongoose from "mongoose";

const messageschema=new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    }
    ,receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text:{
        type:String
    },
    image:{ 
        type:String
    },
    seen:{type:Boolean,default:false}
},{timestamps:true})

const Message=mongoose.model("Message",messageschema)
export default Message