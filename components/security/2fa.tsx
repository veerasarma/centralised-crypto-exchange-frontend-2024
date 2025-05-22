import { useEffect, useState } from "react";
import { InputGroup, Form, Modal } from "react-bootstrap";
import styles from "@/styles/common.module.css";
//import types
import { MobileFormValues } from "./types";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { removeByObj } from "@/lib/validation";
import {
  apiTwoFAOTPRequest,
  apiTwoFAOTPVerify,
} from "@/services/User/UserServices";
import { toastAlert } from "@/lib/toastAlert";
import isEmpty from "@/lib/isEmpty";

type InitialValue = {
  code: string;
  otp: string;
};
let initialFormValue: InitialValue = {
  code: "",
  otp: "",
};
export default function TFA({ TFAModal, setTFAModal }: any) {
  const router = useRouter();
  const { twoFAStatus, emailStatus } = useSelector(
    (state: any) => state.auth.user
  );

  const [formValue, setFormValue] = useState<InitialValue>(initialFormValue);
  const [error, setError] = useState<any>({});
  const [otpButtonType, setOTPButtonType] = useState<string>("Send");
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timer, setTimer] = useState(false);

  let { code, otp } = formValue;

  const handleClose = async () => {
    try {
      if (isEmpty(otp)) {
        return toastAlert("error", "OTP field is required", "login");
      }
      if (otp.length != 6) {
        return toastAlert("error", "Invalid OTP", "login");
      }
      let data = {
        emailOTP: otp,
        type: 2,
      };
      const result = await apiTwoFAOTPVerify(data);
      if (result.data.status) {
        toastAlert("success", result.data.message, "login");
        setError({});
        setTFAModal(false);
        setFormValue(initialFormValue);
        router.push("/2fa");
        setOTPButtonType("Send");
        setMinutes(2);
        setSeconds(59);
      }
    } catch (err: any) {
      if (!isEmpty(err?.response?.data?.message))
        toastAlert("error", err.response.data.message, "login");
    }
  };

  const handleSendCode = async () => {
    try {
      let data = {
        roleType: 1,
        requestType: "2FA",
      };
      const result = await apiTwoFAOTPRequest(data);
      if (result.data.status) {
        setOTPButtonType("Resend");
        setTimer(false);
        setMinutes(2);
        setSeconds(59);
        toastAlert("success", result.data.message, "twofa");
      } else {
        toastAlert("success", result.data.message, "twofa");
      }
    } catch (err: any) {
      toastAlert("error", err.response.data.message, "twofa");
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    if (/[^0-9]/.test(value)) return;

    setFormValue({ ...formValue, ...{ [name]: value } });
    setError(removeByObj(error, name));
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
        show={TFAModal}
        centered
        backdrop="static"
        onHide={() => {
          setTFAModal(false)
          // router.push("/security");
        }}
        className={styles.custom_modal}
      >
        <Modal.Header closeButton className={styles.modal_head}>
          <Modal.Title>Verification Code</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className={`mb-4 ${styles.input_grp}`}>
            {emailStatus == "verified" && (
              <>
                <Form.Label>
                  Email verification code{" "}
                  <span className={styles.required}>*</span>
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    placeholder=" Please enter email code "
                    aria-label="Recipient's username"
                    aria-describedby="basic-addon2"
                    name="otp"
                    value={otp}
                    onChange={handleChange}
                  />
                  {minutes == 0 && seconds == 0 &&
                    <InputGroup.Text id="basic-addon2" className="pe-3">
                      <span className={styles.all} onClick={handleSendCode}>
                        {otpButtonType}
                      </span>
                    </InputGroup.Text>
                  }
                </InputGroup>
                <p className="text-danger">{error?.otp}</p>
              </>
            )}
          </div>
          {(minutes != 0 || seconds != 0) && (
            <p>
              {" "}
              Verification code valid up to :{" "}
              {`${minutes}:${seconds <= 9 ? `0${seconds}` : seconds}`}{" "}
            </p>
          )}
          <div className={`mt-4 ${styles.modal_footer}`}>
            {emailStatus == "verified" ? (
              <>
                <button
                  className={styles.primary_btn}
                  onClick={() => handleClose()}
                >
                  <span></span>
                  <label>Confirm</label>
                </button>
              </>
            ) : (
              <button
                className={styles.primary_btn}
                onClick={() => router.push("/security")}
              >
                <span></span>
                <label>Email verification</label>
              </button>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
