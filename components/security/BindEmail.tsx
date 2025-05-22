import { useEffect, useState } from "react";
import { InputGroup, Form, Modal } from "react-bootstrap";
import styles from "@/styles/common.module.css";
//import types
import { EmailFormValues } from "./types";
//import lib
import { removeByObj } from "@/lib/validation";
import { toastAlert } from "@/lib/toastAlert";
import isEmpty from "@/lib/isEmpty";
import { emailFormat } from "@/lib/stringCase";
//improt store
import { useDispatch, useSelector } from "../../store";
import { getUserDetails } from "../../store/auth/userSlice";
//import service
import { apiEmailUpdate, apiSendOTP } from "../../services/User/UserServices";
//import validation
import { bindEmaiilValid } from "./validation";

const initialFormValue: EmailFormValues = {
  email: "",
  otp: "",
};

export default function BindEmail({ email_modal, setemail_modal }: any) {
  const dispatch = useDispatch();
  const { phoneStatus } = useSelector((state: any) => state.auth.user);
  const [formValue, setFormValue] = useState<EmailFormValues>(initialFormValue);
  const [error, setError] = useState<any>({});
  const [loader, setLoader] = useState<boolean>(false);
  const [otpButtonType, setOTPButtonType] = useState<string>("Send");
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timer, setTimer] = useState(false);
  const { email, otp } = formValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    if (name == 'otp') {
      if (/[^0-9]/.test(value)) return;
    }
    setFormValue({ ...formValue, ...{ [name]: value } });
    setError(removeByObj(error, name));
    setLoader(false);
  };

  const handleClose = () => {
    setError({});
    setemail_modal(false);
    setFormValue(initialFormValue);
    setOTPButtonType("Send");
  };

  const onOTPsend = async () => {
    try {
      let req = {
        roleType: 2,
        requestType: "emailupdate",
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let reqData = {
      email,
      otp,
    };

    try {
      let validation = bindEmaiilValid(reqData);
      if (!isEmpty(validation)) {
        return setError(validation);
      }
      setLoader(true);
      const result = await apiEmailUpdate(reqData);
      setLoader(false);
      if (result.data.success) {
        setMinutes(0)
        setSeconds(0)
        dispatch(getUserDetails());
        toastAlert("success", result.data.message, "email");
        handleClose();
      }
    } catch (err: any) {
      setLoader(false);
      if (!isEmpty(err?.response?.data?.message))
        toastAlert("error", err.response.data.message, "email");
      if (!isEmpty(err?.response?.data?.errors))
        setError(err.response.data.errors);
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
        show={email_modal}
        onHide={handleClose}
        centered
        backdrop="static"
        className={styles.custom_modal}
      >
        <Modal.Header closeButton className={styles.modal_head}>
          <Modal.Title> Set email ID </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {phoneStatus == "verified" ? (
            <>
              <Form>
                <Form.Label className="d-flex">
                  Email Id <span className={styles.required}>*</span>
                </Form.Label>

                <InputGroup className={`mb-3 ${styles.input_grp}`}>
                  <Form.Control
                    type="text"
                    placeholder="Enter your email"
                    autoFocus
                    name="email"
                    onChange={handleChange}
                    value={email}
                  />
                </InputGroup>
                <p className="text-danger">{error?.email}</p>
                <Form.Label className="d-flex">
                  OTP will send your mobile number<span className={styles.required}>*</span>
                </Form.Label>
                <InputGroup className={`mb-3 ${styles.input_grp}`}>
                  <Form.Control
                    placeholder="Enter OTP "
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    name="otp"
                    type='text'
                    onChange={handleChange}
                    value={otp}
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
            <div className={`${styles.modal_footer}`}>
              <button className={styles.primary_btn} onClick={handleClose}>
                <span></span>
                <label>Verify your mobile</label>
              </button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
