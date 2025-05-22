import { useState } from "react";
import styles from "@/styles/common.module.css";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { FloatingLabel, Form } from "react-bootstrap";
//improt types
import { CatDropType, TicketFormValue } from "./types";
//improt lib
import isEmpty from "@/lib/isEmpty";
import { removeByObj } from "@/lib/validation";
import { toastAlert } from "@/lib/toastAlert";
//import service
import { apiCreateTicket } from "../../services/User/UserServices";

let initialFormValue: TicketFormValue = {
  message: "",
  image: "",
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
export default function CreateTicket({ categoryList, fetchRef }: any) {
  const [category, setCategory] = useState<CatDropType>({});
  const [error, setError] = useState<any>({});
  const [imgName, setImgName] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  const [formValue, setFormValue] = useState<TicketFormValue>(initialFormValue);
  const { image, message } = formValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    setFormValue({ ...formValue, ...{ [name]: value } });
    setError(removeByObj(error, name));
    setLoader(false);
  };

  const handleFile = (e: any) => {
    let { name } = e.target;
    console.log('e.target: ', e.target.files[0]);
    if (!imageType.includes(e.target.files[0].type.split("/")[1])) {
      e.target.value = ""
      return toastAlert("error", "Invalid format", "kyc");
    }
    setImgName(e.target.files[0].name);
    setFormValue({ ...formValue, ...{ [name]: e.target.files[0] } });
    setError(removeByObj(error, name));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoader(true);
      const formData = new FormData();
      formData.append("categoryId", category._id);
      formData.append("message", message);
      formData.append("image", image);
      const result = await apiCreateTicket(formData);
      console.log(result, "-----result");
      setLoader(false);
      if (result.data.success) {
        fetchRef.current.show();
        toastAlert("success", result.data.message, "support");
        setError({});
        setCategory({});
        setFormValue(initialFormValue);
        setImgName("");
      } else {
        setLoader(false);
        toastAlert("error", result.data.message, "support");
      }
    } catch (err: any) {
      console.log(err?.response?.data?.errors, "err");
      setLoader(false);
      if (err?.response?.data?.errors) {
        setError(err?.response?.data?.errors);
      }
      if (err?.response?.data?.message) {
        toastAlert("error", err.response.data.message, "support");
      }
    }
  };

  return (
    <div className={styles.box}>
      <h5 className={styles.ylw}>Create Support Ticket</h5>
      <div className={`mb-3 ${styles.input_box} `}>
        <DropdownButton
          id="dropdown-basic-button"
          className={`mb-3 ${styles.drp_down}`}
          title={
            !isEmpty(category?.categoryName)
              ? category?.categoryName
              : "Subject"
          }
          onSelect={(eventKey: any) => {}}
        >
          {categoryList?.length > 0 &&
            categoryList.map((item: CatDropType, index: number) => {
              return (
                <Dropdown.Item
                  eventKey={index}
                  onClick={() => setCategory(item)}
                >
                  {item.categoryName}
                </Dropdown.Item>
              );
            })}
        </DropdownButton>
        <p className="text-danger">{error?.categoryId}</p>
      </div>
      <div className={`mb-3 ${styles.text_area} `}>
        <Form.Control
          as="textarea"
          placeholder="Leave a message here"
          name="message"
          onChange={handleChange}
          value={message}
        />
        <p className="text-danger">{error?.message}</p>
      </div>
      <span className={styles.grey}>
        Please provide any details that can help us understand your issue and
        our customer service staff will get back to you as soon as possible. An
        email with possible solutions will be sent to your email address.
      </span>
      <br />
      
      <div className={`my-3 ${styles.file_box} `}>
        <Form.Group
          //  controlId="formFile"
          className="mb-3"
        >
          <Form.Label className="bg-transparent">
            <span>
              Attachment (<span className={styles.ylw}>Add file</span> or Drop
              files here)
            </span>
          </Form.Label>
          <Form.Control type="file" name="image" onChange={handleFile} />
          {!isEmpty(error) && <p className="text-danger">{error?.image}</p>}
        </Form.Group>
      </div>
      <span className={styles.grey}>(Note: .jpg/.png/.pdf/.jpeg max 1MB)</span>
      {!isEmpty(imgName) && (
        <Form.Label className="bg-transparent">
          <span>
            Attachment - <span className={styles.ylw}>{imgName} </span>
          </span>
        </Form.Label>
      )}
      <div className="text-center mt-4">
        <button
          className={`${styles.primary_btn}`}
          onClick={handleSubmit}
          disabled={loader}
        >
          <span></span>
          <label>
            {loader ? <i className="fa fa-spinner fa-spin"></i> : "Submit"}
          </label>
        </button>
      </div>
    </div>
  );
}
