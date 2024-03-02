import React, { createContext } from "react";

const UserContext = createContext({
  roomName: "default",
  userName: "",
});

export default UserContext;
