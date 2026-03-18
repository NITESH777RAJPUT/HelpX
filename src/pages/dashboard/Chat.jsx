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

      const res = await axios.get(
        `https://backend2-3avp.onrender.com/api/messages/${taskId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessages(res.data);

    };

    fetchMessages();

    socket.emit("join_room", taskId);

    socket.on("receive_message", (msg) => {

      setMessages((prev) => [...prev, msg]);

    });

    return () => socket.off("receive_message");

  }, [taskId]);


  useEffect(() => {

    scrollRef.current?.scrollIntoView({ behavior: "smooth" });

  }, [messages]);


  const sendMessage = () => {

    if (!text.trim()) return;

    socket.emit("send_message", {

      room: taskId,
      senderId: currentUser.id,
      text

    });

    setText("");

  };


  return (

    <div className="h-screen flex flex-col bg-slate-100">

      <Navbar />

      <div className="flex-1 max-w-3xl w-full mx-auto flex flex-col bg-white shadow-xl">

        {/* HEADER */}

        <div className="p-4 border-b flex justify-between items-center bg-white">

          <div>

            <h2 className="font-bold text-slate-800 text-lg">
              Task Discussion
            </h2>

            <p className="text-xs text-green-600">
              Active Chat
            </p>

          </div>

          {/* OFFER */}

          <div className="flex gap-2">

            <div className="flex items-center bg-slate-100 rounded-lg px-2">

              <FaRupeeSign className="text-slate-500"/>

              <input
                value={offer}
                onChange={(e)=>setOffer(e.target.value)}
                className="w-20 bg-transparent p-2 text-sm outline-none"
                placeholder="Offer"
              />

            </div>

            <button className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-700">
              Send
            </button>

          </div>

        </div>


        {/* MESSAGES */}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {messages.map((m, i) => {

            const isMe = m.senderId === currentUser.id;

            return (

              <div
                key={i}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >

                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
                    isMe
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-slate-100 text-slate-800 rounded-tl-none"
                  }`}
                >

                  <p className="text-xs opacity-70 mb-1">
                    {m.sender?.name || "User"}
                  </p>

                  <p className="text-sm leading-relaxed">
                    {m.text}
                  </p>

                </div>

              </div>

            );

          })}

          <div ref={scrollRef} />

        </div>


        {/* INPUT */}

        <div className="p-4 border-t bg-white">

          <div className="flex gap-2">

            <input
              value={text}
              onChange={(e)=>setText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 border rounded-xl px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Type your message..."
            />

            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700"
            >

              <FaPaperPlane />

            </button>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Chat;