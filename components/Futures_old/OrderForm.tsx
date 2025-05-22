import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import spot from "@/styles/Spot.module.css";
import styles from "@/styles/common.module.css";


import { Form, InputGroup, Row, Tab, Nav, Dropdown, Col, Modal, Button, ButtonGroup } from "react-bootstrap";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";
//import store
import { useSelector } from "../../store";

//import component
import LimitOrder from "./LimitOrder";
import MarketOrder from "./MarketOrder";
import Calculator from "./PnLCalculator";
//import lib
import { truncateDecimals } from "@/lib/roundOf";
import { apiChangeLeverage, apiChangeMode } from "@/services/perpetual/PerpetualService";
import { toastAlert } from "@/lib/toastAlert";
import isEmpty from "@/lib/isEmpty";
import { useDispatch } from "react-redux";
import { getMode } from "@/store/UserSetting/dataSlice";
import { capitalize } from "@/lib/stringCase";
import { setTradePair } from "@/store/perpetual/dataSlice";
import TooltipSlider from "../TooltipSlider";

const red: React.CSSProperties = {
  color: "#EF5350",
};
const green: React.CSSProperties = {
  color: "#14B778",
};

const marks = {
  1: "1x",
  25: "25x",
  50: "50x",
  75: "75x",
  100: "100x",
};

