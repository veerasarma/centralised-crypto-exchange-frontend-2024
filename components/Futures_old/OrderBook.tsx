import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import spot from "@/styles/Spot.module.css";
//import store
import { useDispatch, useSelector } from "../../store";
//import socket
import SocketContext from "../Context/SocketContext";
//improt lib
import { toFixed, toFixedDown } from "@/lib/roundOf";
import isEmpty from "@/lib/isEmpty";
//import service
import { getOrderBook } from "../../services/perpetual/PerpetualService";
import { setOrderBookPrice } from "@/store/perpetual/dataSlice";

export default function OrderBook() {
  const dispatch = useDispatch();
  const { tradePair, marketData } = useSelector(
    (state: any) => state.perpetual
  );
  const socketContext = useContext<any>(SocketContext);
  const [view, setView] = useState("all");
  const [orderBook, setOrderBook] = useState<any>({
    buyOrder: [],
    sellOrder: [],
  });
  let { buyOrder, sellOrder } = orderBook;
  // function
  const fetchOrderBook = async (pairId: any) => {
    try {
      const { status, result } = await getOrderBook(pairId);

      if (status == "success") {
        setOrderBook({
          sellOrder: result.sellOrder,
          buyOrder: result.buyOrder,
        });
      }
    } catch (err) { }
  };
  useEffect(() => {
    if (!isEmpty(tradePair._id) && tradePair.botstatus == "off") {
      fetchOrderBook(tradePair._id);
    }

    // // socket
    socketContext.perpSocket.on("usdtPerOrderBook", (result: any) => {
      if (result.pairId == tradePair._id) {
        setOrderBook({
          buyOrder: result.buyOrder,
          sellOrder: result.sellOrder,
        });
      }
    });

    return () => {
      socketContext.perpSocket.off("usdtPerOrderBook");
    };
  }, [tradePair, marketData]);
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
                Price({tradePair?.quoteCoinSymbol})
              </div>
              <div className={spot.item} style={{ justifyContent: "flex-end" }}>
                Amount({tradePair?.baseCoinSymbol})
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
                      return (
                        <>
                          <div className={spot.orderbook_progress} key={index}>
                            <div className={spot.progress_container}>
                              <div className={spot.row_content}>
                                <div
                                  className={spot.ask_light}
                                  onClick={() => {
                                    dispatch(
                                      setOrderBookPrice(
                                        toFixed(
                                          item._id,
                                          tradePair.quoteFloatDigit
                                        )
                                      )
                                    );
                                  }}
                                >
                                  {toFixed(
                                    item?._id,
                                    tradePair?.quoteFloatDigit
                                  )}
                                </div>
                                <div className={spot.text}>
                                  {toFixed(
                                    item?.quantity,
                                    tradePair?.baseFloatDigit
                                  )}
                                </div>
                                <div className={spot.text}>
                                  {toFixed(
                                    item?.total,
                                    tradePair?.baseFloatDigit
                                  )}
                                </div>
                                <div
                                  className={spot.orderbook_tbody_row_bar_sell}
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
                    })}
                </div>
              </div>
            )}

            <div className={spot.orderbook_ticker}>
              <div className={`${spot.contractPrice}`}>
                {toFixed(marketData?.markPrice, tradePair?.quoteFloatDigit)}
              </div>
              {/* <div className={`${spot.contractPrice} ${spot.yellow}`}>
                                {toFixedDown(marketData?.markPrice, tradePair?.quoteFloatDigit)}
                            </div> */}
            </div>
            {(view == "buy" || view == "all") && (
              <div className={`${spot.orderbook_list} ${spot.orderbook_bid}`}>
                <div className={spot.orderbook_list_container}>
                  {buyOrder?.length > 0 &&
                    buyOrder.map((item: any, index: any) => {
                      var precentage = (item.quantity / item.total) * 100;
                      return (
                        <>
                          <div className={spot.orderbook_progress} key={index}>
                            <div className={spot.progress_container}>
                              <div className={spot.row_content}>
                                <div
                                  className={spot.bid_light}
                                  onClick={() => {
                                    dispatch(
                                      setOrderBookPrice(
                                        toFixed(
                                          item._id,
                                          tradePair.quoteFloatDigit
                                        )
                                      )
                                    );
                                  }}
                                >
                                  {toFixed(
                                    item?._id,
                                    tradePair?.quoteFloatDigit
                                  )}
                                </div>
                                <div className={spot.text}>
                                  {toFixed(
                                    item?.quantity,
                                    tradePair?.baseFloatDigit
                                  )}
                                </div>
                                <div className={spot.text}>
                                  {toFixed(
                                    item?.total,
                                    tradePair?.baseFloatDigit
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
