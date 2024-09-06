import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {io} from 'socket.io-client';

const ENDPOINT=process.env.REACT_APP_ENDPOINT;
const Chat = ({projectID}) => {
  const [messages,setMessages]=useState([]);
  const [socket,setSocket]=useState(null);
  const [newMessage,setNewMessage]=useState('');
  const { user } = useSelector((state) => state.auth);

  useEffect(()=>{
    const newSocket=io(ENDPOINT);
    setSocket(newSocket);

    newSocket.emit('joinProject',projectID);
    newSocket.on('projectMessages',(messages)=>{
        setMessages(messages);
    });

    newSocket.on('receiveMessage', (message) => {
        // Handle received message logic here
        setMessages((prevMessages) => [...prevMessages, message]);
      });

    return ()=>{
      newSocket.disconnect();
    }

  },[projectID]);

 
  
  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const message = {
        projectID,
        senderID: user.id,
        content: newMessage
      };
      socket.emit("sendMessage", message);
      setNewMessage("");
    }
  };
  return (
    <div className="chat-container bg-gray-100 p-4 rounded-lg shadow-md mt-6">
    <h3 className="text-2xl font-semibold mb-4">Project Chat</h3>
    <div className="messages mb-4">
      {messages.length > 0 ? (
        messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <strong>{msg.senderID.name}(</strong>{msg.senderID.email}<strong>)</strong>: {msg.content}
          </div>
        ))
      ) : (
        <p>No messages yet.</p>
      )}
    </div>
    <div className="flex">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-grow p-2 border border-gray-300 rounded-l-lg"
      />
      <button
        onClick={handleSendMessage}
        className="bg-blue-500 text-white p-2 rounded-r-lg"
      >
        Send
      </button>
    </div>
  </div>
  )
}

export default Chat
