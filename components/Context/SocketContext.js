import { createContext } from "react";

const SocketContext = createContext({
  spotSocket: "",
  userSocket: "",
  p2pSocket: "",
  perpSocket: "",
});

export default SocketContext;
