import styles from "@/styles/common.module.css";
import { Form, InputGroup } from "react-bootstrap";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

import {
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input/input";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import en from "react-phone-number-input/locale/en.json";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useRouter } from "next/router";
//import types
import { MyFormValuesMobile } from "./types";
//import lib
import isEmpty from "@/lib/isEmpty";
import { toastAlert } from "@/lib/toastAlert";
import { removeByObj } from "@/lib/validation";
import validation from "./validation";
//improt service
import { apiSignUp, verifyOtp } from "../../services/User/AuthService";

let initialValue: MyFormValuesMobile = {
  newPhoneCode: "",
  newPhoneNo: "",
  refferalCode: "",
  roleType: 2,
  confirmPassword: "",
  password: "",
  otp: "",
};

export default function MobileForm({ refId }: any) {
  const submitButtonRef = useRef(null);
  const router = useRouter();
  const [checkbox, setCheckBox] = useState(false);
  const [country, setCountry] = useState("AC");
  const [error, setError] = useState<any>({});
  const [isValidMobile, setIsValidMobile] = useState(false);
  const [formValue, setFormvalue] = useState(initialValue);
  const [loader, setLoader] = useState(false);
  const [userToken, setUserToken] = useState("");
  const [verficationType, setVerficationType] = useState("");
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [isMobile, setisMobile] = useState(false);
  const [refStatus, setRefStatus] = useState(false);
  const [isPassword, setIsPassword] = useState<boolean>(false);
  const [isPassword1, setIsPassword1] = useState<boolean>(false);
  //OTP
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timer, setTimer] = useState(false);
  const [submitData, setSubmitData] = useState({});
  let { newPhoneNo, refferalCode, roleType, confirmPassword, password, otp } =
    formValue;

  const handleReCaptcha = async () => {
    try {
      if (!executeRecaptcha) {
        toastAlert("error", "Recaptcha required", "recaptcha");
        return "";
      }
      return await executeRecaptcha("login");
    } catch (err) {
      toastAlert("error", "Invalid recaptcha", "recaptcha");
      return "";
    }
  };

  useEffect(() => {
    if (!isEmpty(refId)) {
      setFormvalue({ ...formValue, ...{ ['refferalCode']: refId } });
      setRefStatus(true)
    }
  }, [refId])
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

  const handleMobileNo = (e: any) => {
    try {
      let num = e.target.value;
      setError({});
      setFormvalue({ ...formValue, ...{ newPhoneNo: num } });
      if (num === undefined) {
        setError({
          ...error,
          newPhoneNo: "Mobile Number required",
        });
        return;
      }
      if (isEmpty(num)) {
        setError({
          ...error,
          newPhoneNo: "Mobile Number required",
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
            newPhoneNo: "Invalid mobile no",
          });
          return;
        }
      } else {
        setError({
          ...error,
          newPhoneNo: "Mobile Number required",
        });
        return;
      }
    } catch (err) {
      console.log("err: ", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    setFormvalue({ ...formValue, ...{ [name]: value } });
    setError(removeByObj(error, name));
    setLoader(false);
    if (name == "otp" && value?.length == 6) {
      setTimeout(() => {
        autoSubmit();
      }, 500);
    }
  };
  const autoSubmit = () => {
    // Trigger a click on the submit button
    if (submitButtonRef.current) {
      submitButtonRef.current.click();
    }
  };
  const handleFormSubmit = async (e: any) => {
    try {
      e.preventDefault();
      setLoader(true);
      const captcha = await handleReCaptcha();
      if (isEmpty(captcha)) {
        setLoader(false);
        toastAlert("error", "Invalid recaptcha", "login", "TOP_CENTER");
        return;
      }
      let data = {
        newPhoneCode: getCountryCallingCode(country),
        newPhoneNo,
        roleType,
        password,
        confirmPassword,
        reCaptcha: captcha,
        refferalCode: refferalCode,
        checkbox,
      };
      let checkErrors = validation(data);
      if (!isEmpty(checkErrors)) {
        setLoader(false);
        return setError(checkErrors);
      }
      if (!isValidMobile) {
        setLoader(false);
        setError({
          ...error,
          newPhoneNo: "Mobile Number is required",
        });
        return;
      }

      setSubmitData(data);

      const result = await apiSignUp(data);
      setLoader(false);
      if (result.data.status) {
        toastAlert("success", result.data.message, "register");
        if (!result.data.isMobile) {
          router.push("/login");
        } else if (result.data.isMobile) {
          toastAlert("success", result.data.message, "register");
          setisMobile(result.data.isMobile);
          setUserToken(result.data.userToken);
          setVerficationType(result.data.verficationType);
          setTimer(false);
          setMinutes(9);
          setSeconds(59);
        }
      }
    } catch (err: any) {
      setLoader(false);
      if (err?.response?.data?.errors) {
        setError(err.response.data.errors);
      }
    }
  };
  const handleCountry = (e: string) => {
    setCountry(e);
    if (!isEmpty(e) && !isEmpty(newPhoneNo)) {
      let val = `+${getCountryCallingCode(e)}${newPhoneNo}`;
      let res = isValidPhoneNumber(val);
      if (res) {
        setIsValidMobile(res);
        setError({
          ...error,
          newPhoneNo: "",
        });
      } else if (!isValidPhoneNumber(newPhoneNo)) {
        setError({
          ...error,
          newPhoneNo: "Invalid mobile no",
        });
        return;
      }
    }
  };

  const handleOtpSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoader(true);
      let reqData = {
        otpAuth: userToken,
        otp,
        isMobile,
        optType: verficationType,
      };
      let response = await verifyOtp(reqData);
      setLoader(false);
      if (response.data.status) {
        setTimeout(() => {
          toastAlert("success", response.data.message, "login");
          router.push("/login");
        }, 500);
      } else {
        toastAlert("success", response.data.message, "login");
      }
    } catch (err: any) {
      setLoader(false);
      if (err?.response?.data?.errors) {
        setError(err.response.data.errors);
        return;
      }
      toastAlert("error", err.response.data.message, "otpVerify");
    }
  };

  const handleResendOtp = async (e: any) => {
    e.preventDefault();
    setLoader(true);
    try {
      const captcha = await handleReCaptcha();
      if (isEmpty(captcha)) {
        toastAlert("error", "Invalid recaptcha", "login", "TOP_CENTER");
        return;
      }
      let response = await apiSignUp({
        ...submitData,
        ...{ reCaptcha: captcha },
      });
      setLoader(false);
      toastAlert("success", response.data.message, "login");
      if (response.data.isMobile) {
        setMinutes(9);
        setSeconds(59);
        setTimer(false);
        toastAlert("success", response.data.message, "login");
        return;
      }
    } catch (err: any) {
      setLoader(false);
      if (err?.response?.data?.errors) {
        setError(err.response.data.errors);
        return;
      }
      toastAlert("error", err.response.data.message, "login");
    }
  };
  const handleCheck = () => {
    setCheckBox(checkbox ? false : true);
    setError(removeByObj(error, "checkbox"));
    setLoader(false);
  };
  useEffect(() => {
    isValidMobile && setError({});
  }, [isValidMobile]);

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
    <div className={styles.login_tabs}>
      {!isMobile ? (
        <>
          <div className="mb-4">
            <Form.Label>Select Country</Form.Label>
            <CountrySelect
              labels={en}
              value={country}
              onChange={handleCountry}
              name="countrySelect"
              className="form-select"
            />
          </div>
          <div className="mb-4">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              placeholder="Enter your Mobile Number"
              aria-label="mobile"
              aria-describedby="basic-addon1"
              type='number'
              onChange={handleMobileNo}
            />
            <p className="text-danger">{error?.newPhoneNo}</p>
          </div>
          <div className="mb-4">
            <Form.Label>Password</Form.Label>
            <InputGroup className={`${styles.input_grp}`}>
              <Form.Control
                placeholder="Enter password"
                aria-label="password"
                aria-describedby="basic-addon2"
                onChange={handleChange}
                type={!isPassword ? "password" : "text"}
                name="password"
                onKeyPress={(e: any) => {
                  if (e.key == "Enter") handleFormSubmit(e);
                }}
              />
              <InputGroup.Text id="basic-addon2" className="border-start-0">
                {" "}
                <i
                  className={`${styles.eye} ${isPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"
                    }`}
                  onClick={() => setIsPassword(isPassword ? false : true)}
                ></i>{" "}
              </InputGroup.Text>
            </InputGroup>
            <p className="text-danger">{error?.password}</p>
          </div>
          <div className="mb-4">
            <Form.Label>Confirm Password</Form.Label>
            <InputGroup className={`${styles.input_grp}`}>
              <Form.Control
                placeholder="Re-enter your password"
                aria-label="Enter  confirm password"
                aria-describedby="basic-addon2"
                onChange={handleChange}
                type={!isPassword1 ? "password" : "text"}
                name="confirmPassword"
                onKeyPress={(e: any) => {
                  if (e.key == "Enter") handleFormSubmit(e);
                }}
              />
              <InputGroup.Text id="basic-addon2" className="border-start-0">
                {" "}
                <i
                  className={`${styles.eye} ${isPassword1 ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"
                    }`}
                  onClick={() => setIsPassword1(isPassword1 ? false : true)}
                ></i>{" "}
              </InputGroup.Text>
            </InputGroup>
            <p className="text-danger">{error?.confirmPassword}</p>
          </div>
          <div className="mb-4">
            <Form.Label>Referral Code (Optional)</Form.Label>
            <Form.Control
              placeholder="Referral Code"
              autoComplete="off"
              aria-label="mobile"
              aria-describedby="basic-addon1"
              name="refferalCode"
              onChange={handleChange}
              disabled={refStatus}
              value={refferalCode}
              onKeyPress={(e: any) => {
                if (e.key == "Enter") handleFormSubmit(e);
              }}
            />
            <p className="text-danger">{error?.refferalCode}</p>
          </div>
          {/* <div className="mb-4">
                            <Form.Label className={`${styles.arrow} ${isToggled ? styles.active : ''} `} onClick={handleToggleClick}  >Invitation code (valid for new users only)</Form.Label>
                            <Form.Control
                                placeholder="Invitation Code"
                                aria-label="password"
                                aria-describedby="basic-addon2"
                                className={`  ${isToggled ? styles.show : styles.hide}`}
                                name='refferalCode'
                                onChange={handleChange}
                                onKeyPress={(e: any) => {
                                    if (e.key == "Enter") handleFormSubmit(e)
                                }}
                            />
                        </div> */}
          <Form.Group
            className={`mb-3 ${styles.check_box}`}
            controlId="exampleForm.ControlInput1"
          >
            <div className="d-flex align-items-start gap-2">
              <Form.Check
                type="checkbox"
                className={styles.check}
                name="radioGroup"
                id={`default-checkbox1`}
                onClick={handleCheck}
              />
              <span>
                By creating an account,I agree to B5 Exchanges's{" "}
                <Link href="/terms" className={styles.ylw_link}>
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className={styles.ylw_link}>
                  Privacy Policy.
                </Link>
              </span>
            </div>
            <p className="text-danger">{error?.checkbox}</p>
          </Form.Group>
          <button
            className={`my-3 ${styles.primary_btn} ${styles.dark}`}
            onClick={handleFormSubmit}
            disabled={loader}
          >
            <span className={styles.button_chev}></span>{" "}
            <label>
              {loader ? <i className="fa fa-spinner fa-spin"></i> : "Register"}
            </label>
          </button>
        </>
      ) : (
        <>
          <div className="mb-4">
            <Form.Label>OTP</Form.Label>
            <Form.Control
              placeholder="Enter OTP"
              aria-label="otp"
              aria-describedby="basic-addon2"
              name="otp"
              onChange={handleChange}
              onKeyPress={(e: any) => {
                if (e.key == "Enter") handleFormSubmit(e);
              }}
            />
            <p className="text-danger">{error?.otp}</p>
          </div>
          {(minutes != 0 || seconds != 0) && (
            <p>
              {" "}
              OTP valid up to :{" "}
              {`${minutes}:${seconds <= 9 ? `0${seconds}` : seconds}`}{" "}
            </p>
          )}
          {!timer && (
            <button
              className={`my-3 ${styles.primary_btn} ${styles.dark}`}
              onClick={handleOtpSubmit}
              ref={submitButtonRef}
              disabled={loader}
            >
              <span className={styles.button_chev}></span>{" "}
              <label>
                {loader ? (
                  <i className="fa fa-spinner fa-spin"></i>
                ) : (
                  "Verify OTP"
                )}
              </label>
            </button>
          )}

          {timer && (
            <button
              className={`my-3 ${styles.primary_btn} ${styles.dark}`}
              onClick={handleResendOtp}
              disabled={loader}
            >
              <span className={styles.button_chev}></span>{" "}
              <label>
                {loader ? (
                  <i className="fa fa-spinner fa-spin"></i>
                ) : (
                  "Resend OTP"
                )}
              </label>
            </button>
          )}
        </>
      )}

      <div className="mb-4">
        <span className={styles.info}>  Already have an account?
          {" "}<Link href="/login" className={styles.ylw_link}
          >Sign In</Link>
        </span>
      </div>
    </div >

  );
}
