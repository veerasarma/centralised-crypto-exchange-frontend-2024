import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import styles from "@/styles/common.module.css";
import { Container, Row, Col, Form, Dropdown } from "react-bootstrap";
import CountryList from "./CountrySelect";
//import types
import { FormValue } from "./types";
//import lib
import { toastAlert } from "@/lib/toastAlert";
import isEmpty from "@/lib/isEmpty";
import { removeByObj } from "@/lib/validation";
//import store
import { useSelector, useDispatch } from "../../store";
//improt service
import { apiUplaodIdprrof } from "../../services/User/UserServices";
import { getUserDetails } from "../../store/auth/userSlice";
//import component
import Popup from "./Popup";
import { useTheme } from "next-themes";
let initialFormValue: FormValue = {
  id: "",
  frontImg: "",
  backImg: "",
  selfieImg: "",
};
let imageType: string[] = [
  "jpg",
  "JPG",
  "jpeg",
  "JPEG",
  "png",
  "PNG",
  "pdf",
  "PDF",
];

export default function KycForm() {
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch();
  const [formValue, setFormValue] = useState<FormValue>(initialFormValue);
  const { idProof } = useSelector((state: any) => state.auth.user);
  const [country, setCountry] = useState<any>("");
  const [error, setError] = useState<any>({});
  const [show, setShow] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);
  const [loader, setLoader] = useState(false);
  let { id, frontImg, backImg, selfieImg } = formValue;

  const handleFile = (e: any) => {
    let { name } = e.target;
    if (!imageType.includes(e.target.files[0].type.split("/")[1])) {
      return toastAlert("error", "Invalid image", "kyc");
    }
    setFormValue({ ...formValue, ...{ [name]: e.target.files[0] } });
    setError({});
    setLoader(false);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoader(true);
      const formData = new FormData();
      formData.append("type", id);
      formData.append("country", country.value);
      formData.append("frontImage", frontImg);
      formData.append("backImage", backImg);
      formData.append("selfiImage", selfieImg);

      const result = await apiUplaodIdprrof(formData);

      if (result.data.success) {
        setFormValue(initialFormValue);
        dispatch(getUserDetails());
      } else {
        toastAlert("error", result.data.message, "kyc");
      }
      setLoader(false);
    } catch (err: any) {
      setLoader(false);
      if (err?.response?.data?.errors) {
        setError(err.response.data.errors);
      }
    }
  };

  const handleIDs = (e: any) => {
    setFormValue({ ...formValue, ...{ id: e } });
  };

  useEffect(() => {
    if (idProof == "pending" || idProof == "approved") {
      setShow(true);
    }
    setIsClient(true);
  }, [idProof]);
  return (
    <>
      <div className={`mb-5 ${styles.inner_head_box}`}>
        <Container>
          <Row>
            <Col lg={4} className="text-center mx-auto">
              <h5 className={`${styles.inner_head_title}`}>KYC</h5>
              <p className={`${styles.inner_subtitle}`}>
                KYC (Know Your Customer) is a mandatory process for verifying
                the identity of your customers.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        {(idProof == "pending" || idProof == "approved") && isClient ? (
          <Popup show={show} setShow={setShow} status={idProof} />
        ) : (
          isClient && (
            <Row>
              <Col lg={9} className="mx-auto">
                <div className={`mb-5 ${styles.box}`}>
                  <Row>
                    <Col lg={6}>
                      <div className={`mb-4 ${styles.input_box}`}>
                        <Form.Label className={styles.labl}>
                          Select Country
                        </Form.Label>
                        <CountryList
                          setCountry={setCountry}
                          country={country}
                        />
                      </div>
                      <div className={`mb-4 ${styles.input_box}`}>
                        <Form.Label className={styles.labl}>
                          Choose your document type{" "}
                        </Form.Label>
                        <Dropdown className={`${styles.drp_down} mb-4 mb-lg-0`}>
                          <Dropdown.Toggle variant="primary">
                            {!isEmpty(id) ? id : "Select Type"}
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() => handleIDs("Driving License")}
                            >
                              Driving License
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleIDs("ID Card")}>
                              ID Card
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => handleIDs("Residence Permit")}
                            >
                              Residence Permit
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => handleIDs("Passport")}
                            >
                              Passport
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    </Col>
                    <Col lg={6}>
                      <p>Take a photo of your document. The photo should be:</p>
                      <ul>
                        <li>Bright and clear.</li>
                        <li>All corners of the document should be visible.</li>
                      </ul>
                      <Row className="mb-4">
                        <Col md={6} className="mb-3">
                          {theme === "light_theme" ? (
                            <Image
                              src="/assets/images/kyc_img1_light.png"
                              className="img-fluid"
                              alt="img"
                              width={200}
                              height={105}
                            />
                          ) : (
                            <Image
                              src="/assets/images/kyc_img1.png"
                              className="img-fluid"
                              alt="img"
                              width={200}
                              height={105}
                            />
                          )}
                        </Col>
                        <Col md={6}>
                          {theme === "light_theme" ? (
                            <Image
                              src="/assets/images/kyc_img2_light.png"
                              className="img-fluid"
                              alt="img"
                              width={200}
                              height={105}
                            />
                          ) : (
                            <Image
                              src="/assets/images/kyc_img2.png"
                              className="img-fluid"
                              alt="img"
                              width={200}
                              height={105}
                            />
                          )}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={6} className="d-flex">
                      <Row>
                        <Col lg={12} className="d-flex">
                          <div className={styles.file_box}>
                            <Form.Group controlId="formFile">
                              <Form.Label>
                                {frontImg && (
                                  <Image
                                    src={URL.createObjectURL(
                                      new Blob([frontImg], {
                                        type: "image/png",
                                      })
                                    )}
                                    className="img-fluid kycimg"
                                    alt="img"
                                    width={160}
                                    height={124}
                                  />
                                )}

                                <p>Upload Front Page</p>
                                <span>
                                  (Note: .jpg/.png/.pdf/.jpeg min 20kb max 1mb)
                                </span>
                              </Form.Label>

                              <Form.Control
                                type="file"
                                name="frontImg"
                                onChange={handleFile}
                              />
                            </Form.Group>
                            <p className="text-danger">{error?.frontImage}</p>
                          </div>
                        </Col>
                        <Col lg={12} className="d-flex">
                          <div className={styles.file_box}>
                            <Form.Group controlId="formFile">
                              <Form.Label>
                                {backImg && (
                                  <Image
                                    src={URL.createObjectURL(
                                      new Blob([backImg], {
                                        type: "image/png",
                                      })
                                    )}
                                    className="img-fluid kycimg"
                                    alt="img"
                                    width={160}
                                    height={124}
                                  />
                                )}

                                <p> Upload Back Page </p>
                                <span>
                                  (Note: .jpg/.png/.pdf/.jpeg min 20kb max 1mb)
                                </span>
                              </Form.Label>
                              <Form.Control
                                type="file"
                                name="backImg"
                                onChange={handleFile}
                              />
                            </Form.Group>
                            <p className="text-danger">{error?.backImage}</p>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={6} className="d-flex">
                      <div
                        className={`${styles.file_box} ${styles.file_box_selfie}`}
                      >
                        <Form.Group controlId="formFile" className="h-100">
                          <Form.Label>
                            {selfieImg && (
                              <Image
                                src={URL.createObjectURL(
                                  new Blob([selfieImg], { type: "image/png" })
                                )}
                                className="img-fluid kycimg"
                                alt="img"
                                width={160}
                                height={124}
                              />
                            )}
                            <p>Upload a Selfie</p>
                            <span>
                              (Note: .jpg/.png/.pdf/.jpeg min 20kb max 1mb)
                            </span>
                          </Form.Label>
                          <Form.Control
                            type="file"
                            name="selfieImg"
                            onChange={handleFile}
                          />
                        </Form.Group>
                        <p className="text-danger">{error?.selfiImage}</p>
                      </div>
                    </Col>
                  </Row>

                  <ul className="mt-4">
                    <li>Natural expression.</li>
                    <li>Please do not use hats, masks, etc.</li>
                    <li>
                      Make sure your whole face is visible, centered, and your
                      eyes are open.
                    </li>
                    <li>Take picture in a well-lit area.</li>
                    <li>File size greater than 20 kb to less than 1mb</li>
                  </ul>
                  {isClient && (idProof == "new" || idProof == "rejected") && (
                    <button
                      className={`mx-auto d-block mt-5 ${styles.primary_btn}`}
                      onClick={handleSubmit}
                      disabled={loader}
                    >
                      <span></span>
                      <label>
                        {loader ? (
                          <i className="fa fa-spinner fa-spin"></i>
                        ) : (
                          "Submit"
                        )}
                      </label>
                    </button>
                  )}
                </div>
              </Col>
            </Row>
          )
        )}
      </Container>
    </>
  );
}
