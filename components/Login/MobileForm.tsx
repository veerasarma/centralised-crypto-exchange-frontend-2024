import Link from "next/link";
import styles from "@/styles/common.module.css";
import { Form, InputGroup } from "react-bootstrap";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input/input";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import en from "react-phone-number-input/locale/en.json";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useRouter } from "next/router";
import axios from "axios";
import browser from "browser-detect";
import { useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
//improt store
import { setUser } from "../../store/auth/userSlice";
import { setUserSetting } from "../../store/UserSetting/dataSlice";
import { onSignInSuccess } from "../../store/auth/sessionSlice";
//import lib
import isEmpty from "@/lib/isEmpty";
import { toastAlert } from "@/lib/toastAlert";
import { removeByObj } from "@/lib/validation";
import validation from "./validation";
//improt types
import { MyFormValues } from "./types";
//improt service
import {
  apiSignIn,
  resendOtp,
  verifyOtp,
} from "../../services/User/AuthService";

const initialFormValue: MyFormValues = {
  email: "",
  roleType: 2,
  password: "",
  twoFACode: "",
  newPhoneCode: "",
  newPhoneNo: "",
  otp: "",
  isTerms: false,
};

export default function MobileForm() {
  const submitButtonRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const [cookies, setCookie] = useCookies(["name"]);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [country, setCountry] = useState("AC");
  const [formValue, setFormValue] = useState(initialFormValue);
  const [isValidMobile, setIsValidMobile] = useState(false);
  const [error, setError] = useState<any>({});
  const [loader, setLoader] = useState(false);
  const [loginHistory, setLoginHistory] = useState({});
  const [LoginData, setLoginData] = useState({
    newPhoneCode: "",
    newPhoneNo: "",
  });
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timer, setTimer] = useState(false);
  const [resendOtpBtnStatus, setResendOtpBtnStatus] = useState(false);
  const [otpTextBox, setOtpTextBox] = useState(false);
  const [isMobile, setisMobile] = useState(false);
  const [showTwoFA, setShowTowFA] = useState(false);
  const [otpAuth, setotpAuth] = useState("");
  const [isPassword, setIsPassword] = useState<boolean>(false);
  const [checkbox, setCheckBox] = useState(false);
  const { email, password, isTerms, twoFACode, newPhoneNo, otp, roleType } =
    formValue;

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

  const handleReCaptcha = useCallback(async () => {
    try {
      if (!executeRecaptcha) {
        console.log('Execute recaptcha not yet available');
        // toastAlert("error", "Recaptcha required", "recaptcha");
        return "";
      }
      return await executeRecaptcha("phoneLogin");
    } catch (err) {
      console.log(err, "Error on recaptcha");
      toastAlert("error", "Invalid recaptcha!", "recaptcha");
      return "";
    }
  }, [executeRecaptcha]);

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

  const handleMobileNo = (e: any) => {
    try {
      let num = e.target.value;
      setError({});
      setFormValue({ ...formValue, ...{ newPhoneNo: num } });
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
    console.log("name: ", name);
    setFormValue({ ...formValue, ...{ [name]: value } });
    setError(removeByObj(error, name));
    setLoader(false);
    if ((name == "twoFACode" || name == "otp") && value?.length == 6) {
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
    e.preventDefault();
    const captcha = await handleReCaptcha();
    if (isEmpty(captcha)) {
      setLoader(false);
      toastAlert("error", "Invalid recaptcha", "login", "TOP_CENTER");
      return;
    }
    let reqData = {
      newPhoneCode: getCountryCallingCode(country),
      newPhoneNo,
      otp: otp,
      roleType,
      loginHistory,
      password,
      twoFACode,
      reCaptcha: captcha,
      checkbox,
    };
    let checkErrors = validation(reqData);

    if (!isEmpty(checkErrors)) {
      setLoader(false);
      setError(checkErrors);
      return;
    }
    if (!isValidMobile) {
      setLoader(false);
      setError({
        ...error,
        newPhoneNo: "Mobile Number is required",
      });
      return;
    }

    setLoader(true);
    try {
      setLoginData(reqData);
      let response = await apiSignIn(reqData);

      if (response.data.status == "SUCCESS") {
        dispatch(onSignInSuccess(response.data.token));
        dispatch(setUser(response.data.result));
        dispatch(setUserSetting(response.data.userSetting));
        setCookie("loggedin", true, { path: "/" });
        setCookie("userToken", response.data.token, { path: "/" });
        setTimeout(() => {
          setFormValue(initialFormValue);
          setLoader(false);
          toastAlert("success", response.data.message, "login");
          router.push("/spot/QBT_BNB");
        }, 500);
      } else if (response.data.status == "TWO_FA") {
        setShowTowFA(true);
        setLoader(false);
        toastAlert("success", response.data.message, "login");
      } else if (response.data.status == "OTP_SENT") {
        setisMobile(true);
        setMinutes(9);
        setSeconds(59);
        setOtpTextBox(true);
        setLoader(false);
        setResendOtpBtnStatus(true);
        setotpAuth(response.data.userToken);
        toastAlert("success", response.data.message, "login");
      } else if (response.data.status == "OTP") {
        setisMobile(true);
        setMinutes(9);
        setSeconds(59);
        setLoader(false);
        setResendOtpBtnStatus(true);
        setOtpTextBox(true);
        toastAlert("success", response.data.message, "login");

        return;
      }
    } catch (err: any) {
      setLoader(false);
      if (err?.response?.data?.errors) {
        setError(err.response.data.errors);
      }
      if (err?.response?.data?.message)
        toastAlert("error", err.response.data.message, "login");
    }
  };

  const handleOtpSubmit = async (e: any) => {
    try {
      e.preventDefault();
      let reqData = {
        otpAuth,
        otp,
        isMobile,
        loginHistory,
        optType: "login",
      };
      setLoader(true);
      let response = await verifyOtp(reqData);
      if (response.data.status == "SUCCESS") {
        dispatch(onSignInSuccess(response.data.token));
        dispatch(setUser(response.data.result));
        dispatch(setUserSetting(response.data.userSetting));
        setCookie("loggedin", true, { path: "/" });
        setCookie("userToken", response.data.token, { path: "/" });
        setTimeout(() => {
          setFormValue(initialFormValue);
          setLoader(false);
          toastAlert("success", response.data.message, "login");
          router.push("/spot/BNB_USDT"); // ib
        }, 500);
      }
    } catch (err: any) {
      setLoader(false);
      if (err?.response?.data?.errors) {
        setError(err.response.data.errors);
        return;
      }
      toastAlert("error", err?.response?.data?.message, "otpVerify");
    }
  };

  const handleResendOtp = async (e: any) => {
    e.preventDefault();
    setLoader(true);
    let reqData = {
      email,
      newPhoneCode: LoginData.newPhoneCode,
      newPhoneNo: LoginData.newPhoneNo,
      password,
      isTerms,
      twoFACode,
      roleType,
      otp,
      otpTextBox,
      loginHistory,
      // langCode: getLang(),
    };
    try {
      let response = await resendOtp(reqData);
      setLoader(false);

      if (response.data.status == "RESEND_OTP") {
        setMinutes(9);
        setSeconds(59);
        setOtpTextBox(true);
        setTimer(false);
        toastAlert("success", response.data.message, "login");
        // setValidateError(error);
        // grecaptchaObject.reset()
        return;
      } else if (response.data.status == "OTP_SENT") {
        setTimer(false);
        setisMobile(true);
        setMinutes(9);
        setSeconds(59);
        setOtpTextBox(true);
        setLoader(false);
        setResendOtpBtnStatus(true);
        setotpAuth(response.data.userToken);
        toastAlert("success", response.data.message, "login");
      }
    } catch (err: any) {
      setLoader(false);
      if (err?.response?.data?.error) {
        setError(err.response.data.error);
        return;
      }
      toastAlert("error", err?.response?.data?.message, "login");
    }
  };

  const getGeoInfo = async () => {
    try {
      let respData = await axios({
        method: "get",
        url: `https://ipapi.co/json/`,
      });
      const browserResult = browser();
      setLoginHistory({
        countryName: respData.data.country_name,
        countryCode: respData.data.country_calling_code,
        ipaddress: respData.data.ip,
        region: respData.data.region,
        broswername: browserResult.name,
        ismobile: browserResult.mobile,
        os: browserResult.os,
      });
    } catch (err) { }
  };
  // const handleCheck = () => {
  //   setCheckBox(checkbox ? false : true);
  //   setError(removeByObj(error, "checkbox"));
  //   setLoader(false);
  // };

  useEffect(() => {
    getGeoInfo();
  }, []);

  // useEffect(() => {
  //   handleReCaptcha();
  // }, [handleReCaptcha]);

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
      if (seconds == 1 && minutes == 0 && resendOtpBtnStatus) {
        setTimer(true);
      }
    };
  });

  return (
    <div className={styles.login_tabs}>
      {!isMobile && (
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
              onChange={handleMobileNo}
              type='number'
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
          {showTwoFA && (
            <div className="mb-4">
              <Form.Label>2FA Code</Form.Label>
              <Form.Control
                placeholder="Enter 2FA code"
                aria-label="twoFACode"
                aria-describedby="basic-addon2"
                name="twoFACode"
                onChange={handleChange}
                onKeyPress={(e: any) => {
                  if (e.key == "Enter") handleFormSubmit(e);
                }}
              />
              <p className="text-danger">{error?.twoFACode}</p>
            </div>
          )}
        </>
      )}
      {isMobile && (
        <>
          <div className="mb-4">
            <Form.Label>OTP</Form.Label>
            <Form.Control
              placeholder="Enter OTP"
              aria-label="twoFACode"
              aria-describedby="basic-addon2"
              name="otp"
              onChange={handleChange}
              onKeyPress={(e: any) => {
                if (e.key == "Enter") handleFormSubmit(e);
              }}
            />
            <p className="text-danger">{error?.otp}</p>
          </div>
        </>
      )}
      {(minutes != 0 || seconds != 0) && (
        <p>
          {" "}
          OTP valid up to :{" "}
          {`${minutes}:${seconds <= 9 ? `0${seconds}` : seconds}`}{" "}
        </p>
      )}
      {/* {!showTwoFA && !otpTextBox && (
        <Form.Group
          className={`mb-3 ${styles.check_box}`}
          controlId="exampleForm.ControlInput1"
        >
          <Form.Check
            type="checkbox"
            label="I accept and agree to the terms & conditions."
            className={styles.check}
            name="radioGroup"
            id={`default-checkbox1`}
            onClick={handleCheck}
          />
          <p className="text-danger">{error?.checkbox}</p>
        </Form.Group>
      )} */}
      {/* <span className={styles.info}>
        Clicking the button means you have read and agreed to{" "}
      </span>
      <Link
        href="/terms"
        className={styles.ylw_link}
        // onClick={() => router.push("/terms")}
      >
        B5 Exchange Service Agreement{" "}
      </Link> */}
      {isMobile ? (
        <>
          {!timer ? (
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
          ) : (
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
      ) : (
        <button
          className={`my-3 ${styles.primary_btn} ${styles.dark}`}
          onClick={handleFormSubmit}
          disabled={loader}
        >
          <span className={styles.button_chev}></span>{" "}
          <label>
            {loader ? <i className="fa fa-spinner fa-spin"></i> : "Log In"}
          </label>
        </button>
      )}

      <div className="mb-4">
        <span className={styles.info}> Don't have an account?
          {" "}<Link href="/register" className={styles.ylw_link}
          >Sign Up</Link>
          </span>
      </div>

      <Link
        href="/forget"
        className={`text-center d-block ${styles.ylw_link}`}
      // onClick={() => router.push("/forget")}
      >
        Forgot Password?
      </Link>
    </div>
  );
}
