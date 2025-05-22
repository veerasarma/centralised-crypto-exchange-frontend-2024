import { useEffect, useState, useContext } from "react";
import { useSelector } from "../../store";
import spot from "@/styles/Spot.module.css";
import { Table, Form } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import styles from "@/styles/common.module.css";

//import types
import { OpenOrderFormValues } from "./types";
//improt lib
import isEmpty from "@/lib/isEmpty";
import { dateTimeFormat } from "../../lib/dateTimeHelper";
import { toFixed, truncateDecimals } from "../../lib/roundOf";
//import context
import SocketContext from "../Context/SocketContext";
//improt service
import { getPositionOrder } from "../../services/inverse/InverseService";
//import component
import UnrealizedPnL from "./UnrealizedPnL";
import CancelPosition from "./CancelPosition";
import TPEdit from "./TpEditModal";
import SLEdit from "./SlEditModal";
import Image from "next/image";
import { useTheme } from "next-themes";
import { capitalize } from "@/lib/stringCase";
import { inverseIM, orderCost } from "@/lib/bybit";
import { setLeverage } from "@/store/UserSetting/dataSlice";
import { useDispatch } from "react-redux";
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
export default function PositionHistory({ countRef }: any) {

  const dispatch = useDispatch();
  const modeData = useSelector(
    (state) => state.UserSetting?.data?.mode
  );
  const { theme, setTheme } = useTheme();
  const { tradePair } = useSelector((state: any) => state.inverse);
  const socketContext = useContext<any>(SocketContext);
  const isLogin = useSelector((state: any) => state.auth.session.signedIn);
  const { showInverse } = useSelector(
    (state: any) => state.UserSetting?.data?.mode
  );

  // state
  const [loader, setLoader] = useState<boolean>(false);
  const [orderData, setOrderData] = useState<any>(initialValues);
  const [tpData, setTpData] = useState<any>();
  const [slData, setSlData] = useState<any>();
  const [tpEdit, setTpEdit] = useState(false);
  const tpEditShow = () => setTpEdit(true);
  const tpEditClose = () => setTpEdit(false);
  const [slEdit, setSlEdit] = useState(false);
  const slEditShow = () => setSlEdit(true);
  const slEditClose = () => setSlEdit(false);
  const { currentPage, nextPage, limit, count, data } = orderData;

  // function
  const fetchPositionHistory = async (reqData: any, pairId: string) => {
    try {
      let params = { ...reqData, ...{ pairId } };
      const { status, loading, result } = await getPositionOrder(params);
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
    } catch (err) {
      console.log("err: ", err);
    }
  };
  const totalCount = (data: any) => {
    try {
      let count = 0;
      let levStatus = false, newLev = { ...modeData }
      for (let item of data) {
        if (showInverse || tradePair._id.toString() == item.pairId.toString()) {
          count += 1
        }
        // if (tradePair._id.toString() == item.pairId.toString()) {
        //   levStatus = true
        //   newLev.inverseLeverage = item.leverage
        //   console.log(newLev, '--------111')
        // }
      }
      // if (!levStatus) {
      //   newLev.inverseLeverage = tradePair.leverage
      // }
      // console.log(newLev, '--------117')
      // dispatch(setLeverage(newLev))
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
    fetchPositionHistory(reqData, tradePair._id);
  };

  useEffect(() => {
    console.log(tradePair._id, '------11', isLogin, currentPage)
    if (!isEmpty(tradePair._id) && isLogin && !isEmpty(currentPage)) {
      let reqData = {
        page: currentPage,
        limit,
      };
      fetchPositionHistory(reqData, tradePair._id);
      setOrderData(initialValues);
      // socket
      socketContext.inverSocket.on("usdtPositionOrder", (result: any) => {
        if ((!showInverse && result.pairId == tradePair._id) || showInverse) {
          // countRef.current.show(result.data.length);
          totalCount(result.data)
          setOrderData({
            currentPage: 1,
            nextPage: true,
            limit: 10,
            count: result.data.length,
            data: result.data,
          });
        }
      });
      return () => {
        socketContext.inverSocket.off("usdtPositionOrder");
      };
    }
  }, [tradePair._id, isLogin, currentPage, showInverse]);
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
              <th>Contracts</th>
              <th>Date</th>
              <th>Side</th>
              <th>Amount</th>
              <th>Entry Price</th>
              <th>Value</th>
              <th>Liquidation Price</th>
              <th>Initial Margin</th>
              {/* <th>Order Cost</th> */}
              <th>Order Type</th>
              <th>Take Profit</th>
              <th>Stop Loss</th>
              <th>Unrealized PNL</th>
              {/* <th>Realized PNL</th> */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!loader &&
              data?.length > 0 &&
              data.map((item: any, index: number) => {
                if (showInverse || tradePair._id.toString() == item.pairId.toString()) {
                  return (
                    <tr key={index}>
                      <td>
                        {item.pairName}
                        <br />
                        <p style={green} className="mb-0">
                          {capitalize(item.mode)} {item.leverage}x
                        </p>
                      </td>
                      <td>
                        {" "}
                        {dateTimeFormat(item.createdAt, "YYYY-MM-DD HH:mm")}
                      </td>
                      <td>
                        {item.side === "buy" ? (
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
                        {item.side === "buy" ? (
                          <p style={green} className="mb-0">
                            {truncateDecimals(
                              item.quantity,
                              item.pairDetail.baseFloatDigit
                            )}
                          </p>
                        ) : (
                          <p style={red} className="mb-0">
                            -{truncateDecimals(
                              item.quantity,
                              item.pairDetail.baseFloatDigit
                            )}
                          </p>
                        )}
                      </td>
                      <td>
                        {truncateDecimals(
                          item.entryPrice,
                          item.pairDetail.quoteFloatDigit
                        )}
                      </td>
                      <td>
                        {truncateDecimals(
                          item.entryPrice * item.quantity,
                          item.pairDetail.quoteFloatDigit
                        )}
                      </td>
                      <td>
                        {truncateDecimals(
                          item.liquidationPrice,
                          item.pairDetail.quoteFloatDigit
                        )}
                      </td>
                      <td>
                        {truncateDecimals(
                          inverseIM({ price: item.entryPrice, quantity: item.quantity, leverage: item.leverage }),
                          item.pairDetail.quoteFloatDigit
                        )}
                      </td>
                      {/* <td>
                        {truncateDecimals(
                          orderCost({ price: item.entryPrice, quantity: item.quantity, leverage: item.leverage, takerFee: item.pairDetail.takerFee, buyorsell: item.side }),
                          item.pairDetail.quoteFloatDigit
                        )}
                      </td> */}
                      <td>
                        {capitalize(item.orderType)}
                      </td>

                      <td>
                        {item.isTP ? (
                          <span>
                            {item.tpPrice}
                            &nbsp;
                            <i
                              className="far fa-edit"
                              onClick={() => {
                                setTpData(item), tpEditShow();
                              }}
                              style={IconStyle}
                            ></i>
                          </span>
                        ) : (
                          <>
                            Add &nbsp;
                            <i
                              className="far fa-edit"
                              onClick={() => {
                                setTpData(item), tpEditShow();
                              }}
                              style={IconStyle}
                            ></i>
                          </>
                        )}
                      </td>
                      <td>
                        {item.isSL ? (
                          <span>
                            {item.slPrice}
                            &nbsp;
                            <i
                              className="far fa-edit"
                              onClick={() => {
                                slEditShow(), setSlData(item);
                              }}
                              style={IconStyle}
                            ></i>
                          </span>
                        ) : (
                          <>
                            Add &nbsp;
                            <i
                              className="far fa-edit"
                              onClick={() => {
                                slEditShow(), setSlData(item);
                              }}
                              style={IconStyle}
                            ></i>
                          </>
                        )}
                      </td>
                      <td>
                        <UnrealizedPnL positionDetail={item} />
                      </td>
                      {/* <td>
                      <RealizedPnl positionDetail={item} />
                    </td> */}
                      <td>
                        <CancelPosition orderInfo={item} type={"pos"} />
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
        side={tpData?.side}
        tpPrice={tpData?.tpPrice}
        _id={tpData?._id}
        pairId={tpData?.pairId}
        type={"pos"}
      />
      <SLEdit
        slEditShow={slEdit}
        slEditClose={slEditClose}
        side={slData?.side}
        slPrice={slData?.slPrice}
        _id={slData?._id}
        pairId={slData?.pairId}
        type={"pos"}
      />
    </div>
  );
}
