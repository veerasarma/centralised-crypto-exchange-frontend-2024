import Image from "next/image";
import styles from "@/styles/common.module.css";
import { Container, Row, Col, Dropdown } from "react-bootstrap";
import Mainnavbar from "../components/navbar";
import Footer from "../components/footer";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
//import config
import config from "../config";
//import store
import { useSelector, useDispatch } from "@/store";
import { getBankDetails } from "@/store/PaymentMethods/bankSlice";
import { getUserDetails } from "@/store/auth/userSlice";
//import  services
import {
  deleteBankDetail,
  apiSetPrimaryBank,
  setPrimaryUPI,
  deleteUPIDetail,
  setPrimaryQR,
  deleteQRDetail,
} from "@/services/User/UserServices";
// import lib
import { toastAlert } from "@/lib/toastAlert";

export default function Home({}: any) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedValue02, setSelectedValue02] = useState("Bank Account");
  const { bankDetail, upiDetail, qrDetails } = useSelector(
    (state: any) => state.paymentmethods
  );
  const handleItemClick02 = (value: any) => {
    setSelectedValue02(value);
  };

  const handleDelete = async (item: any) => {
    try {
      if (window.confirm("Are you sure to want to Delete?") == true) {
        let reqData = {
          bankId: item._id,
        };
        const respData = await deleteBankDetail(reqData);
        const { success, message } = respData.data;
        if (success) {
          toastAlert("success", message, "deleteBank");
          dispatch(getBankDetails());
          dispatch(getUserDetails());
        } else {
          toastAlert("error", message, "deleteBank");
        }
      }
    } catch (err) {}
  };

  const handlePrimaryBank = async (item: any) => {
    try {
      let reqData = {
        bankId: item._id,
      };
      const respData = await apiSetPrimaryBank(reqData);
      const { success, message } = respData.data;
      if (success) {
        toastAlert("success", message, "deleteBank");
        dispatch(getBankDetails());
      } else {
        toastAlert("error", message, "deleteBank");
      }
    } catch (err) {}
  };

  //upi
  const handleDeleteUPI = async (item: any) => {
    try {
      if (window.confirm("Are you sure to want to Delete?") == true) {
        let reqData = {
          upiId: item.upiId,
          id: item._id,
        };
        const respData = await deleteUPIDetail(reqData);
        const { success, message } = respData.data;
        if (success) {
          toastAlert("success", message, "deleteBank");
          dispatch(getBankDetails());
          dispatch(getUserDetails());
        } else {
          toastAlert("error", message, "deleteBank");
        }
      }
    } catch (err) {}
  };
  // function
  const handlePrimaryUPI = async (item: any) => {
    try {
      let reqData = {
        id: item._id,
        upiId: item.upiId,
      };
      const respData = await setPrimaryUPI(reqData);
      const { success, message } = respData.data;
      if (success) {
        toastAlert("success", message, "deleteBank");
        dispatch(getBankDetails());
      } else {
        toastAlert("error", message, "deleteBank");
      }
    } catch (err) {}
  };

  //goay
  const handleDeleteGPAY = async (item: any) => {
    try {
      if (window.confirm("Are you sure to want to Delete?") == true) {
        let reqData = {
          upiId: item.upiId,
          id: item._id,
        };
        const respData = await deleteQRDetail(reqData);
        const { success, message } = respData.data;
        if (success) {
          toastAlert("success", message, "deleteBank");
          dispatch(getBankDetails());
          dispatch(getUserDetails());
        } else {
          toastAlert("error", message, "deleteBank");
        }
      }
    } catch (err) {}
  };
  // function
  const handlePrimaryGPAY = async (item: any) => {
    try {
      let reqData = {
        id: item._id,
        upiId: item.upiId,
      };
      const respData = await setPrimaryQR(reqData);
      const { success, message } = respData.data;
      if (success) {
        toastAlert("success", message, "deleteBank");
        dispatch(getBankDetails());
      } else {
        toastAlert("error", message, "deleteBank");
      }
    } catch (err) {}
  };
  useEffect(() => {
    dispatch(getBankDetails());
  }, []);
  return (
    <>
      <Mainnavbar />

      <div className={styles.page_box}>
        <div
          className={`mb-5 ${styles.inner_head_box} ${styles.inner_head_box_small}`}
        >
          <Container>
            <Row>
              <Col lg={4} className="text-center mx-auto">
                <h5 className={`mb-0 ${styles.inner_head_title}`}>
                  Payment Settings
                </h5>
              </Col>
            </Row>
          </Container>
        </div>
        <Container>
          <div className={styles.asset}>
            <div className={`mb-4 ${styles.asset_box}`}>
              <div className="w-100">
                <Row className="justify-content-between align-items-end">
                  <Col lg={4}>
                    <label className="mb-3">Payment Type</label>
                    <Dropdown className={`${styles.drp_down} mb-4 mb-lg-0`}>
                      <Dropdown.Toggle variant="primary">
                        {selectedValue02}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => handleItemClick02("Bank Account")}
                        >
                          Bank Account
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleItemClick02("UPI")}>
                          UPI
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleItemClick02("Gpay")}
                        >
                          Gpay
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                  <Col lg={3}>
                    <Link
                      href="/add-payment-method"
                      className={`ms-lg-2 d-inline-block text-center ${styles.primary_btn}`}
                    >
                      <span></span>
                      <label>Add a payment method</label>
                    </Link>
                  </Col>
                </Row>
              </div>
            </div>

            {selectedValue02 == "Bank Account" && (
              <>
                {bankDetail?.result?.length > 0 &&
                  bankDetail.result.map((e: any, index: number) => {
                    return (
                      <div
                        className={`mb-4 ${styles.asset_box} ${styles.bankdetails_box}`}
                        key={index}
                      >
                        <div className="w-100">
                          <div className="d-flex align-items-md-center justify-content-between  flex-md-row flex-column mb-3">
                            <h4 className={`mb-md-0 mb-3`}>
                              #{index + 1} Bank Account
                            </h4>
                            <div className={`${styles.right_btns}`}>
                              {e.isPrimary ? (
                                <button className={styles.green}>
                                  Primary
                                </button>
                              ) : (
                                <button
                                  className={styles.green}
                                  onClick={() => handlePrimaryBank(e)}
                                >
                                  Set Primary
                                </button>
                              )}
                              <button
                                className={`mx-sm-2 ${styles.grey}`}
                                onClick={() =>
                                  router.push(
                                    `/add-payment-method?id=${e._id}&type=bank`
                                  )
                                }
                              >
                                {" "}
                                Edit
                              </button>
                              <button
                                className={styles.red}
                                onClick={() => handleDelete(e)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <div className={styles.bankdetails}>
                            <Row>
                              <Col lg={3}>
                                <p>Account holder name</p>
                                <h6>{e.holderName}</h6>
                              </Col>
                              <Col lg={3}>
                                <p>Account number</p>
                                <h6>{e.accountNo}</h6>
                              </Col>
                              <Col lg={3}>
                                <p>Bank name</p>
                                <h6>{e.bankName}</h6>
                              </Col>
                              <Col lg={3}>
                                <p>Routing number</p>
                                <h6>{e.bankcode}</h6>
                              </Col>
                              <Col lg={3}>
                                <p>Bank city</p>
                                <h6>{e.city}</h6>
                              </Col>
                              <Col lg={3}>
                                <p> Bank country</p>
                                <h6>{e.country}</h6>
                              </Col>
                              <Col lg={3}>
                                <p>Bank address</p>
                                <h6>{e.bankAddress}</h6>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </>
            )}

            {selectedValue02 == "UPI" && (
              <>
                {upiDetail?.result?.length > 0 &&
                  upiDetail.result.map((item: any, index: number) => {
                    return (
                      <div
                        className={`mb-4 ${styles.asset_box} ${styles.bankdetails_box}`}
                        key={index}
                      >
                        <div className="w-100">
                          <div className="d-flex align-items-md-center justify-content-between  flex-md-row flex-column mb-3">
                            <h4 className={`mb-md-0 mb-3`}>
                              {" "}
                              #{index + 1} UPI Details{" "}
                            </h4>
                            <div className={`${styles.right_btns}`}>
                              {item.isPrimary ? (
                                <button className={styles.green}>
                                  Primary
                                </button>
                              ) : (
                                <button
                                  className={styles.green}
                                  onClick={() => handlePrimaryUPI(item)}
                                >
                                  Set Primary
                                </button>
                              )}
                              <button
                                className={`mx-sm-2 ${styles.grey}`}
                                onClick={() =>
                                  router.push(
                                    `/add-payment-method?id=${item._id}&type=upi`
                                  )
                                }
                              >
                                {" "}
                                Edit
                              </button>
                              <button
                                className={styles.red}
                                onClick={() => handleDeleteUPI(item)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <div className={styles.bankdetails}>
                            <Row>
                              <Col lg={3}>
                                <p>UPI ID</p>
                                <h6>{item.upiId}</h6>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </>
            )}

            {selectedValue02 == "Gpay" && (
              <>
                {qrDetails?.result?.length > 0 &&
                  qrDetails.result.map((item: any, index: number) => {
                    let imagepath =
                      config.USER_API + "/images/qr/" + item.frontImage;
                    return (
                      <div
                        className={`mb-4 ${styles.asset_box} ${styles.bankdetails_box}`}
                        key={index}
                      >
                        <div className="w-100">
                          <div className="d-flex align-items-md-center justify-content-between  flex-md-row flex-column mb-3">
                            <h4 className={`mb-md-0 mb-3`}>
                              #{index + 1} Gpay Account{" "}
                            </h4>
                            <div className={`${styles.right_btns}`}>
                              {item.isPrimary ? (
                                <button className={styles.green}>
                                  Primary
                                </button>
                              ) : (
                                <button
                                  className={styles.green}
                                  onClick={() => handlePrimaryGPAY(item)}
                                >
                                  Set Primary
                                </button>
                              )}
                              <button
                                className={`mx-sm-2 ${styles.grey}`}
                                onClick={() =>
                                  router.push(
                                    `/add-payment-method?id=${item._id}&type=qr`
                                  )
                                }
                              >
                                {" "}
                                Edit
                              </button>
                              <button
                                className={styles.red}
                                onClick={() => handleDeleteGPAY(item)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <div className={styles.bankdetails}>
                            <Row>
                              <Col lg={3}>
                                <p>Gpay ID</p>
                                <div className={styles.img_box}>
                                  <Image
                                    src={imagepath}
                                    alt="icon"
                                    className="img-fluid"
                                    width={120}
                                    height={120}
                                  />
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </>
            )}
          </div>
        </Container>
      </div>

      <Footer />
    </>
  );
}
