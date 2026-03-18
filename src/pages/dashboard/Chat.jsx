import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import Navbar from "../../components/Navbar";
import { FaPaperPlane, FaRupeeSign, FaCheckDouble } from "react-icons/fa";

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
    <div className="flex flex-col h-[100dvh] bg-[#e5ddd5]"> {/* WhatsApp Background Color */}
      <div className="flex-none z-20">
        <Navbar />
      </div>

      {/* CHAT HEADER */}
      <div className="flex-none p-3 border-b flex justify-between items-center bg-[#075e54] text-white z-10 shadow-md">
        <div className="min-w-0">
          <h2 className="font-bold text-sm truncate">Task Discussion</h2>
          <p className="text-[10px] text-green-300">● Online</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white/10 rounded-md px-2 border border-white/20">
            <FaRupeeSign className="text-white/70 text-xs" />
            <input
              type="number"
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              className="w-14 bg-transparent p-1.5 text-xs outline-none text-white placeholder:text-white/50"
              placeholder="0.00"
            />
          </div>
          <button className="bg-[#25d366] text-white px-3 py-1.5 rounded-md text-xs font-bold shadow-sm hover:bg-[#1ebe57]">
            Send
          </button>
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        {messages.map((m, i) => {
          const isMe = m.senderId === currentUser.id;
          return (
            <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-3 py-1.5 rounded-lg shadow-sm relative ${
                isMe 
                  ? "bg-[#dcf8c6] text-slate-800 rounded-tr-none" // WhatsApp Green for Sender
                  : "bg-white text-slate-800 rounded-tl-none"    // White for Receiver
              }`}>
                {!isMe && (
                  <p className="text-[10px] font-bold text-blue-600 mb-0.5">
                    {m.sender?.name || "User"}
                  </p>
                )}
                <div className="flex flex-wrap items-end gap-2">
                  <p className="text-[14px] leading-tight flex-1 min-w-[50px]">{m.text}</p>
                  <div className="flex items-center gap-1 min-w-fit">
                    <span className="text-[9px] text-slate-500 uppercase">10:45 AM</span>
                    {isMe && <FaCheckDouble className="text-blue-400 text-[10px]" />}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* INPUT AREA */}
      <div className="flex-none p-2 bg-[#f0f2f5] pb-24 sm:pb-4 border-t">
        <div className="flex gap-2 items-center max-w-4xl mx-auto">
          <div className="flex-1 bg-white rounded-full flex items-center px-4 py-1 shadow-sm border border-slate-200">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="w-full py-2 text-sm outline-none"
              placeholder="Type a message"
            />
          </div>
          <button
            onClick={sendMessage}
            className="bg-[#075e54] text-white p-3 rounded-full hover:bg-[#054c44] shadow-md transition-all flex-none active:scale-90"
          >
            <FaPaperPlane size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;