import {
  doc,
  setDoc,
  serverTimestamp,
  getDocs,
  collection,
  onSnapshot,
  orderBy,
  query,
  addDoc,
} from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { db } from "../firebase";
import { useLocation } from "react-router-dom";
import { uid } from "uid";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const location = useLocation();
  const { roomName, userName } = location.state || {};
  const [bidAmount, setBidAmount] = useState({});
  const bidInputRef = useRef(null);

  const messageRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    const messageText = messageRef.current.value;
    if (messageText.trim() === "") return;
    try {
      const message = {
        content: messageText,
        userName: userName,
        timestamp: serverTimestamp(),
      };
      await setDoc(doc(db, "rooms", roomName, "messages", uid(32)), message);
      messageRef.current.value = "";
      console.log("Bing roi");
    } catch (error) {
      console.log("Loi roi em oi! " + error);
    }
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    const bidText = bidInputRef.current.value;
    if (bidText.trim() === "") return;
    try {
      const newBid = {
        amount: bidText,
        userName: userName,
        timestamp: serverTimestamp(),
      };
      await setDoc(
        doc(db, "rooms", roomName, "bids", "Bid of " + roomName),
        newBid
      );
      bidInputRef.current.value = "";
      console.log("Bing roi");
    } catch (error) {
      console.error("Error submitting bid:", error);
    }
  };

  useEffect(() => {
    const getMessages = async () => {
      const messagesRef = collection(db, "rooms", roomName, "messages");
      const messagesQuery = query(messagesRef, orderBy("timestamp"));
      // Real-time listener
      onSnapshot(messagesQuery, (querySnapshot) => {
        const messageList = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        setMessages(messageList);
      });
      // const messagesSnapshot = await getDocs(messagesQuery);
      // const messageList = messagesSnapshot.docs.map((doc) => ({
      //   ...doc.data(),
      // }));
      // setMessages(messageList);
    };
    getMessages();

    // const getBid = async () => {
    //   const bidsRef = collection(db, "rooms", roomName, "bids");
    //   const querySnapshot = await getDocs(bidsRef);

    //   // Iterate over each document and log its data
    //   querySnapshot.forEach((doc) => {
    //     console.log(doc.id, " => ", doc.data());
    //     setBidAmount(doc.data());
    //   });
    // };

    // getBid();

    const getBid = () => {
      // No async needed here since onSnapshot is real-time
      const bidsRef = collection(db, "rooms", roomName, "bids");
      const unsubscribe = onSnapshot(bidsRef, (querySnapshot) => {
        // Important: Store the unsubscribe function
        querySnapshot.forEach((doc) => {
          setBidAmount(doc.data());
        });
      });

      return unsubscribe; // Use this for cleanup later
    };

    getBid();
  }, []);

  return (
    <>
      <h1 className="mb-10 text-2xl font-bold">{`Welcome to ${roomName}, Mr.${userName}`}</h1>
      <div className="flex">
        <div className="basis-[70%]">
          <h1 className="mb-10 text-xl font-medium">
            Current bid: {bidAmount.amount} VND was bided by{" "}
            {bidAmount.userName}
          </h1>

          <form onSubmit={handleSubmitBid}>
            <h1>Your bid</h1>
            <input
              type="number"
              ref={bidInputRef}
              className="px-5 py-2 my-5 border border-purple-500 rounded outline-none"
            />
            VND
            <br />
            <button
              className="px-5 py-2 border border-purple-500 rounded outline-none"
              type="submit"
            >
              Bid
            </button>
          </form>
        </div>
        <div className="basis-[30%] p-5 border overflow-scroll">
          <ul>
            {messages.map((msg) => (
              <li key={msg.timestamp}>
                <span className="font-bold text-red-500">{msg.userName}</span>
                <span> {msg.content}</span>
              </li>
            ))}
          </ul>
          <div>
            <input
              className="px-5 py-2 my-5 border border-purple-400 rounded outline-none"
              type="text"
              ref={messageRef}
            />
            <button
              onClick={handleSend}
              className="px-5 py-2 border border-blue-500 rounded"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
