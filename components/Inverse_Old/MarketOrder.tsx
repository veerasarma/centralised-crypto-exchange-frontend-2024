import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import spot from "@/styles/Spot.module.css";
import { useRouter, asPath } from "next/router";
import TooltipSlider from "../TooltipSlider";
import Link from "next/link";
import styles from "@/styles/common.module.css";
import { Form, InputGroup, Row, Col, Modal } from "react-bootstrap";
//import store
import { useDispatch, useSelector } from "../../store";
//improt lib
import isEmpty from "@/lib/isEmpty";
import { encryptObject } from "../../lib/cryptoJS";
import { toastAlert } from "@/lib/toastAlert";
import { removeByObj } from "@/lib/validation";
//improt types
import { MarketFormValues } from "./types";
//improt serviec
import { apiChangeLeverage, apiOrderPlace } from "../../services/inverse/InverseService";
import { setTradePair } from "@/store/inverse/dataSlice";

let initialBuyValue: MarketFormValues = {
  quantity: "",
  pairId: "",
  leverage: "100",
  action: "open",
  takeProfit: "",
  stopLoss: "",
};

let initialSellValue: MarketFormValues = {
  quantity: "",
  pairId: "",
  leverage: "100",
  action: "open",
  takeProfit: "",
  stopLoss: "",
};

const marks = {
  1: 1,
  25: 25,
  50: 50,
  75: 75,
  100: 100,
};

