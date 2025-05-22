import { useState, useEffect, useContext } from "react";

import spot from "@/styles/Spot.module.css";
import TooltipSlider from "../TooltipSlider";
import styles from "@/styles/common.module.css";
import { useRouter } from "next/router";
import { Form, InputGroup } from "react-bootstrap";
//import store
import { useSelector } from "../../store";
//improt lib
import { toFixed, toFixedDown, truncateDecimals } from "@/lib/roundOf";
import isEmpty from "@/lib/isEmpty";
import { encryptObject } from "../../lib/cryptoJS";
import { toastAlert } from "@/lib/toastAlert";
import { removeByObj } from "@/lib/validation";
//improt types
import { LimitFormValues } from "./types";
//improt serviec
import { apiOrderPlace } from "../../services/Spot/SpotService";

const marks = {
  0: 0,
  25: 25,
  50: 50,
  75: 75,
  100: 100,
};

let initialBuyValue: LimitFormValues = {
  price: "0",
  quantity: "0",
  slidQuant: "0",
  total: "0",
  percentage: "0"
};
let initialSellValue: LimitFormValues = {
  price: "0",
  quantity: "0",
  slidQuant: "0",
  total: "0",
  percentage: "0"
};

export default function LimitOrder({ activeTab }: any) {
  const router = useRouter();
  const isLogin = useSelector((state: any) => state.auth.session.signedIn);
  const {
    firstCurrency,
    secondCurrency,
    tradePair,
    marketData,
    orderBookPrice,
  } = useSelector((state: any) => state.spot);
  const [isClient, setIsClient] = useState(false);
  const [buyFormValue, setBuyFormvalue] =
    useState<LimitFormValues>(initialBuyValue);
  const [sellFormValue, setSellFormvalue] =
    useState<LimitFormValues>(initialSellValue);
  const [orderSide, setOrderSide] = useState<string>("");
  const [error, setError] = useState<any>({});
  const [loader, setLoader] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    let { value, name } = e.target;
    setLoader(false);
    if (
      name === "price" &&
      value.split(".")[1] &&
      value.split(".")[1].length > tradePair.secondFloatDigit
    ) {
      return;
    } else if (
      name === "quantity" &&
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
      if (name === "price") {
        if (isEmpty(value)) {
          let formData = {
            [name]: value,
            quantity: 0,
            total: 0
          };
          setBuyFormvalue({ ...buyFormValue, ...formData });
        } else {
          let bPrice = value
          let bQuantity = buyFormValue.quantity
          let formData = {
            ...buyFormValue, ...{ [name]: value }
          }
          if (!isEmpty(bPrice) && !isEmpty(bQuantity)) {
            let totalPrice = parseFloat(bPrice) * parseFloat(bQuantity);
            formData = { ...formData, ...{ ['total']: toFixed(totalPrice, tradePair.secondFloatDigit) } }
          }
          setBuyFormvalue(formData);
        }
        return;
      }
      let bPrice = buyFormValue.price
      let bQuantity = value
      let formData = {
        ...buyFormValue, ...{ [name]: value }
      }
      console.log(formData, '-------112')
      if (!isEmpty(bPrice) && !isEmpty(bQuantity)) {
        let totalPrice = parseFloat(bPrice) * parseFloat(bQuantity);
        formData = { ...formData, ...{ ['total']: toFixed(totalPrice, tradePair.secondFloatDigit) } }
      }
      if (name == "quantity") {
        formData = { ...formData, ...{ ['slidQuant']: value } }
      }
      setBuyFormvalue(formData);
    } else {
      if (name === "price") {
        if (isEmpty(value)) {
          let formData = {
            [name]: value,
            quantity: 0,
            total: 0
          };
          setSellFormvalue({ ...sellFormValue, ...formData });
        } else {
          let sPrice = value
          let sQuantity = sellFormValue.quantity
          let formData = {
            ...sellFormValue, ...{ [name]: value }
          }
          if (!isEmpty(sPrice) && !isEmpty(sQuantity)) {
            let totalPrice = parseFloat(sPrice) * parseFloat(sQuantity);
            formData = { ...formData, ...{ ['total']: toFixed(totalPrice, tradePair.secondFloatDigit) } }
          }
          setSellFormvalue(formData);
        }
        return;
      }
      let sPrice = sellFormValue.price
      let sQuantity = value
      let formData = {
        ...sellFormValue, ...{ [name]: value }
      }
      if (!isEmpty(sPrice) && !isEmpty(sQuantity)) {
        let totalPrice = parseFloat(sPrice) * parseFloat(sQuantity);
        formData = { ...formData, ...{ ['total']: toFixed(totalPrice, tradePair.secondFloatDigit) } }
      }
      if (name == "quantity") {
        formData = { ...formData, ...{ ['slidQuant']: value } }
      }
      setSellFormvalue(formData);
    }
  };

  const handleSlider = (e: number, type: string) => {
    try {
      if (type == "buy") {
        let price = buyFormValue.price;
        if (price == "0") price = marketData.markPrice;
        let userBalance =
          secondCurrency && secondCurrency.spotBal > 0
            ? secondCurrency.spotBal
            : 0;
        let totalPrice = (e / 100) * userBalance;
        let quantity = totalPrice / price;
        let total = userBalance * e / 100
        if (!isEmpty(price)) {
          setBuyFormvalue({
            ...buyFormValue,
            ...{
              ["price"]: price,
              ["slidQuant"]: quantity,
              ["quantity"]: toFixedDown(quantity, tradePair.firstFloatDigit),
              ["total"]: toFixedDown(total, tradePair.secondFloatDigit),
            },
          });
        }
      } else if (type == "sell") {
        let userBalance =
          firstCurrency && firstCurrency.spotBal > 0
            ? firstCurrency.spotBal
            : 0;
        let price = sellFormValue.price;
        if (price === "0") price = marketData.markPrice;
        if (!isEmpty(price)) {
          let qtyPrice = (e / 100) * userBalance;
          let total = price * qtyPrice
          setSellFormvalue({
            ...sellFormValue,
            ...{
              ["price"]: price,
              ["slidQuant"]: qtyPrice,
              ["quantity"]: toFixedDown(qtyPrice, tradePair.firstFloatDigit),
              ["total"]: toFixedDown(total, tradePair.secondFloatDigit),
            },
          });
        } else {
          let qtyPrice = (e / 100) * userBalance;
          let total = userBalance * e / 100
          setSellFormvalue({
            ...sellFormValue,
            ...{
              ["price"]: price,
              ["slidQuant"]: qtyPrice,
              ["quantity"]: toFixedDown(qtyPrice, tradePair.firstFloatDigit),
              ["total"]: toFixedDown(total, tradePair.secondFloatDigit),
            },
          });
        }
      }
    } catch (err) {
      console.log(err, "------155");
    }
  };

  const handleSubmit = async (e: any, type: string = "buy") => {
    try {
      e.preventDefault();
      let { price, quantity } = type == "buy" ? buyFormValue : sellFormValue;
      let reqData = {
        price: price,
        quantity: quantity,
        buyorsell: type,
        orderType: "limit",
        spotPairId: tradePair._id,
        newdate: new Date(),
      };
      setOrderSide(type);
      if (isEmpty(reqData.price)) {
        return toastAlert("error", "Price field is required", "orderPlace");
      } else if (isNaN(reqData.price)) {
        return toastAlert("error", "Price allow only numeric", "orderPlace");
      } else if (parseFloat(reqData.price) < 0) {
        return toastAlert(
          "error",
          "Price allow only positive value",
          "orderPlace"
        );
      }
      if (isEmpty(reqData.quantity)) {
        return toastAlert("error", "Quantity field is required", "orderPlace");
      } else if (isNaN(reqData.quantity)) {
        return toastAlert("error", "Quantity allow only numeric", "orderPlace");
      } else if (parseFloat(reqData.quantity) < 0) {
        return toastAlert(
          "error",
          "Quantuty allow only positive value",
          "orderPlace"
        );
      }
      setLoader(true);
      let encryptToken: any = {
        token: await encryptObject(reqData),
      };
      const result: any = await apiOrderPlace(encryptToken);
      setLoader(false);
      if (result.data.status) {
        toastAlert("success", result.data.message, "orderPlace");
        let initForm = {
          price: type == "buy" ? buyFormValue.price : sellFormValue.price,
          quantity: "0",
          slidQuant: "0",
          total: "0"
        }
        setBuyFormvalue(initForm);
        setSellFormvalue(initForm);
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
    if (orderBookPrice && !isEmpty(orderBookPrice)) {
      if (activeTab == "buy") {
        setBuyFormvalue((prev) => {
          return { ...prev, price: toFixed(orderBookPrice, tradePair.secondFloatDigit) };
        });
      } else {
        setSellFormvalue((prev) => {
          return { ...prev, price: toFixed(orderBookPrice, tradePair.firstFloatDigit) };
        });
      }
    }
  }, [orderBookPrice]);
  useEffect(() => {
    if (tradePair && !isEmpty(tradePair)) {
      if (activeTab == "buy") {
        setBuyFormvalue((prev) => {
          return { ...prev, price: toFixed(tradePair.markPrice, tradePair.secondFloatDigit) };
        });
        setError({})
      } else {
        setSellFormvalue((prev) => {
          return { ...prev, price: toFixed(tradePair.markPrice, tradePair.secondFloatDigit) };
        });
        setError({})
      }
    }
  }, [tradePair, activeTab]);

  const handleTotal = (e: any, type: string) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }

    if (
      name === "total" &&
      value.split(".")[1] &&
      value.split(".")[1].length > tradePair.secondFloatDigit
    ) {
      return;
    }

    // if (name == "total" && value == "") {
    //   return
    // }
    if (type == "buy") {
      let formData = { ...buyFormValue, ...{ [name]: value } };
      if (!isEmpty(formData.price) && !isEmpty(formData.total)) {
        let totalPrice = formData.total / formData.price;
        formData = { ...formData, ...{ ["quantity"]: toFixed(totalPrice, tradePair.firstFloatDigit) } };
      }
      setBuyFormvalue(formData);
    }
    if (type == "sell") {
      let formData = { ...sellFormValue, ...{ [name]: value } };
      if (!isEmpty(formData.price) && !isEmpty(formData.total)) {
        let totalPrice = formData.total / formData.price;
        formData = { ...formData, ...{ ["quantity"]: toFixed(totalPrice, tradePair.firstFloatDigit) } };
      }
      setSellFormvalue(formData);
    }
  };
  console.log(buyFormValue, '-------328', secondCurrency)

  useEffect(() => {
    const percentage = (parseFloat(buyFormValue.price) * parseFloat(buyFormValue.quantity)) > 0 ? toFixedDown((((parseFloat(buyFormValue.price) * parseFloat(buyFormValue.quantity)) / parseFloat(secondCurrency.spotBal)) * 100), tradePair?.secondFloatDigit) : 0
    setBuyFormvalue({ ...buyFormValue, percentage: percentage })
  }, [buyFormValue.price, buyFormValue.quantity, buyFormValue.slidQuant, buyFormValue.total])

  useEffect(() => {
    const percentage = parseFloat(sellFormValue.quantity) > 0 ? toFixedDown(((parseFloat(sellFormValue.quantity) / parseFloat(firstCurrency.spotBal)) * 100), tradePair?.firstFloatDigit) : 0
    setSellFormvalue({ ...sellFormValue, percentage: percentage })
  }, [sellFormValue.price, sellFormValue.quantity, sellFormValue.slidQuant, sellFormValue.total])

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
                Buying Price
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
                  value={buyFormValue.price}
                />
                <InputGroup.Text className={`${spot.input_text} ${spot.dark}`}>
                  {tradePair?.secondCurrencySymbol}
                </InputGroup.Text>
              </InputGroup>
            </div>
            {orderSide == "buy" && (
              <p className="text-danger">{error?.price}</p>
            )}
          </div>
          <div className={`mb-3 ${spot.form_box}`}>
            <div className={spot.input_grp}>
              <InputGroup.Text className={spot.input_text}>
                Buying Amount
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
                  value={buyFormValue.quantity}
                />
                <InputGroup.Text className={`${spot.input_text} ${spot.dark}`}>
                  {tradePair?.firstCurrencySymbol}
                </InputGroup.Text>
              </InputGroup>
            </div>
            {orderSide == "buy" && (
              <p className="text-danger">{error?.quantity}</p>
            )}
          </div>
          <div className={`mb-3 ${spot.form_box}`}>
            <div className={spot.input_grp}>
              <InputGroup.Text className={spot.input_text}>
                Total Order Value
              </InputGroup.Text>
              <InputGroup>
                <Form.Control
                  placeholder=""
                  type="number"
                  name="total"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleTotal(e, "buy")
                  }
                  className={spot.input_box}
                  value={buyFormValue.total}
                />
                <InputGroup.Text className={`${spot.input_text} ${spot.dark}`}>
                  {tradePair?.secondCurrencySymbol}
                </InputGroup.Text>
              </InputGroup>
            </div>
            {orderSide == "buy" && (
              <p className="text-danger">{error?.total}</p>
            )}
          </div>
          {/* <div className={spot.tot_flx}>
            <span>Total</span>
            <p className="mb-0">
              {parseFloat(buyFormValue.price) *
                parseFloat(buyFormValue.quantity) >
                0
                ? toFixedDown(
                  parseFloat(buyFormValue.price) *
                  parseFloat(buyFormValue.quantity),
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
              value={buyFormValue?.percentage}
              // (parseFloat(buyFormValue.price) *
              //   parseFloat(buyFormValue.slidQuant) >
              //   0
              //   ?
              //   toFixedDown((((parseFloat(buyFormValue.price) *
              //     parseFloat(buyFormValue.slidQuant)) / parseFloat(secondCurrency.spotBal)) * 100), tradePair?.secondFloatDigit)
              //   : 0)
              // }
              onChange={(e: number) => handleSlider(e, "buy")}
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
                Selling Price
              </InputGroup.Text>
              <InputGroup>
                <Form.Control
                  placeholder=""
                  type="number"
                  className={spot.input_box}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(e, "sell")
                  }
                  name="price"
                  value={sellFormValue.price}
                />
                <InputGroup.Text className={`${spot.input_text} ${spot.dark}`}>
                  {tradePair?.secondCurrencySymbol}
                </InputGroup.Text>
              </InputGroup>
            </div>
            {orderSide == "sell" && (
              <p className="text-danger">{error?.price}</p>
            )}
          </div>
          <div className={`mb-3 ${spot.form_box}`}>
            <div className={spot.input_grp}>
              <InputGroup.Text className={spot.input_text}>
                Selling Amount
              </InputGroup.Text>
              <InputGroup>
                <Form.Control
                  placeholder=""
                  type="number"
                  name="quantity"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(e, "sell")
                  }
                  className={spot.input_box}
                  value={sellFormValue.quantity}
                />
                <InputGroup.Text className={`${spot.input_text} ${spot.dark}`}>
                  {tradePair?.firstCurrencySymbol}
                </InputGroup.Text>
              </InputGroup>
            </div>
            {orderSide == "sell" && (
              <p className="text-danger">{error?.quantity}</p>
            )}
          </div>
          <div className={`mb-3 ${spot.form_box}`}>
            <div className={spot.input_grp}>
              <InputGroup.Text className={spot.input_text}>
                Total Order Value
              </InputGroup.Text>
              <InputGroup>
                <Form.Control
                  placeholder=""
                  type="number"
                  name="total"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleTotal(e, "sell")
                  }
                  className={spot.input_box}
                  value={sellFormValue.total}
                />
                <InputGroup.Text className={`${spot.input_text} ${spot.dark}`}>
                  {tradePair?.secondCurrencySymbol}
                </InputGroup.Text>
              </InputGroup>
            </div>
            {orderSide == "sell" && (
              <p className="text-danger">{error?.total}</p>
            )}
          </div>
          {/* <div className={`mb-3 ${spot.form_box}`}>
            <div className={spot.input_grp}>
              <InputGroup.Text className={spot.input_text}>
                Total
              </InputGroup.Text>
              <InputGroup>
                <Form.Control
                  placeholder=""
                  type="number"
                  name="quantity"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(e, "sell")
                  }
                  className={spot.input_box}
                  value={parseFloat(sellFormValue.price) *
                    parseFloat(sellFormValue.quantity) >
                    0
                    ? toFixedDown(
                      parseFloat(sellFormValue.price) *
                      parseFloat(sellFormValue.quantity),
                      tradePair?.secondFloatDigit
                    )
                    : 0.0}
                />
                <InputGroup.Text className={`${spot.input_text} ${spot.dark}`}>
                  {tradePair?.secondCurrencySymbol}
                </InputGroup.Text>
              </InputGroup>
            </div>
            {orderSide == "sell" && (
              <p className="text-danger">{error?.quantity}</p>
            )}
          </div> */}
          {/* <div className={spot.tot_flx}>
            <span>Total</span>
            <p className="mb-0">
              {parseFloat(sellFormValue.price) *
                parseFloat(sellFormValue.quantity) >
                0
                ? toFixedDown(
                  parseFloat(sellFormValue.price) *
                  parseFloat(sellFormValue.quantity),
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
              value={sellFormValue?.percentage}
              // (parseFloat(sellFormValue.slidQuant) > 0
              //   ? toFixedDown(
              //     ((parseFloat(sellFormValue.slidQuant) / parseFloat(firstCurrency.spotBal)) * 100),
              //     tradePair?.secondFloatDigit
              //   )
              //   : 0)
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
