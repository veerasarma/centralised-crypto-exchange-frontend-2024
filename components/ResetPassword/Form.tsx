import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/styles/common.module.css";
import { InputGroup, Form } from "react-bootstrap";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useRouter } from "next/router";
//import lib
import { removeByObj } from "@/lib/validation";
import { toastAlert } from "@/lib/toastAlert";
import isEmpty from "@/lib/isEmpty";
//improt service
import { apiResetPassword } from "../../services/User/AuthService";

type FomrValue = {
  password: string;
  confirmPassword: string;
};
let initialFormValue: FomrValue = {
  password: "",
  confirmPassword: "",
};
export default function ResetPasswordForm({ authToken }: any) {
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [formValue, setFormValue] = useState<FomrValue>(initialFormValue);
  const [error, setError] = useState<any>({});
  const [loader, setLoader] = useState<boolean>(false);
  const { password, confirmPassword } = formValue;
  const [isPassword, setIsPassword] = useState<boolean>(false);
  const [isConfirmPassword, setIsConfirmPassword] = useState<boolean>(false);


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
        password,
        confirmPassword,
        reCaptcha: captcha,
        authToken,
      };

      let response = await apiResetPassword(reqData);
      if (response.data.success == true) {
        setLoader(false);
        setFormValue(initialFormValue);
        setError({});
        toastAlert("success", response.data.message, "forgotPassword");
        router.push("/login");
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
          <Form.Label>Password</Form.Label>
          <InputGroup className={`${styles.input_grp}`}>
            <Form.Control
              placeholder="Password"
              aria-label="mobile"
              aria-describedby="basic-addon1"
              name="password"
              type={!isPassword ? "password" : "text"}
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
          <p className="text-danger">{error?.password}</p>
        </div>
        <div className="mb-4">
          <Form.Label>Confirm Password</Form.Label>
          <InputGroup className={`${styles.input_grp}`}>
            <Form.Control
              placeholder="Confirm password"
              aria-label="mobile"
              aria-describedby="basic-addon1"
              name="confirmPassword"
              onChange={handleChange}
              type={!isConfirmPassword ? "password" : "text"}

            />
             <InputGroup.Text id="basic-addon2" className="border-start-0">
              {" "}
              <i
                className={`${styles.eye} ${isConfirmPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"
                  }`}
                onClick={() => setIsConfirmPassword(isConfirmPassword ? false : true)}
              ></i>{" "}
            </InputGroup.Text>
          </InputGroup>
          <p className="text-danger">{error?.confirmPassword}</p>
        </div>
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
      </div>
    </>
  );
}
