import { useState, useEffect } from "react";
import styles from "@/styles/common.module.css";
import { InputGroup, Form, Row, Col, Dropdown, Modal } from "react-bootstrap";
//import store
import { useSelector, useDispatch } from "@/store";
import { getAssetData } from "@/store/Wallet/dataSlice";
//import lib
import isEmpty from "@/lib/isEmpty";
import { toFixedDown, truncateDecimals } from "@/lib/roundOf";
import { toastAlert } from "@/lib/toastAlert";
import { removeByObj } from "@/lib/validation";
//improt service
import { apiWalletTransfer } from "@/services/Wallet/WalletService";
import Image from "next/image";
import config from "../../config";
import { affiliateWalletTransfer } from "@/services/affiliate/AffiliateService";
type MyFormValues = {
  fromType: string;
  toType: string;
  currencyId: string;
  amount: string;
  currency: string;
};
const initialValues: MyFormValues = {
  fromType: "affiliate",
  toType: "spot",
  currencyId: "",
  amount: "",
  currency: "",
};

// const walletType = [
//   { key: "Spot Wallet", value: "spot" },
//   { key: "Future Wallet", value: "derivative" },
//   { key: "Inverse Wallet", value: "inverse" },
// ];
export default function Transfer({ show, handleCloseTrans, planData, fetchStakersHistory, filter }: any) {
  const dispatch = useDispatch();
  const currencyData = useSelector((state: any) => state.wallet.currency);
  const assets = useSelector((state: any) => state.wallet.assets);
  const [formValue, setFormValue] = useState(initialValues);
  const { fromType, toType, currency, amount, currencyId } = formValue;
  const [loader, setLoader] = useState<boolean>(false);
  const [error, setError] = useState<any>({});
  const [decimal, setDecimal] = useState<Number>(0);
  const handleFrom = (value: any) => {
    // if (value && value == toType) {
    //   toastAlert("error", "Kindly choose different wallet type", "login");
    //   return;
    // }

    // // if(value && value==fromType) {
    // //   toastAlert("error", "Kindly choose different wallet type", "login");
    // // return;
    // // }
    // if (currencyId) {
    //   let walletBalance =
    //     assets &&
    //     assets.length > 0 &&
    //     assets.find((el: any) => el._id == currencyId);
    //   if (value == "spot") {
    //     setBalance(walletBalance.spotBal);
    //   }
    //   if (value == "derivative") {
    //     let derVal = derValCal(walletBalance)
    //     setBalance(derVal);
    //   }
    //   if (value == "inverse") {
    //     setBalance(walletBalance.inverseBal);
    //   }
    // }
    // setFormValue({ ...formValue, ...{ fromType: value } });
    // setError(removeByObj(error, "fromType"));
  };

  const handleTo = (value: any) => {
    // if (value == fromType) {
    //   toastAlert("error", "Kindly choose different wallet type", "login");
    //   return;
    // }
    // setFormValue({ ...formValue, ...{ toType: value } });
    // setError(removeByObj(error, "toType"));
  };

  const [total, setTotal] = useState(0)

  const [available, setAvailable] = useState(0)

  const [locked, setLocked] = useState(0)

  const [isLocked, setIsLocked] = useState(false)

  const handleCoin = ({ coin, coinId }: any) => {
    setFormValue({ ...formValue, currency: coin, currencyId: coinId, amount: "0" });
    let walletBalance = assets && assets.length > 0 && assets.find((el: any) => el._id == coinId);
    if (!isEmpty(coinId)) {
      const currenntCurData = currencyData.find((item: any) => coinId == item._id)
      let affBal = walletBalance?.affiliateBal > 0 ? walletBalance.affiliateBal : 0
      setDecimal(currenntCurData?.type == "token" ? currenntCurData.decimals : currenntCurData.contractDecimal)
      if (planData.type === "small") {
        setTotal(affBal)
        setAvailable(planData.thirdCont > 0 ? affBal : affBal - (planData.firstCont + planData.secondCont + planData.thirdCont + planData.smallStakerPurchase))
        setIsLocked(false)
        setLocked(0)
      }
      else {
        let curTotal;
        if (coin === planData.coin) {
          curTotal = coin === planData.rewardCoin ? parseFloat(walletBalance.spotLockedBal) + parseFloat(affBal) : walletBalance.spotLockedBal
        }
        else {
          curTotal = coin === planData.rewardCoin ? affBal : walletBalance.spotLockedBal
        }
        setTotal(curTotal)
        let curAvailable;
        if (planData.coin === planData.rewardCoin && addThreeMonths(planData.createdAt) <= new Date()) {
          curAvailable = parseFloat(affBal) + parseFloat(walletBalance.spotLockedBal)
          setLocked(parseFloat(walletBalance.spotLockedBal))
          setIsLocked(true)
        }
        else if (planData.coin === planData.rewardCoin && !(addThreeMonths(planData.createdAt) <= new Date())) {
          curAvailable = affBal
          setLocked(0)
          setIsLocked(false)
        }
        else if (planData.coin !== planData.rewardCoin && addThreeMonths(planData.createdAt) <= new Date()) {
          curAvailable = planData.rewardCoin === coin ? affBal : parseFloat(walletBalance.spotLockedBal)
          setLocked(planData.rewardCoin === coin ? 0 : parseFloat(walletBalance.spotLockedBal))
          setIsLocked(planData.rewardCoin === coin ? false : true)
        }
        else if (planData.coin !== planData.rewardCoin && !(addThreeMonths(planData.createdAt) <= new Date())) {
          curAvailable = planData.rewardCoin === coin ? affBal : 0
          setLocked(0)
          setIsLocked(false)
        }
        setAvailable(curAvailable)
      }
    }
    setError(removeByObj(error, "currencyId"));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: void
  ) => {
    let { value, name } = e.target;
    setLoader(false);
    if (
      name === "amount" &&
      value.split(".")[1] &&
      value.split(".")[1].length > decimal
    ) {
      return;
    }
    if (!isEmpty(value) && !/^(?:[0-9]+(?:\.[0-9]*)?)?$/.test(value)) {
      return;
    }
    setError(removeByObj(error, name));
    setFormValue({ ...formValue, ...{ [name]: value } });
  };

  const handleSubmit = async () => {
    try {
      let reqData = {
        fromType: fromType,
        toType: toType,
        currency: currency,
        currencyId: currencyId,
        amount: amount,
        locked,
        isLocked,
        planData
      };
      if (truncateDecimals(available, decimal) < amount) {
        toastAlert("error", "Insufficient Balance", "walletTransfer", "TOP_RIGHT");
        return
      }
      setLoader(true);
      const respData: any = await affiliateWalletTransfer(reqData);
      setLoader(false);
      if (respData.data.status) {
        dispatch(getAssetData());
        fetchStakersHistory(filter)
        setError({})
        handleCloseTrans();
        setFormValue(initialValues);
        toastAlert("success", respData.data.message, "walletTransfer");
      }
    } catch (err: any) {
      setLoader(false);
      if (!isEmpty(err?.response?.data?.errors))
        setError(err.response.data.errors);
      if (!isEmpty(err?.response?.data?.message))
        toastAlert("error", err.response.data.message, "walletTransfer", "TOP_RIGHT");
    }
  };

  const onClose = () => {
    setError({});
    handleCloseTrans();
  };

  const addThreeMonths = (date: Date) => {
    const threeMonthsLater = new Date(date)
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3)
    return threeMonthsLater
  }

  useEffect(() => {
    if (planData && show) {
      handleCoin({ coin: planData.rewardCoin, coinId: planData.rewardCoinId })
    }
  }, [show, planData]);

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      className={`${styles.custom_modal} ${styles.post_order}`}      
    >
      <Modal.Header closeButton className={`${styles.modal_head}`}>
        <Modal.Title className={styles.title}>Transfer</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pb-4">
        <section>
          <div className="d-md-flex gap-4">
            <p className={`${planData.type === "big" && currency === planData.coin ? "m-0 p-0" : ""}`}>
              Total : {truncateDecimals(total, decimal)} {currency}{" "}
            </p>
            <p className={`${planData.type === "big" && currency === planData.coin ? "m-0 p-0" : ""}`}>
              Available : {truncateDecimals(available, decimal)} {currency}{" "}
            </p>
          </div>
          {
            planData.type === "big" && currency === planData.coin &&
            <div>
              <p>(Invested Amount is able to transfer after three months)</p>
            </div>
          }
        </section>
        <Row>
          <Col lg={6}>
            <label>From</label>
            <Dropdown
              className={`${styles.drp_down} ${styles.drp_down_notoggle} mb-4`}
              onSelect={handleFrom}
              aria-disabled={true}
            >
              <Dropdown.Toggle variant="primary">
                {fromType == "affiliate" ? "Affiliate Wallet" : ""}
              </Dropdown.Toggle>
              {/* <Dropdown.Menu>
                {walletType?.length > 0 &&
                  walletType.map((item: any, index: number) => {
                    if (fromType != item.value) {
                      if (
                        (item.value == "inverse" && config.MODE !== "prod") ||
                        item.value != "inverse"
                      ) {
                        return (
                          <Dropdown.Item eventKey={item.value}>
                            {item.key}
                          </Dropdown.Item>
                        );
                      }
                    }
                  })}
              </Dropdown.Menu> */}
            </Dropdown>
            <p className="text-danger">{error?.fromType}</p>
          </Col>
          {/* <Col lg={2} className="align-self-center text-center">
            <Image
              onClick={() => ChangeType()}
              src="/assets/images/swap_arrow.png"
              className="img-fluid swapArrow"
              alt="img"
              width={42}
              height={40}
            />
          </Col> */}
          <Col lg={6}>
            <label>To</label>
            <Dropdown className={`${styles.drp_down} ${styles.drp_down_notoggle} mb-4`} onSelect={handleTo} aria-disabled={true}>
              <Dropdown.Toggle variant="primary">
                {toType == "spot" ? "Spot Wallet" : ""}
              </Dropdown.Toggle>
              {/* <Dropdown.Menu>
                {walletType?.length > 0 &&
                  walletType.map((item: any, index: number) => {
                    if (toType != item.value) {
                      if (
                        (item.value == "inverse" && config.MODE !== "prod") ||
                        item.value != "inverse"
                      ) {
                        return (
                          <Dropdown.Item eventKey={item.value}>
                            {item.key}
                          </Dropdown.Item>
                        );
                      }
                    }
                  })}
              </Dropdown.Menu> */}
            </Dropdown>
            <p className="text-danger">{error?.toType}</p>
          </Col>
          <Col lg={12}>
            <label>Coin</label>
            <Dropdown
              className={`${styles.drp_down} mb-4`}
              onSelect={(value) => {
                if (planData.type === "big") {
                  console.log('planData: ', planData);
                  let data = {
                    coin: planData.coin === value ? planData.coin : planData.rewardCoin,
                    coinId: planData.coin === value ? planData.coinId : planData.rewardCoinId,
                  }
                  handleCoin(data)
                }
                else if (planData.type === "small") {
                  handleCoin({ coin: planData.rewardCoin, coinId: planData.rewardCoinId })
                }
              }}
            >
              <Dropdown.Toggle variant="primary" disabled={planData.rewardCoin === currency && (planData.rewardCoin === planData.coin || planData.type === "small")}>{currency}</Dropdown.Toggle>
              <Dropdown.Menu>
                {planData.rewardCoin !== currency &&
                  <Dropdown.Item eventKey={planData.rewardCoin}>
                    {planData.rewardCoin}
                  </Dropdown.Item>
                }
                {planData && planData.type === "big" && planData.coin !== currency && (
                  <Dropdown.Item eventKey={planData.coin}>{planData.coin}</Dropdown.Item>
                )
                }
              </Dropdown.Menu>
            </Dropdown>
            <p className="text-danger">{error?.currencyId}</p>
          </Col>
          <Col lg={12}>
            <Form.Label>Amount </Form.Label>
            <InputGroup className={`mb-3 ${styles.input_grp}`}>
              <Form.Control
                type="number"
                name="amount"
                onChange={handleChange}
                value={amount}
              />
              <InputGroup.Text
                id="basic-addon2"
                className="border-start-0"
                onClick={() =>
                  setFormValue({
                    ...formValue,
                    ...{ amount: toFixedDown(available, decimal) },
                  })
                }
              >
                <button className={styles.primary_btn}>
                  <label>Max</label>
                </button>
              </InputGroup.Text>
            </InputGroup>
            <p className="text-danger">{error?.amount}</p>
          </Col>
          <Col lg={12} className="text-center mt-4">
            <button
              className={styles.primary_btn}
              onClick={handleSubmit}
              disabled={loader}
            >
              <span></span>
              <label>
                {loader ? <i className="fa fa-spinner fa-spin"></i> : "Confirm"}
              </label>
            </button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}
