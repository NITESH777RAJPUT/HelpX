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
      } catch (err) {
        console.error("Error fetching messages", err);
      }
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
    socket.emit("send_message", {
      room: taskId,
      senderId: currentUser.id,
      text,
    });
    setText("");
  };

  return (
    // h-[100dvh] prevents mobile browser UI overlap
    <div className="h-[100dvh] flex flex-col bg-slate-50 overflow-hidden">
      <Navbar />

      <div className="flex-1 max-w-3xl w-full mx-auto flex flex-col bg-white shadow-sm overflow-hidden relative">
        
        {/* HEADER: Fixed Height */}
        <div className="p-3 sm:p-4 border-b flex items-center justify-between bg-white z-10">
          <div className="min-w-0">
            <h2 className="font-bold text-slate-800 text-sm sm:text-lg truncate">
              Task Discussion
            </h2>
            <p className="text-[10px] sm:text-xs text-green-600 font-medium">
              ● Active Chat
            </p>
          </div>

          {/* OFFER SECTION: Responsive Width */}
          <div className="flex gap-1.5 sm:gap-2 ml-2">
            <div className="flex items-center bg-slate-100 rounded-lg px-2 border border-slate-200">
              <FaRupeeSign className="text-slate-500 text-xs"/>
              <input
                type="number"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
                className="w-12 sm:w-20 bg-transparent p-1.5 sm:p-2 text-xs sm:text-sm outline-none font-medium"
                placeholder="0.00"
              />
            </div>
            <button className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold hover:bg-green-700 transition-colors">
              Send
            </button>
          </div>
        </div>

        {/* MESSAGES: Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8fafc]">
          {messages.map((m, i) => {
            const isMe = m.senderId === currentUser.id;
            return (
              <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] sm:max-w-[75%] px-3 py-2 sm:px-4 sm:py-3 rounded-2xl shadow-sm ${
                    isMe
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white border border-slate-200 text-slate-800 rounded-tl-none"
                  }`}>
                  <p className={`text-[10px] mb-1 font-medium ${isMe ? "text-blue-100" : "text-slate-500"}`}>
                    {m.sender?.name || "User"}
                  </p>
                  <p className="text-sm leading-relaxed break-words">
                    {m.text}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>

        {/* INPUT AREA: Stays at bottom */}
        <div className="p-3 sm:p-4 border-t bg-white">
          <div className="flex gap-2 items-center">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 sm:py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              disabled={!text.trim()}
              className="bg-blue-600 text-white p-3 sm:p-3.5 rounded-xl hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
            >
              <FaPaperPlane className="text-sm sm:text-base" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Chat;