import { useState, useEffect } from "react";
import axios from "axios";

const Chatbot = ({ userId = "user123" }) => {
  const [messages, setMessages] = useState([]);
  const [type, setType] = useState("query");
  const [input, setInput] = useState("");

  const loadMessages = async () => {
    const res = await axios.get(`/api/chat/${userId}`);
    setMessages(res.data);
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const send = async () => {
    if (!input.trim()) return;
    const res = await axios.post("/api/chat", { userId, type, message: input });
    setMessages([...messages, res.data]);
    setInput("");
  };

  return (
    <div className="max-w-md mx-auto bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-2">Canteen Chatbot</h2>

      <div className="flex mb-2">
        <select className="border p-1 rounded mr-2" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="query">Query</option>
          <option value="complaint">Complaint</option>
          <option value="feedback">Feedback</option>
        </select>
        <input
          className="border p-2 rounded flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={send} className="bg-blue-500 text-white px-4 ml-2 rounded">Send</button>
      </div>

      <div className="h-64 overflow-y-auto border rounded p-2">
        {messages.map((msg, i) => (
          <div key={i} className="mb-2">
            <div className="text-right"><strong>You:</strong> {msg.message}</div>
            {msg.reply && (
              <div className="text-left text-green-700"><strong>Bot:</strong> {msg.reply}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chatbot;
