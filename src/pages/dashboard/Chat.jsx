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

  // ────────────────────────────────────────────────
  // Fetch messages + Socket connection
  // ────────────────────────────────────────────────
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `https://backend2-3avp.onrender.com/api/messages/${taskId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
    };

    fetchMessages();

    socket.emit("join_room", taskId);

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      setTypingUser(null);
    });

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

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ────────────────────────────────────────────────
  // Send message
  // ────────────────────────────────────────────────
  const sendMessage = () => {
    if (!text.trim()) return;

    const msgData = {
      room: taskId,
      senderId: currentUser.id,
      text,
      // you can also add: createdAt: new Date(), sender: { name: currentUser.name }
    };

    socket.emit("send_message", msgData);
    setMessages((prev) => [...prev, msgData]);
    setText("");
    socket.emit("stop_typing", { room: taskId });
  };

  // ────────────────────────────────────────────────
  // Typing indicator with debounce
  // ────────────────────────────────────────────────
  const handleTyping = (e) => {
    setText(e.target.value);

    socket.emit("typing", {
      room: taskId,
      user: currentUser.name || "You",
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stop_typing", { room: taskId });
    }, 1800);
  };

  // Simple time formatter (only HH:MM)
  const formatTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const isMe = (senderId) => senderId === currentUser.id;

  return (
    <div className="flex flex-col h-[100dvh] bg-[#efeae2]">
      {/* Navbar */}
      <div className="flex-none z-20">
        <Navbar />
      </div>

      {/* Header */}
      <div className="flex-none bg-[#075e54] text-white shadow-md px-4 py-3 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-base">Task Discussion</h2>
          <p className="text-xs text-[#a5dfc1]">
            {typingUser && typingUser !== currentUser.name
              ? `${typingUser} is typing...`
              : "Online"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white/15 rounded px-2.5 py-1 border border-white/10">
            <FaRupeeSign className="text-white/80 text-sm mr-1" />
            <input
              type="number"
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              className="w-16 bg-transparent outline-none text-sm text-white placeholder:text-white/60 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="Offer"
            />
          </div>
          <button className="bg-[#25d366] hover:bg-[#20bd5a] text-white text-sm font-medium px-4 py-1.5 rounded shadow-sm transition">
            Send
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2.5 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
        {messages.map((m, i) => {
          const me = isMe(m.senderId);

          return (
            <div
              key={i}
              className={`flex ${me ? "justify-end" : "justify-start"} group`}
            >
              <div
                className={`relative px-3 py-2 max-w-[78%] rounded-2xl shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] break-words ${
                  me
                    ? "bg-[#d9fdd3] rounded-br-[4px] rounded-tr-3xl rounded-tl-3xl rounded-bl-3xl"
                    : "bg-white rounded-bl-[4px] rounded-tl-3xl rounded-tr-3xl rounded-br-3xl"
                }`}
              >
                {!me && m.sender?.name && (
                  <p className="text-xs font-medium text-[#075e54] mb-0.5">
                    {m.sender.name}
                  </p>
                )}

                <p className="text-[15px] leading-[19.5px]">{m.text}</p>

                <div className="flex items-center justify-end gap-1.5 mt-0.5 -mr-1">
                  <span className="text-[11px] text-[#667781] leading-none">
                    {formatTime()}
                  </span>
                  {me && (
                    <FaCheckDouble className="text-[#53bdeb] text-[13px]" />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="flex-none bg-[#f0f2f5] border-t px-3 py-2">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <input
            value={text}
            onChange={handleTyping}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
            className="flex-1 bg-white rounded-full px-5 py-3 text-[15px] outline-none shadow-sm placeholder:text-gray-500"
            placeholder="Type a message"
          />
          <button
            onClick={sendMessage}
            disabled={!text.trim()}
            className="bg-[#075e54] text-white p-3.5 rounded-full hover:bg-[#054c44] transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPaperPlane size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;