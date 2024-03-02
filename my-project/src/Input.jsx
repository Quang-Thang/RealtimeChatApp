import React, { useState } from "react";

const Input = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message === "") {
      return;
    }

    onSendMessage(message);
    setMessage("");
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Gửi</button>
    </div>
  );
};

export default Input;
