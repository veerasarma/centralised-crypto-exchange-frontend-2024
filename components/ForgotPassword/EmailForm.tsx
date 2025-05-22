import { useState } from "react";
import Link from "next/link";
import styles from "@/styles/common.module.css";
import { InputGroup, Form } from "react-bootstrap";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
//import lib
import { removeByObj } from "@/lib/validation";
import { toastAlert } from "@/lib/toastAlert";
import isEmpty from "@/lib/isEmpty";
//improt service
import { apiForgotPassword } from "../../services/User/AuthService";

type FomrValue = {
  email: string;
};
let initialFormValue: FomrValue = {
  email: "",
};
export default function EmailForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formValue, setFormValue] = useState<FomrValue>(initialFormValue);
  const [error, setError] = useState<any>({});
  const [loader, setLoader] = useState<boolean>(false);
  const { email } = formValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    setFormValue({ ...formValue, ...{ [name]: value } });
    setError(removeByObj(error, name));
    setLoader(false);
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
      let reqData = {
        email,
        roleType: 1,
        reCaptcha: captcha,
      };

      let response = await apiForgotPassword(reqData);
      if (response.data.success == true) {
        setLoader(false);
        setFormValue(initialFormValue);
        setError({});
        toastAlert("success", response.data.message, "forgotPassword");
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
  return (
    <>
      <div className={styles.login_tabs}>
        <div className="mb-4">
          <Form.Label>Email Address</Form.Label>
          <InputGroup>
            <Form.Control
              placeholder="Enter Email Address"
              aria-label="mobile"
              aria-describedby="basic-addon1"
              name="email"
              onChange={handleChange}
              value={email}
            />
          </InputGroup>
          <p className="text-danger">{error?.email}</p>
        </div>
        <button
          className={`my-3 ${styles.primary_btn} ${styles.dark}`}
          onClick={handleSubmit}
          disabled={loader}
        >
          <span className={styles.button_chev}></span>{" "}
          <label>
            {loader ? <i className="fa fa-spinner fa-spin"></i> : "Confirm"}{" "}
          </label>
        </button>
      </div>
    </>
  );
}
