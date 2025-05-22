import { useState, useEffect } from "react";
import styles from "@/styles/common.module.css";
import { Form, Row, Col, Dropdown } from "react-bootstrap";
import { useRouter } from "next/router";
// import store
import { useSelector, useDispatch } from "@/store";
import { getUserDetails } from "@/store/auth/userSlice";
import { getBankDetails } from "@/store/PaymentMethods/bankSlice";
//improt service
import { apiBankUpdate, apiBankDetil } from "@/services/User/UserServices";
// import lib
import { toastAlert } from "@/lib/toastAlert";
import isEmpty from "@/lib/isEmpty";
import { removeByObj } from "@/lib/validation";
//import types
import { BankFormValues } from "./types";
//import component
import CountryList from "../kyc/CountrySelect";
//import validation
import { bankAddValid } from "./validation";

const initialFormValue = {
  bankId: "",
  bankName: "",
  accountNo: "",
  holderName: "",
  bankcode: "",
  bankAddress: "",
  city: "",
  isPrimary: "",
  currencyId: " ",
  currencySymbol: "",
};
export default function AddBank({ query, type }: any) {
  const currency = useSelector((state: any) => state.wallet.currency);
  const [country, setCountry] = useState<any>({});
  const [error, setError] = useState<any>({});
  const router = useRouter();
  const dispatch = useDispatch();
  const [formValue, setFormValue] = useState<BankFormValues>(initialFormValue);
  const {
    bankId,
    bankName,
    accountNo,
    holderName,
    bankcode,
    bankAddress,
    city,
    isPrimary,
    currencyId,
    currencySymbol,
  } = formValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value, name } = e.target;
    setFormValue({ ...formValue, ...{ [name]: value } });
    setError(removeByObj(error, name));
  };

  const handleCoin = (value: string) => {
    let checkCurr = currency.find((item: any) => {
      return item._id == value;
    });
    if (isEmpty(checkCurr)) return;
    let data = {
      currencyId: checkCurr._id,
      currencySymbol: checkCurr.coin,
    };
    setFormValue({ ...formValue, ...data });
    setError(removeByObj(error, "currencyId"));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      let data = {
        bankId: bankId,
        bankName: bankName,
        accountNo: accountNo,
        holderName: holderName,
        bankcode: bankcode,
        country: country.value,
        city: city,
        bankAddress: bankAddress,
        currencyId: currencyId,
        currencySymbol: currencySymbol,
        isPrimary: isPrimary,
      };
      let errors = bankAddValid(data);
      if (!isEmpty(errors)) {
        return setError(errors);
      }
      const respData = await apiBankUpdate(data);
      const { success, message } = respData.data;
      if (success) {
        toastAlert("success", message, "bankdetail");
        dispatch(getUserDetails());
        dispatch(getBankDetails());
        router.push("/payment-method");
      }
    } catch (err: any) {
      if (err?.response?.data?.errors) setError(err.response.data.errors);
    }
  };
  const findById = async () => {
    let resp = await apiBankDetil();
    if (resp.data.success) {
      let findDoc = resp?.data?.result?.bankDetails.find((item: any) => {
        return item._id == query.id;
      });
      if (!isEmpty(findDoc)) {
        let data = {
          bankId: findDoc._id,
          bankName: findDoc.bankName,
          accountNo: findDoc.accountNo,
          holderName: findDoc.holderName,
          bankcode: findDoc.bankcode,
          country: findDoc.country,
          city: findDoc.city,
          bankAddress: findDoc.bankAddress,
          currencyId: findDoc.currencyId,
          currencySymbol: findDoc.currencySymbol,
          isPrimary: findDoc.isPrimary,
        };
        setFormValue(data);
      } else {
        router.push("/payment-method");
      }
    }
  };
  useEffect(() => {
    if (!isEmpty(query) && type == "bank") {
      findById();
    }
  }, [query]);
  return (
    <Row>
      <Col lg={4}>
        <label className="mb-1">Currency</label>
        <Dropdown className={`${styles.drp_down} mb-4`} onSelect={handleCoin}>
          <Dropdown.Toggle variant="primary">
            {!isEmpty(currencySymbol) ? currencySymbol : "Select currency"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {currency?.length > 0 &&
              currency.map((item: any, index: number) => {
                if (item.type == "fiat") {
                  return (
                    <Dropdown.Item eventKey={item._id} key={index}>
                      {item.coin}
                    </Dropdown.Item>
                  );
                }
              })}
          </Dropdown.Menu>
        </Dropdown>
        <p className="text-danger">{error?.currencyId}</p>
      </Col>
      <Col lg={4}>
        <div className={`mb-4 ${styles.input_box}`}>
          <Form.Label className="mb-1"> Account holder name </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter holder name"
            className="p-2"
            name="holderName"
            value={holderName}
            onChange={handleChange}
          />
        </div>
        <p className="text-danger">{error?.holderName}</p>
      </Col>
      <Col lg={4}>
        <div className={`mb-4 ${styles.input_box}`}>
          <Form.Label className="mb-1"> Bank name </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter bank name"
            className="p-2"
            name="bankName"
            value={bankName}
            onChange={handleChange}
          />
        </div>
        <p className="text-danger">{error?.bankName}</p>
      </Col>
      <Col lg={4}>
        <div className={`mb-4 ${styles.input_box}`}>
          <Form.Label className="mb-1">Account Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter account no"
            className="p-2"
            name="accountNo"
            value={accountNo}
            onChange={handleChange}
          />
        </div>
        <p className="text-danger">{error?.accountNo}</p>
      </Col>

      <Col lg={4}>
        <div className={`mb-4 ${styles.input_box}`}>
          <Form.Label className="mb-1">
            {currencySymbol == "USD" ? (
              <label>Routing number(s)</label>
            ) : currencySymbol == "EUR" ? (
              <label>BIC/SWIFT Code</label>
            ) : (
              <label>IFSC Code</label>
            )}
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="IFSC Code"
            className="p-2"
            name="bankcode"
            value={bankcode}
            onChange={handleChange}
          />
        </div>
        <p className="text-danger">{error?.bankcode}</p>
      </Col>
      <Col lg={4}>
        <label className="mb-1">Bank Country</label>
        <CountryList setCountry={setCountry} country={country} />
        <p className="text-danger">{error?.country}</p>
      </Col>
      <Col lg={4}>
        <div className={`mb-4 ${styles.input_box}`}>
          <Form.Label className="mb-1">Bank city</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter bank city"
            className="p-2"
            name="city"
            value={city}
            onChange={handleChange}
          />
        </div>
        <p className="text-danger">{error?.city}</p>
      </Col>
      <Col lg={8}>
        <div className={`mb-4 ${styles.input_box}`}>
          <Form.Label className="mb-1">Bank address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter bank address"
            className="p-2"
            name="bankAddress"
            value={bankAddress}
            onChange={handleChange}
          />
        </div>
        <p className="text-danger">{error?.bankAddress}</p>
      </Col>
      <Col lg={12}>
        <div className="d-flex gap-3">
          <button
            className={`${styles.primary_btn}`}
            onClick={() => router.push("/payment-method")}
          >
            <span></span>
            <label>Cancel</label>
          </button>
          <button className={`${styles.primary_btn} ${styles.dark}`} onClick={handleSubmit}>
            <span></span>
            <label>Confirm</label>
          </button>
        </div>
      </Col>
    </Row>
  );
}
