import { useEffect, useState } from "react";
import { InputGroup, Form, Modal } from "react-bootstrap";
import styles from "@/styles/common.module.css";
import { useRouter } from "next/router";
//import types
import { ChangePassFormValue } from "./types";
//import lib
import { removeByObj } from "@/lib/validation";
import { toastAlert } from "@/lib/toastAlert";
import isEmpty from "@/lib/isEmpty";
import { emailFormat } from "@/lib/stringCase";
//improt store
import { useDispatch, useSelector } from "../../store";
import { setUserSetting } from "../../store/UserSetting/dataSlice";
import { onSignOutSuccess } from "../../store/auth/sessionSlice";
import { setUser, initialState } from "../../store/auth/userSlice";
//import service
import {
  apiTwoFAOTPRequest,
  apiPasswordChange,
  apiSendOTP,
} from "../../services/User/UserServices";

let initialFormValue: ChangePassFormValue = {
  oldPassword: "",
  password: "",
  confirmPassword: "",
  otp: "",
};
export default function ChangePassword({
  password_modal,
  setpassword_modal,
}: any) {
  const dispatch = useDispatch();
  const history = useRouter();
  const { email, emailStatus, phoneStatus } = useSelector(
    (state: any) => state.auth.user
  );
  const [formValue, setFormValue] =
    useState<ChangePassFormValue>(initialFormValue);
  const [error, setError] = useState<any>({});
  const [loader, setLoader] = useState<boolean>(false);
  const [otpButtonType, setOTPButtonType] = useState<string>("Send");
  const [check, setCheck] = useState<boolean>(false);
  const [isPassword, setIsPassword] = useState<boolean>(false);
  const [isPassword1, setIsPassword1] = useState<boolean>(false);
  const [isPassword2, setIsPassword2] = useState<boolean>(false);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timer, setTimer] = useState(false);

  let { oldPassword, password, confirmPassword, otp } = formValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    setFormValue({ ...formValue, ...{ [name]: value } });
    setError(removeByObj(error, name));
    setLoader(false);
  };

  const handleSendCode = async () => {
    try {
      let data = {
        roleType: 1,
        requestType: "ChangePass",
      };
      const result = await apiTwoFAOTPRequest(data);
      if (result.data.status) {
        setOTPButtonType("Resend");
        setMinutes(2);
        setSeconds(59);
        toastAlert("success", result.data.message, "pass","TOP_RIGHT");
      } else {
        toastAlert("success", result.data.message, "pass","TOP_RIGHT");
      }
    } catch (err: any) {
      toastAlert("error", err.response.data.message, "pass","TOP_RIGHT");
    }
  };

  const onOTPsend = async () => {
    try {
      let req = {
        roleType: 2,
        requestType: "ChangePass",
      };
      const result = await apiSendOTP(req);
      if (result.data.success) {
        setOTPButtonType("Resend");
        setTimer(false);
        setMinutes(2);
        setSeconds(59);
        toastAlert("success", result.data.message, "login","TOP_RIGHT");
      }
    } catch (err: any) {
      toastAlert("error", err.response.data.message, "login","TOP_RIGHT");
    }
  };

  const handleLogout = () => {
    document.cookie =
      "loggedin" + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    dispatch(setUser(initialState));
    dispatch(onSignOutSuccess());
    dispatch(setUserSetting({}));
    toastAlert("success", "Logout successfully", "login");
    history.push("/login");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      let reqData = {
        oldPassword,
        password,
        confirmPassword,
        otp,
        type: emailStatus == "verified" ? 2 : 1,
      };
      console.log(check, "-check")
      if (
        !check &&
        !isEmpty(reqData.oldPassword) &&
        !isEmpty(reqData.password) &&
        !isEmpty(reqData.confirmPassword)
      ) {
        return toastAlert("error", "Please enable check box", "pass","TOP_RIGHT");
      }
      const result = await apiPasswordChange(reqData);

      if (result.data.success) {
        setMinutes(0)
        setSeconds(0)
        toastAlert("success", result.data.message, "pass","TOP_RIGHT");
        setTimeout(() => {
          handleLogout();
        }, 1000);
      }
    } catch (err: any) {
      if (!isEmpty(err?.response?.data?.errors)) {
        setError(err.response.data.errors);
      }
      if (!isEmpty(err?.response?.data?.message))
        toastAlert("error", err.response.data.message, "pass","TOP_RIGHT");
    }
  };

  const handleClose = () => {
    setpassword_modal(false);
    setError({});
    setFormValue(initialFormValue);
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
        show={password_modal}
        onHide={handleClose}
        centered
        backdrop="static"
        className={styles.custom_modal}
      >
        <Modal.Header closeButton className={styles.modal_head}>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className={`mb-3 ${styles.input_box}`}>
              <Form.Label>
                Old password <span className={styles.required}>*</span>
              </Form.Label>
              <InputGroup className={`${styles.input_grp}`}>
                <Form.Control
                  type={!isPassword ? "password" : "text"}
                  placeholder="Please enter the old password"
                  name="oldPassword"
                  onChange={handleChange}
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
              <p className="text-danger">{error?.oldPassword}</p>
            </div>
            <div className={`mb-3 ${styles.input_box}`}>
              <Form.Label>
                New password <span className={styles.required}>*</span>
              </Form.Label>
              <InputGroup className={`${styles.input_grp}`}>
                <Form.Control
                  type={!isPassword1 ? "password" : "text"}
                  placeholder="Please enter a new password"
                  name="password"
                  onChange={handleChange}
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
              <p className="text-danger">{error?.password}</p>
            </div>
            <div className={`mb-3 ${styles.input_box}`}>
              <Form.Label>
                Confirm New password <span className={styles.required}>*</span>
              </Form.Label>
              <InputGroup className={`${styles.input_grp}`}>
                <Form.Control
                  type={!isPassword2 ? "password" : "text"}
                  placeholder="Please enter a new password again"
                  name="confirmPassword"
                  onChange={handleChange}
                />
                <InputGroup.Text id="basic-addon2" className="border-start-0">
                  {" "}
                  <i
                    className={`${styles.eye} ${isPassword2 ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"
                      }`}
                    onClick={() => setIsPassword2(isPassword2 ? false : true)}
                  ></i>{" "}
                </InputGroup.Text>
              </InputGroup>
              <p className="text-danger">{error?.confirmPassword}</p>
            </div>
            {emailStatus == "verified" ? (
              <div className={`mb-3 ${styles.input_box}`}>
                <Form.Label className="d-flex">
                  Your secure email address is {emailFormat(email)}
                  <span className={styles.required}>*</span>
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
                      <span className={styles.all} onClick={handleSendCode}>
                        {" "}
                        {otpButtonType}
                      </span>{" "}
                    </InputGroup.Text>
                  }
                </InputGroup>
                <p className="text-danger">{error?.otp}</p>
              </div>
            ) : (
              phoneStatus == "verified" && (
                <div className={`mb-3 ${styles.input_box}`}>
                  <Form.Label className="d-flex">
                    OTP will send your mobile number
                    <span className={styles.required}>*</span>
                  </Form.Label>
                  <InputGroup className={`${styles.input_grp}`}>
                    <Form.Control
                      placeholder="Enter OTP "
                      aria-label="Recipient's username"
                      aria-describedby="basic-addon2"
                      name="otp"
                      onChange={handleChange}
                    />
                    <InputGroup.Text id="basic-addon2">
                      {" "}
                      <span className={styles.all} onClick={onOTPsend}>
                        {" "}
                        {otpButtonType}
                      </span>{" "}
                    </InputGroup.Text>
                  </InputGroup>
                  <p className="text-danger">{error?.otp}</p>
                </div>
              )
            )}
            {(minutes != 0 || seconds != 0) && (
              <p>
                {" "}
                Verification code valid up to :{" "}
                {`${minutes}:${seconds <= 9 ? `0${seconds}` : seconds}`}{" "}
              </p>
            )}
            <Form.Group
              className={`mb-3 ${styles.check_box}`}
              controlId="exampleForm.ControlInput1"
            >
              <Form.Check
                onClick={() => setCheck(check ? false : true)}
                type="checkbox"
                id={`default-checkbox`}
                label={`I have been informed that if I log in to this account on a new device after changing the login password, I will be temporarily unable to withdraw coins within 24 hours`}
              />
            </Form.Group>
          </Form>
          <div className={`mt-4 ${styles.modal_footer}`}>
            <button className={`${styles.primary_btn}`} onClick={handleClose}>
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
                {loader ? <i className="fa fa-spinner fa-spin"></i> : "Confirm"}
              </label>
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
