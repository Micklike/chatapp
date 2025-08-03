import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const chatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setmessages] = useState([]);
  const [users, setusers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenmessages, setunseenmessages] = useState({});

  const { socket, axios, authUser } = useContext(AuthContext);

  // Get all users for sidebar
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setusers(data.users);
        setunseenmessages(data.unseenmessage || {});
      }
    } catch (e) {
      toast.error(e?.message);
    }
  };

  // Get all messages with a specific friend
  const specificfriend = async (id) => {
    try {
      const { data } = await axios.get(`/api/messages/messages/${id}`);
      
      if (data.success) {
        setmessages(data.messages);
      }
    } catch (e) {
      toast.error(e?.message);
    }
  };

  // Send message to selected user
  const sendmessage = async (id, body) => {
    try {
      const { data } = await axios.post(`/api/messages/sendmessage/${id}`, body);
      if (data.success) {
        setmessages((d) => [...d, data.newmessage]);

        // Emit the message via socket so recipient gets it in real-time
        if (socket) {
          socket.emit("newMessage", {
            ...data.newmessage,
            receiverId: id, // so backend knows who to deliver to
          });
        }
      }
    } catch (e) {
      toast.error(e?.message);
    }
  };

  // Listen for incoming messages
  const subscribeToMessages = () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        // Mark as seen if chat is open
        newMessage.seen = true;
        setmessages((s) => [...s, newMessage]);

        // Update message as seen in backend
        axios.put(`/api/messages/markasseen/${newMessage._id}`);
      } else {
        // Increment unseen message count
        setunseenmessages((s) => ({
          ...s,
          [newMessage.senderId]: s[newMessage.senderId]
            ? s[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  // Unsubscribe from socket
  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  // Setup socket listeners
  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]);

  const value = {
    messages,
    users,
    selectedUser,
    getUsers,
    setmessages,
    sendmessage,
    setSelectedUser,
    unseenmessages,
    setunseenmessages,
    specificfriend,
  };

  return (
    <chatContext.Provider value={value}>{children}</chatContext.Provider>
  );
};
