import React, { useEffect } from "react";
import Routes from "./routes";
import ThemeCustomization from "./themes";
import ScrollTop from "./components/ScrollTop";
import { ToastContainer } from "react-toastify";
import { Store } from "./store";
import { subscribeToSocket, unSubscribeToSocket } from "./worker/socket";

const App = () => {
  useEffect(() => {
    subscribeToSocket(Store);

    // window.addEventListener("online", handleOnline);
    // window.addEventListener("offline", handleOffline);

    return () => {
      // unSubscribeToSocket();
      // window.removeEventListener("online", handleOnline);
      // window.removeEventListener("offline", handleOffline);
    };
  }, []);
  return (
    <>
      <ThemeCustomization>
        <ScrollTop>
          <Routes />
        </ScrollTop>
      </ThemeCustomization>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default App;
