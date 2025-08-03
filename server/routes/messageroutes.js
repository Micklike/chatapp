import express from "express"
import protect from "../middleware/protect.js"
import User from "../models/user.js"
import Message from "../models/message.js"
import cloudinary from "../lib/cloudinary.js"
import {io,userSocketMap} from "../server.js"

const router=express.Router()


  router.get("/users",protect,async(req,res)=>{
    try{
        const users=await User.find({_id:{$ne:req.user._id}}).select("-password")
        //count unsen message
        const unseenmessage={}
        const promises=users.map(async (user)=>{
          const message=await Message.find({senderId:user._id,receiverId:req.user._id,seen:false})
            if(message.length>0){
              unseenmessage[user._id]=message.length
            }
        })

        await Promise.all(promises)
        


        res.json({success:true,message:"user fetch successfull",users:users,unseenmessage})
  

    }
    catch(e){
        console.error(e)
        res.status(500).json({message:"server error"})
    }
  })


  //getspecific friend
  router.get("/messages/:id",protect,async(req,res)=>{
    try{
    const friend=await User.findById(req.params.id)
    if(!friend) return res.status(404).json({message:"user not found"})
    const messages= await Message.find({$or:[{senderId:req.user._id,receiverId:friend._id},{receiverId:req.user._id,senderId:friend._id}]}).sort({createdAt:1})
    await Message.updateMany({senderId:req.params.id,receiverId:req.user._id,seen:false},{seen:true})
    if(messages.length==0) return res.status(200).json({success:true,messages:[]})

        res.json({success:true,messages})
    }catch(e){
        console.error(e)
        res.status(500).json({success:false,message:"server serror"})
    }

  })
//mark as seen
router.put('/markasseen/:id',protect,async(req,res)=>{
  try{
    await Message.findByIdAndUpdate(req.params.id,{seen:true})
return res.json({message:"message are marked as seen"})

  }
  catch(e){
    console.log(e)
    res.status(500).json({message:"server error"})
  }
})




  router.post('/sendmessage/:id',protect,async(req,res)=>{
    try{
      const {text,image}=req.body
      const friend=await User.findById(req.params.id)
          if(!friend) return res.status(404).json({message:"user not found"})
            let imgurl
          if(image){
            imgurl=(await cloudinary.uploader.upload(image)).secure_url
             
          }
          const newmessage=await Message.create({
            senderId:req.user._id,
            receiverId:req.params.id,
            text,image:imgurl,

          })
         //emit the new message to recieiver socket
         const recieversocketid=userSocketMap[req.params.id]
         if(recieversocketid){
          io.to(recieversocketid).emit("newmessage",newmessage)
         }

          res.status(201).json({success:true,message:"message is created",newmessage})

    }
    catch(e){
        console.error(e)
        res.status(500).json({message:"server serror"})
    }
  })




export default router