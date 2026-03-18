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
  const [typingUser, setTypingUser] = useState(null);

  const scrollRef = useRef();
  const typingTimeoutRef = useRef(null);

  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  // ✅ FETCH + SOCKET
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `https://backend2-3avp.onrender.com/api/messages/${taskId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();

    socket.emit("join_room", taskId);

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      setTypingUser(null);
    });

    // 🔥 typing listener
    socket.on("typing", (user) => {
      setTypingUser(user);
    });

    socket.on("stop_typing", () => {
      setTypingUser(null);
    });

    return () => {
      socket.off("receive_message");
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, [taskId, token]);

  // ✅ AUTO SCROLL
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ SEND MESSAGE
  const sendMessage = () => {
    if (!text.trim()) return;

    const msgData = {
      room: taskId,
      senderId: currentUser.id,
      text,
    };

    socket.emit("send_message", msgData);

    setMessages((prev) => [...prev, msgData]);
    setText("");

    socket.emit("stop_typing", { room: taskId });
  };

  // ✅ TYPING FUNCTION (SMART)
  const handleTyping = (e) => {
    setText(e.target.value);

    socket.emit("typing", {
      room: taskId,
      user: currentUser.name,
    });

    // debounce logic
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { room: taskId });
    }, 1500);
  };

  // ✅ TIME FORMAT
  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#e5ddd5]">

      {/* NAVBAR */}
      <div className="flex-none z-20">
        <Navbar />
      </div>

      {/* HEADER */}
      <div className="flex-none p-3 border-b flex justify-between items-center bg-[#075e54] text-white shadow-md">
        <div>
          <h2 className="font-bold text-sm">Task Discussion</h2>

          {/* 🔥 TYPING INDICATOR */}
          <p className="text-[10px] text-green-300">
            {typingUser && typingUser !== currentUser.name
              ? `${typingUser} typing...`
              : "● Online"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white/10 rounded-md px-2 border border-white/20">
            <FaRupeeSign className="text-white/70 text-xs" />
            <input
              type="number"
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              className="w-14 bg-transparent p-1.5 text-xs outline-none text-white placeholder:text-white/50"
              placeholder="0"
            />
          </div>
          <button className="bg-[#25d366] px-3 py-1.5 rounded-md text-xs font-bold hover:bg-[#1ebe57]">
            Send
          </button>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">

        {messages.map((m, i) => {
          const isMe = m.senderId === currentUser.id;

          return (
            <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`relative px-3 py-2 max-w-[75%] rounded-lg shadow-sm ${
                  isMe
                    ? "bg-[#dcf8c6] rounded-br-none"
                    : "bg-white rounded-bl-none"
                }`}
              >

                {!isMe && (
                  <p className="text-[11px] font-semibold text-blue-600 mb-1">
                    {m.sender?.name || "User"}
                  </p>
                )}

                <p className="text-sm break-words">{m.text}</p>

                <div className="flex justify-end items-center gap-1 mt-1">
                  <span className="text-[10px] text-gray-500">
                    {formatTime()}
                  </span>

                  {isMe && (
                    <FaCheckDouble className="text-blue-500 text-[12px]" />
                  )}
                </div>

              </div>
            </div>
          );
        })}

        <div ref={scrollRef} />
      </div>

      {/* INPUT */}
      <div className="flex-none p-2 bg-[#f0f2f5] border-t">
        <div className="flex gap-2 items-center max-w-4xl mx-auto">

          <input
            value={text}
            onChange={handleTyping}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 bg-white rounded-full px-4 py-2 text-sm outline-none shadow-sm"
            placeholder="Type a message"
          />

          <button
            onClick={sendMessage}
            className="bg-[#075e54] text-white p-3 rounded-full hover:bg-[#054c44] active:scale-90 transition"
          >
            <FaPaperPlane size={16} />
          </button>

        </div>
      </div>

    </div>
  );
}

export default Chat;