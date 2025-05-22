import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/styles/common.module.css";
import { InputGroup, Form } from "react-bootstrap";
import {
  getCountries,
  getCountryCallingCode,
} from "react-phone-number-input/input";
import en from "react-phone-number-input/locale/en.json";
import { isValidPhoneNumber } from "react-phone-number-input";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useRouter } from "next/router";
//improt lib
import isEmpty from "@/lib/isEmpty";
import { toastAlert } from "@/lib/toastAlert";
import { removeByObj } from "@/lib/validation";
//import service
import {
  resendOtp,
  verifyOtp,
  apiForgotPassword,
} from "../../services/User/AuthService";
type FormValueType = {
  newPhoneNo: string;
  otp: string;
};
let initialFormValue: FormValueType = {
  newPhoneNo: "",
  otp: "",
};
export default function MobileForm() {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [country, setCountry] = useState<string>("AC");
  const [error, setError] = useState<any>({});
  const [formValue, setFormValue] = useState<FormValueType>(initialFormValue);
  const [isValidMobile, setIsValidMobile] = useState(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timer, setTimer] = useState(false);
  const [loader, setLoader] = useState(false);
  const [reCaptcha, setReCaptcha] = useState("");
  const [LoginData, setLoginData] = useState<any>({});
  const [isMobile, setisMobile] = useState(false);
  const [otpAuth, setotpAuth] = useState<string>("");
  const { newPhoneNo, otp } = formValue;

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

  const handleResendOtp = async (e: any) => {
    e.preventDefault();
    setLoader(true);
    let reqData = {
      newPhoneCode: LoginData.newPhoneCode,
      newPhoneNo: LoginData.newPhoneNo,
      reCaptcha,
      roleType: 1,
    };
    try {
      let response = await resendOtp(reqData);
      setLoader(false);

      if (response.data.status == "RESEND_OTP") {
        setLoader(false);
        setMinutes(9);
        setSeconds(59);
        setTimer(false);
        toastAlert("success", response.data.message, "login");
        return;
      } else if (response.data.status == "OTP_SENT") {
        setTimer(false);
        setisMobile(true);
        setMinutes(9);
        setSeconds(59);
        setLoader(false);
        toastAlert("success", response.data.message, "login");
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    setFormValue({ ...formValue, ...{ [name]: value } });
    setError(removeByObj(error, name));
    setLoader(false);
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoader(true);
      const captcha = await handleReCaptcha();
      if (isEmpty(captcha)) {
        setLoader(false);
        toastAlert("error", "Invalid recaptcha", "login", "TOP_CENTER");
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
      let reqData = {
        newPhoneNo,
        roleType: 2,
        reCaptcha: captcha,
        newPhoneCode: getCountryCallingCode(country),
      };

      let response = await apiForgotPassword(reqData);
      if (response.data.success == true) {
        setLoader(false);
        setFormValue(initialFormValue);
        setError({});
        toastAlert("success", response.data.message, "forgotPassword");
        if (response.data.isMobile) {
          setReCaptcha("");
          setotpAuth(response.data.userToken);
          setisMobile(response.data.isMobile);
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
      if (err?.response?.data?.message) {
        toastAlert("error", err.response.data.message, "forgotPassword");
      }
    }
  };

  const handleOtpSubmit = async (e: any) => {
    try {
      e.preventDefault();

      let reqData = {
        otpAuth,
        otp,
        type: 1,
        optType: "forget",
      };
      setLoader(true);
      let response = await verifyOtp(reqData);
      setLoader(false);
      if (response.data.status) {
        setTimeout(() => {
          setFormValue(initialFormValue);
          toastAlert("success", response.data.message, "login");
          router.push(
            `/verification/forgotPassword?auth=${response.data.userToken}`
          ); // ib
        }, 500);
      }
    } catch (err: any) {
      setLoader(false);
      if (err?.response?.data?.message) {
        toastAlert("error", err.response.data.message, "otpVerify");
      }
      if (err?.response?.data?.errors) {
        setError(err.response.data.errors);
      }
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
      <div className={styles.login_tabs}>
        {!isMobile && (
          <>
            <div className="mb-4">
              <Form.Label>Select Country</Form.Label>
              <InputGroup>
                <CountrySelect
                  labels={en}
                  value={country}
                  onChange={handleCountry}
                  name="countrySelect"
                  className="form-select"
                />
              </InputGroup>
            </div>
            <div className="mb-4">
              <Form.Label>Mobile Number</Form.Label>
              <InputGroup>
                <Form.Control
                  placeholder="Enter Mobile Number"
                  aria-label="mobile"
                  aria-describedby="basic-addon1"
                  onChange={handleMobileNo}
                />
              </InputGroup>
              <p className="text-danger">{error?.newPhoneNo}</p>
            </div>            
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
                  if (e.key == "Enter") handleOtpSubmit(e);
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
        {isMobile ? (
          <>
            {!timer ? (
              <button
                className={`my-3 ${styles.primary_btn} ${styles.dark}`}
                onClick={handleOtpSubmit}
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
            onClick={handleSubmit}
            disabled={loader}
          >
            <span className={styles.button_chev}></span>{" "}
            <label>
              {loader ? <i className="fa fa-spinner fa-spin"></i> : "Confirm"}
            </label>
          </button>
        )}
      </div>
    </>
  );
}
