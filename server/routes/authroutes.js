import express from "express"
import User from "../models/user.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import protect from "../middleware/protect.js"
import cloudinary from "../lib/cloudinary.js"
const router=express.Router()

router.post("/register",async(req,res)=>{
    try{
    const {name,email,password,bio}=req.body

    if(!name||!email||!password||!bio){ return res.status(400).json({message:"provide all filds data"})}

        if(password.length>6){
    //check for already there email
    const userexits= await User.findOne({email})
    if(userexits){return res.status(400).json({message:"emial is already exits"})}
    //hash password
    const salt=await bcrypt.genSalt(10)
    const hashpassword=await bcrypt.hash(password,salt)
    const newUser=await User.create({
        name,email,password:hashpassword,bio
    })
    //token generation
    const token=jwt.sign({id:newUser._id},process.env.JWT_SECRET,{expiresIn:"7d"})
    res.cookie("jwt",token,{maxAge:7*24*60*60*1000,httpOnly:true,sameSite:"Strict",secure:process.env.NODE_ENV!="development"}).status(201).json({success:true,message:"user is register",user:{name,email,userId:newUser._id,bio},secure:process.env.NODE_ENV!="development"})
  }else{
    res.status(400).json({message:"password length is to small"})
  }
    }
    catch(e){
        console.log(e)
        res.status(500).json({message:" server error"})
    }
    
})
router.post("/login",async(req,res)=>{
    try{
        const {email,password}=req.body
        const userExits=await User.findOne({email})
        if(!userExits) return res.status(404).json({message:"user not found"})
            const passtrue=await bcrypt.compare(password,userExits.password)
        if(!passtrue) return res.status(400).json({message:"password is incorrect"})
        
        const token=jwt.sign({id:userExits._id},process.env.JWT_SECRET,{expiresIn:"7d"})
        res.cookie(
            "jwt",token,{maxAge:24*60*7*60*1000,secure:process.env.NODE_ENV!="development",httpOnly:true,sameSite:"Strict"}
        ).json({success:true,message:'succesfully logged in',user:userExits})

    }
    catch(e){
        console.error(e)
        res.status(500).json({message:"server error"})
    }

    

})
router.post('/logout',(req,res)=>{
   try{
    res.cookie("jwt","",{maxAge:0}).json({message:"you are logout successfull"})

   }
   catch(e){
    console.log(e)
    res.status(500).json({message:"server error"})
   }
})
//upadte profile pic

router.put("/update",protect,async (req,res)=>{
    try{
        const {profilePic,name,bio}=req.body

        const id=req.user._id
        let updateduser;
        if(!profilePic){
         updateduser=   await User.findByIdAndUpdate(id,{bio,name},{new:true})

        }
        else{
            const upload=await cloudinary.uploader.upload(profilePic)
            updateduser=await User.findByIdAndUpdate(id,{profilePic:upload.secure_url,bio,name},{new:true})
        }
        res.json({success:true,user:updateduser})
        

       
    }
    catch(e){
        console.log("error in update profile",e)
        res.status(500).json({message:"Internal server error"})

    }
})

router.get("/check",protect,(req,res)=>{
    try{
    res.json({success:true,message:"user is authenthicate","user":req.user})
    }
    catch(e){
        console.error(e)
        res.status(500).json({sucess:false,message:"server error"})
    }
})





export default router 