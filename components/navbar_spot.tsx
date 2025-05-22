import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "@/styles/common.module.css";
import { Container, Dropdown, Navbar, Nav, Offcanvas } from "react-bootstrap";
import { useRouter } from "next/router";
//improt store
import { useDispatch, useSelector } from "../store";
import { setUserSetting } from "../store/UserSetting/dataSlice";
import { onSignOutSuccess } from "../store/auth/sessionSlice";
import { setUser, initialState } from "../store/auth/userSlice";
import {
  clearBankForm,
  clearGpayForm,
  clearUPIForm,
} from "@/store/PaymentMethods/bankSlice";
//import lib
import { toastAlert } from "@/lib/toastAlert";
import isEmpty from "@/lib/isEmpty";
import { truncateDecimals } from "@/lib/roundOf";
import logo from "../public/assets/images/logo.svg";
import ThemeSwitcher from "./ThemeSwitcher";
import { useTheme } from "next-themes";
import config from "../config";
import { createSocketUser, perpSocket } from "@/config/socketConnectivity";
import Link from "next/link";

export default function Mainnavbar_spot() {
  const { theme } = useTheme();
  const history = useRouter();
  const dispatch = useDispatch();
  const { session, user } = useSelector((state: any) => state.auth);
  const { assets, currency, priceConversion } = useSelector(
    (state: any) => state.wallet
  );
  const [isClient, setIsClient] = useState(false);
  const [showOnramp, setShowOnramp] = useState(false);
  const [totalBTC, setTotalBTC] = useState<number>(0);
  const [totalUSD, setTotalUSD] = useState<number>(0);
  const [hide, setHide] = useState(true);

  const handleShowOnramp = () => setShowOnramp(true);
  const closeOnramp = () => setShowOnramp(false);

  const copyToClipboard = (text: string) => {
    const tempInput = document.createElement("input");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    toastAlert("success", "Copied", "copy");
  };
  useEffect(() => {
    window.addEventListener("online", () => {
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
    });
    window.addEventListener("offline", () => { });
  }, []);
  const handleLogout = () => {
    document.cookie =
      "loggedin" + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    dispatch(setUser(initialState));
    dispatch(onSignOutSuccess());
    dispatch(setUserSetting({}));
    dispatch(clearBankForm());
    dispatch(clearGpayForm());
    dispatch(clearUPIForm());
    toastAlert("success", "Logout successfully", "logout");
    localStorage.removeItem("user");
    history.push("/login");
  };

  useEffect(() => {
    setIsClient(true);
  }, []);
  const handleAsset = () => {
    let totalAmount: any = 0;
    let tempArr = [...assets];
    currency?.length > 0 &&
      currency.map((item: any, index: number) => {
        let PriceCnv = priceConversion.find(
          (el: any) => el.baseSymbol == item.coin && el.convertSymbol == "USDT"
        );
        let pairIndex =
          tempArr &&
          tempArr.findIndex((el: any) => {
            return el._id == item._id;
          });
        if (pairIndex >= 0 && !isEmpty(pairIndex)) {
          let total =
            parseFloat(tempArr[pairIndex].spotBal) +
            parseFloat(tempArr[pairIndex].inverseBal) +
            parseFloat(tempArr[pairIndex].derivativeBal);
          tempArr[pairIndex] = {
            ...tempArr[pairIndex],
            ...{
              image: item.image,
              decimals: item.decimals,
              USDValue: !isEmpty(PriceCnv?.convertPrice)
                ? total * parseFloat(PriceCnv.convertPrice)
                : total,
            },
          };
          if (tempArr[pairIndex].USDValue >= 0) {
            totalAmount += tempArr[pairIndex].USDValue;
          }
        }
      });
    setTotalUSD(totalAmount);
    let btcPrice = priceConversion.find(
      (el: any) => el.baseSymbol == "USDT" && el.convertSymbol == "BTC"
    );
    if (!isEmpty(btcPrice)) {
      setTotalBTC(parseFloat(totalAmount) * parseFloat(btcPrice.convertPrice));
    }
  };
  // const handleAsset = () => {
  //   try {
  //     let totalAmount: any = 0;
  //     let tempArr = [...assets];
  //     currency?.length > 0 &&
  //       currency.map((item: any, index: number) => {
  //         let PriceCnv = priceConversion.find(
  //           (el: any) => el.baseSymbol == item.coin && el.convertSymbol == "BTC"
  //         );
  //         let pairIndex =
  //           tempArr &&
  //           tempArr.findIndex((el: any) => {
  //             return el._id == item._id;
  //           });
  //         if (pairIndex >= 0 && !isEmpty(pairIndex)) {
  //           let btnStatus = "deActive";
  //           if (item?.type == "crypto" && item.status == "active") {
  //             btnStatus = "active";
  //           } else if (item.type == "token") {
  //             tempArr[pairIndex].tokenAddressArray.map((el: any) => {
  //               let currDoc = currency.find((e: any) => {
  //                 return e._id == el.currencyId;
  //               });
  //               if (currDoc?.status == "active") {
  //                 btnStatus = "active";
  //               }
  //             });
  //           }
  //           let bal =
  //             parseFloat(tempArr[pairIndex].spotBal) +
  //             parseFloat(tempArr[pairIndex].inverseBal) +
  //             parseFloat(tempArr[pairIndex].derivativeBal);
  //           tempArr[pairIndex] = {
  //             ...tempArr[pairIndex],
  //             ...{
  //               image: item.image,
  //               decimals: item.contractDecimal,
  //               status: item.status,
  //               BTCVal: !isEmpty(PriceCnv?.convertPrice)
  //                 ? bal * parseFloat(PriceCnv.convertPrice)
  //                 : bal,
  //               btnStatus,
  //               type: item.type,
  //             },
  //           };
  //           if (tempArr[pairIndex].BTCVal >= 0) {
  //             totalAmount += tempArr[pairIndex].BTCVal;
  //           }
  //         }
  //       });
  //     setTotalBTC(parseFloat(totalAmount));
  //     let usdPrice = priceConversion.find(
  //       (el: any) => el.baseSymbol == "BTC" && el.convertSymbol == "USDT"
  //     );
  //     if (!isEmpty(usdPrice)) {
  //       setTotalUSD(
  //         parseFloat(totalAmount) * parseFloat(usdPrice.convertPrice)
  //       );
  //     }
  //   } catch (err) {
  //     console.log("err:------ ", err);
  //   }
  // };
  useEffect(() => {
    if (session?.signedIn) {
      handleAsset();
    }
  }, [assets, currency, priceConversion]);
  return (
    <>
      <Navbar expand="lg" className="main_navbar px-2 me-1">
        {session?.signedIn && isClient && (
          <Navbar.Brand>
            <Link href="/wallet">
              <Image
                src={logo}
                alt="image"
                className="img-fluid"
                width={177}
                height={40}
              />
            </Link>
          </Navbar.Brand>
        )}
        {!session?.signedIn && (
          <Navbar.Brand>
            <Link href="/">
              <Image
                src={logo}
                alt="image"
                className="img-fluid"
                width={177}
                height={40}
              />
            </Link>
          </Navbar.Brand>
        )}
        <div className="navbar_switch_mobile">
          <ThemeSwitcher />
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`} />
        </div>
        <Navbar.Offcanvas
          id={`offcanvasNavbar-expand-lg`}
          aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
          placement="end"
          className="offcan_custom"
        >
          <Offcanvas.Header
            closeButton
            className="justify-content-end"
          ></Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-center flex-grow-1">
              {session?.signedIn && isClient && (
                <>
                  {user?.emailStatus == "verified" ? (
                    <Nav.Link href="#" className="grey d-lg-none">
                      {user?.email}
                    </Nav.Link>
                  ) : (
                    <Nav.Link href="#" className="grey d-lg-none">
                      {user?.phoneNo}
                    </Nav.Link>
                  )}

                  <Nav.Item className="grey d-lg-none border-bottom w-100 py-2 my-2">
                    <span className="d-flex gap-1 align-items-center">
                      UID:
                      <span className="copy px-0">
                        {user?.userId}{" "}
                        <Image
                          src="/assets/images/copy.png"
                          alt="image"
                          className="img-fluid"
                          width={18}
                          height={23}
                          onClick={() => copyToClipboard(user?.userId)}
                        />
                      </span>
                    </span>
                  </Nav.Item>
                  <Nav.Item className="grey d-lg-none border-bottom w-100 block-span py-2 mb-2">
                    <span className="d-block">
                      {" "}
                      Total Assets Value{" "}
                      <i
                        className={
                          hide
                            ? "fa-solid fa-eye ms-2"
                            : "fa-solid fa-eye-slash ms-2"
                        }
                        onClick={() => setHide(hide ? false : true)}
                      ></i>
                    </span>
                    <span>
                      {hide ? `${truncateDecimals(totalBTC, 8)} BTC` : "*****"}{" "}
                    </span>
                    <span>
                      {hide ? `${truncateDecimals(totalUSD, 2)} $` : "*****"}
                    </span>
                  </Nav.Item>
                </>
              )}

              {/* <Nav.Link href="/about" className="nav-link d-lg-none">
                About
              </Nav.Link>
              <Nav.Link href="/contactus" className="nav-link d-lg-none">
                Contact
              </Nav.Link>
              <Nav.Link href="/faq" className="nav-link d-lg-none">
                FAQ
              </Nav.Link> */}
              {/* <Nav.Link href="/market" className='nav-link d-lg-none'>Market</Nav.Link> */}
              {/* {session?.signedIn && isClient && (
                <Nav.Link href="/wallet" className="nav-link d-lg-none">
                  Wallets
                </Nav.Link>
              )} */}
              <Nav.Link href="/market">Market</Nav.Link>
              <Nav.Link href="/spot">Spot</Nav.Link>
              <Nav.Link href="/futures">Future</Nav.Link>
              {session?.signedIn && isClient && (
                <Nav.Link href="/wallet">Wallet</Nav.Link>
              )}
              {config.MODE !== "prod" && (
                <Nav.Link href="/inverse/BTC_USDT">Inverse</Nav.Link>
              )}
              {session?.signedIn && isClient && (
                <>
                  <Nav.Link
                    href="/affiliateProgram"
                    className="nav-link d-lg-none"
                  >
                    Affiliate Plans
                  </Nav.Link>
                  <Nav.Link
                    href="/affiliateUserDetail"
                    className="nav-link d-lg-none"
                  >
                    Affiliate Details
                  </Nav.Link>
                  <Dropdown
                    className="d-lg-flex d-none dropdown_submenu"
                    autoClose="outside"
                  >
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      Affiliate
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown_submenu_div">
                      <Dropdown.Item
                        href="#"
                        onClick={() => history.push("/affiliateProgram")}
                      >
                        Affiliate Plans
                      </Dropdown.Item>
                      <Dropdown.Item
                        href="#"
                        onClick={() => history.push("/affiliateUserDetail")}
                      >
                        Affiliate Details
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              )}
              {/* {config.MODE == "prod" && (
                <Nav.Link href="#">
                  Inverse
                  <sup className="coming-soon-nav">Coming Soon!</sup>
                </Nav.Link>
              )} */}

              {session?.signedIn && isClient && (
                <Nav.Link href="/security" className="nav-link d-lg-none">
                  Account & Security
                </Nav.Link>
              )}
              {session?.signedIn && isClient && (
                <Nav.Link href="/history" className="nav-link d-lg-none">
                  My History
                </Nav.Link>
              )}
              {session?.signedIn && isClient && (
                <Nav.Link href="/notification" className="nav-link d-lg-none">
                  My Message
                </Nav.Link>
              )}
              {session?.signedIn && isClient && (
                <Nav.Link href="/log-session" className="nav-link d-lg-none">
                  Log Session
                </Nav.Link>
              )}
              {session?.signedIn && isClient && (
                <Nav.Link href="/support-ticket" className="nav-link d-lg-none">
                  Support Ticket
                </Nav.Link>
              )}
              {session?.signedIn && isClient && (
                <Nav.Link
                  href="#"
                  onClick={() => handleLogout()}
                  className="nav-link d-lg-none"
                >
                  Log Out
                </Nav.Link>
              )}
            </Nav>
            <div className="d-none d-lg-flex">
              <ThemeSwitcher />
            </div>
            {session?.signedIn && isClient && (
              <>
                <Dropdown
                  className="d-flex profile d-lg-flex d-none"
                  autoClose="outside"
                >
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {theme === "light_theme" ? (
                      <Image
                        src="/assets/images/user_prf_light.png"
                        alt="image"
                        className={`img-fluid ${styles.usr_prf}`}
                        width={15}
                        height={18}
                      />
                    ) : (
                      <Image
                        src="/assets/images/user_prf.png"
                        alt="image"
                        className={`img-fluid ${styles.usr_prf}`}
                        width={15}
                        height={18}
                      />
                    )}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {user?.emailStatus == "verified" ? (
                      <Dropdown.Item href="#" className="grey">
                        {user?.email}
                      </Dropdown.Item>
                    ) : (
                      <Dropdown.Item href="#" className="grey">
                        {user?.phoneNo}
                      </Dropdown.Item>
                    )}

                    <Dropdown.ItemText className="grey border-bottom px-0">
                      <span className="d-flex gap-1 align-items-center">
                        UID:
                        <span className="copy px-0">
                          {user?.userId}{" "}
                          <Image
                            src="/assets/images/copy_dark.png"
                            alt="image"
                            className="img-fluid"
                            width={18}
                            height={23}
                            onClick={() => copyToClipboard(user?.userId)}
                          />
                        </span>
                      </span>
                    </Dropdown.ItemText>
                    <Dropdown.ItemText className="grey border-bottom px-0 drop-balance">
                      <span className="d-block balanceTitle">
                        {" "}
                        Total Assets Value{" "}
                      </span>
                      <div className="balance-flex">
                        <div className="balance-card">
                          <span>
                            {hide
                              ? `${truncateDecimals(totalBTC, 8)} BTC`
                              : "*****"}{" "}
                          </span>
                          <span className="d-block">
                            {hide
                              ? `${truncateDecimals(totalUSD, 2)} $`
                              : "*****"}
                          </span>
                        </div>
                        <div className="balance-visibile-icon">
                          <i
                            className={
                              hide
                                ? "fa-solid fa-eye me-2"
                                : "fa-solid fa-eye-slash me-2"
                            }
                            onClick={() => setHide(hide ? false : true)}
                          ></i>
                        </div>
                      </div>
                    </Dropdown.ItemText>
                    <div className="dropdownmenu_scroll">
                      {/* <Dropdown.Item
                        href="#"
                        onClick={() => history.push("/about")}
                      >
                        About
                      </Dropdown.Item>
                      <Dropdown.Item
                        href="#"
                        onClick={() => history.push("/contactus")}
                      >
                        Contact
                      </Dropdown.Item>
                      <Dropdown.Item
                        href="#"
                        onClick={() => history.push("/faq")}
                      >
                        FAQ
                      </Dropdown.Item> */}
                      {/* <Dropdown.Item
                        href="#"
                        onClick={() => history.push("/wallet")}
                      >
                        Wallets
                      </Dropdown.Item> */}
                      <Dropdown.Item
                        href="#"
                        onClick={() => history.push("/market")}
                      >
                        Market
                      </Dropdown.Item>
                      <Dropdown.Item
                        href="#"
                        onClick={() => history.push("/spot")}
                      >
                        Spot Trade
                      </Dropdown.Item>
                      <Dropdown.Item
                        href="#"
                        onClick={() => history.push("/futures")}
                      >
                        Future Trade
                      </Dropdown.Item>
                      {config.MODE !== "prod" && (
                        <Dropdown.Item
                          href="#"
                          onClick={() => history.push("/inverse/BTC_USDT")}
                        >
                          Inverse Trade
                        </Dropdown.Item>
                      )}
                      <Dropdown.Item
                        href="#"
                        onClick={() => history.push("/affiliateProgram")}
                      >
                        Affiliate Plans
                      </Dropdown.Item>
                      <Dropdown.Item
                        href="#"
                        onClick={() => history.push("/affiliateUserDetail")}
                      >
                        Affiliate Details
                      </Dropdown.Item>
                      <Dropdown.Item
                        href="#"
                        onClick={() => history.push("/security")}
                      >
                        Account & Security
                      </Dropdown.Item>
                      <Dropdown.Item
                        href="#"
                        onClick={() => history.push("/history")}
                      >
                        My History
                      </Dropdown.Item>
                      <Dropdown.Item
                        href="#"
                        onClick={() => history.push("/notification")}
                      >
                        My Message
                      </Dropdown.Item>
                      <Dropdown.Item
                        href="#"
                        onClick={() => history.push("/log-session")}
                      >
                        Log Session
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => history.push("/support-ticket")}
                      >
                        Support Ticket
                      </Dropdown.Item>
                      <Dropdown.Item href="#" onClick={() => handleLogout()}>
                        Log out
                      </Dropdown.Item>
                    </div>
                  </Dropdown.Menu>
                </Dropdown>
                {/* <Nav className="justify-content-start    ">
                    <Nav.Link href="#" onClick={() => history.push('/wallet')} >Wallets  </Nav.Link>
                    <Nav.Link href="#" className='d-lg-none' onClick={() => history.push('/security')}>Account & Security</Nav.Link>
                    <Nav.Link href="#" className='d-lg-none' onClick={() => history.push('/notification')}>My Message</Nav.Link>
                    <Nav.Link href="#" className='d-lg-none' onClick={() => handleLogout()}>Log out</Nav.Link >
                  </Nav> */}
              </>
            )}
            {!session?.signedIn && isClient && (
              <>
                <button
                  className={` ${styles.primary_btn} butn`}
                  onClick={() => history.push("/login")}
                >
                  <span></span>
                  <label>Login</label>
                </button>
                <button
                  className={`${styles.dark} ${styles.primary_btn} register butn`}
                  onClick={() => history.push("/register")}
                >
                  <span></span>
                  <label>Register</label>
                </button>
              </>
            )}
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Navbar>
    </>
  );
}
