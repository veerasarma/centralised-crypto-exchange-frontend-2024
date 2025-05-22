import { useState, useEffect } from "react";
import styles from "@/styles/common.module.css";
import { Form, Row, Col } from "react-bootstrap";
import { useRouter } from "next/router";
// import lib
import { toastAlert } from "@/lib/toastAlert";
import isEmpty from "@/lib/isEmpty";
//improt service
import { updateUPIDetail, apiBankDetil } from "@/services/User/UserServices";
// import store
import { useDispatch } from "@/store";
import { getUserDetails } from "@/store/auth/userSlice";
import { getBankDetails } from "@/store/PaymentMethods/bankSlice";
type MyFormValues = {
  upiId: string;
  isPrimary: string;
};

const initialFormValue = {
  upiId: "",
  isPrimary: "",
};

export default function AddUpi({ query, type }: any) {
  const dispatch = useDispatch();
  const router = useRouter();
  // state
  const [formValue, setFormValue] = useState(initialFormValue);
  let { upiId, isPrimary } = formValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value, name } = e.target;
    setFormValue({ ...formValue, ...{ [name]: value } });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      let reqData = {
        id: query && query.id,
        upiId: upiId,
        isPrimary: isPrimary,
      };
      let regex = /^[\w.-]+@[\w.-]+$/;
      if (isEmpty(upiId)) {
        return toastAlert("error", "UPI id field is required", "upi");
      }
      if (!regex.test(upiId)) {
        return toastAlert("error", "Invalid UPI id", "upi");
      }
      const respData = await updateUPIDetail(reqData);
      const { success, message } = respData.data;
      if (success) {
        dispatch(getUserDetails());
        dispatch(getBankDetails());
        toastAlert("success", message, "bankdetail");
        router.push("/payment-method");
      }
    } catch (err: any) {
      if (err.response.data.message)
        toastAlert("error", err.response.data.message, "upi");
    }
  };
  const findById = async () => {
    let resp = await apiBankDetil();
    if (resp.data.success) {
      let findDoc = resp?.data?.result?.upiDetails.find((item: any) => {
        return item._id == query.id;
      });
      if (!isEmpty(findDoc)) {
        let formData = {
          upiId: findDoc.upiId,
          isPrimary: findDoc.isPrimary,
        };
        setFormValue(formData);
      } else {
        router.push("/payment-method");
      }
    }
  };
  useEffect(() => {
    if (!isEmpty(query) && type == "upi") {
      findById();
    }
  }, [query]);
  return (
    <Row>
      <Col lg={4}>
        <div className={`mb-4 ${styles.input_box}`}>
          <Form.Label className="mb-1"> UPI ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter UPI ID"
            className="p-2"
            name="upiId"
            value={upiId}
            onChange={handleChange}
          />
        </div>
      </Col>
      <Col lg={12}>
        <div className="d-flex gap-3 mt-4">
          <button
            className={`${styles.primary_btn}`}
            onClick={() => router.push("/payment-method")}
          >
            <span></span>
            <label>Cancel</label>
          </button>
          <button
            className={`${styles.primary_btn} ${styles.dark}`}
            onClick={handleSubmit}
          >
            <span></span>
            <label>Confirm</label>
          </button>
        </div>
      </Col>
    </Row>
  );
}