export default function OrderForm() {
  const [show, setShow] = useState(false);
  const [levShow, setLevShow] = useState(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [mode, setMode] = useState("cross");
  const [lev, setLev] = useState<number>(0);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleLevClose = () => setLevShow(false);
  const handleLevShow = () => setLevShow(true);

  const dispatch = useDispatch();
  const { tradePair, walletBal, totalPnL } = useSelector(
    (state: any) => state.perpetual
  );
  const { derivativeMode } = useSelector(
    (state) => state.UserSetting?.data?.mode
  );
  const [pnl_modal, setpnl_modal] = useState(false);

  const [activeTab, setActiveTab] = useState("buy");

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };
  const changeLeverage = async () => {
    try {
      let data = {
        leverage: lev,
        pairData: tradePair
      };
      const { status, message, pairData } = await apiChangeLeverage(data);
      if (status == "success") {
        toastAlert("success", message, "orderPlace");
        dispatch(setTradePair(pairData))
        setLevShow(false)
      } else {
        toastAlert("error", message, "orderPlace");
      }
    } catch (err: any) {
      if (!isEmpty(err?.response?.data?.message))
        toastAlert("error", err.response.data.message, "orderPlace");
    }
  };
  useEffect(() => {
    setMode(derivativeMode);
  }, [derivativeMode]);
  const handleMode = async (iMode: string) => {
    setMode(iMode);
  };
  const changeMode = async () => {
    try {
      let data = {
        mode: mode,
        pairData: tradePair,
      };
      const { status, message } = await apiChangeMode(data);
      if (status == "success") {
        toastAlert("success", message, "orderPlace");
        dispatch(getMode());
        setShow(false);
      } else {
        toastAlert("error", message, "orderPlace");
      }
    } catch (err: any) {
      if (!isEmpty(err?.response?.data?.message))
        toastAlert("error", err.response.data.message, "orderPlace");
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    let { value, name } = e.target;
    setLoader(false);
    if (name === "leverage") {
      if (value.indexOf(".") != -1) {
        return;
      }
      if (parseFloat(value) < 1) return;
      if (parseFloat(value) > 100) return;
    }
    if (!isEmpty(value) && !/^\d*\.?\d*$/.test(value)) {
      return;
    }
    setLev(value);
  };

  const handleSlider = (e: number) => {
    setLev(e);
  };
  const handleLev = (type: string) => {
    let value = lev
    if (type == "+" && value < 100) {
      setLev(value + 1)
    }
    if (type == "-" && value > 1) {
      setLev(value - 1)
    }
  }
  useEffect(() => {
    setLev(tradePair.leverage);
  }, [tradePair])
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
          <div className={`pb-0 ${spot.orderform_bookwrap} pt-0`}>
            <button className={spot.iso_cross_btn} onClick={handleShow}>
              <span>{capitalize(derivativeMode)}</span>
              <Image
                src="/assets/images/caret_arrow_icon.png"
                alt="Icon"
                className="img-fluid"
                width={8}
                height={5}
              />
            </button>
            <div
              className={`${spot.form_box} ${spot.leverage_box}`}
              onClick={handleLevShow}
            >
              <div className={spot.input_grp}>
                {/* <InputGroup.Text className={spot.input_text}>
                  <b>Leverage</b>
                </InputGroup.Text> */}
                <InputGroup>
                  <Form.Control
                    placeholder=""
                    type="text"
                    className={spot.input_box}
                    name="leverage"
                    value={tradePair.leverage}
                  />
                  <InputGroup.Text className={spot.input_text}>
                    <b>X</b>
                  </InputGroup.Text>
                </InputGroup>
              </div>
            </div>
          </div>

          <Tab.Container defaultActiveKey="open">
            <div className={`pt-0 ${spot.ordertab}`}>
              <Nav
                variant="pills"
                className="primary_tab primary_tab_fullwidth"
              >
                <Nav.Item>
                  <Nav.Link eventKey="open">Open</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="close">Close</Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
            <Tab.Content>
              <Tab.Pane eventKey="open">
                <Tab.Container defaultActiveKey="limit">
                  <div className={`pt-0 ${spot.ordertab}`}>
                    <Nav
                      variant="pills"
                      className="primary_tab primary_tab_marketlimit"
                    >
                      <Nav.Item>
                        <Nav.Link eventKey="limit">Limit</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="market">Market</Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </div>
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
                              parseFloat(walletBal?.free) +
                              parseFloat(totalPnL),
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
                                parseFloat(walletBal?.free) +
                                parseFloat(totalPnL)
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
                      <LimitOrder activeTab={activeTab} tabType="open" />
                    </Tab.Pane>
                    <Tab.Pane eventKey="market">
                      <MarketOrder activeTab={activeTab} tabType="open" />
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </Tab.Pane>
              <Tab.Pane eventKey="close">
                <Tab.Container defaultActiveKey="limit">
                  <div className={`pt-0 ${spot.ordertab}`}>
                    <Nav
                      variant="pills"
                      className="primary_tab primary_tab_marketlimit"
                    >
                      <Nav.Item>
                        <Nav.Link eventKey="limit">Limit</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="market">Market</Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </div>
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
                              parseFloat(walletBal?.free) +
                              parseFloat(totalPnL),
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
                                parseFloat(walletBal?.free) +
                                parseFloat(totalPnL)
                              ),
                              tradePair.quoteFloatDigit
                            )}{" "}
                            $
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Tab.Content>
                    <Tab.Pane eventKey="limit">
                      <LimitOrder activeTab={activeTab} tabType="close" />
                    </Tab.Pane>
                    <Tab.Pane eventKey="market">
                      <MarketOrder activeTab={activeTab} tabType="close" />
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
          <Dropdown className={spot.order_dropdown_new_head}>
            <Dropdown.Toggle
              id="dropdown-basic"
              className={spot.order_dropdown_new}
            >
              Good-Till-Canceled
            </Dropdown.Toggle>
            <Dropdown.Menu className="order_dropdown_new_show">
              <Dropdown.Item href="#/action-2">
                {" "}
                Good-Till-Canceled
              </Dropdown.Item>
              {/* <Dropdown.Item href="#/action-1">Immediate-Or-Cancel</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Fill-Or-Kill</Dropdown.Item> */}
            </Dropdown.Menu>
          </Dropdown>
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
            <button
              className={mode == "cross" ? `${spot.selected}` : ""}
              onClick={() => handleMode("cross")}
            >
              Cross
            </button>
            <button
              className={mode == "isolated" ? `${spot.selected}` : ""}
              onClick={() => handleMode("isolated")}
            >
              Isolated
            </button>
          </div>
          <div className={`${spot.switch_note}`}>
            {mode == "cross" && (
              <p>
                All cross positions under the same margin asset share the same
                asset cross margin balance. In the event of liquidation, your
                assets full margin balance along with any remaining open
                positions under the asset may be forfeited.
              </p>
            )}
            {mode == "isolated" && (
              <p>
                Manage your risk on individual positions by restricting the
                amount of margin allocated to each. If the margin ratio of a
                position reached 100%, the position will be liquidated. Margin
                can be added or removed to positions using this mode.
              </p>
            )}
          </div>
          <div className={`mt-4 ${styles.modal_footer}`}>
            <button className={`${styles.primary_btn}`} onClick={handleClose}>
              <span></span>
              <label>Cancel</label>
            </button>
            <button
              className={`${styles.primary_btn} ${styles.dark}`}
              onClick={() => changeMode()}
            >
              <span></span>
              <label>Confirm</label>
            </button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Adjust Leverage Modal */}
      <Modal
        show={levShow}
        onHide={handleLevClose}
        centered
        backdrop="static"
        className={`${styles.custom_modal} ${styles.post_order}`}
      >
        <Modal.Header closeButton className={`${styles.modal_head}`}>
          <Modal.Title className={styles.title}>Adjust Leverage</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pb-4">
          <Row>
            <Col lg={12}>
              <Form.Group className={`mb-2 ${styles.input_grp}`}>
                <Form.Label>Leverage </Form.Label>
                <InputGroup>
                  <InputGroup.Text className={spot.input_text}>
                    <b onClick={() => handleLev("-")} style={{ cursor: 'pointer' }}>-</b>
                  </InputGroup.Text>
                  <Form.Control type="number" style={{ textAlign: 'center' }} name="leverage" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)} value={lev} />
                  <InputGroup.Text className={spot.input_text}>
                    <b onClick={() => handleLev("+")} style={{ cursor: 'pointer' }}>+</b>
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </Col>
            <Col lg={12}>
              <div className={`${spot.form_box} ${spot.form_box_slider}`}>
                <TooltipSlider
                  min={1}
                  max={100}
                  marks={marks}
                  tipFormatter={(value: any) => `${value}`}
                  tipProps={undefined}
                  value={lev}
                  onChange={(e: number) => handleSlider(e)}
                  dotStyle={{
                    backgroundColor: "var(--slider1)",
                    borderColor: "transparent",
                  }}
                  activeDotStyle={{
                    backgroundColor: "var(--text_white)",
                    borderColor: "var(--text_white)",
                  }}
                  handleStyle={{
                    border: "3px solid var(--color-3)",
                    backgroundColor: "var(--text_white)",
                    opacity: "1",
                    boxShadow: "0 0 10px 0 var(--text_white)",
                  }}
                  railStyle={{
                    backgroundColor: "var(--slider1)",
                    height: "1px",
                  }}
                  trackStyle={{
                    backgroundColor: "var(--text_white)",
                    height: "1px",
                  }}
                />
              </div>
            </Col>
            {/* <Col lg={12}>
              <div className={spot.leverage_flex}>
                <label className="mb-0">Max Position at Current Leverage</label>
                <p className="mb-0">1500 BTC</p>
              </div>
            </Col>  */}
          </Row>
          <div className={`mt-4 ${styles.modal_footer}`}>
            <button className={`${styles.primary_btn}`} onClick={handleLevClose}>
              <span></span>
              <label>Cancel</label>
            </button>
            <button
              className={`${styles.primary_btn} ${styles.dark}`}
              disabled={loader}
              onClick={() => changeLeverage()}
            >
              <span></span>
              <label>
                {loader ? <i className="fa fa-spinner fa-spin"></i> : "Confirm"}
              </label>
            </button>
          </div>
        </Modal.Body>
      </Modal>

    </>
  );
}
