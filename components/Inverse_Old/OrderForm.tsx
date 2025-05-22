import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import spot from "@/styles/Spot.module.css";
import styles from "@/styles/common.module.css";

import { InputGroup, Modal, Tab, Nav } from "react-bootstrap";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";
//import store
import { useDispatch, useSelector } from "../../store";

//import component
import LimitOrder from "./LimitOrder";
import MarketOrder from "./MarketOrder";
import Calculator from "./PnLCalculator";
//import lib
import { truncateDecimals } from "@/lib/roundOf";
import { apiChangeMode } from "@/services/inverse/InverseService";

import { getMode } from "@/store/UserSetting/dataSlice";
import { toastAlert } from "@/lib/toastAlert";
import isEmpty from "@/lib/isEmpty";
import { capitalize } from "@/lib/stringCase";
const red: React.CSSProperties = {
  color: "#EF5350",
};
const green: React.CSSProperties = {
  color: "#14B778",
};

export default function OrderForm() {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("cross")
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { tradePair, walletBal, totalPnL } = useSelector(
    (state: any) => state.inverse
  );
  const { inverseMode } = useSelector((state) => state.UserSetting?.data?.mode);
  const dispatch = useDispatch();
  const [pnl_modal, setpnl_modal] = useState(false);

  const [activeTab, setActiveTab] = useState("buy");

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };
  useEffect(() => {
    setMode(inverseMode)
  }, [inverseMode])
  const handleMode = async (iMode: string) => {
    setMode(iMode)
  }
  const changeMode = async () => {
    try {
      let data = {
        mode: mode,
        pairData: tradePair
      };
      const { status, message } = await apiChangeMode(data);
      if (status == "success") {
        toastAlert("success", message, "orderPlace");
        dispatch(getMode());
        setShow(false)
      } else {
        toastAlert("error", message, "orderPlace");
      }
    } catch (err: any) {
      if (!isEmpty(err?.response?.data?.message))
        toastAlert("error", err.response.data.message, "orderPlace");
    }
  };
  return (
    <>
      <div className={spot.orderform_inner}>
        <div className={spot.orderform_navtab}>
          <ul className="spot-trade-tab-wrap trade-tab spot-trade-tab">
            <li
              className={`${activeTab === "buy"
                ? "active-item-left"
                : "trade-tab-select-two"
                } trade-tab-item trade-tab-item-left`}
              onClick={() => handleTabClick("buy")}
            >
              <span className="tab-item-text">Long</span>
            </li>
            <li
              className={`${activeTab === "sell"
                ? "active-item-right trade-tab-select-two"
                : ""
                } trade-tab-item trade-tab-item-right`}
              onClick={() => handleTabClick("sell")}
            >
              <span className="tab-item-text">Short</span>
            </li>
          </ul>
          <Tab.Container defaultActiveKey="limit">
            {/* <div className={spot.orderform_bookwrap}>
              <div className={spot.orderform_bookwrap_inner}>
                <div className={`mb-3 ${spot.form_box}`}>
                  <div className={styles.limit_isolate_btn}>
                    <button
                      className={`${styles.dark} me-1  ${styles.primary_btn} ${
                        inverseMode == "isolated" ? styles.active : ""
                      }`}
                      onClick={(e) => changeMode(e, "isolated")}
                    >
                      ISOLATED
                    </button>
                    <button
                      className={`${styles.dark} me-1  ${styles.primary_btn} ${
                        inverseMode == "cross" ? styles.active : ""
                      }`}
                      onClick={(e) => changeMode(e, "cross")}
                    >
                      CROSS
                    </button>
                  </div>
                </div>
              </div>
            </div> */}
            <div className={`pb-0 ${spot.orderform_bookwrap} pt-0`}>
              <button className={spot.iso_cross_btn} onClick={handleShow}>
                <span>{capitalize(inverseMode)}</span>
                <Image
                  src="/assets/images/caret_arrow_icon.png"
                  alt="Icon"
                  className="img-fluid"
                  width={8}
                  height={5}
                />
              </button>
            </div>
            <div className={`${spot.ordertab}`}>
              <Nav
                variant="pills"
                className="primary_tab primary_tab_fullwidth"
              >
                <Nav.Item>
                  <Nav.Link eventKey="limit">Limit</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="market">Market</Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
            {/* <div className={spot.right_top_perp}>
              Available:{" "}
              {walletBal?.free >= 0 && (
                <span style={green}>
                  {truncateDecimals(
                    parseFloat(walletBal?.free) + parseFloat(totalPnL),
                    tradePair.quoteFloatDigit
                  )}{" "}
                  $
                </span>
              )}
              {walletBal?.free < 0 && (
                <span style={red}>
                  -
                  {truncateDecimals(
                    Math.abs(
                      parseFloat(walletBal?.free) + parseFloat(totalPnL)
                    ),
                    tradePair.quoteFloatDigit
                  )}
                  $
                </span>
              )}
              &nbsp; &nbsp
            </div> */}

            <div className={spot.balanceContainer}>
              <div className="leftBalance">
                <div className={spot.left_top_future}>
                  Locked:{" "}
                  {walletBal?.locked >= 0 && (
                    <span style={green}>
                      {truncateDecimals(
                        parseFloat(walletBal?.locked), // + parseFloat(totalPnL),
                        tradePair.quoteFloatDigit
                      )}{" "}
                      $
                    </span>
                  )}
                  {walletBal?.locked < 0 && (
                    <span style={red}>
                      -
                      {truncateDecimals(
                        Math.abs(
                          parseFloat(walletBal?.locked) // + parseFloat(totalPnL)
                        ),
                        tradePair.quoteFloatDigit
                      )}{" "}
                      $
                    </span>
                  )}
                </div>
                <div className={spot.right_top_future}>
                  Free:{" "}
                  {walletBal?.free >= 0 && (
                    <span style={green}>
                      {truncateDecimals(
                        parseFloat(walletBal?.free) + parseFloat(totalPnL),
                        tradePair.quoteFloatDigit
                      )}{" "}
                      $
                    </span>
                  )}
                  {walletBal?.free < 0 && (
                    <span style={red}>
                      -
                      {truncateDecimals(
                        Math.abs(
                          parseFloat(walletBal?.free) + parseFloat(totalPnL)
                        ),
                        tradePair.quoteFloatDigit
                      )}{" "}
                      $
                    </span>
                  )}
                </div>
              </div>
              <i
                className="fa fa-calculator fa-lg"
                aria-hidden="true"
                onClick={() => setpnl_modal(true)}
              ></i>
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
        </div>
      </div>
      <Calculator pnl_modal={pnl_modal} setpnl_modal={setpnl_modal} />
      {/* Margin Mode Modal */}
      <Modal
        show={show}
        onHide={handleClose}
        centered
        backdrop="static"
        className={`${styles.custom_modal} ${styles.post_order}`}
      >
        <Modal.Header closeButton className={`${styles.modal_head}`}>
          <Modal.Title className={styles.title}>Switch Margin Mode</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pb-4">
          <div className={`${spot.switch_btn_grp}`}>
            <button className={mode == "cross" ? `${spot.selected}` : ""} onClick={() => handleMode("cross")}>Cross</button>
            <button className={mode == "isolated" ? `${spot.selected}` : ""} onClick={() => handleMode("isolated")}>Isolated</button>
          </div>
          <div className={`${spot.switch_note}`}>
            {
              mode == "cross" &&
              <p>
                All cross positions under the same margin asset share the same asset cross margin balance. In the event of liquidation, your assets full margin balance along with any remaining open positions under the asset may be forfeited.
              </p>
            }
            {
              mode == "isolated" &&
              <p>
                Manage your risk on individual positions by restricting the amount of margin allocated to each. If the margin ratio of a position reached 100%, the position will be liquidated. Margin can be added or removed to positions using this mode.
              </p>
            }
          </div>
          <div className={`mt-4 ${styles.modal_footer}`}>
            <button className={`${styles.primary_btn}`} onClick={handleClose}>
              <span></span>
              <label>Cancel</label>
            </button>
            <button className={`${styles.primary_btn} ${styles.dark}`} onClick={() => changeMode()}>
              <span></span>
              <label>Confirm</label>
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
