import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import spot from "@/styles/Spot.module.css";
//import context
import SocketContext from "../../components/Context/SocketContext";
// import style from "@/styles/template.module.css";
import { InputGroup, Modal, Tab, Nav } from "react-bootstrap";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";
//import store
import { useSelector, useDispatch } from "../../store";
//improt store
import {
  setFirstCurrency,
  setSecondCurrency,
} from "../../store/trade/dataSlice";
//import component
import LimitOrder from "./LimitOrder";
import MarketOrder from "./MarketOrder";
export default function OrderForm() {
  const { firstCurrency, secondCurrency, tradePair } = useSelector(
    (state: any) => state.spot
  );
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const socketContext = useContext<any>(SocketContext);
  const handleClose = () => setShowModal(false);

  useEffect(() => {
    // socket
    socketContext.spotSocket.on("updateTradeAsset", (result: any) => {
      if (result.currencyId == firstCurrency.currencyId) {
        dispatch(setFirstCurrency(result));
      } else if (result.currencyId == secondCurrency.currencyId) {
        dispatch(setSecondCurrency(result));
      }
      return () => {
        socketContext.spotSocket.off("updateTradeAsset");
      };
    });
  }, [firstCurrency, secondCurrency]);

  const [activeTab, setActiveTab] = useState("buy");

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className={spot.orderform_inner}>
        <div className={spot.orderform_navtab}>          
          <ul className="spot-trade-tab-wrap trade-tab spot-trade-tab">
            <li
              className={`${
                activeTab === "buy" ? "active-item-left" : "trade-tab-select-two"
              } trade-tab-item trade-tab-item-left`}
              onClick={() => handleTabClick("buy")}
            >
              <span className="tab-item-text">Buy</span>
            </li>
            <li
              className={`${
                activeTab === "sell" ? "active-item-right trade-tab-select-two" : ""
              } trade-tab-item trade-tab-item-right`}
              onClick={() => handleTabClick("sell")}
            >
              <span className="tab-item-text">Sell</span>
            </li>
          </ul>          
          <Tab.Container defaultActiveKey="limit">
            <div className={`${spot.ordertab}`}>
              <Nav variant="pills" className="primary_tab primary_tab_fullwidth">
                <Nav.Item>
                  <Nav.Link eventKey="limit">Limit</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="market">Market</Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
            <Tab.Content>
              <Tab.Pane eventKey="limit">
                <LimitOrder activeTab={activeTab} />
              </Tab.Pane>
              <Tab.Pane eventKey="market">
                <MarketOrder activeTab={activeTab} />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
          <div className={spot.right_top}>
            <span> Fee</span> 
            <ul className={`${spot.feeDetails}`}>
              <li><label>Taker</label> <span>({tradePair?.taker_fees}%)</span></li>
              <li><label>Maker</label> <span>({tradePair?.maker_rebate}%)</span></li>
            </ul> 
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      <Modal
        show={showModal}
        onHide={handleClose}
        centered
        className="primary_modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Transfer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Internal transfers are free on Vixicoins.</p>
          <div className={`mb-3 ${spot.transfer_box}`}>
            <div className={`${spot.from}`}>
              <InputGroup className={spot.input_grp}>
                <div className="d-flex">
                  <InputGroup.Text className={spot.input_text}>
                    <Image
                      src="/assets/images/fiat_from.png"
                      alt="Icon"
                      className="img-fluid"
                      width={17}
                      height={16}
                    />
                  </InputGroup.Text>
                  <InputGroup.Text className={`px-0 ${spot.input_text}`}>
                    From
                  </InputGroup.Text>
                  <InputGroup.Text
                    className={`${spot.input_text} ${spot.dark}`}
                  >
                    Fiat and Spot
                  </InputGroup.Text>
                </div>
              </InputGroup>
            </div>
            <div className={spot.mid_div}>
              <Image
                src="/assets/images/down_arw_long.png"
                alt="Icon"
                className="img-fluid"
                width={12}
                height={19}
              />
              <Image
                src="/assets/images/swap.png"
                alt="Icon"
                className="img-fluid"
                width={14}
                height={16}
              />
            </div>
            <div className={`${spot.from}`}>
              <InputGroup className={spot.input_grp}>
                <div className="d-flex">
                  <InputGroup.Text className={spot.input_text}>
                    <Image
                      src="/assets/images/usd.png"
                      alt="Icon"
                      className="img-fluid"
                      width={22}
                      height={22}
                    />
                  </InputGroup.Text>
                  <InputGroup.Text className={`px-0 ${spot.input_text}`}>
                    To
                  </InputGroup.Text>
                  <InputGroup.Text
                    className={`${spot.input_text} ${spot.dark}`}
                  >
                    USD$-M Futures
                  </InputGroup.Text>
                </div>
              </InputGroup>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
