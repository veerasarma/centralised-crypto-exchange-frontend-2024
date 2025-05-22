import { useEffect, useState } from "react";
import { InputGroup, Form, Modal } from "react-bootstrap";
import styles from "@/styles/common.module.css";
import {
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input/input";
import en from "react-phone-number-input/locale/en.json";
import { isValidPhoneNumber } from "react-phone-number-input";
//import types
import { MobileFormValues } from "./types";
//import lib
import { removeByObj } from "@/lib/validation";
import { toastAlert } from "@/lib/toastAlert";
import isEmpty from "@/lib/isEmpty";
import { emailFormat } from "@/lib/stringCase";
//improt store
import { useDispatch, useSelector } from "../../store";
import { getUserDetails } from "../../store/auth/userSlice";
//import service
import { apiSendOTP, apiverifyMobile } from "../../services/User/UserServices";

const initialFormValue: MobileFormValues = {
  newPhoneNo: "",
  otp: "",
};

export default function BindMobile({ phone_modal, setphone_modal }: any) {
  const dispatch = useDispatch();
  const { emailStatus, email } = useSelector((state: any) => state.auth.user);
  const [formValue, setFormValue] =
    useState<MobileFormValues>(initialFormValue);
  const [error, setError] = useState<any>({});
  const [loader, setLoader] = useState<boolean>(false);
  const [otpButtonType, setOTPButtonType] = useState<string>("Send");
  const [country, setCountry] = useState("AC");
  const [isValidMobile, setIsValidMobile] = useState(false);
  const { newPhoneNo, otp } = formValue;
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timer, setTimer] = useState(false);

  const handleClose = () => {
    setError({});
    setphone_modal(false);
    setFormValue(initialFormValue);
    // setOTPButtonType("Send");
  };

  const CountrySelect = ({ value, onChange, labels, ...rest }: any) => (
    <select
      {...rest}
      value={value}
      onChange={(event) => onChange(event.target.value || undefined)}
    >
      {getCountries().map((country: any) => (
        <option key={country} value={country}>
          {labels[country]} +{getCountryCallingCode(country)}
        </option>
      ))}
    </select>
  );

  const handleCountry = (e: string) => {
    setCountry(e);
    if (!isEmpty(e) && !isEmpty(newPhoneNo)) {
      let val = `+${getCountryCallingCode(e)}${newPhoneNo}`;
      let res = isValidPhoneNumber(val);
      if (res) {
        setIsValidMobile(res);
        setError({
          ...error,
          phoneNumber: "",
        });
      } else if (!isValidPhoneNumber(newPhoneNo)) {
        setError({
          ...error,
          phoneNumber: "Invalid mobile no",
        });
        return;
      }
    }
  };

  const onOTPsend = async () => {
    try {
      let req = {
        roleType: 1,
        requestType: "mobileChange",
      };
      const result = await apiSendOTP(req);
      if (result.data.success) {
        setOTPButtonType("Resend");
        setTimer(false);
        setMinutes(2);
        setSeconds(59);
        toastAlert("success", result.data.message, "login");
      }
    } catch (err: any) {
      toastAlert("error", err.response.data.message, "login");
    }
  };

  const handleMobileNo = (e: any) => {
    try {
      let num = e.target.value;
      setError({});
      setFormValue({ ...formValue, ...{ newPhoneNo: num } });
      if (num === undefined) {
        setError({
          ...error,
          phoneNumber: "Mobile Number required",
        });
        return;
      }
      if (isEmpty(num)) {
        setError({
          ...error,
          phoneNumber: "Mobile Number required",
        });
        return;
      }
      if (!isEmpty(num)) {
        let val = `+${getCountryCallingCode(country)}${num}`;
        let res = isValidPhoneNumber(val);
        if (res) {
          setIsValidMobile(res);
        } else if (!isValidPhoneNumber(num)) {
          setError({
            ...error,
            phoneNumber: "Invalid mobile no",
          });
          return;
        }
      } else {
        setError({
          ...error,
          phoneNumber: "Mobile Number required",
        });
        return;
      }
    } catch (err) {
      console.log("err: ", err);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    setFormValue({ ...formValue, ...{ [name]: value } });
    setError(removeByObj(error, name));
    setLoader(false);
  };

  const handleSubmit = async () => {
    try {
      setLoader(true);
      let reqData = {
        newPhoneCode: getCountryCallingCode(country),
        newPhoneNo,
        otp: otp,
      };
      const result = await apiverifyMobile(reqData);

      if (result.data.success == true) {
        setLoader(false);
        setMinutes(0)
        setSeconds(0)
        dispatch(getUserDetails());
        toastAlert("success", result.data.message, "login");
        handleClose();
        setOTPButtonType("Send");
      }
    } catch (err: any) {
      setLoader(false);
      if (err.response.data.errors) {
        setError(err.response.data.errors);
      }
      if (err.response.data.message)
        toastAlert("error", err.response.data.message, "login");
    }
  };


  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
      if (seconds == 1 && minutes == 0) {
        setTimer(true);
      }
    };
  });

  return (
    <>
      <Modal
        show={phone_modal}
        onHide={handleClose}
        centered
        backdrop="static"
        className={styles.custom_modal}
      >
        <Modal.Header closeButton className={styles.modal_head}>
          <Modal.Title>Phone</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {emailStatus == "verified" ? (
            <>
              <Form>
                <div className={`mb-3 ${styles.input_box}`}>
                  <Form.Label>
                    Country/Region <span className={styles.required}>*</span>
                  </Form.Label>
                  <CountrySelect
                    labels={en}
                    value={country}
                    onChange={handleCountry}
                    name="countrySelect"
                    className="form-select"
                  />
                </div>

                <div className={`mb-3 ${styles.input_box}`}>
                  <Form.Label>
                    Phone Number <span className={styles.required}>*</span>
                  </Form.Label>
                  <Form.Control
                    placeholder="Enter your mobile number"
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    onChange={handleMobileNo}
                  />
                  <p className="text-danger">{error?.phoneNumber}</p>
                </div>

                <div className={`mb-3 ${styles.input_box}`}>
                  <Form.Label className="d-flex">
                    <span>
                      Your secure email address is {emailFormat(email)}{" "}
                      <span className={styles.required}>*</span>
                    </span>
                  </Form.Label>
                  <InputGroup className={`${styles.input_grp}`}>
                    <Form.Control
                      placeholder="Enter your email verification code "
                      aria-label="Recipient's username"
                      aria-describedby="basic-addon2"
                      name="otp"
                      type='number'
                      onChange={handleChange}
                    />
                    {minutes == 0 && seconds == 0 &&
                      <InputGroup.Text id="basic-addon2">
                        {" "}
                        <span className={styles.all} onClick={onOTPsend}>
                          {" "}
                          {otpButtonType}
                        </span>{" "}
                      </InputGroup.Text>
                    }
                  </InputGroup>
                  <p className="text-danger">{error?.otp}</p>
                </div>
                {(minutes != 0 || seconds != 0) && (
                  <p>
                    {" "}
                    Verification code valid up to :{" "}
                    {`${minutes}:${seconds <= 9 ? `0${seconds}` : seconds}`}{" "}
                  </p>
                )}
              </Form>

              <div className={`mt-5 ${styles.modal_footer} `}>
                <button
                  className={styles.primary_btn}
                  onClick={handleClose}
                >
                  <span></span>
                  <label>Cancel</label>
                </button>
                <button
                  className={`${styles.primary_btn} ${styles.dark}`}
                  onClick={handleSubmit}
                  disabled={loader}
                >
                  <span></span>
                  <label>
                    {loader ? (
                      <i className="fa fa-spinner fa-spin"></i>
                    ) : (
                      "Confirm"
                    )}
                  </label>
                </button>
              </div>
            </>   
          ) : (
            <div className={`${styles.modal_footer} `}>
              <button className={styles.primary_btn} onClick={handleClose}>
                <span></span>
                <label>Verify your email</label>
              </button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
