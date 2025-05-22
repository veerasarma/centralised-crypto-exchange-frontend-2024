// Import Swiper styles
// import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/globals.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor, useDispatch } from "../store";
import { useEffect, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import { NextPage } from "next";
import { AppProps } from "next/app";
import Router, { useRouter } from "next/router";
import SocketContext from "../components/Context/SocketContext";
import { IdleTimerProvider, IIdleTimer } from 'react-idle-timer';

import {
  spotSocket,
  perpSocket,
  inverSocket,
} from "../config/socketConnectivity";
import config from "../config";
import { createSocketUser } from "../config/socketConnectivity";
import Script from "next/script";
import Head from "next/head";
//import component
import HelperRoute from "../components/HelperRoute";
import { ThemeProvider } from "next-themes";
import { initialState, setUser } from "@/store/auth/userSlice";
import { onSignOutSuccess } from "@/store/auth/sessionSlice";
import { setUserSetting } from "@/store/UserSetting/dataSlice";
import { clearBankForm, clearGpayForm, clearUPIForm } from "@/store/PaymentMethods/bankSlice";
import { toastAlert } from "@/lib/toastAlert";

import { removeAuthToken } from '@/lib/localStorage'
import { removeAuthorization } from '@/config/axios'



const App: NextPage<AppProps> = ({ Component, pageProps }) => {
  const idleTimer = useRef<IIdleTimer>(null);
  // const dispatch = useDispatch()
  const history = useRouter();
  const [Loader, setLoader] = useState<boolean>(false);

  const isMaintenanceMode = true;

  Router.events.on("routeChangeStart", () => {
    setLoader(true);
  });

  Router.events.on("routeChangeComplete", () => {
    setLoader(false);
  });
  Router.events.on("routeChangeError", () => setLoader(false));

  useEffect(() => {
    typeof document !== undefined
      ? require("bootstrap/dist/js/bootstrap.bundle.min")
      : null;
  }, []);
  const { user } = store.getState().auth;
  // useEffect(() => {
  //   const { user } = store.getState().auth;
  //   if (user && user._id) createSocketUser(user._id);
  // }, []);

  const handleOnIdle = () => {
    console.log('User is idle');
    if (config.MODE !== "local") {
      handleLogout()
    }
    // Call the logout function when the user becomes idle
  };
  const handleLogout = () => {
    if (!localStorage.getItem("user")) {
      return
    }
    document.cookie =
      "loggedin" + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    // dispatch(setUser(initialState));
    // dispatch(onSignOutSuccess());
    // dispatch(setUserSetting({}));
    // dispatch(clearBankForm());
    // dispatch(clearGpayForm());
    // dispatch(clearUPIForm());
    // toastAlert("success", "Logout successfully", "logout");
    // localStorage.removeItem("user");
    // history.push("/login");
    // removeAuthToken()
    localStorage.removeItem("user");
    // removeAuthorization()
    document.cookie = 'userToken' + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/login'
    return true
  };
  useEffect(() => {
    if (user && user._id) {
      createSocketUser(user._id);

      // Listen for the reconnect event
      perpSocket.on("reconnect", () => {
        console.log("Reconnected to the server");
        createSocketUser(user._id);
      });

      // Clean up the event listeners on component unmount
      return () => {
        perpSocket.off("reconnect");
      };
    }
  }, [user]);
  useEffect(() => {
    const { user } = store.getState().auth;
    const start = () => setLoader(true);
    const end = () => setLoader(false);
    if (user && user._id) createSocketUser(user._id);
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    if (Router.isReady) {
      setLoader(false);
    }
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  // if (isMaintenanceMode) {
  //   return (
  //     <div>
  //       <h1>Site Under Maintenance</h1>
  //       <p>We're sorry, but the site is currently undergoing maintenance. Please check back later.</p>
  //     </div>
  //   );
  // }

  return (
    <>
      <IdleTimerProvider
        ref={idleTimer}
        timeout={1000 * 60 * 30}
        onIdle={handleOnIdle}
        debounce={500}
      >
        <Head>
          <title>Welcome to B5 Exchange</title>
          <meta
            name="description"
            content="B5 Exchange - The best global cryptocurrency exchange offers seamless and secured trading experience to buy, sell, trade bitcoin and other cryptos."
          />
          <meta
            name="keywords"
            content="B5 Exchange, cryptocurrency exchange, bitcoin exchange, best cryptocurrency exchange, cryptocurrency trading platform, buy bitcoin, buy and sell cryptocurrencies, buy and sell bitcoin, bitcoin trading, best cryptocurrency trading, cryptocurrency trading platform"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          />
          <link rel="icon" href="/favicon.png" />
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
          />
          <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"
            rel="stylesheet"
          ></link>

        </Head>
        <ThemeProvider>
          <Provider store={store}>
            <ToastContainer />
            <HelperRoute />
            <SocketContext.Provider
              value={{ spotSocket, perpSocket, inverSocket } as any}
            >
              <Script
                type="text/javascript"
                strategy="beforeInteractive"
                src="https://code.jquery.com/jquery-1.11.2.min.js"
              ></Script>

              <Script
                type="text/javascript"
                strategy="afterInteractive"
                src="/datafeeds/udf/dist/bundle.js"
                onReady={() => {
                  console.log("Script has loaded bundle");
                }}
              />
              <PersistGate persistor={persistor} loading={null}>
                {() => (
                  <>
                    {Loader ? (
                      <div className="loading-screen middle">
                        <div className="bar bar1"></div>
                        <div className="bar bar2"></div>
                        <div className="bar bar3"></div>
                        <div className="bar bar4"></div>
                      </div>
                    ) : (
                      <Component {...pageProps} />
                    )}
                  </>
                )}
              </PersistGate>
            </SocketContext.Provider>
          </Provider>
        </ThemeProvider>
      </IdleTimerProvider>
    </>
  );
};

export default App;
