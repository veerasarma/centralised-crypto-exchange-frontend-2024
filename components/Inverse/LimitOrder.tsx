import { useState, useEffect, useContext } from "react";

import spot from "@/styles/Spot.module.css";
import TooltipSlider from "../TooltipSlider";
import styles from "@/styles/common.module.css";
import { useRouter } from "next/router";
import {
  Form,
  InputGroup,
  Row,
  Col,
  Modal,
  Button,
  ButtonGroup,
} from "react-bootstrap";
//import store
import { useDispatch, useSelector } from "../../store";
//improt lib
import isEmpty from "@/lib/isEmpty";
import { encryptObject } from "../../lib/cryptoJS";
import { toastAlert } from "@/lib/toastAlert";
import { removeByObj } from "@/lib/validation";
//improt types
import { LimitFormValues } from "./types";
//improt serviec
import {
  apiOrderPlace,
} from "../../services/inverse/InverseService";
import { capitalize } from "@/lib/stringCase";
import { toFixed, toFixedDown, truncateDecimals } from "@/lib/roundOf";
import { getMode } from "@/store/UserSetting/dataSlice";
import { nWComma } from "@/lib/calculation";

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

let initialValue: LimitFormValues = {
  price: "0",
  quantity: "0",
  leverage: "100",
  orderCost: "0",
  takeProfit: "",
  stopLoss: "",
  typeTIF: "GTC",
};

