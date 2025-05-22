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
//import context
import SocketContext from "../Context/SocketContext";
//improt service
import { getOrderHistory } from "../../services/perpetual/PerpetualService";
import Image from "next/image";
import { useTheme } from "next-themes";
import { capitalize } from "@/lib/stringCase";
import { toastAlert } from "@/lib/toastAlert";

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
export default function OrderHistory({ checkClose }: any) {
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
      const { status, loading, result } = await getOrderHistory(
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
      socketContext.perpSocket.on("perpetualClosedPnL", (result: any) => {
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
        socketContext.perpSocket.off("perpetualClosedPnL");
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
            <h6 className="text-center">No Records Found</h6>
          </div>
        }
        height={250}
      >
        <Table className={`${spot.spot_history_table}`}>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Closed PNL</th>
              <th>Entry Price</th>
              <th>Avg. Close Price</th>
              <th>Quantity</th>
              <th>Opened</th>
              <th>Closed</th>
              {/* <th>Symbol</th>
              <th>Direction</th>
              <th>Quantity</th>
              <th>Order Type</th>
              <th>Entry Price</th>
              <th>Open Time</th>
              <th>Close Price</th>
              <th>Close Time</th>
              <th>Realized PNL</th> */}
            </tr>
          </thead>
          <tbody>
            {!loader &&
              data?.length > 0 &&
              data.map((item: any, index: number) => {
                if ((!checkClose && item.pairId?._id == tradePair._id) || checkClose)
                  return (
                    <tr key={index}>
                      <td>
                        <span>{`${item?.pairId?.baseCoinSymbol}/${item?.pairId?.quoteCoinSymbol}`}</span>
                        {item.direction === "closed_long" ? (
                          <p style={green} className="mb-0">
                            Long
                          </p>
                        ) : (
                          <p style={red} className="mb-0">
                            Short
                          </p>
                        )}
                      </td>
                      <td>
                        <p style={item.pnl < 0 ? red : green} className="mb-0">
                          {item.pnl < 0
                            ? `${truncateDecimals(item.pnl, 8)}`
                            : `${truncateDecimals(item.pnl, 8)}`}
                        </p>
                      </td>
                      <td>
                        {truncateDecimals(
                          item.entryPrice,
                          item?.pairId?.quoteFloatDigit
                        ) + item?.pairId?.quoteCoinSymbol}
                      </td>
                      <td>
                        {truncateDecimals(
                          item.exitPrice,
                          item?.pairId?.quoteFloatDigit
                        ) + item?.pairId?.quoteCoinSymbol}
                      </td>
                      <td>
                        {truncateDecimals(
                          item.quantity,
                          item?.pairId?.baseFloatDigit
                        ) + item?.pairId?.baseCoinSymbol}
                      </td>
                      <td>{dateTimeFormat(item.openAt, "YYYY-MM-DD HH:mm")}</td>
                      <td>{dateTimeFormat(item.closedAt, "YYYY-MM-DD HH:mm")}</td>
                    </tr>
                  );
                // return (
                //   <tr key={index}>
                //     <td>
                //       <span>{`${item?.pairId?.baseCoinSymbol}/${item?.pairId?.quoteCoinSymbol}`}</span>
                //     </td>
                //     <td>
                //       {item.direction === "closed_long" ? (
                //         <p style={green} className="mb-0">
                //           Long
                //         </p>
                //       ) : (
                //         <p style={red} className="mb-0">
                //           Short
                //         </p>
                //       )}
                //     </td>

                //     <td>
                //       {truncateDecimals(
                //         item.quantity,
                //         item?.pairId?.baseFloatDigit
                //       ) + item?.pairId?.baseCoinSymbol}
                //     </td>
                //     <td>
                //       {item.orderType ? capitalize(item.orderType) : "-"}
                //     </td>
                //     <td>
                //       {truncateDecimals(
                //         item.entryPrice,
                //         item?.pairId?.quoteFloatDigit
                //       ) + item?.pairId?.quoteCoinSymbol}
                //     </td>
                //     <td>{dateTimeFormat(item.openAt, "YYYY-MM-DD HH:mm")}</td>
                //     <td>
                //       {truncateDecimals(
                //         item.exitPrice,
                //         item?.pairId?.quoteFloatDigit
                //       ) + item?.pairId?.quoteCoinSymbol}
                //     </td>
                //     <td>{dateTimeFormat(item.closedAt, "YYYY-MM-DD HH:mm")}</td>
                //     <td>
                //       <p style={item.pnl < 0 ? red : green} className="mb-0">
                //         {item.pnl < 0
                //           ? `${truncateDecimals(item.pnl, 8)}`
                //           : `${truncateDecimals(item.pnl, 8)}`}
                //       </p>
                //     </td>
                //   </tr>
                // );
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
