import styles from "@/styles/common.module.css";
import Mainnavbar from "../components/navbar";
import Footer from "../components/footer";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Container, Form, Col, Row } from "react-bootstrap";
//import service
import { apiContactUs } from "../services/User/UserServices";
//import lib
import { toastAlert } from "@/lib/toastAlert";
import isEmpty from "@/lib/isEmpty";
import config from "../config";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import RegisterForm from "@/components/contactus/RegisterForm";

let captchaKey = config.RECAPTCHA_SITE_KEY ? config.RECAPTCHA_SITE_KEY : ''

export default function ContactUs() {

  return (
    <>
      <Mainnavbar />
      <div className={styles.page_box}>
        <GoogleReCaptchaProvider reCaptchaKey={captchaKey}>
          <RegisterForm />
        </GoogleReCaptchaProvider>
      </div>
      <Footer />
    </>
  );
}
