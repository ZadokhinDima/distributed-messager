import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null); // Stores user details
  const [chatID, setChatID] = useState(null); // Stores chat ID
  const [messages, setMessages] = useState([]); // Stores chat messages
  const [messageInput, setMessageInput] = useState(""); // For sending messages
  const [joinChatID, setJoinChatID] = useState(""); // Chat ID for joining
  const [username, setUsername] = useState(""); // Input for username
  const [pollingInterval, setPollingInterval] = useState(null); // Store the interval ID
  const [chatName, setChatName] = useState(null);


  // Create User
  const handleCreateUser = async () => {
    if (user) return; // Don't allow creating another user
    if (!username) return alert("Please enter a username!");
    try {
      const response = await axios.post('http://localhost:80/api/write/user', {
        username
      });
      console.log("User created:", response.data); // Debugging: Check response
      setUser(response.data); // Store user details
      setUsername(user.username); // Clear username input
    } catch (error) {
      console.error("Error creating user:", error.response?.data || error.message);
    }
  };

  // Create Chat
  const handleCreateChat = async () => {
    if (!user) {
      alert("Create a user first!");
      return;
    }
  
    const chatName = prompt("Enter the chat name:"); // Prompt the user for a chat name
    if (!chatName) {
      alert("Chat name is required!");
      return;
    }
  
    try {
      const response = await axios.post(
        'http://localhost:80/api/write/chat',
        { chatName }, // Send the chat name in the request body
        {
          headers: {
            userId: user.id, // Send the user ID in the headers
          },
        }
      );
  
      setChatID(response.data.chatID); // Store chat ID
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };
  

  // Join Chat
  const handleJoinChat = async () => {
    if (!user || !joinChatID) return alert("Provide user and chat ID!");
    try {
      await axios.post(`http://localhost:80/api/write/chat/${joinChatID}/join`, null, {
        headers: { userId: user.id },
      });
      setJoinChatID(joinChatID); // Set current chat ID
    } catch (error) {
      console.error("Error joining chat:", error);
    }
  };

  // Send Message
  const handleSendMessage = async () => {
    if (!user || !joinChatID || !messageInput) return alert("Provide all fields!");
    try {
      await axios.post(`http://localhost:80/api/write/message`, {
        chatId: joinChatID,
        message: messageInput
      }, {
        headers: {
          userId: user.id, // Send the user ID in the headers
        },
      });
      setMessages((prev) => [...prev, { sender: "You", text: messageInput }]); // Add message locally
      setMessageInput(""); // Clear input
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const fetchMessages = async () => {
    if (!joinChatID || !user) return; // No chat selected
    try {
      const last = 20;
      const response = await axios.get(
        `http://localhost:80/api/read/chat/${joinChatID}/messages/${last}`,
        {
          headers: {
            userId: user.id, // Pass the userId in headers
          }
        }
      );
      setMessages(response.data.messages); // Replace with the latest messages
      setChatName(response.data.chatName);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  
  

  // Start polling messages when chatID changes
  useEffect(() => {
    if (joinChatID) {
      fetchMessages(); // Fetch messages immediately
      const interval = setInterval(fetchMessages, 1000); // Fetch every 5 seconds
      setPollingInterval(interval); // Store interval ID for cleanup
    }
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval); // Clear interval on cleanup
        setPollingInterval(null);
      }
    };
  }, [joinChatID]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Distributed Messenger</h1>
      
      {!user && (
        <div>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleCreateUser} disabled={!username}>
            Create           </button>
        </div>
      )}

      {user && (
        <div>
          <p><strong>User ID:</strong> {user.id}</p>
          <p><strong>Username:</strong> {username}</p>

          <button onClick={handleCreateChat} disabled={!!chatID}>
            Create Chat
          </button>

          <div>
            <input
              type="text"
              placeholder="Enter Chat ID to join"
              value={joinChatID}
              onChange={(e) => setJoinChatID(e.target.value)}
            />
            <button onClick={handleJoinChat} disabled={!joinChatID}>
              Join Chat
            </button>
          </div>
        </div>
      )}

      {joinChatID && (
        <div>
          <h2>Chat: {chatName}</h2>
          <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>
          {messages.map((msg, index) => (
        <p key={index}>
          <strong>{msg.senderUsername}:</strong> {msg.text}
        </p>
      ))}

          </div>
          <div>
            <input
              type="text"
              placeholder="Type your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <button onClick={handleSendMessage} disabled={!messageInput}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
