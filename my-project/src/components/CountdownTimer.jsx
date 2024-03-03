import React, { useEffect, useState } from "react";
import { onValue, realtimeDB, ref, set } from "../firebase";
import { toast } from "react-toastify";

const CountdownTimer = () => {
  const [timeRemain, setTimeRemain] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [count, setCount] = useState(0);

  const handleStart = (e) => {
    e.preventDefault();
    setIsRunning(true);
  };
  useEffect(() => {
    const timeRef = ref(realtimeDB, "rooms/" + "roomA");
    set(timeRef, { timeRemain: 60 });

    onValue(timeRef, (snapshot) => {
      const data = snapshot.val();

      console.log(data.timeRemain);
      setTimeRemain(data.timeRemain);
    });
  }, [isRunning]);

  useEffect(() => {
    //Implementing the setInterval method
    const timeRef = ref(realtimeDB, "rooms/" + "roomA");
    const interval = setInterval(() => {
      // setCount(count + 1);
      set(timeRef, { timeRemain: timeRemain - 1 });
    }, 1000);

    //Clearing the interval
    return () => clearInterval(interval);
  }, [count]);

  const handleChange = (e) => {
    e.preventDefault();
    const timeRef = ref(realtimeDB, "rooms/" + "roomA");
    set(timeRef, { timeRemain: timeRemain - 1 });
  };

  // useEffect(() => {
  //   let intervalId;
  //   const timeRef = ref(realtimeDB, "rooms/" + "roomA");
  //   set(timeRef, { timeRemain: 59 });
  //   if (isRunning) {
  //     intervalId = setInterval(() => {
  //       setTimeRemain((prevTime) => {
  //         if (prevTime.timeRemain > 0) {
  //           return { timeRemain: prevTime.timeRemain - 1 };
  //         } else {
  //           clearInterval(intervalId);
  //           return prevTime;
  //         }
  //       });
  //     }, 1000);
  //   }

  //   return () => clearInterval(intervalId);
  // }, [isRunning]);

  // const handleChange2 = (e) => {
  //   e.preventDefault();
  //   const timeRef = ref(realtimeDB, "rooms/" + "roomA");
  //   set(timeRef, { timeRemain: timeRemain - 1 });
  // };
  // const handleChange3 = (e) => {
  //   e.preventDefault();
  //   const timeRef = ref(realtimeDB, "rooms/" + "roomA");
  //   set(timeRef, { timeRemain: timeRemain - 1 });
  // };

  return (
    <>
      <div>
        <h1>{count}</h1>
        <h1>{timeRemain}</h1>
        <button onClick={handleChange}>Change</button>
        <br />
        <button onClick={handleStart}>Start</button>
        {/* <button onClick={handleChange2}>Change2</button>
        <button onClick={handleChange3}>Change3</button> */}
      </div>
    </>
  );
};

export default CountdownTimer;
