import jwt from"jsonwebtoken"
import User from "../models/user.js"

const protect=async(req,res,next)=>{
    try{
        //token check
        const token=req.cookies?.jwt
        if(!token) return res.status(401).json({message:"token not prvieded"})
            const decoded=jwt.verify(token,process.env.JWT_SECRET)
            const currUser=await User.findById(decoded.id).select("-password")
        if(!currUser) return res.status(401 ).json({message:"user not founc"})


        req.user=currUser



    next()
}
    catch(e){
        console.error(e)
        res.status(401).json({message:"server error"})
    }
}
export default protect