export default function LimitOrder() {
  const [orderShow, setOrderShow] = useState(false);
  const [percent, setPerc] = useState(0);
  const handleOrderClose = () => setOrderShow(false);
  const router = useRouter();
  const isLogin = useSelector((state: any) => state.auth.session.signedIn);

  const dispatch = useDispatch();
  const { tradePair, walletBal, marketData, orderBookPrice } = useSelector(
    (state: any) => state.inverse
  );

  const { inverseMode, inverseLeverage } = useSelector(
    (state) => state.UserSetting?.data?.mode
  );
  const [isClient, setIsClient] = useState(false);
  const [formValue, setFormValue] =
    useState<LimitFormValues>(initialValue);
  const [orderSide, setOrderSide] = useState<string>("");
  const [error, setError] = useState<any>({});
  const [loader, setLoader] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    let { value, name } = e.target;
    setLoader(false);
    setPerc(0);
    console.log(value, "------79");
    if (
      (name === "price" ||
        name === "takeProfit" ||
        name === "stopLoss" ||
        name === "quantity") &&
      isEmpty(value.split(".")[0]) &&
      value.indexOf(".") != -1
    ) {
      return;
    }
    if (
      (name === "price" || name === "takeProfit" || name === "stopLoss") &&
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
      console.log("-------104");
      return;
    }
    setError(removeByObj(error, name));
    if (name == "quantity" || name == "price") {
      let priceVal = name == "price" ? value : formValue.price
      let quantityVal = name == "quantity" ? value : formValue.quantity
      setFormValue({ ...formValue, ...{ [name]: value, ["orderCost"]: (quantityVal / priceVal) / inverseLeverage } }); // priceVal * quantityVal / inverseLeverage
    } else {
      setFormValue({ ...formValue, ...{ [name]: value } });
    }
  };

  const handleCheck = async (type: string = "buy") => {
    try {
      let { price, quantity, takeProfit, stopLoss, leverage } = formValue
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
      if (isEmpty(price)) {
        return toastAlert("error", "Price Field is Required", "orderPlace");
      } else if (parseFloat(price) <= 0) {
        return toastAlert(
          "error",
          "Price Must Be Greater Than Zero",
          "orderPlace"
        );
      }
      if (isEmpty(quantity)) {
        return toastAlert("error", "Quantity Field is Required", "orderPlace");
      } else if (parseFloat(quantity) <= 0) {
        return toastAlert(
          "error",
          "Quantity Must Be Greater Than Zero",
          "orderPlace"
        );
      }
      if (isEmpty(leverage)) {
        return toastAlert(
          "error",
          "Leverage Must Be Greater Than Zero",
          "orderPlace"
        );
      }
      if (!isEmpty(stopLoss) && stopLoss <= 0) {
        toastAlert(
          "error",
          "Stop loss must be greater than 0",
          "marketOrder_tp"
        );
        return;
      }
      if (!isEmpty(takeProfit) && takeProfit <= 0) {
        toastAlert(
          "error",
          "Take Profit must be greater than current price",
          "marketOrder_tp"
        );
        return;
      }
      setOrderSide(type)
      setOrderShow(true);
    } catch (err: any) {
      console.log(err, "------214");
    }
  };
  const handleSubmit = async (type: string = "buy") => {
    try {
      // e.preventDefault();
      let { price, quantity, takeProfit, stopLoss, leverage, typeTIF } = formValue
      let isTakeProfit = !(takeProfit === "" || takeProfit === "0");
      let isStopLoss = !(stopLoss === "" || stopLoss === "0");
      setLoader(true);
      var reqData = {
        price: price,
        quantity: quantity,
        buyorsell: type,
        orderType: "limit",
        pairId: tradePair._id,
        leverage,
        newdate: new Date(),
        typeTIF,
        takeProfit,
        stopLoss,
        isStopLoss,
        isTakeProfit,
        action: "open",
      };
      let encryptToken: any = {
        token: await encryptObject(reqData),
      };
      const { status, message, } = await apiOrderPlace(encryptToken);
      setLoader(false);
      if (status == "success") {
        toastAlert("success", message, "orderPlace");
        setFormValue({ ...formValue, ...{ takeProfit: "", stopLoss: "", quantity: 0, leverage: leverage } });
        // dispatch(getMode({ inverseId: tradePair._id }));
        setError({});
        setOrderShow(false);
        setOrderSide("");
      } else {
        toastAlert("error", message, "orderPlace");
        setOrderShow(false);
      }
    } catch (err: any) {
      setLoader(false);
      setOrderShow(false);
      if (!isEmpty(err?.response?.data?.message))
        toastAlert("error", err.response.data.message, "orderPlace");
      if (err?.response?.data?.errors) {
        setError(err.response.data.errors);
      }
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);
  useEffect(() => {
    setFormValue({ ...formValue, ...{ leverage: inverseLeverage } });
  }, [inverseLeverage]);
  useEffect(() => {
    if (orderBookPrice && !isEmpty(orderBookPrice)) {

      setFormValue((prev) => {
        return { ...prev, price: orderBookPrice };
      });
    }
  }, [orderBookPrice]);
  useEffect(() => {
    setFormValue((prev) => {
      return { ...prev, price: toFixed(tradePair.markPrice, tradePair.quoteFloatDigit) };
    });
  }, [tradePair._id]);
  const hPercClick = (perc: any, perStatus: any) => {
    if (perStatus) {
      setPerc(perc);
    }
    let ordCos =
      truncateDecimals(
        walletBal.free * (perc > 0 ? perc / 100 : 0),
        tradePair.quoteFloatDigit)
    let qty = (ordCos * formValue.price) / inverseLeverage // ordCos * inverseLeverage
    setFormValue({
      ...formValue,
      ...{
        ["quantity"]: toFixed(
          qty,
          tradePair.baseFloatDigit
        ),
        ["orderCost"]: ordCos
      },
    });
  };
  useEffect(() => {
    // let priceVal = formValue.price
    // let quantityVal = formValue.quantity
    // if (quantityVal > 0 && priceVal > 0) {
    //   setFormValue({ ...formValue, ...{ ["orderCost"]: priceVal * quantityVal / leverage } });
    // }
    if (percent > 0) {
      hPercClick(percent, false)
    } else if (formValue.price > 0 && formValue.quantity > 0) {
      setFormValue({ ...formValue, ...{ ["orderCost"]: (formValue.quantity / formValue.price) / inverseLeverage, leverage: inverseLeverage } });
    }
  }, [inverseLeverage]);
  return (
    <>
      <div className={spot.orderform_bookwrap}>
        <div className={spot.orderform_bookwrap_inner}>
          <div className={`mb-2 ${spot.form_box}`}>
            <div className={spot.input_grp}>
              <InputGroup.Text className={spot.input_text}>
                <b>Price</b>
              </InputGroup.Text>
              <InputGroup>
                <Form.Control
                  placeholder=""
                  type="number"
                  className={spot.input_box}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(e, "buy")
                  }
                  name="price"
                  value={formValue.price}
                />
                <InputGroup.Text
                  className={`${spot.input_text} ${spot.dark}`}
                >
                  {tradePair?.quoteCoinSymbol}
                </InputGroup.Text>
              </InputGroup>
            </div>
            {orderSide == "buy" && (
              <p className="text-danger">{error?.price}</p>
            )}
          </div>
          <div className={`mb-2 ${spot.form_box}`}>
            <div className={spot.input_grp}>
              <InputGroup.Text className={spot.input_text}>
                <b>Amount</b>
              </InputGroup.Text>
              <InputGroup>
                <Form.Control
                  placeholder=""
                  type="number"
                  className={spot.input_box}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(e, "buy")
                  }
                  name="quantity"
                  value={formValue.quantity}
                />
                <InputGroup.Text
                  className={`${spot.input_text} ${spot.dark}`}
                >
                  {tradePair?.baseCoinSymbol}
                </InputGroup.Text>
              </InputGroup>
            </div>
            {orderSide == "buy" && (
              <p className="text-danger">{error?.quantity}</p>
            )}
          </div>
          <div className={`mb-2 ${spot.form_box}`}>
            <div className={spot.input_grp}>
              <InputGroup.Text className={spot.input_text}>
                <b>Order Cost</b>
              </InputGroup.Text>
              <InputGroup>
                <div className={spot.balanceContainer}>
                  <div className="leftBalance">
                    <div className={spot.left_top_future}>
                      <span >
                        {formValue.orderCost > 0 ? `${formValue.orderCost}` : "--"}{" "}
                      </span>
                    </div>
                  </div>
                </div>
                <Form.Control
                  disabled
                  className={spot.input_box}
                />
                <InputGroup.Text
                  className={`${spot.input_text} ${spot.dark}`}
                >
                  {tradePair?.baseCoinSymbol}
                </InputGroup.Text>
              </InputGroup>
            </div>
            {orderSide == "buy" && (
              <p className="text-danger">{error?.quantity}</p>
            )}
          </div>
          <div className={`${spot.form_box} ${spot.form_box_slider}`}>
            <TooltipSlider
              min={1}
              max={100}
              marks={marks}
              tipFormatter={(value: any) => `${value}`}
              tipProps={undefined}
              value={percent}
              onChange={(e: number) => hPercClick(e, true)}
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
            {/* <ButtonGroup className={spot.buttonGroup}>
              {[10, 25, 50, 75, 100].map((percentage, idx) => (
                <Button
                  key={idx}
                  variant={
                    percent == percentage ? "primary" : "outline-secondary"
                  }
                  onClick={() => hPercClick(percentage)}
                  className="w-100"
                >
                  {percentage}%
                </Button>
              ))}
            </ButtonGroup> */}
          </div>
          <div className={`mb-2 ${spot.form_box}`}>
            <Row>
              <Col>
                <div className={spot.input_grp}>
                  <InputGroup.Text className={spot.input_text}>
                    <b>Take Profit</b>
                  </InputGroup.Text>
                  <InputGroup>
                    <Form.Control
                      placeholder=""
                      type="number"
                      className={spot.input_box}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange(e, "buy")
                      }
                      name="takeProfit"
                      value={formValue.takeProfit}
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
                      type="number"
                      className={spot.input_box}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleChange(e, "buy")
                      }
                      name="stopLoss"
                      value={formValue.stopLoss}
                    />
                  </InputGroup>
                </div>
              </Col>
            </Row>
          </div>
          {isClient && isLogin ? (
            <div className={`${spot.form_button_box}`}>
              <button
                className={spot.order_buy_btn}
                onClick={(e) => handleCheck("buy")}
                disabled={orderSide == "buy" && loader}
              >
                {loader && orderSide == "buy" ? (
                  <i className="fa fa-spinner fa-spin"></i>
                ) : (
                  "Open Long"
                )}
              </button>
              <button
                className={spot.order_sell_btn}
                onClick={(e) => handleCheck("sell")}
                disabled={orderSide == "sell" && loader}
              >
                {loader && orderSide == "sell" ? (
                  <i className="fa fa-spinner fa-spin"></i>
                ) : (
                  "Open Short"
                )}
              </button>
            </div>
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
      {/* Order Place Modal */}
      <Modal
        show={orderShow}
        onHide={handleOrderClose}
        centered
        backdrop="static"
        className={`${styles.custom_modal} ${styles.post_order}`}
      >
        <Modal.Header closeButton className={`${styles.modal_head}`}>
          <Modal.Title className={styles.title}>
            <span style={{ color: orderSide == "buy" ? 'green' : 'red' }}>
              {`Limit ${capitalize(orderSide)}`}
            </span>
            {` ${tradePair.tikerRoot}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles.modalContent}>
            <div className={styles.modalRow}>
              <div>Order Price</div>
              <div className={styles.modalOrder}>
                {`${nWComma(toFixed(formValue.price, tradePair.quoteFloatDigit))}
                   ${tradePair.quoteCoinSymbol}`}{" "}
              </div>
            </div>
            <div className={styles.modalRow}>
              <div>Qty</div>
              <div className={styles.modalOrder}>{`${toFixed(marketData?.markPrice * formValue.quantity, tradePair.quoteFloatDigit)} ${tradePair.quoteCoinSymbol}`} </div>
            </div>
            <div className={styles.modalRow}>
              <div>Order Value</div>
              <div className={styles.modalOrder}>
                {`${toFixed(formValue.quantity, tradePair.baseFloatDigit)
                  } ${tradePair.baseCoinSymbol}`}{" "}
              </div>
            </div>
            <div className={styles.modalRow}>
              <div>Order Cost</div>
              <div className={styles.modalOrder}>
                {`${formValue.orderCost} ${tradePair.baseCoinSymbol}`}{" "}
              </div>
            </div>
            <div className={styles.modalRow}>
              <div>Time in Force</div>
              <div className={styles.modalOrder}>Good-Till-Canceled</div>
            </div>
            <div className={styles.modalRow}>
              <div>Leverage</div>
              <div className={styles.modalOrder}>{`${capitalize(inverseMode)} ${inverseLeverage
                }x`}</div>
            </div>
          </div>
          <div className={`mt-4 ${styles.modal_footer}`}>
            <button
              className={`${styles.primary_btn} ${styles.dark}`}
              disabled={loader}
              onClick={() => handleSubmit(orderSide)}
            >
              <span></span>
              <label>
                {loader ? <i className="fa fa-spinner fa-spin"></i> : "Confirm"}
              </label>
            </button>
            <button
              className={`${styles.primary_btn}`}
              onClick={handleOrderClose}
            >
              <span></span>
              <label>Cancel</label>
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
