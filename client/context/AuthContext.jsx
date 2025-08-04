import { createContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backurl = import.meta.env.VITE_BACKEND_URL;

// Global axios defaults
axios.defaults.baseURL = backurl;
axios.defaults.withCredentials = true;

// Create the context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [onlineusers, setonlineusers] = useState([]);
  const [socket, setsocket] = useState(null);

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/api/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Run checkAuth when component mounts
  useEffect(() => {
    checkAuth()
  }, []);

  // Connect socket for real-time updates
  function connectSocket(userdata) {
    console.log(userdata,"ll")
    if (!userdata || socket?.connected) return;
    console.log("ff")
    const newsocket = io(backurl, {
      query: { userId: userdata._id }
    });
    newsocket.connect();
    setsocket(newsocket);

    // Listen for online users
    newsocket.on("getOnlineUser", (users) => {
      console.log(users,"users")
      setonlineusers(users);
    });

    // Listen for errors or disconnect
    newsocket.on("disconnect", (users) => {
            console.log(users,"users")

      setonlineusers([]);
    });
  }

  // Login function
  const login = async (state, credential) => {
    
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credential);
      if (data?.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      console.log(e);
      toast.error(e?.response?.data?.message || "Login failed");
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
      setAuthUser(null);
      setonlineusers([]);
      if (socket) socket.disconnect();
      toast.success("User logged out");
    } catch (e) {
      console.log(e,"logout error")
      toast.error("Logout failed");
    }
  };

  // Update profile function
  const update = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
      }
    } catch (e) {
      console.log(e);
      toast.error("Update failed");
    }
  };

  // Values to share via context
  const value = {
    axios,
    authUser,
    onlineusers,
    socket,
    login,
    logout,
    update
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
