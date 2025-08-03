import React, { useContext, useEffect, useRef, useState } from "react";
import profile_martin from "../assets/profile_martin.png";
import arrow_icon from "../assets/arrow_icon.png";
import logo_icon from "../assets/logo_icon.svg";
import help_icon from "../assets/help_icon.png";
import avatar_icon from "../assets/avatar_icon.png";
import galleryIcon from "../assets/gallery_icon.svg";
import send_button from "../assets/send_button.svg";

import { formatMessageTime } from "../lib/utlis";
import { chatContext } from "../../context/chatContext";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Chatcontainer = () => {
  const {
    messages,
    selectedUser,
    setSelectedUser,
    sendmessage,
    specificfriend,
  } = useContext(chatContext);

  const { authUser, onlineusers } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const scrollEnd = useRef();

  // Scroll to latest message
  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle send text message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim() === "" || !selectedUser) return;
    await sendmessage(selectedUser._id, { text: message.trim() });
    setMessage("");
  };

  // Handle send image
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      if (selectedUser) {
        await sendmessage(selectedUser._id, { image: reader.result });
      }
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  // Load previous messages for selected user
  useEffect(() => {
    console.log("kjhj")
    if (selectedUser) {
      specificfriend(selectedUser._id);
      console.log(selectedUser,"id")

    }
  }, [selectedUser]);
  console.log(messages,"meesages")

  return selectedUser ? (
    <div className="h-full overflow-hidden relative backdrop-blur-lg">
      {/* Top bar */}
      <div  className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || avatar_icon}
          alt="profile img"
          className="w-8 h-8 rounded-full " style={{border:"1px solid red"}}
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.name}
          {onlineusers?.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>
        <img
          src={arrow_icon}
          onClick={() => setSelectedUser(null)}
          alt="arrow_icon"
          className="md:hidden max-w-7 cursor-pointer"
        />
        <img src={help_icon} alt="help" className="max-md:hidden max-w-5" />
      </div>

      {/* Messages Area */}
      
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 ${
              msg.senderId === authUser._id
                ? "justify-end"
                : "flex-row-reverse justify-end"
            }`}
          >
            {msg.image ? (
              <img
                src={msg.image}
                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${
                  msg.senderId === authUser._id
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            )}
            <div className="text-center text-xs">
              <img
                src={
                  msg.senderId === authUser._id
                    ? authUser.profilePic || avatar_icon
                    : selectedUser.profilePic || avatar_icon
                }
                alt=""
                className="w-7 h-7 rounded-full"
              />
              <p className="text-gray-500">{formatMessageTime(msg.createdAt)}</p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>

      {/* Bottom Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3 bg-black/20"
      >
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent"
          />
          <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="image/png,image/jpeg"
            hidden
          />
          <label htmlFor="image">
            <img
              src={galleryIcon}
              className="w-5 mr-2 cursor-pointer"
              alt="gallery"
            />
          </label>
        </div>
        <button type="submit">
          <img src={send_button} className="w-7 cursor-pointer" alt="send" />
        </button>
      </form>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={logo_icon} className="max-w-16" alt="logo" />
      <p className="text-lg font-medium text-white">
        Chat Anytime, Anywhere
      </p>
    </div>
  );
};

export default Chatcontainer;
