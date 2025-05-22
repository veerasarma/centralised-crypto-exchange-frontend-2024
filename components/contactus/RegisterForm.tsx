import styles from "@/styles/common.module.css";
import Mainnavbar from "../navbar";
import Footer from "../footer";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Container, Form, Col, Row } from "react-bootstrap";
//import service
import { apiContactUs } from "../../services/User/UserServices";
//import lib
import { toastAlert } from "@/lib/toastAlert";
import isEmpty from "@/lib/isEmpty";
import config from "../../config";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

type InitialValue = {
    name: string;
    email: string;
    message: string;
};
let initialFormValue: InitialValue = {
    name: "",
    email: "",
    message: "",
};

export default function RegisterForm() {
    const [formValue, setFormValue] = useState<InitialValue>(initialFormValue);
    let { name, email, message } = formValue;
    const { executeRecaptcha } = useGoogleReCaptcha();

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
        // setError(removeByObj(error, name))
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const captcha = await handleReCaptcha();
            console.log("captcha-------xx", captcha);
            if (isEmpty(captcha)) {
                toastAlert("error", "Invalid recaptcha", "contactus", "TOP_CENTER");
                return;
            }
            let data = {
                name,
                email,
                message,
                reCaptcha: captcha
            };
            let emailRegex =
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;
            let emailRegQuotes =
                /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if (isEmpty(data.email)) {
                return toastAlert("error", "Email field is required", "contactus");
            } else if (!emailRegex.test(data.email)) {
                return toastAlert("error", "Email is invalid", "contactus");
            } else if (!emailRegQuotes.test(data.email)) {
                return toastAlert("error", "Email is invalid", "contactus");
            }
            if (isEmpty(data.name)) {
                return toastAlert("error", "Name field is required", "contactus");
            }
            else if (!/^[A-Za-z]+(\.[A-Za-z]+|\s[A-Za-z]+)*$/.test(data.name)) {
                return toastAlert("error", "Please enter a valid name. Names should only contain letters, a single space, or a single dot between names.", "contactus");
            }            
            if (isEmpty(data.message)) {
                return toastAlert("error", "Message field is required", "contactus");
            }
            let result = await apiContactUs(data);
            if (result.data.status) {
                toastAlert("success", result.data.message, "contactus");
                setFormValue(initialFormValue);
            }
            else {
                toastAlert("error", result.data.message, "contactus");
            }
        } catch (err: any) {
            if (err?.response?.data?.message) {
                toastAlert("error", err?.response?.data?.message, "contactus");
            }
        }
    };
    return (
        <>
            <div
                className={`mb-5 ${styles.inner_head_box} ${styles.inner_head_box_small}`}
            >
                <Container>
                    <Row>
                        <Col lg={4} className="text-center mx-auto">
                            <h5 className={`mb-0 ${styles.inner_head_title}`}>
                                Contact Us
                            </h5>
                        </Col>
                    </Row>
                </Container>
            </div>
            <div className={`${styles.contact}`}>
                <Container>
                    <div className="d-flex align-items-center justify-content-between">
                        <h3 className={`mb-4 ${styles.h2tag} `}></h3>
                    </div>
                    <Row>
                        <Col lg={12}>
                            <div className={`mb-5 py-4 ${styles.box}`}>
                                <Row>
                                    <Col lg={6} className="mx-auto">
                                        <Form.Label> Name</Form.Label>
                                        <div className={`mb-4  ${styles.input_box}`}>
                                            <Form.Control
                                                placeholder="Enter your name"
                                                aria-label="Recipient's username"
                                                aria-describedby="basic-addon2"
                                                name="name"
                                                value={name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <Form.Label> Email</Form.Label>
                                        <div className={`mb-4  ${styles.input_box}`}>
                                            <Form.Control
                                                placeholder="Enter your email "
                                                aria-label="Recipient's username"
                                                aria-describedby="basic-addon2"
                                                name="email"
                                                value={email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <Form.Label> Message</Form.Label>
                                        <div className={`mb-3 ${styles.text_area} `}>
                                            <Form.Control
                                                as="textarea"
                                                placeholder="Leave a comment here"
                                                aria-label="Recipient's username"
                                                aria-describedby="basic-addon2"
                                                name="message"
                                                rows={4}
                                                value={message}
                                                className={styles.height}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="text-center">
                                            <button
                                                className={styles.primary_btn}
                                                onClick={handleSubmit}
                                            >
                                                <span></span>
                                                <label>Submit</label>
                                            </button>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    );
}


