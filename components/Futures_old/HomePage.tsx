import React, { useEffect, useState, useRef, useContext } from "react";
import Script from "next/script";
import spot from "@/styles/Future.module.css";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Tab, Nav, Form, Modal } from "react-bootstrap";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from '@/styles/common.module.css';
import Mainnavbar_spot from "../../components/navbar_spot";
import dynamic from "next/dynamic";
//import component'
import OrderForm from "./OrderForm";
import OrderBook from "./OrderBook";
import MarketPrice from "./MarketPrice";
import PairList from "./contractDetails";
import RecentTrade from "./RecentTrade";
import OpenOrder from "./OpenOrder";
import ClosedPnL from "./ClosePnL";
import TradeHistory from "./TradeHistory";
import PositionHistory from "./PositionHistory";
import OrderCount from "./CountRef";
import OrderPosition from "./CountPosition";
import { apiChangePair, cancellAllOpen, closeAllPos, getOpenOrder, getPositionOrder } from "@/services/perpetual/PerpetualService";
import { changePair } from "@/services/User/UserServices";
import { useDispatch, useSelector } from "../../store";
import { getMode } from "@/store/UserSetting/dataSlice";
import isEmpty from "@/lib/isEmpty";
import SocketContext from "../Context/SocketContext";
import { CancelFormValues } from "./types";
import { toastAlert } from "@/lib/toastAlert";

const Chart = dynamic(() => import("./Chart"), {
  ssr: false,
});
let initialCancel: CancelFormValues = {
  type: "",
  show: false
};

