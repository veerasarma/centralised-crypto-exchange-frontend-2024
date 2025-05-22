import React, { useEffect, useState, useRef } from "react";
import Script from 'next/script'
import spot from "@/styles/Future.module.css";
import { Scrollbars } from 'react-custom-scrollbars-2';
import {
    Tab,
    Nav, Form
} from "react-bootstrap";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Mainnavbar_spot from "../../components/navbar_spot";
import dynamic from "next/dynamic";
//import component'
import OrderForm from "./OrderForm";
import OrderBook from './OrderBook'
import MarketPrice from './MarketPrice'
import PairList from './contractDetails'
import RecentTrade from './RecentTrade'
import OpenOrder from './OpenOrder'
import ClosedPnL from './ClosePnL'
import TradeHistory from './TradeHistory'
import PositionHistory from './PositionHistory'
import OrderCount from './CountRef'
import { useDispatch, useSelector } from "../../store";
import { changePair } from "@/services/User/UserServices";
import { getMode } from "@/store/UserSetting/dataSlice";

const Chart = dynamic(() => import("./Chart"), {
    ssr: false,
});

export default function Spot() {
    let countRef = useRef()
    const dispatch = useDispatch()
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [check, setCheck] = useState<boolean>(false);
    const { showInverse } = useSelector(
        (state: any) => state.UserSetting?.data?.mode
    );
    useEffect(() => {
        setScriptLoaded(true)
    }, [])
    const [pair_box, setpair_box] = useState(false);
    const pair_sidebar = () => {
        setpair_box(!pair_box)
    };
    const pairChange = async (e: any) => {
        try {
            let { checked } = e.target
            setCheck(!checked)
            let data = {
                showInverse: checked,
                type: "inverse"
            };
            const { status } = await changePair(data);
            if (status) {
                dispatch(getMode());
            }
        } catch (err: any) {

        }
    };
    useEffect(() => {
        setCheck(showInverse)
    }, [showInverse])
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
                    <div className={spot.chart_wrapper}  >
                        <div className={spot.chart_inner}>
                            {
                                typeof window !== "undefined" && scriptLoaded && <Chart />
                            }
                        </div>
                    </div>
                    {/* Order Form */}
                    <div className={spot.orderform_wrapper}  >
                        <OrderForm />
                    </div>

                    {/* pairs  */}
                    <PairList pair_box={pair_box} pair_sidebar={pair_sidebar} setpair_box={setpair_box} />

                    {/* Recent Trades */}
                    <RecentTrade />

                    {/* Order History Table */}
                    <div className={spot.history_table} >
                        <div className={spot.history_table_wrap}>
                            <Tab.Container defaultActiveKey="open_order">
                                <Nav variant="pills" className={`${spot.order_tab} primary_tab`}>
                                    <Nav.Item>
                                        <Nav.Link eventKey="open_position">Open Positions</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="open_order"><OrderCount ref={countRef} /></Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="close_position">Closed Positions</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="trade_his">Trade History</Nav.Link>
                                    </Nav.Item>
                                    <Tab.Pane eventKey="open_position" className="px-2">
                                        <Form.Check className={spot.pair_checkbox}
                                            type="checkbox"
                                            id="default-checkbox"
                                            checked={check}
                                            onClick={(e: any) => pairChange(e)}
                                            label="Show all trading pairs"
                                        />
                                    </Tab.Pane>
                                </Nav>
                                <Tab.Content>
                                    <Tab.Pane eventKey="open_position" className="px-2">
                                        <Scrollbars style={{ width: "100%", height: 300 }} >
                                            <PositionHistory />
                                        </Scrollbars>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="open_order" className="px-2">
                                        <Scrollbars style={{ width: "100%", height: 300 }} >
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
        </>
    );
}
