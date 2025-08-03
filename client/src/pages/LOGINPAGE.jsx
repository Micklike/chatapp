import { useState } from "react";
import logo_big from "../assets/logo_big.svg"
import arrow_icon from "../assets/arrow_icon.png"
import input from "daisyui/components/input";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const LOGINPAGE = () => {
    const [currState,setcurrState]=useState("Sign up")
    const [fullName,setFullName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [bio,setBio]=useState("")
    const [agree,setagree]=useState(false)
    const [isDataSubmitted,setIsDataSubmitted]=useState(false)
    const {login}=useContext(AuthContext)
    function onSubmitHandler(e){
        e.preventDefault()

        if(currState=="Sign up"&& !isDataSubmitted){
            setIsDataSubmitted(true)
            return;
        } 
        if(agree==true) login(currState==="Sign up"?"Register":"Login",{name:fullName,email,password,bio})
        else toast.error("First Agree to Term's And Condit...")

    }
    return (
        <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
        {/* left */}
        <img src={logo_big} className="w-[min(30vw,250px)]" alt="" />
            {/* right */}
        <form onSubmit={onSubmitHandler} className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg">
            <h2 className="font-medium text-2xl flex justify-between items-center">{currState}
                {isDataSubmitted &&<img onClick={()=>setIsDataSubmitted(false)}  src={arrow_icon} alt="" className="w-5 cursor-pointer" />}
            </h2>
            {currState==="Sign up"&&!isDataSubmitted&&<input value={fullName} onChange={(e)=>setFullName(e.target.value)} type="text" className="p-2 border border-gray-500 rounded-md focus:outline-none" placeholder="Full Name"  required />}

            {!isDataSubmitted&&(
                <>
                <input onChange={(e)=>setEmail(e.target.value)} value={email} type="Email" placeholder="Email Address" required className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                <input onChange={(e)=>setPassword(e.target.value)} value={password} type="password" placeholder="Password" required className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
              

                </>
            )}

            {
                currState==="Sign up"&& isDataSubmitted&&(
                    <textarea  rows={4} className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="provide a short bio..." value={bio} onChange={(e)=>setBio(e.target.value)} required></textarea>
                )
            }
            <button type="submit" className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer">
                {currState=="Sign up"?"Create Account":"Login Now"}
            </button>
            <div className="flex items-center pag-2 text-sm text-gray-500">
                <input value={agree} onChange={()=>setagree(!agree)} type="checkbox"/>
                <p>Agree to the terms of use & privacy policy.</p>
            </div>
            <div className="flex flex-col gap-2">
                {currState=="Sign up"?(<p className="text-sm text-gray-600">Already have an account?<span onClick={()=>{setcurrState('Login');setIsDataSubmitted(false)}} className="font-medium text-violet-500 cursor-pointer">Login here</span></p>):(<p className="text-sm text-gray-600">Create an account<span onClick={()=>setcurrState("Sign up")} className="font-medium text-violet-500 cursor-pointer">Click here</span></p>)}
            </div>



        
        </form>
        </div>
    );
}

export default LOGINPAGE;
