import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/common.module.css";
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import logo from "../public/assets/images/logo.svg";
//improt config
import config from "../config";
//improt store
import { useSelector } from "../store";
import { subscribe } from "@/services/common.service";
import { toastAlert } from "@/lib/toastAlert";

export default function Footer() {
  const { session, user } = useSelector((state: any) => state.auth);
  const [isClient, setIsClient] = useState(false);
  const [formValue, setFormValue] = useState({ email: "" });
  const [err, setError] = useState({});
  const { email } = formValue;
  useEffect(() => {
    setIsClient(true);
  }, []);
  const handleClick = async () => {
    try {
      const result: any = await subscribe({ email });
      console.log(result, "-------23");

      if (result.data.status) {
        setFormValue({ email: "" });
        toastAlert("success", result.data.message, "newsletter");
      }
    } catch (err: any) {
      if (err?.response?.data?.errors) {
        setError(err.response.data.errors);
      }
    }
  };
  const handleChange = (e: any) => {
    const { value } = e.target;
    setFormValue({ ...{ email: value } });
    setError({});
  };
  return (
    <>
      <footer className={styles.footer}>
        <Container>
          <Row>
            <Col lg={4}>
              <Link href="#">
                <Image
                  src={logo}
                  alt="image"
                  className="img-fluid mb-3"
                  width={177}
                  height={40}
                />
              </Link>
              {/* <ul className={styles.social_icons}>
                <li>
                  <Link href="https://web.telegram.org/" target="_blank">
                    <i className="fa-solid fa-paper-plane"></i>
                  </Link>
                </li>
                <li>
                  <Link href="https://www.facebook.com/login/" target="_blank">
                    <i className="fa-brands fa-facebook-f"></i>
                  </Link>
                </li>
                <li>
                  <Link href="https://x.com/" target="_blank">
                    <i className="fa-brands fa-x-twitter"></i>
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://www.instagram.com/accounts/login/?hl=en"
                    target="_blank"
                  >
                    <i className="fa-brands fa-instagram"></i>
                  </Link>
                </li>
                <li>
                  <Link href="https://www.youtube.com/" target="_blank">
                    <i className="fa-brands fa-youtube"></i>
                  </Link>
                </li>
                <li>
                  <Link href="https://www.whatsapp.com/" target="_blank">
                    <i className="fa-brands fa-whatsapp"></i>
                  </Link>
                </li>
              </ul> */}
            </Col>
            <Col lg={4}>
              <ul>
                <li>
                  {" "}
                  <Link href="/spot/BNB_USDT">Trade</Link>
                </li>
                <li>
                  {" "}
                  <Link href="/market">Market</Link>
                </li>
                <li>
                  {" "}
                  <Link href="/about">About Us</Link>
                </li>
                <li>
                  {" "}
                  <Link href="/contactus">Contact Us</Link>
                </li>
                <li>
                  {" "}
                  <Link href="/faq">FAQ</Link>
                </li>
              </ul>
            </Col>
            <Col lg={4} className="mb-4 pb-2">
              <h5>News for Updates</h5>
              <p>
                Subscribe to get update and notify our exchange and products
              </p>
              <InputGroup className={`${styles.input_grp}`}>
                <Form.Control
                  placeholder="Enter your email address"
                  aria-label="email"
                  aria-describedby="basic-addon2"
                  name={email}
                  type="email"
                  onChange={(e) => handleChange(e)}
                  value={email}
                />
                <InputGroup.Text
                  id="basic-addon2"
                  className="border-start-0"
                  onClick={() => handleClick()}
                >
                  <Image
                    src="/assets/images/button-arrow.png"
                    alt="image"
                    className="img-fluid arrow-search"
                    width={9}
                    height={9}
                  />
                </InputGroup.Text>
              </InputGroup>
              {err && err?.email && (
                <span className="text-danger mb-4">{err && err.email}</span>
              )}
            </Col>
          </Row>
          <div className={styles.footer_blw}>
            <p>
              © Copyright {new Date().getFullYear()} by{" "}
              <span className={styles.brand}>B5 Exchange</span>. All rights
              reserved.
            </p>
            <p>
              <Link href="/terms">Terms of Use</Link>
              <span className={styles.seperator}> | </span>
              <Link href="/privacy-policy">Privacy Policy</Link>{" "}
            </p>
          </div>
        </Container>
      </footer>

      {/* <div className={styles.app_notify}>
        <i className="fa-solid fa-circle-xmark"></i>
        <div>
          <p>Can't find B5 Exchange on GooglePlay or Appstore?</p>
          <a href="#" className={styles.primary_btn}>
            Download App
          </a>
        </div>
      </div> */}
    </>
  );
}
