import { useEffect, useState } from "react";
import styles from "@/styles/common.module.css";
import { Form, Row, Col } from "react-bootstrap";
import Image from "next/image";
import { useRouter } from "next/router";
// import lib
import { toastAlert } from "@/lib/toastAlert";
import isEmpty from "@/lib/isEmpty";
//improt service
import { updateQRDetail, apiBankDetil } from "@/services/User/UserServices";
//import config
import config from "../../config";
// import store
import { useDispatch } from "@/store";
import { getUserDetails } from "@/store/auth/userSlice";
import { getBankDetails } from "@/store/PaymentMethods/bankSlice";
interface FormValue {
  frontImage: any;
  isPrimary: string;
}

let initialFormValue = {
  frontImage: "",
  isPrimary: "",
};
let imageType: string[] = ["jpg", "JPG", "jpeg", "JPEG", "png", "PNG"];

export default function AddQr({ query, type }: any) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [formValue, setFormValue] = useState<FormValue>(initialFormValue);
  const [imageChoosen, setImageChoosen] = useState<boolean>(false);
  let { frontImage, isPrimary } = formValue;

  const handleFile = (e: any) => {
    let { name } = e.target;
    if (!imageType.includes(e.target.files[0].type.split("/")[1])) {
      return toastAlert("error", "Invalid image", "qr");
    }
    setImageChoosen(true);
    setFormValue({ ...formValue, ...{ [name]: e.target.files[0] } });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("qrImage", frontImage);
      formData.append("isPrimary", isPrimary);
      formData.append("id", query && query.id);
      if (isEmpty(frontImage.name)) {
        return toastAlert("error", "Image field is required", "qr");
      }
      const respData = await updateQRDetail(formData);
      const { success, message } = respData.data;
      if (success) {
        dispatch(getUserDetails());
        dispatch(getBankDetails());
        toastAlert("success", message, "bankdetail");
        router.push("/payment-method");
      }
    } catch (err: any) {
      if (err?.response?.data?.message) {
        toastAlert("error", err.response.data.message, "upiForm");
      }
    }
  };
  const findById = async () => {
    let resp = await apiBankDetil();
    if (resp.data.success) {
      let findDoc = resp?.data?.result?.qrDetails.find((item: any) => {
        return item._id == query.id;
      });
      if (!isEmpty(findDoc)) {
        let data = {
          frontImage: findDoc.frontImage,
          isPrimary: findDoc.isPrimary,
        };
        setFormValue(data);
      } else {
        router.push("/payment-method");
      }
    }
  };
  useEffect(() => {
    if (!isEmpty(query) && type == "qr") {
      findById();
    }
  }, [query]);
  return (
    <Row>
      <Col lg={4}>
        <div className={`mb-4 ${styles.file_box}`}>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label className={styles.fileimg}>
              {imageChoosen ? (
                frontImage ? (
                  <Image
                    src={URL.createObjectURL(
                      new Blob([frontImage], { type: "image/png" })
                    )}
                    className="img-fluid kycimg"
                    alt="img"
                    width={160}
                    height={124}
                  />
                ) : (
                  <>
                    <i className="bi bi-cloud-arrow-up-fill"></i>
                    <p>Upload your QR Scan</p>
                    <span>(Note: .jpg/.png/.jpeg)</span>
                  </>
                )
              ) : (
                <Image
                  className="requiredDoc"
                  alt="User"
                  width={160}
                  height={124}
                  src={config.USER_API + "/images/qr/" + frontImage}
                />
              )}
            </Form.Label>
            <Form.Control type="file" name="frontImage" onChange={handleFile} />
          </Form.Group>
        </div>
      </Col>
      <Col lg={12}>
        <div className="d-flex gap-3">
          <button
            className={`${styles.primary_btn}`}
            onClick={() => router.push("/payment-method")}
          >
            <span></span>
            <label>Cancel</label>
          </button>
          {!isEmpty(frontImage.name) && (
            <button className={`${styles.primary_btn} ${styles.dark}`} onClick={handleSubmit}>
              <span></span>
              <label>Confirm</label>
            </button>
          )}
        </div>
      </Col>
    </Row>
  );
}
