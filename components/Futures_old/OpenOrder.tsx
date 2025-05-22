import { useEffect, useState, useContext } from "react";
import { useSelector } from "../../store";
import spot from "@/styles/Spot.module.css";
import { Table } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import styles from '@/styles/common.module.css';

//import types
import { OpenOrderFormValues } from "./types";
//improt lib
import isEmpty from "@/lib/isEmpty";
import { dateTimeFormat } from "../../lib/dateTimeHelper";
import { truncateDecimals } from "../../lib/roundOf";
import { capitalize, firstLetterCase } from "../../lib/stringCase";
//import context
import SocketContext from "../Context/SocketContext";
//improt service
import { getOpenOrder } from "../../services/perpetual/PerpetualService";
//import component
import CancelOrder from "./CloseOrder";
import TPEdit from "./TpEditModal";
import SLEdit from "./SlEditModal";
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
const IconStyle: React.CSSProperties = {
  color: "#FDE573",
};
const red: React.CSSProperties = {
  color: "#EF5350",
};
const green: React.CSSProperties = {
  color: "#14B778",
};
export default function OpenOrder({ countRef }: any) {
  const { showOFuture } = useSelector(
    (state: any) => state.UserSetting?.data?.mode
  );
  const { theme, setTheme } = useTheme();
  const socketContext = useContext<any>(SocketContext);
  const { tradePair } = useSelector((state: any) => state.perpetual);
  const [orderData, setOrderData] = useState<any>(initialValues);
  const [loader, setLoader] = useState<boolean>(false);
  const { currentPage, nextPage, limit, count, data } = orderData;
  const isLogin = useSelector((state: any) => state.auth.session.signedIn);
  const [tpData, setTpData] = useState<any>();
  const [slData, setSlData] = useState<any>();
  const [tpEdit, setTpEdit] = useState(false);
  const tpEditShow = () => setTpEdit(true);
  const tpEditClose = () => setTpEdit(false);
  const [slEdit, setSlEdit] = useState(false);
  const slEditShow = () => setSlEdit(true);
  const slEditClose = () => setSlEdit(false);
  // function
  const fetchOpenOrder = async (reqData: any, pairId: string) => {
    try {
      const { status, loading, result } = await getOpenOrder(reqData, pairId);
      setLoader(loading);
      if (status == "success") {
        totalCount(result.data)
        setOrderData({
          currentPage: result.currentPage,
          nextPage: result.nextPage,
          limit: result.limit,
          count: result.count,
          data: result.data, // [...data, ...result.data],
        });
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
        if (showOFuture || tradePair._id.toString() == item.pairId.toString()) {
          count += 1
        }
      }
      countRef.current.show(count);
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

  useEffect(() => {
    if (!isEmpty(tradePair._id) && isLogin && !isEmpty(currentPage)) {
      let reqData = {
        page: currentPage,
        limit,
      };
      setOrderData(initialValues);
      fetchOpenOrder(reqData, tradePair._id);

      // socket
      socketContext.perpSocket.on("perpetualOpenOrder", (result: any) => {
        if ((showOFuture && result.pairId == tradePair._id) || !showOFuture) {
          totalCount(result.data)
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
        socketContext.perpSocket.off("perpetualOpenOrder");
      };
    }
  }, [tradePair._id, isLogin, showOFuture]);
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
              <th>contracts</th>
              <th>Side</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Filled Total</th>
              <th>Order Type</th>
              <th>Take Profit</th>
              <th>Stop Loss</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!loader &&
              data?.length > 0 &&
              data.map((item: any, index: number) => {
                if (showOFuture || tradePair._id.toString() == item.pairId.toString()) {
                  return (
                    <tr key={index}>
                      <td>
                        {dateTimeFormat(item.orderDate, "YYYY-MM-DD HH:mm")}
                      </td>
                      <td>
                        {item.baseCoinSymbol}/{item.quoteCoinSymbol}
                      </td>
                      <td>
                        {item.buyorsell === "buy" ? (
                          <p style={green} className="mb-0">
                            Open Long
                          </p>
                        ) : (
                          <p style={red} className="mb-0">
                            Open Short
                          </p>
                        )}
                      </td>
                      <td>
                        {" "}
                        {item.orderType === "market"
                          ? "Market"
                          : truncateDecimals(
                            item.price,
                            tradePair.quoteFloatDigit
                          )}
                      </td>
                      <td>
                        {" "}
                        {truncateDecimals(
                          item.quantity,
                          tradePair.baseFloatDigit
                        )}
                      </td>
                      <td>
                        {" "}
                        {truncateDecimals(
                          item.orderValue ? item.orderValue : 0,
                          tradePair.quoteFloatDigit
                        )}
                      </td>
                      <td>
                        {" "}
                        {capitalize(item.orderType)}
                      </td>
                      <td>
                        {item.status == "open" ? (
                          <span>
                            {item.tpPrice > 0 ? item.tpPrice : "Add"}
                            &nbsp;
                            <i
                              onClick={() => {
                                tpEditShow();
                                setTpData(item);
                              }}
                              style={IconStyle}
                              className="far fa-edit"
                            ></i>
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        {item.status == "open" ? (
                          <span>
                            {item.slPrice > 0 ? item.slPrice : "Add"}
                            &nbsp;
                            <i
                              onClick={() => {
                                slEditShow();
                                setSlData(item);
                              }}
                              style={IconStyle}
                              className="far fa-edit"
                            ></i>
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>{capitalize(item.status)}</td>
                      <td>
                        <CancelOrder orderInfo={item} type={"order"} />
                      </td>
                    </tr>
                  );
                }
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

      <TPEdit
        tpEditShow={tpEdit}
        tpEditClose={tpEditClose}
        side={tpData?.buyorsell}
        tpPrice={tpData?.tpPrice}
        _id={tpData?._id}
        pairId={tpData?.pairId}
        type={"order"}
      />
      <SLEdit
        slEditShow={slEdit}
        slEditClose={slEditClose}
        side={slData?.buyorsell}
        slPrice={slData?.slPrice}
        _id={slData?._id}
        pairId={slData?.pairId}
        type={"order"}
      />
    </div>
  );
}
