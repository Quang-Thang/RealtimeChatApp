import React from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import Login from "./components/Login";
import { Route, Routes } from "react-router-dom";
import Chat from "./components/Chat";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </>
  );
};

export default App;
