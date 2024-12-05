import React, { useState } from "react";
import { postRequest } from "../api";

const CreateChat = () => {
  const [chatName, setChatName] = useState("");
  const [userId, setUserId] = useState("");

  const handleSubmit = async () => {
    const result = await postRequest(
      "/write/chat",
      { chatName },
      { userId }
    );
    alert(result.error ? result.error : `Chat Created: ${JSON.stringify(result)}`);
    setChatName("");
    setUserId("");
  };

  return (
    <div>
      <h2>Create Chat</h2>
      <input
        type="text"
        value={chatName}
        onChange={(e) => setChatName(e.target.value)}
        placeholder="Chat name"
      />
      <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="Your User ID"
      />
      <button onClick={handleSubmit}>Create Chat</button>
    </div>
  );
};

export default CreateChat;
