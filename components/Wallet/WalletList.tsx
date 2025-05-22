import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import styles from "@/styles/common.module.css";
import { Container, InputGroup, Table, Form } from "react-bootstrap";
import { useRouter } from "next/router";
//import store
import { useSelector, useDispatch } from "../../store";
import { getAssetData, getPriceConversion } from "../../store/Wallet/dataSlice";
//import lib
import isEmpty from "@/lib/isEmpty";
import { toFixed, truncateDecimals } from "@/lib/roundOf";
//import Component
import InternalTranf from "./InternalTransfer";
import config from "../../config";
import { getPositionOrder } from "@/services/perpetual/PerpetualService";
import { OpenOrderFormValues } from "../Futures/types";
import { capitalize } from "@/lib/stringCase";
import { dateTimeFormat } from "@/lib/dateTimeHelper";
import { unrealizedPnL } from "@/lib/bybit";
import SocketContext from "../Context/SocketContext";
import { apiGetUserDeposit } from "@/services/Wallet/WalletService";
import FutureWallet from "./futureWallet"
import InverseWallet from "./inverseWallet"
import { useTheme } from "next-themes";
const initialValues: OpenOrderFormValues = {
  currentPage: 1,
  nextPage: true,
  limit: 10,
  count: 0,
  data: [],
};
const red: React.CSSProperties = {
  color: "#EF5350",
};
const green: React.CSSProperties = {
  color: "#14B778",
};
export default function WalletList() {
  const socketContext = useContext<any>(SocketContext);
  const dispatch = useDispatch();
  const router = useRouter();
  const { assets, currency, priceConversion } = useSelector(
    (state: any) => state.wallet
  );
  const { pairList } = useSelector((state: any) => state.spot);
  const { tradePair } = useSelector((state: any) => state.perpetual);
  const [Wallet, setWallet] = useState<any>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [orderData, setOrderData] = useState<any>();
  const [totalBTC, setTotalBTC] = useState<number>(0);
  const [totalUSD, setTotalUSD] = useState<number>(0);
  const [totUnreal, setTotUnreal] = useState<number>(0);
  const [check, setCheck] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState(0);
  const [subTab, setSubActive] = useState(0);
  const [show, setShow] = useState(false);
  const [filter, setFilter] = useState(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleTabClick = (tabid: any) => {
    setActiveTab(tabid);
  };
  const handleSubTab = (tabid: any) => {
    setSubActive(tabid);
  };
  const { theme, setTheme } = useTheme();
  // function
  const fetchPositionHistory = async (reqData: any, pairId: string) => {
    try {
      let params = { ...reqData, ...{ pairId } };
      const { status, loading, result } = await getPositionOrder(params);
      setLoader(loading);
      if (status == "success") {
        setOrderData(result.data);
        let totUnrealized = 0
        for (let item of result.data) {
          let unReal = parseFloat(toFixed(
            unrealizedPnL({
              entryPrice: item.entryPrice,
              quantity: item.quantity,
              lastPrice: item.pairDetail.markPrice || item.entryPrice,
              buyorsell: item.side,
            }),
            item.pairDetail.quoteFloatDigit
          ))
          totUnrealized += unReal
        }
        setTotUnreal(totUnrealized)
      } else {
        setOrderData({
          ...orderData,
        });
      }
    } catch (err) {
      console.log("err: ", err);
    }
  };
  useEffect(() => {
    apiGetUserDeposit()
  }, [])
  useEffect(() => {
    let reqData = {
      page: 1,
      limit: 100,
    };
    fetchPositionHistory(reqData, tradePair._id);
    socketContext.perpSocket.emit("subscribe", tradePair.tikerRoot + "perp");
    socketContext.perpSocket.emit("subscribe", "perpetual");
    // socket
    socketContext.perpSocket.on("usdtPerMarketPrice", (result: any) => {
      setOrderData((el: any) => {
        let orderList: any = [];
        let totUnrealized = 0
        el && el.map((item: any) => {
          if (item.pairId == result.pairId) {
            let unReal = parseFloat(toFixed(
              unrealizedPnL({
                entryPrice: item.entryPrice,
                quantity: item.quantity,
                lastPrice: result.data.markPrice || item.entryPrice,
                buyorsell: item.side,
              }),
              item.pairDetail.quoteFloatDigit
            ))
            totUnrealized += unReal

            orderList.push({
              ...item,
              pairDetail: result.data,
            });
          } else {
            let unReal = parseFloat(toFixed(
              unrealizedPnL({
                entryPrice: item.entryPrice,
                quantity: item.quantity,
                lastPrice: item.pairDetail.markPrice || item.entryPrice,
                buyorsell: item.side,
              }),
              item.pairDetail.quoteFloatDigit
            ))
            totUnrealized += unReal
            orderList.push(item);
          }
        });

        setTotUnreal(totUnrealized)
        return orderList;
      });
    });

    return () => {
      socketContext.perpSocket.off("usdtPerMarketPrice");
    };
  }, [tradePair._id])
  useEffect(() => {
    return () => {
      socketContext.perpSocket.emit("unSubscribe", tradePair.tikerRoot + "perp");
      socketContext.perpSocket.emit("unSubscribe", "perpetual");
    };
  }, []);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;
    function getSearch(item: any) {
      return (
        item.coin.toLowerCase() == value?.toLowerCase() ||
        item.spotBal == value ||
        item.spotInOrder == value ||
        item.USDValue == value ||
        item.affiliateBal == value ||
        item.spotLockedBal == value ||
        item.USDTValue == value
      );
    }
    let filterDoc = Wallet.filter(getSearch);
    if (!isEmpty(filterDoc)) {
      setFilter(true);
      setWallet(filterDoc);
    } else {
      setFilter(false);
    }
    if (isEmpty(value)) {
      setFilter(true);
      handleAsset();
    }
  };

  const handleAsset = () => {
    try {
      let totalAmount: any = 0;
      let tempArr = [...assets];
      currency?.length > 0 &&
        currency.map((item: any, index: number) => {
          let PriceCnv = priceConversion.find(
            (el: any) =>
              el.baseSymbol == item.coin && el.convertSymbol == "USDT"
          );
          let pairIndex =
            tempArr &&
            tempArr.findIndex((el: any) => {
              return el._id == item._id;
            });
          console.log(pairIndex, '------203', item.coin)
          if (pairIndex >= 0 && !isEmpty(pairIndex)) {
            let btnStatus = "deActive";
            if (item?.type == "crypto" && item.status == "active") {
              btnStatus = "active";
            } else if (item.type == "token") {
              tempArr[pairIndex].tokenAddressArray.map((el: any) => {
                let currDoc = currency.find((e: any) => {
                  return e._id == el.currencyId;
                });
                if (currDoc?.status == "active") {
                  btnStatus = "active";
                }
              });
            }
            let usdtPC = priceConversion.find(
              (el: any) =>
                el.baseSymbol == item.coin && el.convertSymbol == "USDT"
            );
            // let bal: any =
            //   parseFloat(tempArr[pairIndex].spotBal) +
            //   parseFloat(tempArr[pairIndex].inverseBal) +
            //   parseFloat(tempArr[pairIndex].derivativeBal);

            let affiliateBal =
              parseFloat(tempArr[pairIndex].affiliateBal) +
              parseFloat(tempArr[pairIndex].spotLockedBal)
            let bal =
              activeTab == 0
                ? tempArr[pairIndex].spotBal
                : activeTab == 1
                  ? tempArr[pairIndex].inverseBal
                  : activeTab == 2
                    ? tempArr[pairIndex].derivativeBal
                    : affiliateBal;
            console.log(bal, "----------92");
            tempArr[pairIndex] = {
              ...tempArr[pairIndex],
              ...{
                image: item.image,
                decimals: item.type == "token" ? item.decimals : item.contractDecimal,
                status: item.status,
                USDValue: !isEmpty(PriceCnv?.convertPrice)
                  ? parseFloat(bal) * parseFloat(PriceCnv.convertPrice)
                  : parseFloat(bal),
                USDTValue: !isEmpty(usdtPC?.convertPrice)
                  ? affiliateBal * parseFloat(usdtPC.convertPrice)
                  : affiliateBal,
                btnStatus,
                type: item.type,
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
        console.log(totalAmount, "------113", btcPrice);
        setTotalBTC(
          parseFloat(totalAmount) * parseFloat(btcPrice.convertPrice)
        );
      }
      setWallet(tempArr);
    } catch (err) {
      console.log("err:------ ", err);
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
  //         let usdtPC = priceConversion.find(
  //           (el: any) =>
  //             el.baseSymbol == item.coin && el.convertSymbol == "USDT"
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
  //             // parseFloat(tempArr[pairIndex].derivativeBal);
  //             parseFloat(tempArr[pairIndex].derivativeBalWB);
  //           let affiliateBal =
  //             parseFloat(tempArr[pairIndex].affiliateBal) +
  //             parseFloat(tempArr[pairIndex].spotLockedBal)
  //           tempArr[pairIndex] = {
  //             ...tempArr[pairIndex],
  //             ...{
  //               image: item.image,
  //               decimals: item.type == "token" ? item.decimals : item.contractDecimal,
  //               status: item.status,
  //               BTCVal: !isEmpty(PriceCnv?.convertPrice)
  //                 ? bal * parseFloat(PriceCnv.convertPrice)
  //                 : bal,
  //               USDValue: !isEmpty(usdtPC?.convertPrice)
  //                 ? bal * parseFloat(usdtPC.convertPrice)
  //                 : bal,
  //               USDTValue: !isEmpty(usdtPC?.convertPrice)
  //                 ? affiliateBal * parseFloat(usdtPC.convertPrice)
  //                 : affiliateBal,
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
  //     setWallet(tempArr);
  //     console.log('tempArr: ', tempArr);
  //   } catch (err) {
  //     console.log("err:------ ", err);
  //   }
  // };

  const handleTrade = (coin: string) => {
    let doc = pairList.find(
      (el: any) => el.firstCurrencySymbol == coin && el.secondCurrencySymbol == "USDT"
    );
    if (!doc) {
      doc = pairList.find(
        (el: any) => el.firstCurrencySymbol == coin
      );
    }
    if (!doc) {
      doc = pairList.find(
        (el: any) => el.secondCurrencySymbol == coin
      );
    }
    if (!isEmpty(doc)) {
      window.open(
        `/spot/${doc.firstCurrencySymbol}_${doc.secondCurrencySymbol}`,
        "_blank"
      );
    } else {
      window.open(`/spot/BTC_USDT`, "_blank");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isEmpty(priceConversion) || isEmpty(assets))
          await dispatch(getPriceConversion());
        await dispatch(getAssetData());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    if (
      isEmpty(Wallet) &&
      !isEmpty(assets) &&
      !isEmpty(currency) &&
      !isEmpty(priceConversion)
    ) {
      handleAsset();
    }
  }, [assets, currency, priceConversion]);

  useEffect(() => {
    if (!isEmpty(Wallet)) {
      handleAsset();
    }
  }, [activeTab, assets]);

  return (
    <>
      <div className={`mb-5 ${styles.inner_head_box}`}>
        <Container>
          <div className={`${styles.asset_box} ${styles.asset_box_wallet}`}>
            <div>
              <p>Total Assets Value</p>
              <h5>
                {truncateDecimals(totalBTC, 8)} BTC ≈{" "}
                {truncateDecimals(totalUSD, 2)} USDT
              </h5>
            </div>
            <div className="buttonWalletFlex">
              <button
                className={`me-3 ${styles.primary_btn}`}
                onClick={handleShow}
              >
                <span></span>
                <label>Transfer</label>
              </button>
              <button
                className={`me-3 ${styles.primary_btn}`}
                onClick={() => router.push("/deposit")}
              >
                <span></span>
                <label>Deposit</label>
              </button>
              <button
                className={`${styles.primary_btn}`}
                onClick={() => router.push("/withdraw")}
              >
                <span></span>
                <label>Withdraw</label>
              </button>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        <div className={`my-4 ${styles.asset_table_head}`}>
          <InputGroup className="">
            <Form.Control
              placeholder="Search"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              className={styles.text}
              onChange={handleSearch}
            />
            <InputGroup.Text id="basic-addon2" className={styles.grp_text}>
              <Image
                src="/assets/images/search.png"
                alt="image"
                className="img-fluid"
                width={16}
                height={16}
              />
            </InputGroup.Text>
          </InputGroup>
          <Form.Group
            className={`${styles.check_box}`}
            controlId="exampleForm.ControlInput1"
          >
            <Form.Check
              type="checkbox"
              onClick={() => setCheck(check ? false : true)}
              label="Assets above 0"
              className={styles.check}
              name="radioGroup1"
              id={`default-checkbox`}
            />
          </Form.Group>
        </div>

        <div className={`${styles.tab_head}`}>
          <p
            className={`${activeTab === 0 ? styles.active : ""}`}
            onClick={() => handleTabClick(0)}
          >
            Spot wallet
          </p>
          <p
            className={`${activeTab === 2 ? styles.active : ""}`}
            onClick={() => handleTabClick(2)}
          >
            Future wallet
          </p>
          {config.MODE !== "prod" && (
            <p
              className={`${activeTab === 1 ? styles.active : ""}`}
              onClick={() => handleTabClick(1)}
            >
              Inverse wallet
            </p>
          )}
          <p
            className={`${activeTab === 3 ? styles.active : ""}`}
            onClick={() => handleTabClick(3)}
          >
            Affiliate wallet
          </p>
        </div>

        {activeTab === 0 && (
          <div className={styles.asset_table}>
            <Table responsive>
              <thead>
                <tr>
                  <th>Coin</th>
                  <th> Available </th>
                  <th>In Orders</th>
                  <th>Sub Total</th>
                  <th>Estimated Value(USDT)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {Wallet?.length > 0 ? (
                  Wallet.map((item: any, index: number) => {
                    if (filter && item.type != "fiat") {
                      if (check) {
                        if (item.spotBal > 0) {
                          return (
                            <tr key={index}>
                              <td>
                                <div>
                                  {!isEmpty(item.image) && (
                                    <Image
                                      src={item.image}
                                      alt="image"
                                      className="img-fluid me-3"
                                      width={27}
                                      height={27}
                                    />
                                  )}
                                  <span>{item.coin}</span>
                                </div>
                              </td>
                              <td>
                                {parseFloat(item.spotBal) >= 0
                                  ? truncateDecimals(
                                    item.spotBal,
                                    item.decimals
                                  )
                                  : 0}
                              </td>
                              <td>
                                {!isEmpty(parseFloat(item.spotInOrder))
                                  ? truncateDecimals(
                                    parseFloat(item.spotInOrder),
                                    item.decimals
                                  )
                                  : 0}
                              </td>
                              <td>
                                {truncateDecimals(
                                  parseFloat(item.spotBal) +
                                    parseFloat(item.spotInOrder) >=
                                    0
                                    ? parseFloat(item.spotBal) +
                                    parseFloat(item.spotInOrder)
                                    : 0,
                                  item.decimals
                                )}
                              </td>
                              <td>
                                {parseFloat(item.USDValue) >= 0
                                  ? truncateDecimals(
                                    item.USDValue,
                                    item.decimals
                                  )
                                  : 0}
                              </td>
                              <td>
                                <div>
                                  {item.btnStatus == "active" && (
                                    <>
                                      <button
                                        onClick={() => router.push("/deposit")}
                                        className={`${styles.primary_btn}`}
                                        disabled={
                                          item.btnStatus == "active"
                                            ? false
                                            : true
                                        }
                                      >
                                        <span></span>
                                        <label>Deposit</label>
                                      </button>
                                      <button
                                        onClick={() => router.push("/withdraw")}
                                        className={`${styles.primary_btn} mx-2`}
                                        disabled={
                                          item.btnStatus == "active"
                                            ? false
                                            : true
                                        }
                                      >
                                        <span></span>
                                        <label>Withdraw</label>
                                      </button>
                                    </>
                                  )}

                                  <button
                                    onClick={() => handleTrade(item.coin)}
                                    className={`${styles.primary_btn}`}
                                  >
                                    <span></span>
                                    <label>Trade</label>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      } else {
                        return (
                          <tr key={index}>
                            <td>
                              <div>
                                {!isEmpty(item.image) && (
                                  <Image
                                    src={item.image}
                                    alt="image"
                                    className="img-fluid me-3"
                                    width={27}
                                    height={27}
                                  />
                                )}
                                <span>{item.coin}</span>
                              </div>
                            </td>
                            <td>
                              {parseFloat(item.spotBal) >= 0
                                ? truncateDecimals(item.spotBal, item.decimals)
                                : 0}
                            </td>
                            <td>
                              {!isEmpty(item.spotInOrder)
                                ? truncateDecimals(
                                  item.spotInOrder,
                                  item.decimals
                                )
                                : 0}
                            </td>
                            <td>
                              {truncateDecimals(
                                parseFloat(item.spotBal) +
                                  parseFloat(item.spotInOrder) >=
                                  0
                                  ? parseFloat(item.spotBal) +
                                  parseFloat(item.spotInOrder)
                                  : 0,
                                item.decimals
                              )}
                            </td>
                            <td>
                              {parseFloat(item.USDValue) >= 0
                                ? truncateDecimals(item.USDValue, item.decimals)
                                : 0}
                            </td>
                            <td>
                              <div>
                                {item.btnStatus == "active" && (
                                  <>
                                    <button
                                      onClick={() =>
                                        router.push(`/deposit?id=${item._id}`)
                                      }
                                      className={`${styles.primary_btn}`}
                                      disabled={
                                        item.btnStatus == "active"
                                          ? false
                                          : true
                                      }
                                      title={
                                        item.btnStatus != "active"
                                          ? "Disabled"
                                          : ""
                                      }
                                    >
                                      <span></span>
                                      <label>Deposit</label>
                                    </button>
                                    <button
                                      onClick={() =>
                                        router.push(`/withdraw?id=${item._id}`)
                                      }
                                      className={`${styles.primary_btn} mx-2`}
                                      disabled={
                                        item.btnStatus == "active"
                                          ? false
                                          : true
                                      }
                                      title={
                                        item.btnStatus != "active"
                                          ? "Disabled"
                                          : ""
                                      }
                                    >
                                      <span></span>
                                      <label>Withdraw</label>
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => handleTrade(item.coin)}
                                  className={`${styles.primary_btn}`}
                                >
                                  <span></span>
                                  <label>Trade</label>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    }
                  })
                ) : (
                  <tr>
                    <td colSpan={12}>
                      <div className="d-flex flex-column gap-3 align-items-center m-5">
                        {theme === "light_theme" ? (
                          <Image
                            src="/assets/images/nodata_light.svg"
                            alt="No data"
                            className="img-fluid"
                            width={96}
                            height={96}
                          />
                        ) : (
                          <Image
                            src="/assets/images/nodata.svg"
                            alt="No data"
                            className="img-fluid"
                            width={96}
                            height={96}
                          />
                        )}
                        <h6>No Records Found</h6>
                      </div>
                    </td>
                  </tr>
                )
                }
              </tbody>
            </Table>
          </div>
        )}
        {activeTab === 1 && (
          <InverseWallet Wallet={Wallet} check={check} filter={filter} />
          // <div className={styles.asset_table}>
          //   <Table responsive>
          //     <thead>
          //       <tr>
          //         <th>Coin</th>
          //         <th> Equity </th>
          //         <th> Free </th>
          //         <th> In Market </th>
          //       </tr>
          //     </thead>
          //     <tbody>
          //       {Wallet?.length > 0 &&
          //         Wallet.map((item: any, index: number) => {
          //           if (filter && item.type != "fiat") {
          //             if (check) {
          //               if (item.inverseBal > 0) {
          //                 return (
          //                   <tr key={index}>
          //                     <td>
          //                       <div>
          //                         {!isEmpty(item.image) && (
          //                           <Image
          //                             src={item.image}
          //                             alt="image"
          //                             className="img-fluid me-3"
          //                             width={27}
          //                             height={27}
          //                           />
          //                         )}
          //                         <span>{item.coin}</span>
          //                       </div>
          //                     </td>
          //                     <td>
          //                       {parseFloat(item.inverseBal) >= 0
          //                         ? truncateDecimals(
          //                           parseFloat(item.inverseBal),
          //                           item.decimals
          //                         )
          //                         : 0}
          //                     </td>
          //                     <td>
          //                       {parseFloat(item.inverseBal) >= 0
          //                         ? truncateDecimals(
          //                           parseFloat(item.inverseBal) -
          //                           parseFloat(item.inverseLockBal),
          //                           item.decimals
          //                         )
          //                         : 0}
          //                     </td>
          //                     <td>
          //                       {parseFloat(item.inverseBal) >= 0
          //                         ? truncateDecimals(
          //                           parseFloat(item.inverseLockBal),
          //                           item.decimals
          //                         )
          //                         : 0}
          //                     </td>
          //                   </tr>
          //                 );
          //               }
          //             } else {
          //               return (
          //                 <tr>
          //                   <td>
          //                     <div>
          //                       {!isEmpty(item.image) && (
          //                         <Image
          //                           src={item.image}
          //                           alt="image"
          //                           className="img-fluid me-3"
          //                           width={27}
          //                           height={27}
          //                         />
          //                       )}
          //                       <span>{item.coin}</span>
          //                     </div>
          //                   </td>
          //                   <td>
          //                     {parseFloat(item.inverseBal) >= 0
          //                       ? truncateDecimals(
          //                         parseFloat(item.inverseBal),
          //                         item.decimals
          //                       )
          //                       : 0}
          //                   </td>
          //                   <td>
          //                     {parseFloat(item.inverseBal) >= 0
          //                       ? truncateDecimals(
          //                         parseFloat(item.inverseBal) -
          //                         parseFloat(item.inverseLockBal),
          //                         item.decimals
          //                       )
          //                       : 0}
          //                   </td>
          //                   <td>
          //                     {parseFloat(item.inverseBal) >= 0
          //                       ? truncateDecimals(
          //                         parseFloat(item.inverseLockBal),
          //                         item.decimals
          //                       )
          //                       : 0}
          //                   </td>
          //                 </tr>
          //               );
          //             }
          //           }
          //         })}
          //     </tbody>
          //   </Table>
          // </div>
        )}
        {activeTab === 2 && (
          <FutureWallet Wallet={Wallet} check={check} filter={filter} />
          // <section className={`${styles.peer} ${styles.myorder}`}>
          //   <div className={styles.tabbox}>
          //     <div
          //       className={`${subTab === 0 ? styles.active : ""}`}
          //       onClick={() => handleSubTab(0)}
          //     >
          //       Positions
          //     </div>
          //     <div
          //       className={`${subTab === 1 ? styles.active : ""}`}
          //       onClick={() => handleSubTab(1)}
          //     >
          //       Assets
          //     </div>
          //     <label>
          //       Unrealized PNL:{" "}
          //       <span style={toFixed(totUnreal, 2) > 0 ? green : red}>{toFixed(totUnreal, 2)}</span>
          //     </label>
          //     {/* <label>
          //       Realized PNL:{" "}
          //       <span style={red}>-0.001</span>
          //     </label> */}
          //   </div>
          //   {subTab === 0 && <div className={styles.asset_table}>
          //     <Table responsive>
          //       <thead>
          //         <tr>
          //           <th>Contracts</th>
          //           <th>Date</th>
          //           <th>Side</th>
          //           <th>Amount</th>
          //           <th>Entry Price</th>
          //           <th>Liquidation Price</th>
          //           <th>Take Profit</th>
          //           <th>Stop Loss</th>
          //           <th>Unrealized PNL</th>
          //         </tr>
          //       </thead>
          //       <tbody>
          //         {!loader &&
          //           orderData?.length > 0 &&
          //           orderData.map((item: any, index: number) => {
          //             let unReal = toFixed(
          //               unrealizedPnL({
          //                 entryPrice: item.entryPrice,
          //                 quantity: item.quantity,
          //                 lastPrice: item.pairDetail.markPrice || item.entryPrice,
          //                 buyorsell: item.side,
          //               }),
          //               item.pairDetail.quoteFloatDigit
          //             )
          //             return (
          //               <tr key={index}>
          //                 <td>
          //                   {item.pairName}
          //                   <br />
          //                   <p style={green} className="mb-0">
          //                     {capitalize(item.mode)} {item.leverage}x
          //                   </p>
          //                 </td>
          //                 <td>
          //                   {" "}
          //                   {dateTimeFormat(item.createdAt, "YYYY-MM-DD HH:mm")}
          //                 </td>
          //                 <td>
          //                   {item.side === "buy" ? (
          //                     <p style={green} className="mb-0">
          //                       Long
          //                     </p>
          //                   ) : (
          //                     <p style={red} className="mb-0">
          //                       Short
          //                     </p>
          //                   )}
          //                 </td>
          //                 <td>
          //                   {truncateDecimals(
          //                     item.quantity,
          //                     item.pairDetail.baseFloatDigit
          //                   )}
          //                 </td>
          //                 <td>
          //                   {truncateDecimals(
          //                     item.entryPrice,
          //                     item.pairDetail.quoteFloatDigit
          //                   )}
          //                 </td>
          //                 <td>
          //                   {truncateDecimals(
          //                     item.liquidationPrice,
          //                     item.pairDetail.quoteFloatDigit
          //                   )}
          //                 </td>

          //                 <td>
          //                   {item.isTP ? (
          //                     <span>
          //                       {item.tpPrice}
          //                     </span>
          //                   ) : "-"}
          //                 </td>
          //                 <td>
          //                   {item.isSL ? (
          //                     <span>
          //                       {item.slPrice}
          //                     </span>
          //                   ) : "-"}
          //                 </td>
          //                 <td>
          //                   {
          //                     unReal > 0 ? (
          //                       <span className="text-success">{unReal}</span>
          //                     ) : (
          //                       <span className="text-danger">{unReal}</span>
          //                     )
          //                   }
          //                 </td>

          //               </tr>
          //             );

          //           })}
          //       </tbody>
          //     </Table>
          //   </div>}
          //   {subTab === 1 &&
          //     <div className={styles.asset_table}>
          //       <Table responsive>
          //         <thead>
          //           <tr>
          //             <th>Coin</th>
          //             <th> Equity </th>
          //             <th> Wallet Balance </th>
          //             <th> Free </th>
          //             <th> In Market </th>
          //           </tr>
          //         </thead>
          //         <tbody>
          //           {Wallet?.length > 0 &&
          //             Wallet.map((item: any, index: number) => {
          //               console.log(item, '------1030')
          //               if (filter && item.type != "fiat") {
          //                 if (check) {
          //                   if (item.derivativeBal > 0) {
          //                     return (
          //                       <tr key={index}>
          //                         <td>
          //                           <div>
          //                             {!isEmpty(item.image) && (
          //                               <Image
          //                                 src={item.image}
          //                                 alt="image"
          //                                 className="img-fluid me-3"
          //                                 width={27}
          //                                 height={27}
          //                               />
          //                             )}
          //                             <span>{item.coin}</span>
          //                           </div>
          //                         </td>
          //                         <td>
          //                           {parseFloat(item.derivativeBal) >= 0
          //                             ? truncateDecimals(
          //                               parseFloat(item.derivativeBal),
          //                               item.decimals
          //                             )
          //                             : 0}
          //                         </td>
          //                         <td>
          //                           {parseFloat(item.derivativeBal) >= 0
          //                             ? truncateDecimals(
          //                               parseFloat(item.derivativeBal),
          //                               item.decimals
          //                             )
          //                             : 0}
          //                         </td>
          //                         <td>
          //                           {parseFloat(item.derivativeBal) >= 0
          //                             ? truncateDecimals(
          //                               parseFloat(item.derivativeBal) -
          //                               parseFloat(item.derivativeBalLocked),
          //                               item.decimals
          //                             )
          //                             : 0}
          //                         </td>
          //                         <td>
          //                           {parseFloat(item.derivativeBal) >= 0
          //                             ? truncateDecimals(
          //                               parseFloat(item.derivativeBalLocked),
          //                               item.decimals
          //                             )
          //                             : 0}
          //                         </td>
          //                       </tr>
          //                     );
          //                   }
          //                 } else {
          //                   return (
          //                     <tr>
          //                       <td>
          //                         <div>
          //                           {!isEmpty(item.image) && (
          //                             <Image
          //                               src={item.image}
          //                               alt="image"
          //                               className="img-fluid me-3"
          //                               width={27}
          //                               height={27}
          //                             />
          //                           )}
          //                           <span>{item.coin}</span>
          //                         </div>
          //                       </td>
          //                       <td>
          //                         {parseFloat(item.derivativeBal) >= 0
          //                           ? truncateDecimals(
          //                             parseFloat(item.derivativeBal),
          //                             item.decimals
          //                           )
          //                           : 0}
          //                       </td>
          //                       <td>
          //                         {parseFloat(item.derivativeBal) >= 0
          //                           ? truncateDecimals(
          //                             parseFloat(item.derivativeBal),
          //                             item.decimals
          //                           )
          //                           : 0}
          //                       </td>
          //                       <td>
          //                         {parseFloat(item.derivativeBal) >= 0
          //                           ? truncateDecimals(
          //                             parseFloat(item.derivativeBal) -
          //                             parseFloat(item.derivativeBalLocked),
          //                             item.decimals
          //                           )
          //                           : 0}
          //                       </td>
          //                       <td>
          //                         {parseFloat(item.derivativeBal) >= 0
          //                           ? truncateDecimals(
          //                             parseFloat(item.derivativeBalLocked),
          //                             item.decimals
          //                           )
          //                           : 0}
          //                       </td>
          //                     </tr>
          //                   );
          //                 }
          //               }
          //             })}
          //         </tbody>
          //       </Table>
          //     </div>}
          // </section>
        )}
        {activeTab === 3 && (
          <div className={styles.asset_table}>
            <Table responsive>
              <thead>
                <tr>
                  <th>Coin</th>
                  <th> Available </th>
                  <th>Spot Locked(Invested)</th>
                  <th>Sub Total</th>
                  <th>Estimated Value(USDT)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {Wallet?.length > 0 ? (
                  Wallet.map((item: any, index: number) => {
                    if (filter && item.type != "fiat") {
                      if (check) {
                        if (item.affiliateBal > 0) {
                          return (
                            <tr key={index}>
                              <td>
                                <div>
                                  {!isEmpty(item.image) && (
                                    <Image
                                      src={item.image}
                                      alt="image"
                                      className="img-fluid me-3"
                                      width={27}
                                      height={27}
                                    />
                                  )}
                                  <span>{item.coin}</span>
                                </div>
                              </td>
                              <td>
                                {parseFloat(item.affiliateBal) >= 0
                                  ? truncateDecimals(
                                    item.affiliateBal,
                                    item.decimals
                                  )
                                  : 0}
                              </td>
                              <td>
                                {parseFloat(item.spotLockedBal) >= 0
                                  ? truncateDecimals(
                                    item.spotLockedBal,
                                    item.decimals
                                  )
                                  : 0}
                              </td>
                              <td>
                                {truncateDecimals(
                                  parseFloat(item.affiliateBal) +
                                    parseFloat(item.spotLockedBal) >=
                                    0
                                    ? parseFloat(item.affiliateBal) +
                                    parseFloat(item.spotLockedBal)
                                    : 0,
                                  item.decimals
                                )}
                              </td>
                              <td>
                                {parseFloat(item.USDTValue) >= 0
                                  ? truncateDecimals(
                                    item.USDTValue,
                                    item.decimals
                                  )
                                  : 0}
                              </td>
                              <td>
                                <td>
                                  <button
                                    disabled={item.btnStatus != "active"}
                                    onClick={() => router.push("/affiliateUserDetail")}
                                    className={`${styles.primary_btn}`}
                                  >
                                    <span></span>
                                    <label>Transfer</label>
                                  </button>
                                </td>
                              </td>
                            </tr>
                          );
                        }
                      } else {
                        return (
                          <tr key={index}>
                            <td>
                              <div>
                                {!isEmpty(item.image) && (
                                  <Image
                                    src={item.image}
                                    alt="image"
                                    className="img-fluid me-3"
                                    width={27}
                                    height={27}
                                  />
                                )}
                                <span>{item.coin}</span>
                              </div>
                            </td>
                            <td>
                              {parseFloat(item.affiliateBal) >= 0
                                ? truncateDecimals(
                                  item.affiliateBal,
                                  item.decimals
                                )
                                : 0}
                            </td>
                            <td>
                              {parseFloat(item.spotLockedBal) >= 0
                                ? truncateDecimals(
                                  item.spotLockedBal,
                                  item.decimals
                                )
                                : 0}
                            </td>
                            <td>
                              {truncateDecimals(
                                parseFloat(item.affiliateBal) +
                                  parseFloat(item.spotLockedBal) >=
                                  0
                                  ? parseFloat(item.affiliateBal) +
                                  parseFloat(item.spotLockedBal)
                                  : 0,
                                item.decimals
                              )}
                            </td>
                            <td>
                              {parseFloat(item.USDTValue) >= 0
                                ? truncateDecimals(
                                  item.USDTValue,
                                  item.decimals
                                )
                                : 0}
                            </td>
                            <td>
                              <button
                                disabled={item.btnStatus != "active"}
                                onClick={() => router.push("/affiliateUserDetail")}
                                className={`${styles.primary_btn}`}
                              >
                                <span></span>
                                <label>Transfer</label>
                              </button>
                            </td>
                          </tr>
                        );
                      }
                    }
                  })
                ) : (
                  <tr>
                    <td colSpan={12}>
                      <div className="d-flex flex-column gap-3 align-items-center m-5">
                        {theme === "light_theme" ? (
                          <Image
                            src="/assets/images/nodata_light.svg"
                            alt="No data"
                            className="img-fluid"
                            width={96}
                            height={96}
                          />
                        ) : (
                          <Image
                            src="/assets/images/nodata.svg"
                            alt="No data"
                            className="img-fluid"
                            width={96}
                            height={96}
                          />
                        )}
                        <h6>No Records Found</h6>
                      </div>
                    </td>
                  </tr>
                )
                }
              </tbody>
            </Table>
          </div>
        )}

        <InternalTranf show={show} handleClose={handleClose} totUnreal={totUnreal} />
      </Container>
    </>
  );
}
