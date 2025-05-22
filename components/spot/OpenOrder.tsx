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
import { getOpenOrder } from "../../services/Spot/SpotService";
//import component
import CancelOrder from "./CancelOrder";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useDispatch } from "../../store";
import { setOpenOrders } from "@/store/trade/dataSlice";
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
export default function OpenOrder({ countRef, countRef2 }: any) {
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch()
  const { showSpot } = useSelector(
    (state: any) => state.UserSetting?.data?.mode
  );
  const socketContext = useContext<any>(SocketContext);
  const { tradePair } = useSelector((state: any) => state.spot);
  const [orderData, setOrderData] = useState<any>(initialValues);
  const [loader, setLoader] = useState<boolean>(false);
  const [copiedItems, setCopiedItems] = useState<any>({});
  const { currentPage, nextPage, limit, count, data } = orderData;
  const isLogin = useSelector((state: any) => state.auth.session.signedIn);

  // function
  const fetchOpenOrder = async (reqData: any, pairId: string) => {
    try {
      const { status, loading, result } = await getOpenOrder(reqData, pairId);
      setLoader(loading);
      if (status == "success") {
        totalCount(result.data)
        console.log(data, '------resi;t', result.data)
        setOrderData({
          currentPage: result.currentPage,
          nextPage: result.nextPage,
          limit: result.limit,
          count: result.count,
          data: result.data, // [...data, ...result.data]
        });
        dispatch(setOpenOrders(result.data)) // [...data, ...result.data]
      } else {
        setOrderData({
          ...orderData,
          ...{ nextPage: false },
        });
      }
    } catch (err) { }
  };
  const totalCount = (data: any) => {
    try {
      let count = 0;
      for (let item of data) {
        if (showSpot || tradePair._id.toString() == item.pairId.toString()) {
          count += 1
        }
      }
      countRef.current.show(count);
      countRef2.current.show(count);
    } catch (err) {
      console.log(err, '-----104')
    }
  }
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
    fetchOpenOrder(reqData, tradePair._id);
  };
  const test = () => {
    countRef.current.show(10);
  };

  const handleCopy = (index: number, id: string) => {    
    navigator.clipboard
      .writeText(id)
      .then(() => {
        setCopiedItems((prevCopiedItems: any) => ({
          ...prevCopiedItems,
          [index]: true,
        }));
        toastAlert("success", "Order ID copied to clipboard", "login");
    
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
      setOrderData(initialValues);
      fetchOpenOrder(reqData, tradePair._id);

      // socket
      socketContext.spotSocket.on("openOrder", (result: any) => {
        if ((!showSpot && result.pairId == tradePair._id) || showSpot) {
          totalCount(result.data)
          setOrderData({
            currentPage: result.currentPage,
            nextPage: result.nextPage,
            limit: result.limit,
            count: result.count,
            data: result.data,
          });
          dispatch(setOpenOrders(result.data))
        }
      });
      return () => {
        socketContext.spotSocket.off("openOrder");
      };
    }
  }, [tradePair._id, isLogin]);

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
              <th>Date</th>
              <th>Pair</th>
              <th>Type</th>
              {/* <th>Order ID</th> */}
              <th>Side</th>
              <th>Price</th>
              <th>Amount</th>
              <th>Filled</th>
              <th>Total Order Value</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!loader &&
              data?.length > 0 &&
              data.map((item: any, index: number) => {
                if (showSpot || tradePair._id.toString() == item.pairId.toString()) {
                  return (
                    <tr key={index}>
                      <td>
                        {dateTimeFormat(item.orderDate, "YYYY-MM-DD HH:mm")}
                      </td>
                      <td>
                        {item.firstCurrency}/{item.secondCurrency}
                      </td>
                      <td>{capitalize(item.orderType)}</td>
                      {/* <td>
                      <i
                        className={copiedItems[index] ? 'fas fa-check' : 'far fa-copy'}
                        onClick={() => {
                          if (copiedItems[index]) return;
                          return handleCopy(index, item.orderCode)
                        }}
                        style={IconStyle}
                      ></i>
                      {" "} {item.orderCode}
                      </td> */}
                      <td>{capitalize(item.buyorsell)}</td>
                      <td>
                        {item.price == "market"
                          ? "Market"
                          : item.price &&
                          truncateDecimals(
                            item.price,
                            item?.pairDetail?.secondFloatDigit
                          )}
                      </td>
                      <td>
                        {item.openQuantity &&
                          truncateDecimals(
                            item.openQuantity,
                            item?.pairDetail?.firstFloatDigit
                          )}
                      </td>
                      <td>
                        {item.filledQuantity &&
                          truncateDecimals(
                            item.filledQuantity,
                            item?.pairDetail?.firstFloatDigit
                          )}
                      </td>
                      <td>
                        {item.orderValue &&
                          truncateDecimals(
                            item.orderValue ? item.orderValue : 0,
                            item?.pairDetail?.secondFloatDigit
                          )}
                      </td>
                      <td>
                        <CancelOrder orderInfo={item} />
                      </td>
                    </tr>
                  );
                }
              })}
            {loader && (
              <tr>
                <td colSpan={9}>
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
