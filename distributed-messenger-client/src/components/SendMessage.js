import React, { useState } from "react";
import { postRequest } from "../api";

const SendMessage = () => {
  const [chatId, setChatId] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");

  const handleSubmit = async () => {
    const result = await postRequest(
      "/write/message",
      { chatId, message },
      { userId }
    );
    alert(result.error ? result.error : `Message Sent: ${JSON.stringify(result)}`);
    setChatId("");
    setMessage("");
    setUserId("");
  };

  return (
    <div>
      <h2>Send Message</h2>
      <input
        type="text"
        value={chatId}
        onChange={(e) => setChatId(e.target.value)}
        placeholder="Chat ID"
      />
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your message"
      />
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Your User ID"
      />
      <button onClick={handleSubmit}>Send Message</button>
    </div>
  );
};

export default SendMessage;
