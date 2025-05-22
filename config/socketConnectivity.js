// import package
import io from "socket.io-client";
import store from "../store";
// import lib
import config from "./index";
var connectionOptions = {
  // transports: ['websocket'],
  cookie: false,
  forceNew: true,
  reconnection: true,
  reconnectionDelay: 2000,
  reconnectionDelayMax: 600,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  // parser,
};

console.log(config.SPOT_API, "config.SPOT_API");
const spotSocket = io(config.SPOT_API);
const perpSocket = io(config.FUTURES_API);
const inverSocket = io(config.INVERSE_API);

const createSocketUser = (userId) => {
  spotSocket.emit("CREATEROOM", userId);
  perpSocket.emit("CREATEROOM", userId);
  inverSocket.emit("CREATEROOM", userId);
};

spotSocket.on("disconnect", (reason) => {
  const { user } = store.getState().auth;
  if (user && user._id) createSocketUser(user._id);
});

perpSocket.on("disconnect", (reason) => {
  const { user } = store.getState().auth;
  console.log(user, "-------36");
  if (user && user._id) createSocketUser(user._id);
});

export { spotSocket, perpSocket, inverSocket, createSocketUser };
