import React from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import Login from "./components/Login";
import { Route, Routes } from "react-router-dom";
import Chat from "./components/Chat";
import { ToastContainer } from "react-toastify";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default App;
