import React, { useEffect, useRef, useState } from "react";
import { onValue, realtimeDB, ref, set } from "../firebase";
import { toast } from "react-toastify";

const CountdownTimer = ({ userName }) => {
  const [timeRemain, setTimeRemain] = useState(10);
  const [isRunning, setIsRunning] = useState(false);

  const intervalRef = useRef();

  const handleStart = (e) => {
    e.preventDefault();
    setIsRunning(true);
  };

  useEffect(() => {
    const timeRef = ref(realtimeDB, "rooms/" + "roomA");
    set(timeRef, { timeRemain: 10 });

    onValue(timeRef, (snapshot) => {
      const data = snapshot.val();

      setTimeRemain(data.timeRemain);
    });
  }, [isRunning]);

  useEffect(() => {
    //Implementing the setInterval method
    const timeRef = ref(realtimeDB, "rooms/" + "roomA");
    if (isRunning) {
      if (timeRemain > 0) {
        intervalRef.current = setInterval(() => {
          set(timeRef, { timeRemain: timeRemain - 1 });
        }, 1000);
      } else {
        clearInterval(intervalRef.current);
        toast.success("Mr." + userName + " đã giành chiến thắng 🚀🚀");
      }
    }

    return () => clearInterval(intervalRef.current);
  }, [timeRemain, isRunning]);

  const handleReset = (e) => {
    e.preventDefault();
    setTimeRemain(10);
    // setIsRunning(false);
  };

  return (
    <>
      <div>
        <h1>Thời gian còn lại: {timeRemain} giây</h1>
        <br />
        <button onClick={handleStart}>Start</button>
        <br />
        <button onClick={handleReset}>Reset</button>
      </div>
    </>
  );
};

export default CountdownTimer;
