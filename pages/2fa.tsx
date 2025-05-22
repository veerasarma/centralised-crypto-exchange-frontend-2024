import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "@/styles/common.module.css";
import { Container, Row, Col, InputGroup, Form, Modal } from "react-bootstrap";
import Mainnavbar from "../components/navbar";
import Footer from "../components/footer";
import { useRouter } from "next/router";
//import lib
import { toastAlert } from "@/lib/toastAlert";
import { removeByObj } from "@/lib/validation";
//import service
import {
  apiget2Fa,
  apiUpdate2FA,
  apidisable2FA,
  apiTwoFAOTPRequest,
  apiTwoFAOTPVerify,
} from "../services/User/UserServices";
//import store
import { getUserDetails } from "../store/auth/userSlice";
import { useSelector, useDispatch } from "../store";
import isEmpty from "@/lib/isEmpty";

type InitialValue = {
  code: string;
  otp: string;
};
let initialFormValue: InitialValue = {
  code: "",
  otp: "",
};
export default function TwoFa() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { twoFAStatus, emailStatus } = useSelector(
    (state: any) => state.auth.user
  );
  const [secretData, setSecretData] = useState<any>({});
  const [formValue, setFormValue] = useState<InitialValue>(initialFormValue);
  const [otpButtonType, setOTPButtonType] = useState<string>("Send");
  const [error, setError] = useState<any>({});
  const [isClient, setIsClient] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);

  let { code, otp } = formValue;

  const fetchTwoFA = async () => {
    try {
      const result = await apiget2Fa();
      if (result.data.success) {
        setSecretData(result.data.result);
      }
    } catch (err) {}
  };
  const handleclose = async () => {
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
      setLoader(true);
      const result = await apiTwoFAOTPVerify(data);
      setLoader(false);
      if (result.data.status) {
        toastAlert("success", result.data.message, "login");
        setShow(false);
      }
    } catch (err: any) {
      setLoader(false);
      if (!isEmpty(err?.response?.data?.message))
        toastAlert("error", err.response.data.message, "login");
    }
  };

  const copyToClipboard = (text: string) => {
    const tempInput = document.createElement("input");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    toastAlert("success", "Copied", "copy");
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
    setFormValue({ ...formValue, ...{ [name]: value } });
    setError(removeByObj(error, name));
  };

  const enable2fa = async (e: any) => {
    e.preventDefault();
    try {
      let data = {
        secret: secretData.secret,
        uri: secretData.uri,
        code,
        otp,
        type: 2,
      };
      setLoader(true);
      const result = await apiUpdate2FA(data);
      setLoader(false);
      if (result.data.success) {
        dispatch(getUserDetails());
        setFormValue(initialFormValue);
        setOTPButtonType("Send");
        setError({});
        toastAlert("success", result.data.message, "twofa");
        router.push("/security");
      }
    } catch (err: any) {
      setLoader(false);
      if (err?.response?.data?.errors) {
        setError(err.response.data.errors);
      } else if (err?.response?.data?.error) {
        setError(err.response.data.error);
      }
    }
  };

  const disable2fa = async (e: any) => {
    e.preventDefault();
    try {
      let data = {
        secret: secretData.secret,
        uri: secretData.uri,
        code,
        otp,
        type: 2,
      };
      setLoader(true);
      const result = await apidisable2FA(data);
      setLoader(false);
      if (result.data.success) {
        dispatch(getUserDetails());
        setFormValue(initialFormValue);
        setError({});
        setOTPButtonType("Send");
        toastAlert("success", result.data.message, "twofa");
        router.push("/security");
      }
    } catch (err: any) {
      setLoader(false);
      if (err?.response?.data?.errors) {
        setError(err.response.data.errors);
      } else if (err?.response?.data?.error) {
        setError(err.response.data.error);
      }
    }
  };

  useEffect(() => {
    fetchTwoFA();
    setIsClient(true);
  }, []);

  return (
    <>
      <Mainnavbar />

      {isClient && !show && (
        <div className={styles.page_box}>
          <div className={styles.deposit}>
            <div className={`mb-5 ${styles.inner_head_box}`}>
              <Container>
                <Row>
                  <Col lg={6} className="text-center mx-auto">
                    <h5 className={`${styles.inner_head_title}`}>2FA</h5>
                    <p className={`${styles.inner_subtitle}`}>
                      Two-factor authentication (2FA) adds an extra layer of
                      security to your online accounts by requiring two
                      verification methods to log in.
                    </p>
                  </Col>
                </Row>
              </Container>
            </div>
            <Container>
              <Row className="pb-4">
                <Col lg={6} className="mx-auto">
                  <div className={`mb-4  ${styles.box}`}>
                    <div className={styles.step_flx}>
                      <div className={`w-100 ${styles.right_box}`}>
                        <p className={"mb-3"}>
                          Open Google Authenticator, scan the QR code below or
                          manually enter the key to get a 6-digit verification
                          code
                        </p>
                        <span className={`${styles.sm}`}>
                          Please make sure to keep the Google Authentication
                          Secret Key in a safe place to avoid the inability to
                          change the binding after changing or losing your
                          phone.
                        </span>
                        <div className={`mt-4 ${styles.qrcode} text-center w-100`}>
                          <img
                            src={secretData?.imageUrl}
                            alt="image"
                            className="img-fluid"
                            width={200}
                            height={200}
                          />
                        </div>
                        <span className="pt-3 d-block">
                          Secret Key: {secretData?.secret}{" "}
                          <Image
                            src="/assets/images/copy_dark.png"
                            alt="image"
                            className="img-fluid"
                            width={12}
                            height={14}
                            onClick={() => copyToClipboard(secretData?.secret)}
                          />
                        </span>
                      </div>
                    </div>
                    <div className={styles.step_flx}>
                      <div className={`w-100 ${styles.right_box}`}>
                        <p className={"mb-3"}>
                          Please fill in the verification code you obtained
                          below and complete the verification.
                        </p>
                        {/* <div className={`mb-4 ${styles.input_grp}`}>
                          {
                            isClient && emailStatus == 'verified' &&
                            <>
                              <Form.Label>* Email verification code</Form.Label>
                              <InputGroup>
                                <Form.Control
                                  placeholder=" Please enter email code "
                                  aria-label="Recipient's username"
                                  aria-describedby="basic-addon2"
                                  name='otp'
                                  value={otp}
                                  onChange={handleChange}
                                />
                                <InputGroup.Text id="basic-addon2" className='pe-3'>
                                  <p className={styles.all} onClick={handleSendCode}>{otpButtonType}</p>
                                </InputGroup.Text>
                              </InputGroup>
                              <p className='text-danger'>{error?.otp}</p>
                            </>
                          }

                        </div> */}
                        <div className={`mb-4 ${styles.input_grp}`}>
                          <Form.Label>
                            Google Auth Code{" "}
                            <span className={styles.required}>*</span>
                          </Form.Label>
                          <InputGroup>
                            <Form.Control
                              placeholder=" Please enter email google auth code "
                              aria-label="Recipient's username"
                              aria-describedby="basic-addon2"
                              name="code"
                              value={code}
                              onChange={handleChange}
                              type="number"
                            />
                            {/* <InputGroup.Text
                              id="basic-addon2"
                              className="pe-3"
                            ></InputGroup.Text> */}
                          </InputGroup>
                          <p className="text-danger">{error?.code}</p>
                        </div>
                        {isClient && emailStatus == "verified" ? (
                          <div className={`text-center ${styles.modal_footer}`}>
                            {isClient && twoFAStatus == "disabled" ? (
                              <button
                                className={styles.primary_btn}
                                onClick={enable2fa}
                                disabled={loader}
                              >
                                <span></span>
                                <label>
                                  {loader ? (
                                    <i className="fa fa-spinner fa-spin"></i>
                                  ) : (
                                    "Enable"
                                  )}
                                </label>
                              </button>
                            ) : (
                              <button
                                className={styles.primary_btn}
                                onClick={disable2fa}
                                disabled={loader}
                              >
                                <span></span>
                                <label>
                                  {loader ? (
                                    <i className="fa fa-spinner fa-spin"></i>
                                  ) : (
                                    "Disable"
                                  )}
                                </label>
                              </button>
                            )}
                          </div>
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
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      )}

      {isClient && show && (
        <Modal
          show={show}
          centered
          onHide={() => {
            router.push("/security");
          }}
          className={styles.custom_modal}
        >
          <Modal.Header closeButton className={styles.modal_head}>
            <Modal.Title>Verification Code</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className={`mb-4 ${styles.input_grp}`}>
              {isClient && emailStatus == "verified" && (
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
                    <InputGroup.Text id="basic-addon2" className="pe-3">
                      <span className={styles.all} onClick={handleSendCode}>
                        {otpButtonType}
                      </span>
                    </InputGroup.Text>
                  </InputGroup>
                  <p className="text-danger">{error?.otp}</p>
                </>
              )}
            </div>
            <div className={`mt-4 ${styles.modal_footer}`}>
              {isClient && emailStatus == "verified" ? (
                <>
                  <button
                    className={styles.primary_btn}
                    onClick={() => handleclose()}
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
      )}

      <Footer />
    </>
  );
}
