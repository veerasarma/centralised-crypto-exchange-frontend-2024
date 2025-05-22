import Link from "next/link";
import styles from "@/styles/common.module.css";
import { Form, InputGroup } from "react-bootstrap";
import { useState, useEffect, useRef, useCallback } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useDispatch } from "react-redux";
// import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import axios from "axios";
import browser from "browser-detect";
//improt types
import { MyFormValues } from "./types";
//import lib
import isEmpty from "@/lib/isEmpty";
import { toastAlert } from "@/lib/toastAlert";
import { removeByObj } from "@/lib/validation";
import validation from "./validation";
//import store
import { setUser } from "../../store/auth/userSlice";
import { setUserSetting } from "../../store/UserSetting/dataSlice";
import { onSignInSuccess } from "../../store/auth/sessionSlice";
import { getBankDetails } from "@/store/PaymentMethods/bankSlice";
//improt service
import { apiSignIn, resendOtp } from "../../services/User/AuthService";
import { setCookie } from "@/utils/cookie";

const initialFormValue: MyFormValues = {
  email: "",
  roleType: 1,
  password: "",
  twoFACode: "",
  otp: "",
  isTerms: false,
  newPhoneCode: "",
  newPhoneNo: "",
};

export default function EmailForm() {
  const submitButtonRef = useRef(null);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const dispatch = useDispatch();
  const router = useRouter();
  const [formValue, setFormvalue] = useState(initialFormValue);
  const [error, setError] = useState<any>({});
  const [loader, setLoader] = useState(false);
  const [loginHistory, setLoginHistory] = useState({});
  const [isMobile, setisMobile] = useState(false);
  const [showTwoFA, setShowTowFA] = useState(false);
  const [checkbox, setCheckBox] = useState(false);
  //otpbox
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timer, setTimer] = useState(false);
  const [resendOtpBtnStatus, setResendOtpBtnStatus] = useState(false);
  const [otpTextBox, setOtpTextBox] = useState(false);
  // const [cookies, setCookie] = useCookies(["name"]);
  const [isPassword, setIsPassword] = useState<boolean>(false);
  const {
    email,
    password,
    isTerms,
    twoFACode,
    newPhoneCode,
    newPhoneNo,
    otp,
    roleType,
  } = formValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    if (name == 'otp' || name == 'twoFACode') {
      if (/[^0-9]/.test(value)) return;
    }
    setFormvalue({ ...formValue, ...{ [name]: value } });
    setError(removeByObj(error, name));
    setLoader(false);
    if ((name == "twoFACode" || name == "otp") && value?.length == 6) {
      setTimeout(() => {
        autoSubmit();
      }, 500);
    }
  };
  const handleReCaptcha = useCallback(async () => {
    try {
      if (!executeRecaptcha) {
        // toastAlert("error", "Recaptcha required", "recaptcha");
        console.log('Execute recaptcha not yet available');
        return "";
      }
      return await executeRecaptcha("emailLogin");
    } catch (err) {
      console.log(err, "Error on recaptcha");
      toastAlert("error", "Invalid recaptcha!", "recaptcha");
      return "";
    }
  }, [executeRecaptcha]);

  const autoSubmit = () => {
    // Trigger a click on the submit button
    if (submitButtonRef.current) {
      submitButtonRef.current.click();
    }
  };

  const handleFormSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoader(true);
      const captcha = await handleReCaptcha();
      if (isEmpty(captcha)) {
        setLoader(false);
        toastAlert("error", "Invalid recaptcha", "login", "TOP_CENTER");
        return;
      }
      let data = {
        email,
        password,
        isTerms,
        twoFACode,
        roleType,
        loginHistory,
        newPhoneCode,
        newPhoneNo,
        otp,
        otpTextBox,
        reCaptcha: captcha,
        checkbox,
      };
      let checkErrors = validation(data);
      console.log("checkErrors--------",checkErrors);
      
      if (!isEmpty(checkErrors)) {
        setLoader(false);
        setError(checkErrors);
        return;
      }
      let response = await apiSignIn(data);

      if (response.data.status == "SUCCESS") {
        dispatch(onSignInSuccess(response.data.token));
        setError({});
        dispatch(setUser(response.data.result));
        dispatch(setUserSetting(response.data.userSetting));
        setCookie("loggedin", true);
        setCookie("userToken", response.data.token);

        // setCookie("loggedin", true, { path: "/" });
        // setCookie("userToken", response.data.token, { path: "/" });
        setTimeout(() => {
          setFormvalue(initialFormValue);
          setLoader(false);
          toastAlert("success", response.data.message, "login");
          router.push("/wallet");
          // router.push("/spot/BTC_USDT");
        }, 500);
      } else if (response.data.status == "TWO_FA") {
        setError({});
        setShowTowFA(true);
        setOtpTextBox(false);
        setOtpTextBox(false);
        setLoader(false);
        toastAlert("error", response.data.message, "login");
      } else if (response.data.status == "OTP_SENT") {
        setError({});
        setisMobile(isMobile);
        setLoader(false);
        toastAlert("success", response.data.message, "login");
      } else if (response.data.status == "OTP") {
        setError({});
        setMinutes(2);
        setSeconds(59);
        setLoader(false);
        setResendOtpBtnStatus(true);
        setOtpTextBox(true);
        toastAlert("success", response.data.message, "login");
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
  // const handleCheck = () => {
  //   setCheckBox(checkbox ? false : true);
  //   setError(removeByObj(error, "checkbox"));
  //   setLoader(false);
  // };

  const handleResendOtp = async (e: any) => {
    e.preventDefault();
    setLoader(true);
    let reqData = {
      email,
      newPhoneCode,
      newPhoneNo,
      password,
      isTerms,
      twoFACode,
      roleType,
      otp,
      otpTextBox,
      loginHistory,
    };
    try {
      let response = await resendOtp(reqData);
      setLoader(false);

      if (response.data.status == "RESEND_OTP") {
        setMinutes(2);
        setSeconds(59);
        setOtpTextBox(true);
        setTimer(false);
        toastAlert("success", response.data.message, "login");
        // setValidateError(error);
        // grecaptchaObject.reset()
        return;
      }
    } catch (err: any) {
      setLoader(false);
      if (err?.response?.data?.error) {
        setError(err.response.data.error);
        return;
      }
      toastAlert("error", err.response.data.message, "login");
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
      {!showTwoFA && !otpTextBox && (
        <>
          <div className="mb-4">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              placeholder="Enter your email"
              aria-label="mobile"
              aria-describedby="basic-addon1"
              onChange={handleChange}
              name="email"
              type="text"
              onKeyPress={(e: any) => {
                if (e.key == "Enter") handleFormSubmit(e);
              }}
            />
            <p className="text-danger">{error?.email}</p>
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
        </>
      )}

      {showTwoFA && (
        <div className="mb-4">
          <Form.Label>2FA Code</Form.Label>
          <Form.Control
            placeholder="Enter 2FA Code"
            aria-label="twoFACode"
            aria-describedby="basic-addon2"
            onChange={handleChange}
            name="twoFACode"
            value={twoFACode}
            type="text"
            onKeyPress={(e: any) => {
              if (e.key == "Enter") handleFormSubmit(e);
            }}
          />
          <p className="text-danger">{error?.twoFACode}</p>
        </div>
      )}
      {otpTextBox && (
        <div className="mb-4">
          <Form.Label>OTP</Form.Label>
          <Form.Control
            placeholder="Enter OTP code"
            aria-label="otp"
            type="text"
            aria-describedby="basic-addon2"
            onChange={handleChange}
            name="otp"
            value={otp}
            onKeyPress={(e: any) => {
              if (e.key == "Enter") handleFormSubmit(e);
            }}
          />
          <p className="text-danger">{error?.otp}</p>
        </div>
      )}
      {(minutes != 0 || seconds != 0) && otpTextBox && (
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
      {!timer ? (
        <button
          className={`my-3 ${styles.primary_btn} ${styles.dark}`}
          onClick={handleFormSubmit}
          ref={submitButtonRef}
          disabled={loader}
        >
          <span className={styles.button_chev}></span>{" "}
          <label className="mb-0">
            {loader ? <i className="fa fa-spinner fa-spin"></i> : "Log In"}
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
            {loader ? <i className="fa fa-spinner fa-spin"></i> : "Resend OTP"}
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
