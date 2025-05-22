import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import spot from "@/styles/Spot.module.css";
import { useRouter, asPath } from "next/router";
import TooltipSlider from "../TooltipSlider";
import Link from "next/link";
import styles from "@/styles/common.module.css";
import { Form, InputGroup } from "react-bootstrap";
// import socket 
import SocketContext from "../Context/SocketContext";
//import store
import { useSelector } from "../../store";
//improt lib
import { toFixed, toFixedDown, truncateDecimals } from "@/lib/roundOf";
import isEmpty from "@/lib/isEmpty";
import { encryptObject } from "../../lib/cryptoJS";
import { toastAlert } from "@/lib/toastAlert";
import { removeByObj } from "@/lib/validation";
//improt types
import { MarketFormValues } from "./types";
//improt serviec
import { apiOrderPlace } from "../../services/Spot/SpotService";

let initialBuyValue: MarketFormValues = {
  orderValue: "",
  slidQuant: "",
  percentage: "0"
};

let initialSellValue: MarketFormValues = {
  amount: "",
  slidQuant: "",
  percentage: "0"
};

const marks = {
  0: 0,
  25: 25,
  50: 50,
  75: 75,
  100: 100,
};

export default function MarketOrder({ activeTab }: any) {
  const router = useRouter();
  const socketContext = useContext<any>(SocketContext);

  const isLogin = useSelector((state: any) => state.auth.session.signedIn);
  const { firstCurrency, secondCurrency, tradePair, marketData } = useSelector(
    (state: any) => state.spot
  );
  const [isClient, setIsClient] = useState(false);
  const [buyFormValue, setBuyFormvalue] =
    useState<MarketFormValues>(initialBuyValue);
  const [sellFormValue, setSellFormvalue] =
    useState<MarketFormValues>(initialSellValue);
  const [orderSide, setOrderSide] = useState<string>("");
  const [error, setError] = useState<any>({});
  const [mData, setMData] = useState<any>({});
  const [loader, setLoader] = useState<boolean>(false);


  useEffect(() => {
    // socket
    // socketContext.spotSocket.on("marketPrice", (result: any) => {
    //   if (tradePair._id == result.pairId) {
    //     setMData(result?.data);
    //   }
    // });
    setMData(marketData)
  }, [tradePair, marketData]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    let { value, name } = e.target;
    setLoader(false);
    if (
      name === "orderValue" &&
      value.split(".")[1] &&
      value.split(".")[1].length > tradePair.secondFloatDigit
    ) {
      return;
    } else if (
      name === "amount" &&
      value.split(".")[1] &&
      value.split(".")[1].length > tradePair.firstFloatDigit
    ) {
      return;
    }
    if (!isEmpty(value) && !/^\d*\.?\d*$/.test(value)) {
      return;
    }
    setError(removeByObj(error, name));
    if (type == "buy") {
      setBuyFormvalue({ ...buyFormValue, ...{ [name]: value, ["slidQuant"]: value } });
    } else {
      setSellFormvalue({ ...sellFormValue, ...{ [name]: value, ["slidQuant"]: value } });
    }
  };

  const handleSlider = (percentage: number, buyorsell: string) => {
    if (buyorsell == "buy") {
      let userBalance =
        secondCurrency && secondCurrency.spotBal > 0
          ? secondCurrency.spotBal
          : 0;
      setBuyFormvalue({
        ...buyFormValue,
        ...{
          orderValue:
            toFixedDown(
              userBalance * (percentage / 100),
              tradePair.secondFloatDigit
            ),
          slidQuant: userBalance * (percentage / 100),
        },
      });
    } else if (buyorsell == "sell") {
      let userBalance =
        firstCurrency && firstCurrency.spotBal > 0
          ? parseFloat(firstCurrency.spotBal)
          : 0;
      setSellFormvalue({
        ...sellFormValue,
        ...{
          amount: toFixedDown(
            userBalance * (percentage / 100),
            tradePair.firstFloatDigit
          ),
          slidQuant: userBalance * (percentage / 100),
        },
      });
    }
  };

  const handleSubmit = async (e: any, type: string = "buy") => {
    try {
      e.preventDefault();
      let side: string = type == "buy" ? "orderValue" : "amount";
      let reqData = {
        [side]: type == "buy" ? buyFormValue.orderValue : sellFormValue.amount,
        buyorsell: type,
        orderType: "market",
        spotPairId: tradePair._id,
        newdate: new Date(),
      };
      setOrderSide(type);

      if (type == "buy") {
        if (isEmpty(reqData.orderValue)) {
          return toastAlert(
            "error",
            "Order Value field is required",
            "orderPlace"
          );
        } else if (isNaN(reqData.orderValue)) {
          return toastAlert(
            "error",
            "Order Value allow only numeric",
            "orderPlace"
          );
        } else if (parseFloat(reqData.orderValue) < 0) {
          return toastAlert(
            "error",
            "Order Value allow only positive value",
            "orderPlace"
          );
        }
      } else {
        if (isEmpty(reqData.amount)) {
          return toastAlert("error", "Quantity field is required", "orderPlace");
        } else if (isNaN(reqData.amount)) {
          return toastAlert("error", "Quantity allow only numeric", "orderPlace");
        } else if (parseFloat(reqData.amount) < 0) {
          return toastAlert(
            "error",
            "Quantity allow only positive value",
            "orderPlace"
          );
        }
      }
      setLoader(true);
      let encryptToken: any = {
        token: await encryptObject(reqData),
      };
      const result: any = await apiOrderPlace(encryptToken);
      setLoader(false);
      if (result.data.status) {
        toastAlert("success", result.data.message, "orderPlace");
        setBuyFormvalue(initialBuyValue);
        setSellFormvalue(initialSellValue);
        setError({});
        setOrderSide("");
      } else {
        toastAlert("success", result.data.message, "orderPlace");
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const percentage = parseFloat(buyFormValue.slidQuant) > 0 ? toFixedDown(((parseFloat(buyFormValue.slidQuant) / parseFloat(secondCurrency.spotBal)) * 100), tradePair?.secondFloatDigit) : 0
    setBuyFormvalue({ ...buyFormValue, percentage: percentage })
  }, [buyFormValue.slidQuant])

  useEffect(() => {
    const percentage = parseFloat(sellFormValue.slidQuant) > 0 ? toFixedDown(((parseFloat(sellFormValue.slidQuant) / parseFloat(firstCurrency.spotBal)) * 100),tradePair?.firstFloatDigit) : 0
    setSellFormvalue({ ...sellFormValue, percentage: percentage })
  }, [sellFormValue.slidQuant])

  return (
    <div className={spot.orderform_bookwrap}>
      {activeTab == "buy" ? (
        <div className={spot.orderform_bookwrap_inner}>
          <div className={spot.place_order_bal}>
            <label>Available</label>
            <span>
              {!isEmpty(secondCurrency?.spotBal)
                ? truncateDecimals(
                  secondCurrency.spotBal,
                  tradePair?.secondFloatDigit
                )
                : isClient
                  ? 0.0
                  : null}{" "}
              <small>{tradePair?.secondCurrencySymbol}</small>
            </span>
          </div>
          <div className={`mb-3 ${spot.form_box}`}>
            <div className={spot.input_grp}>
              <InputGroup.Text className={spot.input_text}>
                Price
              </InputGroup.Text>
              <InputGroup>
                <Form.Control
                  placeholder=""
                  type="number"
                  className={spot.input_box}
                  disabled
                  name="market"
                  value={toFixedDown(mData?.markPrice, tradePair?.secondFloatDigit)} // "Market"
                />
                <InputGroup.Text className={`${spot.input_text} ${spot.dark}`}>
                  {tradePair?.secondCurrencySymbol}
                </InputGroup.Text>
              </InputGroup>
            </div>
          </div>
          <div className={`mb-3 ${spot.form_box}`}>
            <div className={spot.input_grp}>
              <InputGroup.Text className={spot.input_text}>
                Buying order value
              </InputGroup.Text>
              <InputGroup>
                <Form.Control
                  placeholder=""
                  type="number"
                  className={spot.input_box}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(e, "buy")
                  }
                  name="orderValue"
                  value={buyFormValue.orderValue}
                />
                <InputGroup.Text className={`${spot.input_text} ${spot.dark}`}>
                  {tradePair?.secondCurrencySymbol}
                </InputGroup.Text>
              </InputGroup>
            </div>
            {orderSide == "buy" && (
              <p className="text-danger">{error?.orderValue}</p>
            )}
          </div>

          {/* <div className={spot.tot_flx}>
            <span>Total</span>
            <p className="mb-0">
              {parseFloat(buyFormValue.orderValue) > 0
                ? toFixedDown(
                  parseFloat(buyFormValue.orderValue),
                  tradePair?.secondFloatDigit
                )
                : 0.0}
              <span className="ms-2">{tradePair?.secondCurrencySymbol}</span>
            </p>
          </div> */}
          <div className={`${spot.form_box} ${spot.form_box_slider}`}>
            <TooltipSlider
              min={0}
              max={100}
              marks={marks}
              tipFormatter={(value: any) => `${value}`}
              tipProps={undefined}
              onChange={(e: number) => handleSlider(e, "buy")}
              value={buyFormValue?.percentage}
              // (parseFloat(buyFormValue.slidQuant) > 0
              //   ?
              //   toFixedDown(((parseFloat(buyFormValue.slidQuant) / parseFloat(secondCurrency.spotBal)) * 100), tradePair?.secondFloatDigit)
              //   : 0)
              // }
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
                  "Buy"
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
          <div className={spot.place_order_bal}>
            <label>Available</label>
            <span>
              {!isEmpty(firstCurrency?.spotBal)
                ? truncateDecimals(firstCurrency.spotBal, tradePair.firstFloatDigit)
                : isClient
                  ? 0.0
                  : null}{" "}
              <small>{tradePair?.firstCurrencySymbol}</small>
            </span>
          </div>
          <div className={`mb-3 ${spot.form_box}`}>
            <div className={spot.input_grp}>
              <InputGroup.Text className={spot.input_text}>
                Price
              </InputGroup.Text>
              <InputGroup>
                <Form.Control
                  placeholder=""
                  type="number"
                  className={spot.input_box}
                  disabled
                  name="market"
                  value={toFixedDown(mData?.markPrice, tradePair?.secondFloatDigit)} // "Market"
                />
                <InputGroup.Text className={`${spot.input_text} ${spot.dark}`}>
                  {tradePair?.secondCurrencySymbol}
                </InputGroup.Text>
              </InputGroup>
            </div>
          </div>
          <div className={`mb-3 ${spot.form_box}`}>
            <div className={spot.input_grp}>
              <InputGroup.Text className={spot.input_text}>
                Selling amount
              </InputGroup.Text>
              <InputGroup>
                <Form.Control
                  placeholder=""
                  type="number"
                  className={spot.input_box}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(e, "sell")
                  }
                  name="amount"
                  value={sellFormValue.amount}
                />
                <InputGroup.Text className={`${spot.input_text} ${spot.dark}`}>
                  {tradePair?.firstCurrencySymbol}
                </InputGroup.Text>
              </InputGroup>
            </div>
            {orderSide == "sell" && (
              <p className="text-danger">{error?.amount}</p>
            )}
          </div>
          {/* <div className={spot.tot_flx}>
            <span>Total</span>
            <p className="mb-0">
              {parseFloat(sellFormValue.amount) > 0
                ? toFixedDown(
                  parseFloat(sellFormValue.amount),
                  tradePair?.firstFloatDigit
                )
                : 0.0}
              <span className="ms-2">{tradePair?.firstCurrencySymbol}</span>
            </p>
          </div> */}
          <div className={`${spot.form_box} ${spot.form_box_slider}`}>
            <TooltipSlider
              min={0}
              max={100}
              marks={marks}
              tipFormatter={(value: any) => `${value}`}
              tipProps={undefined}
              value={sellFormValue?.percentage}
              //   (parseFloat(sellFormValue.slidQuant) > 0
              //     ? toFixedDown(
              //       ((parseFloat(sellFormValue.slidQuant) / parseFloat(firstCurrency.spotBal)) * 100),
              //       tradePair?.secondFloatDigit
              //     )
              //     : 0)
              // }
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
          </div>
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
                  "Sell"
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
  );
}
