import jwt from "jsonwebtoken"
export const generateToken=async(userId)=>{
    const token=jwt.sign({userid},process.env.JWT_SECRET)

}