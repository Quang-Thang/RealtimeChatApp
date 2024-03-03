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
import { useEffect, useRef, useState } from "react";
import { db, realtimeDB } from "../firebase";
import { Link, useLocation } from "react-router-dom";
import { uid } from "uid";
import { IoIosSend } from "react-icons/io";
import User from "./User";
import { RiAuctionFill } from "react-icons/ri";
import { IoLogOut } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PiClockCountdownFill } from "react-icons/pi";
import confetti from "canvas-confetti";
import CountdownTimer from "./CountdownTimer";
import { onValue, ref, set } from "firebase/database";
const Chat = () => {
  const [messages, setMessages] = useState([]);
  const location = useLocation();
  const { roomName, userName } = location.state || {};
  const [bidAmount, setBidAmount] = useState({});
  const bidInputRef = useRef(null);
  const [timeRemain, setTimeRemain] = useState(60);
  const messageRef = useRef(null);

  const intervalRef = useRef();
  const [start, setStart] = useState(false);

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
    if (bidText.trim() === "") {
      toast.error("Vui lòng nhập số tiền muốn cược 🚀");
      return;
    }
    if (bidText <= bidAmount.amount) {
      console.log("Error boy");
      toast.error("Vui lòng đặt cược lớn hơn giá trị cược hiện tại 🚀");
      return;
    }
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
      setStart(true);

      bidInputRef.current.value = "";
      toast.success("Đặt cược thành công 🚀");
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
    };
    getMessages();

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

    // Cleanup function for useEffect
    return () => {
      // If a getBid listener is active, unsubscribe when the component unmounts
      const unsubscribeBid = getBid();
      if (unsubscribeBid) unsubscribeBid();
    };
  }, [bidAmount]);

  function formatTimestamp(timestamp) {
    if (!timestamp) return "";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  return (
    <>
      <h1 className="mb-10 text-2xl font-bold">{`Welcome to ${roomName}, Mr.${userName}`}</h1>
      <div className="flex items-center justify-between px-10">
        <div className="px-3 py-2 text-white rounded-xl bg-slate-900">
          <h1 className="flex items-center gap-3 text-2xl font-medium">
            <PiClockCountdownFill />
            {/* Thời gian còn lại: {timeRemain} giây */}
            <CountdownTimer userName={bidAmount.userName} />
          </h1>
        </div>
        <Link to="/">
          <button className="px-2 py-2 bg-red-500 rounded ">
            <span className="flex items-center justify-between gap-1 text-white">
              <IoLogOut color="white" size="20" />
              Thoát
            </span>
          </button>
        </Link>
      </div>
      <div className="flex p-10">
        <div className="basis-[70%]">
          <div className="flex">
            <div className="basis-[50%]">
              <div className="pr-5">
                <img
                  src="https://cdn.pixabay.com/photo/2016/11/18/17/46/house-1836070_1280.jpg"
                  alt=""
                  className="w-full h-[500px] rounded"
                />
              </div>
            </div>
            <div className="basis-[50%] pr-5">
              <div className="grid grid-cols-3">
                <User name="John" />
                <User name="John" />
                <User name="John" />
              </div>
              <form onSubmit={handleSubmitBid}>
                <div className="flex items-center pl-1 mt-5">
                  <input
                    type="number"
                    ref={bidInputRef}
                    className="px-5 py-2  border border-purple-500 rounded outline-none w-full basis-[95%]"
                  />
                  <span className="mx-3 font-bold select-none basis-[5%] text-xl">
                    VND
                  </span>
                </div>

                <br />
                <div className="flex items-center justify-center w-full">
                  <button
                    className="w-[150px] px-5 py-1 border border-purple-500 rounded outline-none"
                    type="submit"
                  >
                    <span className="relative flex items-center justify-center gap-3 text-xl font-semibold">
                      <RiAuctionFill color="blue" className="absolute left-0" />{" "}
                      Bid
                    </span>
                  </button>
                </div>
              </form>
              <div>
                <h1 className="pt-5 text-2xl font-medium">
                  <span>
                    Current bid:{" "}
                    <b className="font-extrabold">{bidAmount.amount} VND</b> was
                    bided by{" "}
                  </span>
                  <span className="font-extrabold">{bidAmount.userName} </span>
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="basis-[30%]  bg-white h-[750px]">
          <div className="p-5 overflow-hidden border rounded">
            <ul className="h-[650px] pr-5 overflow-y-scroll">
              {messages.length > 0 &&
                messages.map((msg) => (
                  <li className="flex justify-between mb-4" key={msg.timestamp}>
                    <span className="basis-[82%]">
                      <span className="font-bold text-red-500">
                        {msg.userName}
                      </span>
                      <span> {msg.content}</span>
                    </span>
                    <span className="basis-[15%]">
                      {formatTimestamp(msg.timestamp)}
                    </span>
                  </li>
                ))}
            </ul>
            <div className="flex items-center justify-center w-full gap-2">
              <input
                className="px-5 py-2 my-5 border border-purple-400 rounded outline-none basis-[95%] bg-white"
                type="text"
                ref={messageRef}
              />
              <button
                className="basis-[5%] p-1 bg-slate-500 rounded-full hover:bg-slate-600 active:bg-slate-700"
                onClick={handleSend}
              >
                <IoIosSend size="30" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