export default function Spot() {
  let countRef = useRef();
  let countPos = useRef();
  const dispatch = useDispatch()
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const socketContext = useContext<any>(SocketContext);
  const [isActive, setActive] = useState("open");
  const { tradePair } = useSelector((state: any) => state.perpetual);
  const isLogin = useSelector((state: any) => state.auth.session.signedIn);
  const [check, setCheck] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [oCheck, setOCheck] = useState<boolean>(false);
  const [modDet, setModalDet] = useState<any>(initialCancel);
  const [posCount, setPosCount] = useState<number>(0);
  const [openCount, setOpenCount] = useState<number>(0);
  const { showFuture, showOFuture } = useSelector(
    (state: any) => state.UserSetting?.data?.mode
  );
  const { show, type } = modDet
  useEffect(() => {
    setScriptLoaded(true);
  }, []);
  const [pair_box, setpair_box] = useState(false);
  const pair_sidebar = () => {
    setpair_box(!pair_box);
  };
  const fetchPositionHistory = async (reqData: any, pairId: string) => {
    try {
      let params = { ...reqData, ...{ pairId } };
      const { status, result } = await getPositionOrder(params);
      if (status == "success") {
        setPosCount(result.count);
      }
    } catch (err) {
      console.log("err: ", err);
    }
  };
  const fetchOpenOrder = async (reqData: any, pairId: string) => {
    try {
      const { status, loading, result } = await getOpenOrder(reqData, pairId);
      setLoader(loading);
      if (status == "success") {
        setOpenCount(result.count);
      }
    } catch (err) { }
  };
  useEffect(() => {
    if (!isEmpty(tradePair._id) && isLogin) {
      let reqData = {
        page: 1,
        limit: 10,
      };
      fetchPositionHistory(reqData, tradePair._id);
      fetchOpenOrder(reqData, tradePair._id);

      // socket
      socketContext.perpSocket.on("perpetualOpenOrder", (result: any) => {
        // if ((showOFuture && result.pairId == tradePair._id) || !showOFuture) {
        setOpenCount(result.data.length)
        // }
      });
      socketContext.perpSocket.on("usdtPositionOrder", (result: any) => {
        // if ((check && result.pairId == tradePair._id) || !check) {
        setPosCount(result.data.length);
        // }
      });
      return () => {
        socketContext.perpSocket.off("perpetualOpenOrder");
        socketContext.perpSocket.off("usdtPositionOrder");
      };
    }
  }, [tradePair._id, isLogin, check])
  const pairChange = async (e: any, type: string) => {
    try {
      let { checked } = e.target
      let data = {};
      if (type == 'position') {
        setCheck(!checked)
        data = {
          showFuture: checked,
          type: "perpetual-showfuture"
        };
      }
      if (type == 'open') {
        setOCheck(!checked)
        data = {
          showOFuture: checked,
          type: "perpetual-showopen"
        };
      }
      const { status } = await changePair(data);
      if (status) {
        dispatch(getMode());
      }
    } catch (err: any) {

    }
  };
  useEffect(() => {
    setCheck(showFuture)
    setOCheck(showOFuture)
  }, [showFuture, showOFuture])
  const handleClose = () => {
    setModalDet({ ...modDet, ...{ ['show']: false } })
  }
  const handleSubmit = async () => {
    try {
      handleClose()
      setLoader(true)
      if (type == "pos") {
        let { status, message } = await closeAllPos();
        setLoader(false)
        if (status == "success") {
          toastAlert('success', message, 'cancelOrder');
        } else {
          toastAlert('error', message, 'cancelOrder');
        }
      }
      if (type == "open") {
        let data = {
          pairId: tradePair._id,
        }
        let { status, message } = await cancellAllOpen(data);
        setLoader(false)
        if (status == "success") {
          toastAlert('success', message, 'cancelOrder');
        } else {
          toastAlert('error', message, 'cancelOrder');
        }
      }
    } catch (err) { }
  }
  return (
    <>
      <Script
        type="text/javascript"
        strategy="afterInteractive"
        src="/datafeeds/udf/dist/bundle.js"
        onReady={() => {
          setScriptLoaded(true);
          console.log("Script has loaded bundle");
        }}
      />
      <script src="https://code.jquery.com/jquery-1.11.2.min.js" />
      <script src="/datafeeds/udf/dist/polyfills.js" />
      <div>
        <Mainnavbar_spot />
        <div className={spot.trade_wrapper}>
          {/* Orderbook */}
          <OrderBook />

          {/* Market Info */}

          <MarketPrice pair_sidebar={pair_sidebar} />
          {/* Chart */}
          <div className={spot.chart_wrapper}>
            <div className={spot.chart_inner}>
              {typeof window !== "undefined" && scriptLoaded && <Chart />}
            </div>
          </div>
          {/* Order Form */}
          <div className={spot.orderform_wrapper}>
            <OrderForm />
          </div>

          {/* pairs  */}
          <PairList
            pair_box={pair_box}
            pair_sidebar={pair_sidebar}
            setpair_box={setpair_box}
          />

          {/* Recent Trades */}
          <RecentTrade />

          {/* Order History Table */}
          <div className={spot.history_table}>
            <div className={spot.history_table_wrap}>
              <Tab.Container defaultActiveKey="open_order">
                <div className={`${spot.orderbook_flex}`}>
                  <Nav
                    variant="pills"
                    className={`${spot.order_tab} primary_tab future-order-tab`}
                  >
                    <Nav.Item>
                      <Nav.Link eventKey="open_position" onClick={() => { setActive("position") }}>
                        {/* Open Positions */}
                        <OrderPosition ref={countPos} />
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="open_order" onClick={() => { setActive("open") }}>
                        <OrderCount ref={countRef} />
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="close_position" onClick={() => { setActive("close") }}>
                        Closed Positions
                      </Nav.Link>
                    </Nav.Item>
                    {/* <Nav.Item>
                      <Nav.Link>
                        Order History
                      </Nav.Link>
                    </Nav.Item> */}
                    <Nav.Item>
                      <Nav.Link eventKey="trade_his" onClick={() => { setActive("trade") }}>Trade History</Nav.Link>
                    </Nav.Item>
                  </Nav>
                  {isActive == "position" &&
                    <div className="futer-history-right">
                      <Form.Check className={spot.pair_checkbox}
                        type="checkbox"
                        id="default-checkbox"
                        checked={check}
                        onClick={(e: any) => pairChange(e, 'position')}
                        label="Show all pairs"
                      />
                      {posCount && posCount > 1 && check ?
                        <button className="btn-primary" onClick={() => setModalDet({ ...modDet, ...{ ['type']: 'pos', ['show']: true } })}>Close All</button>
                        : ""
                      }
                    </div>
                  }
                  {
                    isActive == "open" &&
                    <div className="futer-history-right">
                      <Form.Check className={spot.pair_checkbox}
                        type="checkbox"
                        id="default-checkbox"
                        checked={oCheck}
                        onClick={(e: any) => pairChange(e, 'open')}
                        label="All Active Orders"
                      />
                      {openCount && openCount > 0 ?
                        <button className="btn-primary" onClick={() => setModalDet({ ...modDet, ...{ ['type']: 'open', ['show']: true } })}>Cancel All</button>
                        : ""
                      }
                    </div>
                  }
                </div>
                <Tab.Content>
                  <Tab.Pane eventKey="open_position" className="px-2">
                    <Scrollbars style={{ width: "100%", height: 300 }}>
                      <PositionHistory countRef={countPos} />
                    </Scrollbars>
                  </Tab.Pane>
                  <Tab.Pane eventKey="open_order" className="px-2">
                    <Scrollbars style={{ width: "100%", height: 300 }}>
                      <OpenOrder countRef={countRef} />
                    </Scrollbars>
                  </Tab.Pane>
                  <Tab.Pane eventKey="close_position" className="px-2">
                    <Scrollbars style={{ width: "100%", height: 300 }}>
                      <ClosedPnL />
                    </Scrollbars>
                  </Tab.Pane>
                  <Tab.Pane eventKey="trade_his" className="px-2">
                    <Scrollbars style={{ width: "100%", height: 300 }}>
                      <TradeHistory />
                    </Scrollbars>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </div>
          </div>
        </div>
      </div>

      {/* Close All Position */}
      <Modal show={show} centered onHide={() => handleClose()} className={styles.custom_modal}  >
        <Modal.Header closeButton className={styles.modal_head}>
          <Modal.Title>{type == 'pos' ? 'Are you sure that you want to close all positions?' : oCheck && type == "open" ? ' Are you sure that you want to cancel all Active?' : `Are you sure that you want to cancel all ${tradePair.tikerRoot} Active?`}  </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={`${spot.form_box}`}>
            <div className='row'>
              <div className='col-md-6'>
                <button className={spot.order_buy_btn} onClick={() => handleClose()} >Cancel</button>
              </div>
              <div className='col-md-6'>
                <button className={spot.order_sell_btn} onClick={() => handleSubmit()}>{loader ? <i className="fa fa-spinner fa-spin" ></i> : 'Confirm'}</button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal >
    </>
  );
}
