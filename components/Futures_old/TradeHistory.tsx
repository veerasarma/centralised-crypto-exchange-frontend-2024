import { useEffect, useState, useContext } from "react";
import { useSelector } from "../../store";
import spot from "@/styles/Spot.module.css";
import { Table } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
//import types
import { OpenOrderFormValues } from "./types";
//improt lib
import isEmpty from "@/lib/isEmpty";
import { dateTimeFormat } from "../../lib/dateTimeHelper";
import { truncateDecimals } from "../../lib/roundOf";
import { capitalize } from "../../lib/stringCase";
//import context
import SocketContext from "../Context/SocketContext";
//improt service
import { getTradeHistory } from "../../services/perpetual/PerpetualService";
import Image from "next/image";
import { useTheme } from "next-themes";

const initialValues: OpenOrderFormValues = {
  currentPage: 1,
  nextPage: true,
  limit: 10,
  count: 0,
  data: [],
};
const spinner: React.CSSProperties = {
  fontSize: "36px",
};
const red: React.CSSProperties = {
  color: "#EF5350",
};
const green: React.CSSProperties = {
  color: "#14B778",
};
export default function TradeHistory() {
  const { theme, setTheme } = useTheme();
  const { tradePair } = useSelector((state: any) => state.perpetual);
  const socketContext = useContext<any>(SocketContext);
  const isLogin = useSelector((state: any) => state.auth.session.signedIn);
  // state
  const [loader, setLoader] = useState<boolean>(false);
  const [orderData, setOrderData] = useState<any>(initialValues);

  const { currentPage, nextPage, limit, count, data } = orderData;

  // function
  const fetchOrderHistory = async (reqData: any, pairId: string) => {
    try {
      const { status, loading, result } = await getTradeHistory(
        reqData,
        pairId
      );

      setLoader(loading);
      if (status == "success") {
        setOrderData({
          currentPage: result.currentPage,
          nextPage: result.nextPage,
          limit: result.limit,
          count: result.count,
          data: [...data, ...result.data],
        });
      } else {
        setOrderData({
          ...orderData,
          ...{ nextPage: false },
        });
      }
    } catch (err) { }
  };

  const fetchMoreData = () => {
    if (data.length >= count) {
      setOrderData({
        ...orderData,
        ...{ nextPage: false },
      });
      return;
    }

    let reqData = {
      page: currentPage + 1,
      limit,
    };
    fetchOrderHistory(reqData, tradePair._id);
  };

  useEffect(() => {
    if (!isEmpty(tradePair._id) && isLogin && !isEmpty(currentPage)) {
      let reqData = {
        page: currentPage,
        limit,
      };
      fetchOrderHistory(reqData, tradePair._id);
      setOrderData(initialValues);

      // socket
      socketContext.perpSocket.on("perpetualTradeHistory", (result: any) => {
        if (result.pairId == tradePair._id) {
          setOrderData({
            currentPage: result.currentPage,
            nextPage: result.nextPage,
            limit: result.limit,
            count: result.count,
            data: result.data,
          });
        }
      });
      return () => {
        socketContext.perpSocket.off("perpetualTradeHistory");
      };
    }
  }, [tradePair, isLogin]);

  return (
    <div className={spot.box}>
      <InfiniteScroll
        dataLength={data.length}
        next={fetchMoreData}
        hasMore={nextPage}
        loader={
          <div className="nodata">
            {theme === "light_theme" ? (
              <Image
                src="/assets/images/nodata_light.svg"
                alt="image"
                className="img-fluid"
                width={96}
                height={96}
              />
            ) : (
              <Image
                src="/assets/images/nodata.svg"
                alt="image"
                className="img-fluid"
                width={96}
                height={96}
              />
            )}
            <h6 className="text-center">No records found</h6>
          </div>
        }
        height={250}
      >
        <Table className={`${spot.spot_history_table}`}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Contracts</th>
              <th>Side</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Order Type</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>
            {!loader &&
              data?.length > 0 &&
              data.map((item: any, index: number) => {
                return (
                  <tr key={index}>
                    <td>
                      {dateTimeFormat(item.orderDate, "YYYY-MM-DD HH:mm")}
                    </td>
                    <td>
                      {" "}
                      {item.baseCoinSymbol}/{item.quoteCoinSymbol}
                    </td>
                    <td>
                      {item.buyorsell === "buy" ? (
                        <p className="mb-0" style={green}>
                          Long
                        </p>
                      ) : (
                        <p className="mb-0" style={red}>
                          Short
                        </p>
                      )}
                    </td>
                    <td>
                      {" "}
                      {truncateDecimals(
                        item.tradePrice,
                        tradePair.quoteFloatDigit
                      )}
                    </td>
                    <td>
                      {" "}
                      {truncateDecimals(
                        item.tradeQty,
                        tradePair.baseFloatDigit
                      )}
                    </td>
                    <td>
                      {" "}
                      {capitalize(item.orderType)}
                    </td>
                    <td>
                      {" "}
                      {truncateDecimals(
                        item.tradePrice * item.tradeQty,
                        tradePair.quoteFloatDigit
                      )}
                    </td>
                  </tr>
                );
              })}
            {loader && (
              <tr>
                <td colSpan={10}>
                  <div className={spot.table_empty}>
                    <i className="fa fa-spinner fa-spin" style={spinner}></i>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </InfiniteScroll>
    </div>
  );
}
