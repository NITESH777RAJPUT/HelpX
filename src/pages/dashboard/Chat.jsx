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

  // ✅ TYPING
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
    }, 1500);
  };

  const formatTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isMe = (id) => id === currentUser.id;

  return (
    <div className="flex flex-col h-[100dvh] bg-[#efeae2]">

      {/* NAVBAR */}
      <div className="flex-none z-20">
        <Navbar />
      </div>

      {/* HEADER */}
      <div className="flex-none bg-[#075e54] text-white px-4 py-3 flex justify-between items-center shadow">
        <div>
          <h2 className="font-semibold">Task Discussion</h2>
          <p className="text-xs text-green-300">
            {typingUser && typingUser !== currentUser.name
              ? `${typingUser} typing...`
              : "Online"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white/10 px-2 py-1 rounded">
            <FaRupeeSign />
            <input
              type="number"
              value={offer}
              onChange={(e) => setOffer(e.target.value)}
              className="bg-transparent outline-none w-16 text-white text-sm"
              placeholder="Offer"
            />
          </div>
          <button className="bg-[#25d366] px-3 py-1 rounded">
            Send
          </button>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-3 py-4 pb-28 space-y-2.5">
        {messages.map((m, i) => {
          const me = isMe(m.senderId);

          return (
            <div key={i} className={`flex ${me ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-3 py-2 max-w-[75%] rounded-lg shadow ${
                  me
                    ? "bg-[#dcf8c6] rounded-br-none"
                    : "bg-white rounded-bl-none"
                }`}
              >
                {!me && (
                  <p className="text-xs text-blue-600 font-semibold">
                    {m.sender?.name || "User"}
                  </p>
                )}

                <p className="text-sm">{m.text}</p>

                <div className="flex justify-end items-center gap-1 mt-1">
                  <span className="text-[10px] text-gray-500">
                    {formatTime()}
                  </span>
                  {me && <FaCheckDouble className="text-blue-500 text-xs" />}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={scrollRef} />
      </div>

      {/* ✅ FIXED INPUT (NAVBAR KE UPAR) */}
      <div className="fixed bottom-16 left-0 w-full bg-[#f0f2f5] border-t px-3 py-2 z-50">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">

          <input
            value={text}
            onChange={handleTyping}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              !e.shiftKey &&
              (e.preventDefault(), sendMessage())
            }
            className="flex-1 bg-white rounded-full px-5 py-3 text-sm outline-none shadow"
            placeholder="Type a message"
          />

          <button
            onClick={sendMessage}
            className="bg-[#075e54] text-white p-3 rounded-full"
          >
            <FaPaperPlane />
          </button>

        </div>
      </div>

    </div>
  );
}

export default Chat;