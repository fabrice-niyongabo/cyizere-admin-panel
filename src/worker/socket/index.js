import { io } from "socket.io-client";
import { EVENT_NAMES_ENUM, SOCKET_URL } from "../../constants";
import {
  addPaymentList,
  deletePaymentList,
} from "../../actions/supplierpayments";

let mSocket = undefined;
let mStore = undefined;

export const subscribeToSocket = (store) => {
  mStore = store;
  if (mSocket !== undefined) {
    return;
  }

  const { user } = mStore.getState();

  mSocket = io(SOCKET_URL);
  mSocket.on("connect", () => {
    console.log("connected to socket");
  });
  emitSocket("addUser", { userType: "admin", email: user.email });
  mSocket.on("NtumaEventNames", (data) => {
    // console.log(data);
    if (
      data.type !== undefined &&
      data.data !== undefined &&
      mStore !== undefined
    ) {
      dispatchBasicAppData(data, mStore);
    }
  });

  mSocket.on("disconnect", () => {
    console.log("disconnected from socket");
  });
  mSocket.on("connect_error", (err) => {
    // console.log(`socket connect_error due to ${err.message}`);
    // console.log(JSON.stringify(err));
  });
};

const dispatchBasicAppData = (data, store) => {
  //supplier payments
  if (data.type === EVENT_NAMES_ENUM.ADD_SUPPLIERS_PAYMENT_DETAILS) {
    store.dispatch(addPaymentList(data.data));
  }
  if (data.type === EVENT_NAMES_ENUM.DELETE_SUPPLIERS_PAYMENT_DETAILS) {
    store.dispatch(deletePaymentList(data.data));
  }
};

export const unSubscribeToSocket = () => {
  mSocket !== undefined && mSocket.disconnect();
  console.log("Socket Disconnected");
};

export const emitSocket = (eventName, data) => {
  mSocket !== undefined && mSocket.emit(eventName, data);
};
