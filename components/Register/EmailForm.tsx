import Link from "next/link";
import styles from "@/styles/common.module.css";
import { InputGroup, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useRouter } from "next/router";
//import types
import { MyFormValues } from "./types";
//import lib
import { toastAlert } from "../../lib/toastAlert";
import isEmpty from "../../lib/isEmpty";
import { removeByObj } from "../../lib/validation";
import validation from "./validation";
//improt service
import { apiSignUp, apiMailResend } from "../../services/User/AuthService";

let initialValue: MyFormValues = {
  email: "",
  password: "",
  roleType: 1,
  confirmPassword: "",
  refferalCode: ""
};

export default function EmailForm({ refId }: any) {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string>("");
  const [formValue, setFormvalue] = useState(initialValue);
  const [checkbox, setCheckBox] = useState(false);
  const [loader, setLoader] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [error, setError] = useState<any>({});
  const [isPassword, setIsPassword] = useState<boolean>(false);
  const [isPassword1, setIsPassword1] = useState<boolean>(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [refStatus, setRefStatus] = useState(false);
  const [timer, setTimer] = useState(false);
  const [resendStatus, setResendStatus] = useState(false);
  let { email, password, refferalCode, roleType, confirmPassword } = formValue;

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
      setFormvalue({ ...formValue, ...{ 'refferalCode': refId } });
      setRefStatus(true)
    }
  }, [refId])
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    setFormvalue({ ...formValue, ...{ [name]: value } });
    setError(removeByObj(error, name));
    setLoader(false);
  };
  const handleCheck = () => {
    setCheckBox(checkbox ? false : true);
    setError(removeByObj(error, "checkbox"));
    setLoader(false);
  };
  const resendLink = async () => {
    try {
      let data = {
        email: userEmail,
      };
      let result = await apiMailResend(data);
      if (result.data.success) {
        toastAlert("success", result.data.message, "register");
        setMinutes(2);
        setSeconds(59);
        setTimer(false);
      } else {
        toastAlert("error", result.data.message, "register");
      }
    } catch (err: any) {
      if (err?.response?.data?.message) {
        toastAlert("error", err.response.data.message, "register");
      }
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
        email,
        roleType,
        password,
        reCaptcha: captcha,
        refferalCode,
        confirmPassword,
        checkbox,
      };
      let checkErrors = validation(data);
      if (!isEmpty(checkErrors)) {
        setLoader(false);
        return setError(checkErrors);
      }
      const result = await apiSignUp(data);
      setLoader(false);
      if (result.data.status) {
        setUserEmail(email);
        toastAlert("success", result.data.message, "register");
        setFormvalue(initialValue);
        setMinutes(2);
        setSeconds(59);
        setResendStatus(true);
        // router.push("/login");
      } else {
        toastAlert("error", result.data.message, "register");
      }
    } catch (err: any) {
      setLoader(false);
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
    <div className={styles.login_tabs}>
      <div className="mb-4">
        <Form.Label>Enter Email Address</Form.Label>
        <Form.Control
          placeholder="Enter your email"
          autoComplete="off"
          aria-label="mobile"
          aria-describedby="basic-addon1"
          name="email"
          onChange={handleChange}
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
          // autoComplete="off"
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
      {!timer && !resendStatus ? (
        <button
          onClick={handleFormSubmit}
          className={`my-3 ${styles.primary_btn} ${styles.dark}`}
          disabled={loader}
        >
          <span className={styles.button_chev}></span>{" "}
          <label>
            {loader ? <i className="fa fa-spinner fa-spin"></i> : "Register"}
          </label>
        </button>
      ) : (
        <button
          onClick={resendLink}
          className={`my-3 ${styles.primary_btn} ${styles.dark}`}
          disabled={!timer ? true : false}
        >
          <span className={styles.button_chev}></span>{" "}
          <label>
            {loader ? (
              <i className="fa fa-spinner fa-spin"></i>
            ) : !timer ? (
              <>
                <i className="	far fa-clock"></i> &nbsp;{" "}
                {`${minutes}:${seconds <= 9 ? `0${seconds}` : seconds}`}
              </>
            ) : (
              "Resend Link"
            )}
          </label>
        </button>
      )}

      <div className="mb-4">
        <span className={styles.info}>  Already have an account?
          {" "}<Link href="/login" className={styles.ylw_link}
          >Sign In</Link>
        </span>
      </div>

    </div>
  );
}
