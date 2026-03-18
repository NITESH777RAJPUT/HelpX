import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import Navbar from "../../components/Navbar";
import { FaPaperPlane, FaRupeeSign } from "react-icons/fa";

const socket = io("https://backend2-3avp.onrender.com");

function Chat() {
  const { taskId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [offer, setOffer] = useState("");

  const scrollRef = useRef();
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `https://backend2-3avp.onrender.com/api/messages/${taskId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data);
      } catch (err) { console.error(err); }
    };
    fetchMessages();
    socket.emit("join_room", taskId);
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => socket.off("receive_message");
  }, [taskId, token]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;
    socket.emit("send_message", { room: taskId, senderId: currentUser.id, text });
    setText("");
  };

  return (
    /* h-[100dvh] ensures it fits perfectly between top and bottom browser bars */
    <div className="flex flex-col h-[100dvh] bg-white">
      
      {/* 1. TOP NAVBAR */}
      <div className="flex-none shadow-sm z-20">
        <Navbar />
      </div>

      {/* 2. CHAT HEADER (Task Info & Offer) */}
      <div className="flex-none p-3 border-b flex justify-between items-center bg-white z-10">
        <div className="min-w-0">
          <h2 className="font-bold text-slate-800 text-sm truncate">Task Discussion</h2>
          <p className="text-[10px] text-green-600">● Active Chat</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-md px-2 border border-slate-200">
            <FaRupeeSign className="text-slate-400 text-xs" />
            <input
              type="number"
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              className="w-12 sm:w-20 bg-transparent p-1.5 text-xs outline-none"
              placeholder="0.00"
            />
          </div>
          <button className="bg-[#22c55e] text-white px-3 py-1.5 rounded-md text-xs font-bold shadow-sm">
            Send
          </button>
        </div>
      </div>

      {/* 3. MESSAGES AREA - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((m, i) => {
          const isMe = m.senderId === currentUser.id;
          return (
            <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-3 py-2 rounded-2xl shadow-sm border ${
                isMe ? "bg-blue-600 text-white border-blue-500 rounded-tr-none" 
                     : "bg-white text-slate-800 border-slate-100 rounded-tl-none"
              }`}>
                <p className={`text-[10px] font-semibold mb-1 opacity-80`}>
                  {m.sender?.name || "User"}
                </p>
                <p className="text-[13px] leading-snug">{m.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* 4. INPUT AREA - Floating above bottom nav if necessary */}
      <div className="flex-none p-3 border-t bg-white pb-20 sm:pb-4"> 
        {/* pb-20 handles space for your Bottom Navigation bar on mobile */}
        <div className="flex gap-2 items-center max-w-3xl mx-auto">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 border border-slate-200 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 shadow-md active:scale-90 transition-transform"
          >
            <FaPaperPlane size={14} />
          </button>
        </div>
      </div>

      {/* NOTE: Agar aapka Bottom Nav component yahan render ho raha hai, toh usey fixed na rakhein, balki yahan flex-none mein daalein */}
    </div>
  );
}

export default Chat;