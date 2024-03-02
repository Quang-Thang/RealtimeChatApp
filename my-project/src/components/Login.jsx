import React, { Children, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

import Chat from "./Chat";

const Login = () => {
  const [roomName, setRoomName] = useState("");
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();

  console.log(roomName);
  console.log(userName);
  const handleSubmit = () => {
    // Assuming any login logic is done here
    navigate("/chat", { state: { roomName, userName } }); // Navigate with state
  };

  return (
    <>
      <div>
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Room name"
          onChange={(e) => setRoomName(e.target.value)}
          className="px-5 py-2 my-5 border border-purple-400 rounded outline-none"
        />
        <br />
        <input
          type="text"
          placeholder="Your name"
          onChange={(e) => setUserName(e.target.value)}
          className="px-5 py-2 mb-5 border border-purple-400 rounded outline-none"
        />
        <br />

        <button
          onClick={handleSubmit}
          className="px-5 py-2 border border-purple-400 rounded"
        >
          Join
        </button>
      </div>
    </>
  );
};

export default Login;
