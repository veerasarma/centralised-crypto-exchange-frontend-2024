import { useEffect, useState } from "react";
import { InputGroup, Form, Modal } from "react-bootstrap";
import styles from "@/styles/common.module.css";
//import types
import { AntiPhisingFormValues } from "./types";
//import lib
import { removeByObj } from "@/lib/validation";
import { toastAlert } from "@/lib/toastAlert";
import isEmpty from "@/lib/isEmpty";
import { emailFormat } from "@/lib/stringCase";
//improt store
import { useDispatch, useSelector } from "../../store";
import { getUserDetails } from "../../store/auth/userSlice";
//import service
import {
  apiAntiphisingCodeSubmit,
  apiSendOTP,
} from "../../services/User/UserServices";
//import validation
import { anitPhisingValid } from "./validation";

const initialFormValue: AntiPhisingFormValues = {
  code: "",
  otp: "",
};

export default function AntiPhising({
  antiphising_modal,
  setantiphising_modal,
}: any) {
  const dispatch = useDispatch();
  const { emailStatus, email } = useSelector((state: any) => state.auth.user);
  const [formValue, setFormValue] =
    useState<AntiPhisingFormValues>(initialFormValue);
  const [error, setError] = useState<any>({});
  const [loader, setLoader] = useState<boolean>(false);
  const [otpButtonType, setOTPButtonType] = useState<string>("Send");
  const [isPassword, setIsPassword] = useState<boolean>(false);
  const { code, otp } = formValue;
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timer, setTimer] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    setFormValue({ ...formValue, ...{ [name]: value } });
    setError(removeByObj(error, name));
    setLoader(false);
  };

  const handleClose = () => {
    setError({});
    setantiphising_modal(false);
    setFormValue(initialFormValue);
    // setOTPButtonType("Send");
  };

  const onOTPsend = async () => {
    try {
      let req = {
        roleType: 1,
        requestType: "antiphising",
      };
      const result = await apiSendOTP(req);
      if (result.data.success) {
        dispatch(getUserDetails());
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      let data = {
        code,
        otp,
        type: 2,
      };
      let validation = await anitPhisingValid(data);
      if (!isEmpty(validation)) return setError(validation);
      setLoader(true);
      let result = await apiAntiphisingCodeSubmit(data);
      setLoader(false);
      if (result.data.success == true) {
        dispatch(getUserDetails());
        setMinutes(0)
        setSeconds(0)
        toastAlert("success", result.data.message, "asspass","TOP_RIGHT");
        handleClose();
        setOTPButtonType("Send");
      }
    } catch (err: any) {
      setLoader(false);
      if (err.response.data.errors) {
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
      <Modal
        show={antiphising_modal}
        onHide={handleClose}
        centered
        backdrop="static"
        className={styles.custom_modal}
      >
        <Modal.Header closeButton className={styles.modal_head}>
          <Modal.Title> Set anti-phishing code </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {emailStatus == "verified" ? (
            <>
              <div className={styles.info_box}>
                After successfully setting the anti-phishing code, every B5
                Exchange email you receive will be accompanied by the anti-phishing
                code logo.
              </div>
              <Form>
                <Form.Label className="d-flex">
                  <span className={`${styles.required} me-1`}>*</span>
                  <span>
                    Anti-phishing codes (do not set common passwords to
                    anti-phishing codes)
                  </span>
                </Form.Label>
                <Form.Label className="d-flex">
                  <span className={`${styles.required} me-1`}>*</span>
                  <span>
                    4-20 characters, support numbers and upper and lower case
                    letters
                  </span>
                </Form.Label>
                <div className={`mb-3 mt-3 ${styles.input_box}`}>
                  <Form.Label>
                    Anti-phishing code{" "}
                    <span className={styles.required}>*</span>
                  </Form.Label>
                  <InputGroup className={`${styles.input_grp}`}>
                    <Form.Control
                      type={!isPassword ? "password" : "text"}
                      placeholder="Anti-phishing code"
                      name="code"
                      onChange={handleChange}
                    />
                    <InputGroup.Text
                      id="basic-addon2"
                      className="border-start-0"
                    >
                      {" "}
                      <i
                        className={`${styles.eye} ${isPassword
                          ? "fa-solid fa-eye"
                          : "fa-solid fa-eye-slash"
                          }`}
                        onClick={() => setIsPassword(isPassword ? false : true)}
                      ></i>{" "}
                    </InputGroup.Text>
                  </InputGroup>
                  <p className="text-danger">{error?.code}</p>
                </div>
                <div className={`mb-3 ${styles.input_box}`}>
                  <Form.Label className="d-flex">
                    Your secure email address is {emailFormat(email)}
                    <span className={styles.required}>*</span>
                  </Form.Label>
                  <InputGroup className={`${styles.input_grp}`}>
                    <Form.Control
                      placeholder="Please enter email code "
                      aria-label="Recipient's username"
                      aria-describedby="basic-addon2"
                      name="otp"
                      type='number'
                      onChange={handleChange}
                    />
                    {
                      minutes == 0 && seconds == 0 &&
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
              <div className={`mt-5 ${styles.modal_footer}`}>
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
            <div className={`mt-5 ${styles.modal_footer}`}>
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
