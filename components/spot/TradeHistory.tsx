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
import { getTradeHistory } from "../../services/Spot/SpotService";
import Image from "next/image";
import { useTheme } from "next-themes";
import { toastAlert } from "@/lib/toastAlert";
import NoAuth from "./NoAuth";

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
const IconStyle: React.CSSProperties = {
  color: "#FDE573",
};
export default function TradeHistory() {
  const { theme, setTheme } = useTheme();
  const { tradePair } = useSelector((state: any) => state.spot);
  const socketContext = useContext<any>(SocketContext);
  const isLogin = useSelector((state: any) => state.auth.session.signedIn);
  // state
  const [loader, setLoader] = useState<boolean>(false);
  const [orderData, setOrderData] = useState<any>(initialValues);
  const [copiedItems, setCopiedItems] = useState<any>({});

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
    } catch (err) {}
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

  const handleCopy = (index: number, id: string) => {    
    navigator.clipboard
      .writeText(id)
      .then(() => {
        setCopiedItems((prevCopiedItems: any) => ({
          ...prevCopiedItems,
          [index]: true,
        }));
        toastAlert("success", "Trade ID copied to clipboard", "login");
    
        setTimeout(() => {
          setCopiedItems((prevCopiedItems: any) => {
            const newCopiedItems = { ...prevCopiedItems };
            delete newCopiedItems[index];
            return newCopiedItems;
          });
        }, 5000);
      })
      .catch(() => {});
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
      socketContext.spotSocket.on("tradeHistory", (result: any) => {
        console.log("result: ", result);
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
        socketContext.spotSocket.off("tradeHistory");
      };
    }
  }, [tradePair, isLogin]);
  
  if (!isLogin) {
    return (
      <NoAuth />
    )
  }

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
              <th>Order No.</th>
              <th>Date</th>
              <th>Pair</th>
              <th>Side</th>
              <th>Price</th>
              <th>Executed</th>
              <th>Fee</th>
              <th>Total Order Value</th>
            </tr>
          </thead>
          <tbody>
            {!loader &&
              data?.length > 0 &&
              data.map((item: any, index: number) => {
                return (
                  <tr key={index}>
                    <td>
                      <i
                        className={copiedItems[index] ? 'fas fa-check' : 'far fa-copy'}
                        onClick={() => {
                          if (copiedItems[index]) return;
                          return handleCopy(index, item.orderCode)
                        }}
                        style={IconStyle}
                      ></i>
                      {" "}{item.orderCode} 
                    </td>
                    <td>
                      {dateTimeFormat(item.createdAt, "YYYY-MM-DD HH:mm")}
                    </td>
                    <td>
                      {item.firstCurrency}/{item.secondCurrency}
                    </td>
                    <td>{capitalize(item.buyorsell)}</td>
                    <td>
                      {truncateDecimals(
                        item.tradePrice,
                        tradePair.secondFloatDigit
                      )}
                    </td>
                    <td>
                      {truncateDecimals(
                        item.tradeQty,
                        tradePair.firstFloatDigit
                      )}
                    </td>
                    <td>
                      {truncateDecimals(item.fee, 8)}{" "}
                      {item.buyorsell == "buy"
                        ? item.firstCurrency
                        : item.secondCurrency}
                    </td>
                    <td>
                      {truncateDecimals(
                        item.tradePrice * item.tradeQty,
                        tradePair.secondFloatDigit
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
