import React, { useEffect, useState } from 'react';
import logo from "../assets/logo.png"
import menu_icon  from "../assets/menu_icon.png"
import { useNavigate } from 'react-router';
import search_icon from "../assets/search_icon.png"
import { userDummyData } from '../assets/assets';

import avatar_icon from "../assets/avatar_icon.png"
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { chatContext } from '../../context/chatContext';
const Sidebar = () => {

//         messages,users,selectedUser,getUsers,setmessages,sendmessage,setSelectedUser,unseenmessages,setunseenmessages
    const [inputtext,setinputtext]=useState("")
    const {getUsers,users,selectedUser,setSelectedUser,unseenmessages,setunseenmessages}= useContext(chatContext)
    
    
    const navigate=useNavigate()
    const {logout,onlineusers}=useContext(AuthContext)
    async function handlelogout(){
        await logout()
        navigate("/login")

    }
    const filteruser=inputtext? users.filter((user)=>user.name.toLowerCase().includes(inputtext.toLowerCase())):users
    console.log(filteruser,"k")
    useEffect(()=>{
        getUsers()
    },[onlineusers])
    return (
        <div className={`bg-[#8185b2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser?"max-md:hidden":""}`}>
        <div className='pb-5'>
            <div className='flex justify-between items-center'>
                <img src={logo} className='max-w-40' alt="logo" />
                <div className='relative py-2 group '>
                    <img src={menu_icon} alt="menuicon" className='max-h-5 cursor-pointer' />
                    <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border-gray-600 text-gray-100 hidden group-hover:block'>
                        <p onClick={()=>{navigate("/profile")}} className='cursor-pointer text-sm'>Edit Profile</p>
                        <hr  className='my-2 border-t border-gray-500'/>
                        <p className='cursor-pointer text-sm' onClick={handlelogout}>Logout</p>

                    </div>

                </div>

            </div>
            <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
                <img src={search_icon} alt="search" className='w-3' />
                <input value={inputtext} onChange={(e)=>setinputtext(e.target.value)} type="text" className='bg-transparent border-none outline-none text-white text-xs placeholder=[#c8c8c8] flex-1' placeholder='Search User...'/>
            </div>
        </div>
        <div className='flex flex-col'>
            {filteruser.map((user,index)=>(<div key={index} onClick={()=>{setSelectedUser(user);setunseenmessages(s=>({...s,[user._id]:0}));}} className={ `relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id &&'bg-[#282142]/50'} `}>
                <img src={user?.profilePic|| avatar_icon} alt="profilepic"  className='w-[35px] aspect-[1/1] rounded-full'/>
                <div className='flex flex-col leading-5 '>
                    <p >{user.name}</p>
                    {
                        onlineusers.includes(user._id)?<span className='text-green-400 text-xs'>Online</span>:
                        <span className='text-neutral-400 tetx-xs'>Offline</span>
                    }
                </div>
                {unseenmessages[user._id]>0&&<p className='absolute top-4 right-4 tetx-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50'>{unseenmessages[user._id]}</p>}
            </div>))}

        </div>
    </div>);
}

export default Sidebar;
