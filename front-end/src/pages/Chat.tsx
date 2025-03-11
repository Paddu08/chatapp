import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";


const userId = localStorage.getItem("userId"); // ✅ Get userId from localStorage

const token = localStorage.getItem("token");
interface Message {
    _id: string;
    sender: {
      name: string;
    };
    receiver: string;
    text: string;
    createdAt: string;
  }

const socket = io("http://localhost:5001", {
    auth: { userId }, // Send userId when connecting
});
const Chat = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);  // Updated to Message[] instead of string[]
    const [isConnected, setIsConnected] = useState(false); 
    const [recipientId, setRecipientId] = useState(""); // Store selected recipient
    // Track connection status

    useEffect(() => {
        const fetchMessages = async () => {
            if (recipientId) {
                const res = await axios.get(`http://localhost:5001/api/messages/${userId}/${recipientId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setMessages(res.data);
            }
        };
        fetchMessages();
    }, [recipientId]);
    useEffect(() => {
        socket.on("connect", () => {
            console.log("✅ Connected to Socket.io server");
            setIsConnected(true);
        });

        socket.on("disconnect", () => {
            console.log("❌ Disconnected from Socket.io server");
            setIsConnected(false);
        });

        // ✅ Listen for incoming messages
        socket.on("receiveMessage", (msg: Message) => { 
            setMessages((prev) => [...prev, msg]);
        });

      

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("receiveMessage");
        };
    }, []);
    const sendMessage = async () => {
        if (!message.trim()) return;
    
        try {
            const token = localStorage.getItem("token"); // ✅ Get JWT token
            const receiverId = "67cfac422ebc7b5e4436da97"; // ✅ Hardcoded for now
    
            const res = await axios.post(
                "http://localhost:5001/api/messages",
                { receiver: receiverId, text: message,sender:userId}, // ✅ No sender
                { headers: { Authorization: `Bearer ${token}` } } // ✅ Send token in headers
            );
    
            console.log("Message sent:", res.data);
    
            // ✅ Update UI
            setMessages((prev) => [...prev, res.data]);
            setMessage("");
    
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    return (
        <div>
            <h2>Chat</h2>
            <p>Status: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}</p>
            <input
                type="text"
                placeholder="Recipient User ID"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
            />
          <div>
    {messages.map((msg: Message, index) => (
        <p key={index}>
<strong>{msg.sender.name}:</strong> {msg.text}
{msg.createdAt}
        </p>
    ))}
</div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;