export default function MarketOrder({ activeTab }: any) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const dispatch = useDispatch();
  const router = useRouter();
  const isLogin = useSelector((state: any) => state.auth.session.signedIn);
  const { tradePair, marketData } = useSelector((state: any) => state.inverse);
  const [isClient, setIsClient] = useState(false);
  const [buyFormValue, setBuyFormvalue] =
    useState<MarketFormValues>(initialBuyValue);
  const [sellFormValue, setSellFormvalue] =
    useState<MarketFormValues>(initialSellValue);
  const [orderSide, setOrderSide] = useState<string>("");
  const [error, setError] = useState<any>({});
  const [loader, setLoader] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    let { value, name } = e.target;
    setLoader(false);
    if (name === "leverage") {
      if (value.indexOf(".") != -1) {
        return;
      }
      // if (isEmpty(value)) return;
      if (parseFloat(value) < 1) return;
      if (parseFloat(value) > 100) return;
    }
    if (
      (name === "orderValue" ||
        name === "takeProfit" ||
        name === "stopLoss" ||
        name === "quantity") &&
      isEmpty(value.split(".")[0]) &&
      value.indexOf(".") != -1
    ) {
      return;
    }
    if (
      name === "orderValue" &&
      value.split(".")[1] &&
      value.split(".")[1].length > tradePair.quoteFloatDigit
    ) {
      return;
    } else if (
      name === "quantity" &&
      value.split(".")[1] &&
      value.split(".")[1].length > tradePair.baseFloatDigit
    ) {
      return;
    }
    if (!isEmpty(value) && !/^\d*\.?\d*$/.test(value)) {
      return;
    }
    setError(removeByObj(error, name));
    if (type == "buy") {
      setBuyFormvalue({ ...buyFormValue, ...{ [name]: value } });
    } else {
      setSellFormvalue({ ...sellFormValue, ...{ [name]: value } });
    }
  };

  const handleSlider = (e: number, type: string) => {
    if (type == "buy") {
      setBuyFormvalue({ ...buyFormValue, ...{ leverage: e } });
    } else if (type == "sell") {
      setSellFormvalue({ ...sellFormValue, ...{ leverage: e } });
    }
  };
  const handleSubmit = async (e: any, type: string = "buy") => {
    try {
      e.preventDefault();
      let { quantity, leverage, takeProfit, stopLoss } =
        type == "buy" ? buyFormValue : sellFormValue;

      let isTakeProfit = !(takeProfit === "" || takeProfit === "0");
      let isStopLoss = !(stopLoss === "" || stopLoss === "0");
      if (type == "buy") {
        if (!isEmpty(takeProfit) && takeProfit < marketData?.markPrice) {
          toastAlert(
            "error",
            "Take Profit must be greater than current price",
            "marketOrder_tp"
          );
          return;
        }
        if (!isEmpty(stopLoss) && stopLoss > marketData?.markPrice) {
          toastAlert(
            "error",
            "Stop loss price should be lower than current price",
            "marketOrder_tp"
          );
          return;
        }
      } else {
        if (!isEmpty(takeProfit) && takeProfit > marketData?.markPrice) {
          toastAlert(
            "error",
            "Take Profit should be lower than current price",
            "marketOrder_tp"
          );
          return;
        } else if (!isEmpty(stopLoss) && stopLoss < marketData?.markPrice) {
          toastAlert(
            "error",
            "Stop loss price should be greater than current price",
            "marketOrder_sl"
          );
          return;
        }
      }
      if (isEmpty(quantity)) {
        toastAlert("error", "Quantity Field is Required", "marketOrder_sl");
        return;
      }
      if (Number(quantity) <= 0) {
        toastAlert(
          "error",
          "Quantity Must Be Greater Than Zero",
          "marketOrder_sl"
        );
        return;
      }
      let reqData = {
        quantity,
        buyorsell: type,
        orderType: "market",
        pairId: tradePair._id,
        leverage,
        action: "open",
        newdate: new Date(),
        takeProfit,
        stopLoss,
        isStopLoss,
        isTakeProfit,
      };
      setOrderSide(type);
      setLoader(true);
      let encryptToken: any = {
        token: await encryptObject(reqData),
      };
      const { status, message, pairData } = await apiOrderPlace(encryptToken);
      setLoader(false);
      if (status == "success") {
        toastAlert("success", message, "orderPlace");
        setBuyFormvalue(initialBuyValue);
        setSellFormvalue(initialSellValue);
        dispatch(setTradePair(pairData))
        setError({});
        setOrderSide("");
      } else {
        toastAlert("error", message, "orderPlace");
      }
    } catch (err: any) {
      setLoader(false);
      if (!isEmpty(err?.response?.data?.message))
        toastAlert("error", err.response.data.message, "orderPlace");
      if (err?.response?.data?.errors) {
        setError(err.response.data.errors);
      }
    }
  };

  const changeLeverage = async () => {
    try {
      let data = {
        leverage: activeTab == "buy" ? buyFormValue.leverage : sellFormValue.leverage,
        pairData: tradePair
      };
      const { status, message, pairData } = await apiChangeLeverage(data);
      if (status == "success") {
        toastAlert("success", message, "orderPlace");
        dispatch(setTradePair(pairData))
        setShow(false)
      } else {
        toastAlert("error", message, "orderPlace");
      }
    } catch (err: any) {
      if (!isEmpty(err?.response?.data?.message))
        toastAlert("error", err.response.data.message, "orderPlace");
    }
  };
  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    if (activeTab == "buy") {
      setBuyFormvalue({ ...buyFormValue, ...{ leverage: tradePair.leverage } });
    } else {
      setSellFormvalue({ ...sellFormValue, ...{ leverage: tradePair.leverage } });
    }
  }, [tradePair, activeTab])

  return (
    <>
      <div className={spot.orderform_bookwrap}>
        {activeTab == "buy" ? (
          <div className={spot.orderform_bookwrap_inner}>
            <div className={`mb-3 ${spot.form_box}`}>
              <div className={spot.input_grp}>
                <InputGroup.Text className={spot.input_text}>
                  <b>Amount</b>
                </InputGroup.Text>
                <InputGroup>
                  <Form.Control
                    placeholder=""
                    type="text"
                    className={spot.input_box}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange(e, "buy")
                    }
                    name="quantity"
                    value={buyFormValue.quantity}
                  />
                  <InputGroup.Text className={`${spot.input_text} ${spot.dark}`}>
                    {tradePair?.baseCoinSymbol}
                  </InputGroup.Text>
                </InputGroup>
              </div>
              {orderSide == "buy" && (
                <p className="text-danger">{error?.orderValue}</p>
              )}
            </div>
            <div className={`mb-3 ${spot.form_box} ${spot.leverage_box}`} onClick={handleShow}>
              <div className={spot.input_grp}>
                <InputGroup.Text className={spot.input_text}>
                  <b>Leverage</b>
                </InputGroup.Text>
                <InputGroup>
                  <Form.Control
                    placeholder=""
                    type="text"
                    className={spot.input_box}
                    // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    //   handleChange(e, "buy")
                    // }
                    name="leverage"
                    value={tradePair.leverage}
                  />
                  <InputGroup.Text className={spot.input_text}>
                    <b>X</b>
                  </InputGroup.Text>
                </InputGroup>
              </div>
            </div>
            <div className={`mb-3 ${spot.form_box}`}>
              <Row>
                <Col>
                  <div className={spot.input_grp}>
                    <InputGroup.Text className={spot.input_text}>
                      <b>Take Profit</b>
                    </InputGroup.Text>
                    <InputGroup>
                      <Form.Control
                        placeholder=""
                        type="text"
                        className={spot.input_box}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange(e, "buy")
                        }
                        name="takeProfit"
                        value={buyFormValue.takeProfit}
                      />
                    </InputGroup>
                  </div>
                </Col>
                <Col>
                  <div className={spot.input_grp}>
                    <InputGroup.Text className={spot.input_text}>
                      <b>Stop Loss</b>
                    </InputGroup.Text>
                    <InputGroup>
                      <Form.Control
                        placeholder=""
                        type="text"
                        className={spot.input_box}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange(e, "buy")
                        }
                        name="stopLoss"
                        value={buyFormValue.stopLoss}
                      />
                    </InputGroup>
                  </div>
                </Col>
              </Row>
            </div>
            {/* <div className={`${spot.form_box} ${spot.form_box_slider}`}>
              <TooltipSlider
                min={1}
                max={100}
                marks={marks}
                tipFormatter={(value: any) => `${value}`}
                tipProps={undefined}
                onChange={(e: number) => handleSlider(e, "buy")}
                value={buyFormValue.leverage}
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
            </div> */}
            <div className={`${spot.form_box}`}>
              {isClient && isLogin ? (
                <button
                  className={spot.order_buy_btn}
                  onClick={(e) => handleSubmit(e, "buy")}
                  disabled={orderSide == "buy" && loader}
                >
                  {loader && orderSide == "buy" ? (
                    <i className="fa fa-spinner fa-spin"></i>
                  ) : (
                    "Long"
                  )}
                </button>
              ) : isClient ? (
                <button
                  className={`${styles.animate} ${styles.primary_btn} w-100 d-block text-center`}
                  onClick={() => router.push("/login")}
                >
                  <label>Log In / Register </label>
                </button>
              ) : null}
            </div>
          </div>
        ) : (
          <div className={spot.orderform_bookwrap_inner}>
            <div className={`mb-3 ${spot.form_box}`}>
              <div className={spot.input_grp}>
                <InputGroup.Text className={spot.input_text}>
                  <b>Amount</b>
                </InputGroup.Text>
                <InputGroup>
                  <Form.Control
                    placeholder=""
                    type="text"
                    className={spot.input_box}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange(e, "sell")
                    }
                    name="quantity"
                    value={sellFormValue.quantity}
                  />
                  <InputGroup.Text className={`${spot.input_text} ${spot.dark}`}>
                    {tradePair?.baseCoinSymbol}
                  </InputGroup.Text>
                </InputGroup>
              </div>
              {orderSide == "sell" && (
                <p className="text-danger">{error?.amount}</p>
              )}
            </div>
            <div className={`mb-3 ${spot.form_box} ${spot.leverage_box}`} onClick={handleShow}>
              <div className={spot.input_grp}>
                <InputGroup.Text className={spot.input_text}>
                  <b>Leverage</b>
                </InputGroup.Text>
                <InputGroup>
                  <Form.Control
                    placeholder=""
                    type="text"
                    className={spot.input_box}
                    // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    //   handleChange(e, "buy")
                    // }
                    name="leverage"
                    value={tradePair.leverage}
                  />
                  <InputGroup.Text className={spot.input_text}>
                    <b>X</b>
                  </InputGroup.Text>
                </InputGroup>
              </div>
            </div>
            <div className={`mb-3 ${spot.form_box}`}>
              <Row>
                <Col>
                  <div className={spot.input_grp}>
                    <InputGroup.Text className={spot.input_text}>
                      <b>Take Profit</b>
                    </InputGroup.Text>
                    <InputGroup>
                      <Form.Control
                        placeholder=""
                        type="text"
                        className={spot.input_box}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange(e, "sell")
                        }
                        name="takeProfit"
                        value={sellFormValue.takeProfit}
                      />
                    </InputGroup>
                  </div>
                </Col>
                <Col>
                  <div className={spot.input_grp}>
                    <InputGroup.Text className={spot.input_text}>
                      <b>Stop Loss</b>
                    </InputGroup.Text>
                    <InputGroup>
                      <Form.Control
                        placeholder=""
                        type="text"
                        className={spot.input_box}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleChange(e, "sell")
                        }
                        name="stopLoss"
                        value={sellFormValue.stopLoss}
                      />
                    </InputGroup>
                  </div>
                </Col>
              </Row>
            </div>
            {/* <div className={`${spot.form_box} ${spot.form_box_slider}`}>
              <TooltipSlider
                min={0}
                max={100}
                marks={marks}
                tipFormatter={(value: any) => `${value}`}
                tipProps={undefined}
                value={sellFormValue.leverage}
                onChange={(e: number) => handleSlider(e, "sell")}
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
            </div> */}
            <div className={`${spot.form_box}`}>
              {isClient && isLogin ? (
                <button
                  className={spot.order_sell_btn}
                  onClick={(e) => handleSubmit(e, "sell")}
                  disabled={orderSide == "sell" && loader}
                >
                  {loader && orderSide == "sell" ? (
                    <i className="fa fa-spinner fa-spin"></i>
                  ) : (
                    "Short"
                  )}
                </button>
              ) : isClient ? (
                <button
                  className={`${styles.animate} ${styles.primary_btn} w-100 d-block text-center`}
                  onClick={() => router.push("/login")}
                >
                  <label>Log In / Register </label>
                </button>
              ) : null}
            </div>
          </div>
        )}
      </div>
      {/* Adjust Leverage Modal */}
      <Modal
        show={show}
        onHide={handleClose}
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
                <Form.Control type="number" name="leverage" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, activeTab)} value={activeTab == "buy" ? buyFormValue.leverage : sellFormValue.leverage} />
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
                  value={activeTab == "buy" ? buyFormValue.leverage : sellFormValue.leverage}
                  onChange={(e: number) => handleSlider(e, activeTab)}
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
            <Col lg={12}>
              <div className={spot.leverage_flex}>
                <label className="mb-0">Max Position at Current Leverage</label>
                <p className="mb-0">1500 BTC</p>
              </div>
            </Col>
          </Row>
          <div className={`mt-4 ${styles.modal_footer}`}>
            <button className={`${styles.primary_btn}`} onClick={handleClose}>
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
      </Modal></>
  );
}
