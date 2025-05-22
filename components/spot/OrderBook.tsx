import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import spot from "@/styles/Spot.module.css";
//import store
import { useDispatch, useSelector } from "../../store";
//import socket
import SocketContext from "../Context/SocketContext";
//improt lib
import { toFixed } from "@/lib/roundOf";
import isEmpty from "@/lib/isEmpty";
//import service
import { getOrderBook } from "../../services/Spot/SpotService";
import { setOrderBookPrice } from "../../store/trade/dataSlice";

export default function OrderBook() {
  const { tradePair, marketData, openOrders } = useSelector((state: any) => state.spot);
  const socketContext = useContext<any>(SocketContext);
  const dispatch = useDispatch();

  const [view, setView] = useState("all");
  const [orderBook, setOrderBook] = useState<any>({
    buyOrder: [],
    sellOrder: [],
  });
  let { buyOrder, sellOrder } = orderBook;
  // function

  const [mpData, setmpData] = useState<any>();
  useEffect(() => {
    setmpData(marketData);
  }, [marketData, tradePair]);

  useEffect(() => {
    // socket
    socketContext.spotSocket.on("marketPrice", (result: any) => {
      if (tradePair._id == result.pairId) {
        setmpData(result?.data);
      }
    });
    return () => {
      socketContext.spotSocket.off("marketPrice");
    };
  }, [tradePair]);
  const fetchOrderBook = async (pairId: any) => {
    try {
      const { status, result } = await getOrderBook(pairId);

      if (status == "success") {
        setOrderBook({
          buyOrder: await mergeOrder(result.buyOrder, "buy"),
          sellOrder: await mergeOrder(result.sellOrder, "sell"),
        });
      }
    } catch (err) { }
  };
  useEffect(() => {
    if (!isEmpty(tradePair._id) && tradePair.botstatus == "bot") {
      fetchOrderBook(tradePair._id);
    }

    // // socket
    socketContext.spotSocket.on("orderBook", async (result: any) => {
      if (result.pairId == tradePair._id) {
        setOrderBook({
          buyOrder: await mergeOrder(result.buyOrder, "buy"),
          sellOrder: await mergeOrder(result.sellOrder, "sell"),
        });
      }
    });

    return () => {
      socketContext.spotSocket.off("orderBook");
    };
  }, [tradePair._id, marketData, openOrders]);
  const mergeOrder = async (data: any, type: string) => {
    try {
      let updatedOrder = data;
      if (type == "buy" && openOrders.length > 0) {
        let checkO = openOrders.filter((order: any) => (toFixed(updatedOrder[0]._id, tradePair.secondFloatDigit) >= toFixed(order.price, tradePair.secondFloatDigit) && toFixed(updatedOrder[updatedOrder.length - 1]._id, tradePair.secondFloatDigit) <= toFixed(order.price, tradePair.secondFloatDigit) && order.buyorsell == "buy"));
        if (checkO && checkO.length > 0) {
          checkO.forEach((matchedOrder: any) => {
            let existingOrder = updatedOrder.find((upd: any) =>
              toFixed(upd._id, tradePair.secondFloatDigit) === toFixed(matchedOrder.price, tradePair.secondFloatDigit)
            );
            if (existingOrder) {
              existingOrder.price = matchedOrder.price;
              existingOrder.status = 'open';
            }
          });
          // updatedOrder = updatedOrder.concat(openOrders).sort((a: any, b: any) => (b.price || b._id) - (a.price || a._id));
          return updatedOrder;
        }
      } else if (type == "sell" && openOrders.length > 0) {
        let checkO = openOrders.filter((order: any) => (toFixed(updatedOrder[0]._id, tradePair.secondFloatDigit) <= toFixed(order.price, tradePair.secondFloatDigit) && toFixed(updatedOrder[updatedOrder.length - 1]._id, tradePair.secondFloatDigit) >= toFixed(order.price, tradePair.secondFloatDigit) && order.buyorsell == "sell"));
        // if (checkO && checkO.length > 0) {
        //   updatedOrder.pop();
        //   return updatedOrder.concat(openOrders).sort((a: any, b: any) => (a.price || a._id) - (b.price || b._id));
        // }
        checkO.forEach((matchedOrder: any) => {
          let existingOrder = updatedOrder.find((upd: any) =>
            toFixed(upd._id, tradePair.secondFloatDigit) === toFixed(matchedOrder.price, tradePair.secondFloatDigit)
          );
          if (existingOrder) {
            existingOrder.price = matchedOrder.price;
            existingOrder.status = 'open';
          }
        });
        // updatedOrder = updatedOrder.concat(openOrders).sort((a: any, b: any) => (b.price || b._id) - (a.price || a._id));
        return updatedOrder;
      }
    } catch (err) {
      console.log(err, '-------98')
    }

    return data
  }
  return (
    <>
      <div className={spot.orderbook_wrap}>
        <div className={spot.orderbook_header}>
          <h6 className={spot.spot_head}>Order Book</h6>
          <div className={spot.orderbook_header_tips}>
            <button onClick={() => setView("all")}>
              <Image
                src="/assets/images/orderbook_icon_01.png"
                alt="Icon"
                className="img-fluid"
                width={16}
                height={16}
              />
            </button>
            <button onClick={() => setView("sell")}>
              <Image
                src="/assets/images/orderbook_icon_02.png"
                alt="Icon"
                className="img-fluid"
                width={16}
                height={16}
              />
            </button>
            <button onClick={() => setView("buy")}>
              <Image
                src="/assets/images/orderbook_icon_03.png"
                alt="Icon"
                className="img-fluid"
                width={16}
                height={16}
              />
            </button>
          </div>
        </div>
        <div className={spot.orderbook_wrap_inner} id="spotOrderbook">
          <div className={spot.orderbook_tbheader}>
            <div className={spot.content}>
              <div
                className={spot.item}
                style={{ justifyContent: "flex-start" }}
              >
                Price({tradePair?.secondCurrencySymbol})
              </div>
              <div className={spot.item} style={{ justifyContent: "flex-end" }}>
                Amount({tradePair?.firstCurrencySymbol})
              </div>
              <div className={spot.item} style={{ justifyContent: "flex-end" }}>
                Total
              </div>
            </div>
          </div>

          <div
            className={`${spot.orderlist_container} ${view == "sell" ? spot.show_sell : ""
              }  ${view == "buy" ? spot.show_buy : ""} `}
          >
            {(view == "sell" || view == "all") && (
              <div className={`${spot.orderbook_list} ${spot.orderbook_ask}`}>
                <div className={spot.orderbook_list_container}>
                  {sellOrder?.length > 0 &&
                    sellOrder.map((item: any, index: any) => {
                      var precentage = (item.quantity / item.total) * 100;
                      let total = item?.status == "open" ? item.price * item.quantity : item.total
                      if (
                        toFixed(
                          item?.quantity,
                          tradePair?.firstFloatDigit
                        ) > 0
                      ) {
                        return (
                          <>
                            <div
                              className={spot.orderbook_progress}
                              key={index}
                              onClick={() => {
                                dispatch(
                                  setOrderBookPrice(
                                    toFixed(
                                      item._id,
                                      tradePair.secondFloatDigit
                                    )
                                  )
                                );
                              }}
                            >
                              <div className={spot.progress_container}>
                                <div className={spot.row_content}>
                                  <div
                                    className={spot.ask_light}
                                  >
                                    {item?.status == "open" && <span>→</span>}
                                    {toFixed(
                                      item?.status == "open" ? item.price : item?._id,
                                      tradePair?.secondFloatDigit
                                    )}
                                  </div>
                                  <div className={spot.text}>
                                    {toFixed(
                                      item?.quantity,
                                      tradePair?.firstFloatDigit
                                    )}
                                  </div>
                                  <div className={spot.text}>
                                    {toFixed(
                                      item.total,
                                      tradePair?.secondFloatDigit
                                    )}
                                  </div>
                                  <div
                                    className={
                                      spot.orderbook_tbody_row_bar_sell
                                    }
                                    style={{ width: `${precentage}%` }}
                                  ></div>
                                </div>
                                <div
                                  className={`${spot.progress_bar} ${spot.ask_bar}`}
                                  style={{
                                    transform: "translateX(-14.385%)",
                                  }}
                                ></div>
                              </div>
                            </div>
                          </>
                        );
                      }
                    })}
                </div>
              </div>
            )}

            <div className={spot.orderbook_ticker}>
              <div className={`${spot.contractPrice}`}>
                {toFixed(mpData?.markPrice, tradePair?.secondFloatDigit)}
              </div>
            </div>
            {(view == "buy" || view == "all") && (
              <div className={`${spot.orderbook_list} ${spot.orderbook_bid}`}>
                <div className={spot.orderbook_list_container}>
                  {buyOrder?.length > 0 &&
                    buyOrder.map((item: any, index: any) => {
                      var precentage = (item.quantity / item.total) * 100;
                      let total = item?.status == "open" ? item.price * item.quantity : item.total
                      if (
                        toFixed(
                          item?.quantity,
                          tradePair?.firstFloatDigit
                        ) > 0
                      ) {
                        return (
                          <>
                            <div
                              className={spot.orderbook_progress}
                              key={index}
                              onClick={() => {
                                dispatch(
                                  setOrderBookPrice(
                                    toFixed(
                                      item._id,
                                      tradePair.secondFloatDigit
                                    )
                                  )
                                );
                              }}
                            >
                              <div className={spot.progress_container}>
                                <div className={spot.row_content}>
                                  <div
                                    className={spot.bid_light}
                                  >
                                    {item?.status == "open" && <span>→</span>}
                                    {toFixed(
                                      item?.status == "open" ? item.price : item?._id,
                                      tradePair?.secondFloatDigit
                                    )}

                                  </div>
                                  <div className={spot.text}>
                                    {toFixed(
                                      item?.quantity,
                                      tradePair?.firstFloatDigit
                                    )}
                                  </div>
                                  <div className={spot.text}>
                                    {toFixed(
                                      item.total,
                                      tradePair?.secondFloatDigit
                                    )}
                                  </div>
                                  <div
                                    className={spot.orderbook_tbody_row_bar_buy}
                                    style={{ width: `${precentage}%` }}
                                  ></div>
                                </div>
                                <div
                                  className={`${spot.progress_bar} ${spot.bid_bar}`}
                                  style={{
                                    transform: "translateX(-14.385%)",
                                  }}
                                ></div>
                              </div>
                            </div>
                          </>
                        );
                      }
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
