import { useState, useEffect } from "react";
import styles from "@/styles/common.module.css";
import { InputGroup, Form, Row, Col, Dropdown, Modal } from "react-bootstrap";
//import store
import { useSelector, useDispatch } from "@/store";
import { getAssetData } from "@/store/Wallet/dataSlice";
//import lib
import isEmpty from "@/lib/isEmpty";
import { truncateDecimals } from "@/lib/roundOf";
import { toastAlert } from "@/lib/toastAlert";
import { removeByObj } from "@/lib/validation";
//improt service
import { apiWalletTransfer } from "@/services/Wallet/WalletService";
import Image from "next/image";
import config from "../../config";
type MyFormValues = {
  fromType: string;
  toType: string;
  userAssetId: string;
  amount: string;
  currency: string;
};
const initialValues: MyFormValues = {
  fromType: "spot",
  toType: "derivative",
  userAssetId: "",
  amount: "",
  currency: "",
};

const walletType = [
  { key: "Spot Wallet", value: "spot" },
  { key: "Future Wallet", value: "derivative" },
  { key: "Inverse Wallet", value: "inverse" },
];
export default function InternalTranf({ show, handleClose, totUnreal }: any) {
  const dispatch = useDispatch();
  const assets = useSelector((state: any) => state.wallet.assets);
  const currencyData = useSelector((state: any) => state.wallet.currency);
  const { derivativeMode } = useSelector(
    (state) => state.UserSetting?.data?.mode
  );
  const [formValue, setFormValue] = useState(initialValues);
  const [balance, setBalance] = useState("");
  const { fromType, toType, currency, amount, userAssetId } = formValue;
  const [loader, setLoader] = useState<boolean>(false);
  const [error, setError] = useState<any>({});
  const [decimal, setDecimal] = useState<Number>(0);
  const handleFrom = (value: any) => {
    if (value && value == toType) {
      toastAlert("error", "Kindly choose different wallet type", "login");
      return;
    }

    // if(value && value==fromType) {
    //   toastAlert("error", "Kindly choose different wallet type", "login");
    // return;
    // }
    if (userAssetId) {
      let walletBalance =
        assets &&
        assets.length > 0 &&
        assets.find((el: any) => el._id == userAssetId);
      if (value == "spot") {
        setBalance(walletBalance.spotBal);
      }
      if (value == "derivative") {
        let derVal = derValCal(walletBalance)
        setBalance(derVal);
      }
      if (value == "inverse") {
        setBalance(walletBalance.inverseBal);
      }
    }
    setFormValue({ ...formValue, ...{ fromType: value } });
    setError(removeByObj(error, "fromType"));
  };
  const handleTo = (value: any) => {
    if (value == fromType) {
      toastAlert("error", "Kindly choose different wallet type", "login");
      return;
    }
    setFormValue({ ...formValue, ...{ toType: value } });
    setError(removeByObj(error, "toType"));
  };
  const handleCoin = (value: any) => {
    let walletBalance =
      assets && assets.length > 0 && assets.find((el: any) => el._id == value);
    const currenntCurData = currencyData.find((item: any) => walletBalance._id == item._id)
    setDecimal(currenntCurData?.type == "token" ? currenntCurData.decimals : currenntCurData?.contractDecimal)
    if (!isEmpty(walletBalance)) {
      if (fromType == "spot") {
        setBalance(walletBalance.spotBal);
      }
      if (fromType == "derivative") {
        let derVal = derValCal(walletBalance)
        setBalance(derVal);
      }
      if (fromType == "inverse") {
        setBalance(walletBalance.inverseBal);
      }
      console.log(walletBalance, '------92')
      let data = { currency: walletBalance.coin, userAssetId: value };
      setError(removeByObj(error, "userAssetId"));
      setFormValue({ ...formValue, ...data });
    }
  };
  const derValCal = (walletBal: any) => {
    let derVal: any = parseFloat(walletBal.derivativeBal) - parseFloat(walletBal.derivativeBalLocked)
    if (derivativeMode == "cross") {
      // derVal -= parseFloat(walletBal.derivativeBalWB)
    }
    console.log(derVal, '-------110', totUnreal)
    if (totUnreal <= 0) {
      derVal += parseFloat(totUnreal)
    }
    console.log(derVal, '-----114')
    return derVal
  }
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    let { value, name } = e.target;
    setLoader(false);
    if (
      name === "amount" &&
      value.split(".")[1] &&
      value.split(".")[1].length > 6
    ) {
      return;
    }
    if (!isEmpty(value) && !/^\d*\.?\d*$/.test(value)) {
      return;
    }
    setError(removeByObj(error, name));
    setFormValue({ ...formValue, ...{ [name]: value } });
  };
  const ChangeType = () => {
    if (userAssetId) {
      let walletBalance =
        assets &&
        assets.length > 0 &&
        assets.find((el: any) => el._id == userAssetId);
      if (toType == "spot") {
        setBalance(walletBalance.spotBal);
      }
      if (toType == "derivative") {
        let derVal = derValCal(walletBalance)
        setBalance(derVal);
      }
      if (toType == "inverse") {
        setBalance(walletBalance.inverseBal);
      }
    }
    let data = { fromType: toType, toType: fromType, amount: "" };
    setFormValue({ ...formValue, ...data });
  };

  const handleSubmit = async () => {
    try {
      let reqData = {
        fromType: fromType,
        toType: toType,
        userAssetId: userAssetId,
        amount: amount,
      };
      setLoader(true);
      const respData: any = await apiWalletTransfer(reqData);
      setLoader(false);
      if (respData.data.status) {
        dispatch(getAssetData());
        handleClose();
        setFormValue(initialValues);
        toastAlert("success", respData.data.message, "walletTransfer");
      }
    } catch (err: any) {
      setLoader(false);
      if (!isEmpty(err?.response?.data?.errors))
        setError(err.response.data.errors);
      if (!isEmpty(err?.response?.data?.message))
        toastAlert("error", err.response.data.message, "login");
    }
  };
  const onClose = () => {
    setFormValue(initialValues);
    setBalance("0");
    setError({});
    handleClose();
  };
  useEffect(() => {
    if (!isEmpty(assets)) {
      if (toType != "derivative") {
        handleCoin(assets[0]._id);
      } else {
        let derivData = assets.find((item: any) => item.coin == "USDT")
        handleCoin(derivData._id)
      }
    }
  }, [assets, show]);
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      className={`${styles.custom_modal} ${styles.post_order}`}
      size="lg"
    >
      <Modal.Header closeButton className={`${styles.modal_head}`}>
        <Modal.Title className={styles.title}>Transfer</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pb-4">
        <p>
          Total : {truncateDecimals(balance, decimal)} {currency}{" "}
        </p>
        <Row>
          <Col lg={5}>
            <label>From</label>
            <Dropdown
              className={`${styles.drp_down} mb-4`}
              onSelect={handleFrom}
            >
              <Dropdown.Toggle variant="primary">
                {fromType == "spot"
                  ? "Spot wallet"
                  : fromType == "inverse"
                    ? "Inverse Wallet"
                    : "Future wallet"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
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
              </Dropdown.Menu>
            </Dropdown>
            <p className="text-danger">{error?.fromType}</p>
          </Col>
          <Col lg={2} className="align-self-center text-center">
            <Image
              onClick={() => ChangeType()}
              src="/assets/images/swap_arrow.png"
              className="img-fluid swapArrow"
              alt="img"
              width={42}
              height={40}
            />
          </Col>
          <Col lg={5}>
            <label>To</label>
            <Dropdown className={`${styles.drp_down} mb-4`} onSelect={handleTo}>
              <Dropdown.Toggle variant="primary">
                {toType == "spot"
                  ? "Spot wallet"
                  : toType == "inverse"
                    ? "Inverse Wallet"
                    : "Future wallet"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
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
              </Dropdown.Menu>
            </Dropdown>
            <p className="text-danger">{error?.toType}</p>
          </Col>
          <Col lg={12}>
            <label>Coin</label>
            <Dropdown
              className={`${styles.drp_down} mb-4`}
              onSelect={handleCoin}
            >
              <Dropdown.Toggle variant="primary">{currency}</Dropdown.Toggle>
              <Dropdown.Menu>
                {assets?.length > 0 &&
                  assets.map((item: any, index: number) => {
                    if (((fromType == "spot" && toType == "derivative") || (fromType == "derivative" && toType == "spot")) && item.coin == 'USDT') {
                      return (
                        <Dropdown.Item eventKey={item._id} key={index}>
                          {item.coin}
                        </Dropdown.Item>
                      );
                    }
                    else if (fromType != "derivative" && toType != "derivative") {
                      return (
                        <Dropdown.Item eventKey={item._id} key={index}>
                          {item.coin}
                        </Dropdown.Item>
                      );
                    }

                  })}
              </Dropdown.Menu>
            </Dropdown>
            <p className="text-danger">{error?.userAssetId}</p>
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
                    ...{ amount: truncateDecimals(balance, decimal) },
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
