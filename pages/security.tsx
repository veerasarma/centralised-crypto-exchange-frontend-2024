import Image from "next/image";
import styles from "@/styles/common.module.css";
import { Container, Row, Col } from "react-bootstrap";
import Mainnavbar from "../components/navbar";
import Footer from "../components/footer";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
//import store
import { useSelector } from "../store";
//import lib
import { emailFormat } from "@/lib/stringCase";
import { toastAlert } from "@/lib/toastAlert";
import { securityLevel } from "@/lib/statusCode";
import isEmpty from "@/lib/isEmpty";
import config from "../config/index";
//import component
const ChangePassword = dynamic(
  () => import("@/components/security/ChangePassword")
);
const BindMobile = dynamic(() => import("@/components/security/BindMobile"));
const TFA = dynamic(() => import("@/components/security/2fa"));
const AssetPassword = dynamic(
  () => import("@/components/security/AssetPassword")
);
const AntiPhising = dynamic(() => import("@/components/security/Antiphising"));
const BindEmail = dynamic(() => import("@/components/security/BindEmail"));
const KYC = dynamic(() => import("@/components/security/kyc"));

import { handleAuthSSR } from "../utils/auth";
export default function Security() {
  const router = useRouter();
  const {
    idProof,
    twoFAStatus,
    phoneStatus,
    emailStatus,
    assetPasswordStatus,
    antiphishingStatus,
    email,
    userId,
    phoneNo,
    loginHistory,
  } = useSelector((state: any) => state.auth.user);
  const { bankDetail, upiDetail, qrDetails } = useSelector(
    (state: any) => state.paymentmethods
  );

  const userDoc = useSelector((state: any) => state.auth.user);
  const [password_modal, setpassword_modal] = useState(false);
  const [phone_modal, setphone_modal] = useState(false);
  const [TFAModal, setTFAModal] = useState(false);
  const [email_modal, setemail_modal] = useState(false);
  const [kyc_modal, setkyc_modal] = useState(false);
  const [asset_password_modal, setasset_password_modal] = useState(false);
  const [antiphising_modal, setantiphising_modal] = useState(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [level, setLevel] = useState<string | undefined>("");

  const copyToClipboard = (text: string) => {
    const tempInput = document.createElement("input");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    toastAlert("success", "Copied", "copy");
  };

  useEffect(() => {
    // dispatch(getWithdrawLimit())
    setIsClient(true);
    setLevel(securityLevel(userDoc));
  }, [userDoc]);
  useEffect(() => {
    if (window) {
      const queryParams = new URLSearchParams(window.location.search);
      const qData = queryParams.get("value");
      if (qData == "kyc") {
        setkyc_modal(true);
      } else if (qData == "2fa") {
        setTFAModal(true);
      }
    }
  }, []);
  return (
    <>
      <Mainnavbar />
      <div className={styles.page_box}>
        <div className={styles.security}>
          <div className={`mb-5 ${styles.inner_head_box}`}>
            <Container>
              <div className={`${styles.inner_head_box_flex}`}>
                <div className={styles.usr_flx_head}>
                  <div className={styles.usr_flx}>
                    <Image
                      src="/assets/images/user_icon.png"
                      className="img-fluid me-3"
                      alt="img"
                      width={36}
                      height={36}
                    />
                    <div>
                      <h5>{isClient && emailFormat(email)}</h5>
                      {/* <span>Nickname:  John</span> */}
                    </div>
                  </div>
                  <div>
                    <div className={styles.user_info_top}>
                      <Image
                        src={require("../public/assets/images/affiliate-program/user_icon.png")}
                        alt="Icon"
                        width={24}
                        height={24}
                        className=""
                      />
                      <span>Refferal Link</span>
                    </div>
                    <p>
                      {`${config.FRONT_URL}/register-B5/IN/${userId}`}
                      <Image
                        src="/assets/images/copy_dark.png"
                        className={`${styles.copy} img-fluid ms-2`}
                        alt="img"
                        width={12}
                        height={14}
                        onClick={() =>
                          copyToClipboard(
                            `${config.FRONT_URL}/register-B5/IN/${userId}`
                          )
                        }
                      />
                    </p>
                  </div>
                </div>
                <div className={styles.user_info}>
                  <div>
                    <div className={styles.user_info_top}>
                      <svg
                        width="14"
                        height="16"
                        viewBox="0 0 14 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.00098 6C8.65783 6 10.001 4.65685 10.001 3C10.001 1.34315 8.65783 0 7.00098 0C5.34412 0 4.00098 1.34315 4.00098 3C4.00098 4.65685 5.34412 6 7.00098 6Z"
                          fill="#9E9E9E"
                        />
                        <path
                          d="M0.466147 12.4935C0.271263 13.0016 0.445325 13.571 0.875175 13.9046C2.56753 15.218 4.69299 16 7.00109 16C9.31154 16 11.439 15.2164 13.1322 13.9006C13.5618 13.5667 13.7355 12.9971 13.5403 12.4892C12.531 9.86354 9.98517 8 7.00404 8C4.02129 8 1.47427 9.86557 0.466147 12.4935Z"
                          fill="#9E9E9E"
                        />
                      </svg>
                      <span>UID</span>
                    </div>
                    <p className="d-flex align-items-center">
                      {isClient && userId}
                      <Image
                        src="/assets/images/copy_dark.png"
                        className={`${styles.copy} img-fluid ms-2`}
                        alt="img"
                        width={12}
                        height={14}
                        onClick={() => copyToClipboard(userId)}
                      />
                    </p>
                  </div>
                  <div>
                    {isClient && emailStatus == "verified" ? (
                      <>
                        <div className={styles.user_info_top}>
                          <svg
                            width="18"
                            height="12"
                            viewBox="0 0 18 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2 0C0.895431 0 0 0.895431 0 2V3.16147L8.44098 7.38197C8.79289 7.55792 9.20711 7.55792 9.55902 7.38197L18 3.16147V2C18 0.895431 17.1046 0 16 0H2Z"
                              fill="#9E9E9E"
                            />
                            <path
                              d="M18 4.83853L10.2298 8.72361C9.45564 9.11071 8.54436 9.11071 7.77016 8.72361L0 4.83853V10C0 11.1046 0.89543 12 2 12H16C17.1046 12 18 11.1046 18 10V4.83853Z"
                              fill="#9E9E9E"
                            />
                          </svg>

                          <span>Email</span>
                        </div>
                        <p>{isClient && email}</p>
                      </>
                    ) : (
                      <>
                        <div className={styles.user_info_top}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            version="1.1"
                            width="16"
                            height="16"
                            x="0"
                            y="0"
                            viewBox="0 0 35 35"
                          >
                            <g>
                              <path
                                d="M25.302 0H9.698a2.37 2.37 0 0 0-2.364 2.364v30.271A2.371 2.371 0 0 0 9.698 35h15.604a2.37 2.37 0 0 0 2.364-2.364V2.364A2.37 2.37 0 0 0 25.302 0zM15.004 1.704h4.992a.286.286 0 0 1 0 .573h-4.992a.286.286 0 1 1 0-.573zM17.5 33.818a1.182 1.182 0 1 1 0-2.364 1.182 1.182 0 0 1 0 2.364zm8.521-3.193H8.979V3.749h17.042v26.876z"
                                fill="#9e9e9e"
                                opacity="1"
                                data-original="#000000"
                              ></path>
                            </g>
                          </svg>
                          <span>Mobile</span>
                        </div>
                        <p>{isClient && phoneNo}</p>
                      </>
                    )}
                  </div>
                  {isClient &&
                    emailStatus == "verified" &&
                    phoneStatus == "verified" && (
                      <div>
                        <div className={styles.user_info_top}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            version="1.1"
                            width="16"
                            height="16"
                            x="0"
                            y="0"
                            viewBox="0 0 35 35"
                          >
                            <g>
                              <path
                                d="M25.302 0H9.698a2.37 2.37 0 0 0-2.364 2.364v30.271A2.371 2.371 0 0 0 9.698 35h15.604a2.37 2.37 0 0 0 2.364-2.364V2.364A2.37 2.37 0 0 0 25.302 0zM15.004 1.704h4.992a.286.286 0 0 1 0 .573h-4.992a.286.286 0 1 1 0-.573zM17.5 33.818a1.182 1.182 0 1 1 0-2.364 1.182 1.182 0 0 1 0 2.364zm8.521-3.193H8.979V3.749h17.042v26.876z"
                                fill="#9e9e9e"
                                opacity="1"
                                data-original="#000000"
                              ></path>
                            </g>
                          </svg>
                          <span>Mobile</span>
                        </div>
                        <p>{isClient && phoneNo}</p>
                      </div>
                    )}

                  <div>
                    <div className={styles.user_info_top}>
                      <svg
                        width="14"
                        height="17"
                        viewBox="0 0 14 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M6.69008 16.933L6.69288 16.9342C6.89 17.02 7 17 7 17C7 17 7.11 17.02 7.30791 16.9339L7.30992 16.933L7.31565 16.9304L7.33381 16.922C7.34884 16.915 7.36967 16.9052 7.39591 16.8926C7.44837 16.8673 7.52255 16.8306 7.61533 16.7822C7.80078 16.6855 8.06121 16.5419 8.37166 16.3495C8.99123 15.9655 9.81736 15.3826 10.6455 14.5844C12.3022 12.9876 14 10.4925 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.4925 1.69783 12.9876 3.35452 14.5844C4.18264 15.3826 5.00877 15.9655 5.62834 16.3495C5.93879 16.5419 6.19922 16.6855 6.38467 16.7822C6.47745 16.8306 6.55163 16.8673 6.60409 16.8926C6.63033 16.9052 6.65116 16.915 6.66619 16.922L6.68435 16.9304L6.69008 16.933ZM7 9.25C8.24264 9.25 9.25 8.24264 9.25 7C9.25 5.75736 8.24264 4.75 7 4.75C5.75736 4.75 4.75 5.75736 4.75 7C4.75 8.24264 5.75736 9.25 7 9.25Z"
                          fill="#9E9E9E"
                        />
                      </svg>

                      <span>IP Address</span>
                    </div>
                    <p>{isClient && loginHistory?.ipaddress}</p>
                  </div>
                  <div>
                    <div className={styles.user_info_top}>
                      <svg
                        width="16"
                        height="17"
                        viewBox="0 0 16 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M8.33891 0.236629C8.1429 0.0738744 7.85709 0.0738743 7.66109 0.236629C5.7223 1.8465 3.26847 2.85755 0.583332 2.98607C0.341968 2.99763 0.135874 3.17196 0.104195 3.41151C0.0354678 3.93122 0 4.46141 0 4.9999C0 10.1624 3.25997 14.5635 7.83362 16.2569C7.94086 16.2966 8.05915 16.2966 8.16639 16.2569C12.74 14.5635 16 10.1624 16 4.9999C16 4.46141 15.9645 3.93122 15.8958 3.41151C15.8641 3.17196 15.658 2.99763 15.4167 2.98607C12.7315 2.85755 10.2777 1.8465 8.33891 0.236629Z"
                          fill="#9E9E9E"
                        />
                      </svg>

                      <span>Security level</span>
                    </div>
                    <p>{isClient && level}</p>
                  </div>
                </div>
              </div>
            </Container>
          </div>
          <Container className="mb-5">
            <Row>
              <Col lg={6}>
                <div
                  className={`mb-4 ${styles.box} ${styles.account_settings_box}`}
                >
                  {isClient && idProof == "approved" ? (
                    <div className="VerifyBadge">
                      <span>Completed</span>
                      <Image
                        src="/assets/images/tic_mark.png"
                        className={`${styles.account_settings_icon} img-fluid`}
                        alt="img"
                        width={16}
                        height={16}
                      />
                    </div>
                  ) : (
                    <div className="notVerifyBadge">
                      <span>Pending</span>
                      <Image
                        src="/assets/images/close_red.png"
                        className={`${styles.account_settings_icon} img-fluid`}
                        alt="img"
                        width={16}
                        height={16}
                      />
                    </div>
                  )}
                  <div className={styles.set_flx}>
                    <svg
                      width="26"
                      height="30"
                      viewBox="0 0 26 30"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13.6673 18.0033V20.7892C12.8332 20.4944 11.9357 20.334 11.0007 20.334C6.58237 20.334 3.00065 23.9157 3.00065 28.334H0.333984C0.333984 22.4429 5.10961 17.6673 11.0007 17.6673C11.9215 17.6673 12.8151 17.784 13.6673 18.0033ZM11.0007 16.334C6.58065 16.334 3.00065 12.754 3.00065 8.33398C3.00065 3.91398 6.58065 0.333984 11.0007 0.333984C15.4207 0.333984 19.0007 3.91398 19.0007 8.33398C19.0007 12.754 15.4207 16.334 11.0007 16.334ZM11.0007 13.6673C13.9473 13.6673 16.334 11.2807 16.334 8.33398C16.334 5.38732 13.9473 3.00065 11.0007 3.00065C8.05398 3.00065 5.66732 5.38732 5.66732 8.33398C5.66732 11.2807 8.05398 13.6673 11.0007 13.6673ZM18.7245 25.5529L23.4385 20.8389L25.3241 22.7245L18.7245 29.3241L14.0105 24.6101L15.8961 22.7245L18.7245 25.5529Z"
                        fill="#EAB486"
                      />
                    </svg>
                    <div>
                      {/* {isClient && idProof == "approved" ? (
                        <>
                          <Row>
                            <Col lg={2} sm={2}>
                              <Image
                                src="/verified_icon.svg"
                                alt="Icon"
                                width={22}
                                height={22}
                                priority
                              />
                            </Col>
                            <Col lg={10} sm={10}>
                              <h3>KYC Verified</h3>
                            </Col>
                          </Row>
                        </>
                      ) : (
                        <h3>KYC Verification</h3>
                      )}  <h4>
                        {isClient &&
                        (idProof == "new" || idProof == "rejected") ? (
                          <span
                            className="red_txt cursor_pointer"
                            onClick={() => setkyc_modal(true)}
                          >
                            <span></span>
                            <label>Verification</label>
                          </span>
                        ) : (
                          isClient &&
                          idProof == "pending" && (
                            <span
                              className="red_txt cursor_pointer"
                              onClick={() => router.push("/kyc")}
                            >
                              <label>Pending</label>
                            </span>
                          )
                        )}
                      </h4> */}
                      <p>KYC</p>
                      <span>
                        Real-name verification could increase withdrawal limits
                      </span>
                      {isClient &&
                      (idProof == "new" || idProof == "rejected") ? (
                        <button
                          className={`${styles.dark} ${styles.primary_btn}`}
                          // onClick={() => router.push("/kyc")}
                          onClick={() => setkyc_modal(true)}
                        >
                          <span></span>
                          <label>Verification</label>
                        </button>
                      ) : (
                        isClient &&
                        idProof == "pending" && (
                          <button
                            className={`${styles.dark} ${styles.primary_btn}`}
                            onClick={() => router.push("/kyc")}
                          >
                            <span></span>
                            <label>Pending</label>
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={6}>
                <div
                  className={`mb-4 ${styles.box} ${styles.account_settings_box}`}
                >
                  {isClient && twoFAStatus == "enabled" ? (
                    <div className="VerifyBadge">
                      <span>Completed</span>
                      <Image
                        src="/assets/images/tic_mark.png"
                        className={`${styles.account_settings_icon} img-fluid`}
                        alt="img"
                        width={16}
                        height={16}
                      />
                    </div>
                  ) : (
                    <div className="notVerifyBadge">
                      <span>Pending</span>
                      <Image
                        src="/assets/images/close_red.png"
                        className={`${styles.account_settings_icon} img-fluid`}
                        alt="img"
                        width={16}
                        height={16}
                      />
                    </div>
                  )}
                  <div className={styles.set_flx}>
                    <svg
                      width="24"
                      height="28"
                      viewBox="0 0 24 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.6667 9.99935V3.33268H2.66667V24.666H10.7417C11.1784 25.2221 11.7071 25.7123 12.3147 26.1124L14.168 27.3327H1.32453C0.593267 27.3327 0 26.7407 0 26.0103V1.98842C0 1.2731 0.598267 0.666016 1.33628 0.666016H15.9957L24 8.66602V9.99935H14.6667ZM12 12.666H24V20.598C24 21.9189 23.3316 23.1524 22.2188 23.8852L18 26.6631L13.7812 23.8852C12.6684 23.1524 12 21.9189 12 20.598V12.666ZM14.6667 20.598C14.6667 21.0196 14.8821 21.4172 15.2477 21.658L18 23.4703L20.7523 21.658C21.1179 21.4172 21.3333 21.0196 21.3333 20.598V15.3327H14.6667V20.598Z"
                        fill="#EAB486"
                      />
                    </svg>
                    <div>
                      <p>2FA</p>
                      <span>
                        For the safety of your account, please go to 2FA binding
                      </span>
                      <button
                        className={`${styles.dark} ${styles.primary_btn}`}
                        // onClick={() => router.push("/2fa")}
                        onClick={() => {
                          setTFAModal(true);
                        }}
                      >
                        <span></span>
                        <label>
                          {isClient && twoFAStatus == "enabled"
                            ? "Disable"
                            : "Enable"}
                        </label>
                      </button>
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={6}>
                <div
                  className={`mb-4 ${styles.box} ${styles.account_settings_box}`}
                >
                  <div className={styles.set_flx}>
                    <svg
                      width="24"
                      height="29"
                      viewBox="0 0 24 29"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 9.66732H22.6667C23.4031 9.66732 24 10.2643 24 11.0007V27.0007C24 27.7371 23.4031 28.334 22.6667 28.334H1.33333C0.59696 28.334 0 27.7371 0 27.0007V11.0007C0 10.2643 0.59696 9.66732 1.33333 9.66732H4V8.33398C4 3.9157 7.58172 0.333984 12 0.333984C16.4183 0.333984 20 3.9157 20 8.33398V9.66732ZM2.66667 12.334V25.6673H21.3333V12.334H2.66667ZM10.6667 17.6673H13.3333V20.334H10.6667V17.6673ZM5.33333 17.6673H8V20.334H5.33333V17.6673ZM16 17.6673H18.6667V20.334H16V17.6673ZM17.3333 9.66732V8.33398C17.3333 5.38846 14.9455 3.00065 12 3.00065C9.05448 3.00065 6.66667 5.38846 6.66667 8.33398V9.66732H17.3333Z"
                        fill="#EAB486"
                      />
                    </svg>

                    <div>
                      <p>Login Password</p>
                      <span>This password is used for your login check</span>
                      <button
                        className={`${styles.dark} ${styles.primary_btn}`}
                        onClick={() => {
                          setpassword_modal(true);
                        }}
                      >
                        <span></span>
                        <label>Modify</label>
                      </button>
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={6}>
                <div
                  className={`mb-4 ${styles.box} ${styles.account_settings_box}`}
                >
                  {isClient && emailStatus == "verified" ? (
                    <div className="VerifyBadge">
                      <span>Completed</span>
                      <Image
                        src="/assets/images/tic_mark.png"
                        className={`${styles.account_settings_icon} img-fluid`}
                        alt="img"
                        width={16}
                        height={16}
                      />
                    </div>
                  ) : (
                    <div className="notVerifyBadge">
                      <span>Pending</span>
                      <Image
                        src="/assets/images/close_red.png"
                        className={`${styles.account_settings_icon} img-fluid`}
                        alt="img"
                        width={16}
                        height={16}
                      />
                    </div>
                  )}

                  <div className={styles.set_flx}>
                    <svg
                      width="30"
                      height="26"
                      viewBox="0 0 30 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M27.3327 14.6667H24.666V5.65056L14.0951 15.1173L3.33268 5.62125V21.3333H16.666V24H1.99935C1.26298 24 0.666016 23.4031 0.666016 22.6667V1.33333C0.666016 0.59696 1.26298 0 1.99935 0H25.9993C26.7358 0 27.3327 0.59696 27.3327 1.33333V14.6667ZM4.01463 2.66667L14.0819 11.5493L24.0007 2.66667H4.01463ZM23.3327 25.3333L18.6187 20.6193L20.5043 18.7337L23.3327 21.5621L28.0467 16.848L29.9323 18.7337L23.3327 25.3333Z"
                        fill="#EAB486"
                      />
                    </svg>
                    <div>
                      <p>Secure Email</p>
                      {isClient && emailStatus == "verified" && (
                        <span>
                          Your email is {isClient && emailFormat(email)}
                        </span>
                      )}
                      <button
                        className={`${styles.dark} ${styles.primary_btn}`}
                        onClick={() => {
                          setemail_modal(true);
                        }}
                      >
                        <span></span>
                        <label>
                          {isClient && emailStatus == "verified"
                            ? "Modify"
                            : "Add"}
                        </label>
                      </button>
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={6}>
                <div
                  className={`mb-4 ${styles.box} ${styles.account_settings_box}`}
                >
                  {isClient && phoneStatus == "verified" ? (
                    <div className="VerifyBadge">
                      <span>Completed</span>
                      <Image
                        src="/assets/images/tic_mark.png"
                        className={`${styles.account_settings_icon} img-fluid`}
                        alt="img"
                        width={16}
                        height={16}
                      />
                    </div>
                  ) : (
                    <div className="notVerifyBadge">
                      <span>Pending</span>
                      <Image
                        src="/assets/images/close_red.png"
                        className={`${styles.account_settings_icon} img-fluid`}
                        alt="img"
                        width={16}
                        height={16}
                      />
                    </div>
                  )}
                  <div className={styles.set_flx}>
                    <svg
                      width="24"
                      height="28"
                      viewBox="0 0 24 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.9993 0.666016C18.7358 0.666016 19.3327 1.26298 19.3327 1.99935V11.3327H16.666V3.33268H3.33268V24.666H9.99935V27.3327H1.99935C1.26298 27.3327 0.666016 26.7358 0.666016 25.9993V1.99935C0.666016 1.26298 1.26298 0.666016 1.99935 0.666016H17.9993ZM17.9993 13.9993C20.2085 13.9993 21.9993 15.7901 21.9993 17.9993V19.3327H23.3327V25.9993C23.3327 26.7358 22.7358 27.3327 21.9993 27.3327H13.9993C13.2629 27.3327 12.666 26.7358 12.666 25.9993V19.3327H13.9993V17.9993C13.9993 15.7901 15.7901 13.9993 17.9993 13.9993ZM20.666 21.9993H15.3327V24.666H20.666V21.9993ZM17.9993 16.666C17.3219 16.666 16.666 17.266 16.666 17.9993V19.3327H19.3327V17.9993C19.3327 17.2629 18.7358 16.666 17.9993 16.666Z"
                        fill="#EAB486"
                      />
                    </svg>
                    <div>
                      <p>Secure Phone </p>
                      <span>You haven't bound your phone number yet </span>
                      <button
                        className={`${styles.dark} ${styles.primary_btn}`}
                        onClick={() => {
                          setphone_modal(true);
                        }}
                      >
                        <span></span>
                        <label>
                          {isClient && phoneStatus == "verified"
                            ? "Change"
                            : "Add"}
                        </label>
                      </button>
                    </div>
                  </div>
                </div>
              </Col>
              <Col lg={6}>
                <div
                  className={`mb-4 ${styles.box} ${styles.account_settings_box}`}
                >
                  {isClient && assetPasswordStatus ? (
                    <div className="VerifyBadge">
                      <span>Completed</span>
                      <Image
                        src="/assets/images/tic_mark.png"
                        className={`${styles.account_settings_icon} img-fluid`}
                        alt="img"
                        width={16}
                        height={16}
                      />
                    </div>
                  ) : (
                    <div className="notVerifyBadge">
                      <span>Pending</span>
                      <Image
                        src="/assets/images/close_red.png"
                        className={`${styles.account_settings_icon} img-fluid`}
                        alt="img"
                        width={16}
                        height={16}
                      />
                    </div>
                  )}
                  <div className={styles.set_flx}>
                    <svg
                      width="30"
                      height="22"
                      viewBox="0 0 30 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.0065 0.337891C23.1067 0.337891 29.6732 3.91961 29.6732 8.33782V13.6712C29.6732 18.0896 23.1067 21.6712 15.0065 21.6712C7.05099 21.6712 0.574857 18.2162 0.346097 13.9072L0.339844 13.6712V8.33782C0.339844 3.91961 6.90634 0.337891 15.0065 0.337891ZM15.0065 16.3378C10.0459 16.3378 5.6605 14.9946 3.00622 12.9385L3.00651 13.6712C3.00651 16.1808 8.18335 19.0045 15.0065 19.0045C21.6875 19.0045 26.7901 16.2973 26.9999 13.8285L27.0065 13.6712L27.0081 12.9374C24.354 14.9941 19.968 16.3378 15.0065 16.3378ZM15.0065 3.00456C8.18335 3.00456 3.00651 5.82828 3.00651 8.33782C3.00651 10.8474 8.18335 13.6712 15.0065 13.6712C21.8297 13.6712 27.0065 10.8474 27.0065 8.33782C27.0065 5.82828 21.8297 3.00456 15.0065 3.00456Z"
                        fill="#EAB486"
                      />
                    </svg>

                    <div>
                      <p>Asset Password</p>
                      <span>
                        This password is used for your transaction verification
                      </span>
                      <div>
                        <button
                          className={`${styles.dark} ${styles.primary_btn}`}
                          onClick={() => {
                            setasset_password_modal(true);
                          }}
                        >
                          <span></span>
                          <label>
                            {isClient && !assetPasswordStatus ? "Add" : "Edit"}
                          </label>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              {/* <Col lg={6}>
                <div
                  className={`mb-4 ${styles.box} ${styles.account_settings_box}`}
                >
                  <Image
                    src={
                      isClient &&
                      (bankDetail?.result?.length > 0 ||
                        upiDetail?.result?.length > 0 ||
                        qrDetails?.result?.length > 0)
                        ? "/assets/images/tic_mark.png"
                        : "/assets/images/close_red.png"
                    }
                    className={`${styles.account_settings_icon} img-fluid`}
                    alt="img"
                    width={16}
                    height={16}
                  />
                  <div className={styles.set_flx}>
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 28 28"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M0.666016 24.666H27.3327V27.3327H0.666016V24.666ZM3.33268 13.9993H5.99935V23.3327H3.33268V13.9993ZM9.99935 13.9993H12.666V23.3327H9.99935V13.9993ZM15.3327 13.9993H17.9993V23.3327H15.3327V13.9993ZM21.9993 13.9993H24.666V23.3327H21.9993V13.9993ZM0.666016 7.33268L13.9993 0.666016L27.3327 7.33268V12.666H0.666016V7.33268ZM3.33268 8.98078V9.99935H24.666V8.98078L13.9993 3.64744L3.33268 8.98078ZM13.9993 8.66602C13.2629 8.66602 12.666 8.06906 12.666 7.33268C12.666 6.59631 13.2629 5.99935 13.9993 5.99935C14.7357 5.99935 15.3327 6.59631 15.3327 7.33268C15.3327 8.06906 14.7357 8.66602 13.9993 8.66602Z"
                        fill="#EAB486"
                      />
                    </svg>
                    <div>
                      <p>Bank Details</p>
                      <span>Please Add Bank Details for transactions</span>
                      <button
                        className={`${styles.dark} ${styles.primary_btn}`}
                        onClick={() => router.push("/payment-method")}
                      >
                        <span></span>
                        <label>Link</label>
                      </button>
                    </div>
                  </div>
                </div>
              </Col> */}
              <Col lg={6}>
                <div
                  className={`mb-4 ${styles.box} ${styles.account_settings_box}`}
                >
                  {isClient && antiphishingStatus ? (
                    <div className="VerifyBadge">
                      <span>Completed</span>
                      <Image
                        src="/assets/images/tic_mark.png"
                        className={`${styles.account_settings_icon} img-fluid`}
                        alt="img"
                        width={16}
                        height={16}
                      />
                    </div>
                  ) : (
                    <div className="notVerifyBadge">
                      <span>Pending</span>
                      <Image
                        src="/assets/images/close_red.png"
                        className={`${styles.account_settings_icon} img-fluid`}
                        alt="img"
                        width={16}
                        height={16}
                      />
                    </div>
                  )}
                  <div className={styles.set_flx}>
                    <svg
                      width="30"
                      height="22"
                      viewBox="0 0 32 32"
                      fill="#EAB486"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M31.3,31.9H0.7c-0.7,0-1.2-0.6-1.2-1.2V13.5c0-0.4,0.2-0.7,0.4-0.9l5.8-5l1.6,1.9l-5.3,4.6v0.6L16,23.5
	l14.1-8.8v-0.6l-5.4-4.6l1.6-1.9l5.8,5c0.3,0.2,0.4,0.6,0.4,0.9v17.2C32.6,31.4,32,31.9,31.3,31.9z M1.9,29.4h28.1V17.7L16.7,26
	c-0.4,0.3-0.9,0.3-1.3,0L1.9,17.7V29.4z M16.1,18.6c-1.7,0-3.2-1.4-3.2-3.2v-2.8C11.8,12.1,11,11,11,9.7s0.8-2.4,1.9-2.9V0.1h2.5
	v6.8c1.1,0.5,1.9,1.6,1.9,2.9s-0.8,2.4-1.9,2.9v2.8c0,0.4,0.3,0.7,0.7,0.7s0.7-0.3,0.7-0.7v-1.9h2.5v1.9
	C19.2,17.2,17.8,18.6,16.1,18.6z M14.2,9.1c-0.4,0-0.7,0.3-0.7,0.7s0.3,0.7,0.7,0.7s0.7-0.3,0.7-0.7S14.5,9.1,14.2,9.1z"
                      />
                    </svg>

                    <div>
                      <p>Anti-phishing Code</p>
                      <span>
                        Emails sent to you by B5 Exchange will contain this code
                      </span>
                      <button
                        onClick={() => setantiphising_modal(true)}
                        className={`${styles.dark} ${styles.primary_btn}`}
                      >
                        <span></span>
                        <label>{antiphishingStatus ? "Edit" : "Set"}</label>
                      </button>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      <Footer />

      {/* change password modal */}
      <ChangePassword
        password_modal={password_modal}
        setpassword_modal={setpassword_modal}
      />

      {/*Phone number modal */}
      <BindMobile phone_modal={phone_modal} setphone_modal={setphone_modal} />

      {/*2FA modal */}
      <TFA TFAModal={TFAModal} setTFAModal={setTFAModal} />

      {/* Asset Password modal */}
      <AssetPassword
        asset_password_modal={asset_password_modal}
        setasset_password_modal={setasset_password_modal}
      />

      {/* antiphising  modal */}
      <AntiPhising
        antiphising_modal={antiphising_modal}
        setantiphising_modal={setantiphising_modal}
      />
      {/* email  modal */}
      <BindEmail email_modal={email_modal} setemail_modal={setemail_modal} />
      <KYC kyc_modal={kyc_modal} setkyc_modal={setkyc_modal} />
    </>
  );
}
