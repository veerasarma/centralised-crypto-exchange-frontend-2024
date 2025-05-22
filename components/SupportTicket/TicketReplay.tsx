import Image from "next/image";
import styles from "@/styles/common.module.css";
import { useState } from "react";
import { Form } from "react-bootstrap";
//import store
import { useSelector } from "../../store";
//import lib
import { toastAlert } from "@/lib/toastAlert";
import isEmpty from "@/lib/isEmpty";
import { momentFormat } from "@/lib/dateTimeHelper";
//improt types
import { TicketFormValue } from "./types";
//import service
import { apiReplyUpdate } from "../../services/User/UserServices";
//import config
import config from "../../config";
import { removeByObj } from "@/lib/validation";

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
export default function TicketReplay({ tikData, chatList, fetchData }: any) {
  const { _id } = useSelector((state: any) => state.auth.user);
  const [formValue, setFormValue] = useState<TicketFormValue>(initialFormValue);
  const [loader, setLoader] = useState<boolean>(false);
  const [imgName, setImgName] = useState<string>("");
  const [error, setError] = useState<any>({});
  const { message, image } = formValue;

  const handleFile = (e: any) => {
    let { name } = e.target;
    if (!imageType.includes(e.target.files[0].type.split("/")[1])) {
      e.target.value = ""
      return toastAlert("error", "Invalid format", "kyc");
    }
    setImgName(e.target.files[0].name);
    setLoader(false);
    setFormValue({ ...formValue, ...{ [name]: e.target.files[0] } });
    setError(removeByObj(error, name));
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    setFormValue({ ...formValue, ...{ [name]: value } });
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (image == "" && isEmpty(message)) {
        return toastAlert("error", "Message is required", "ticketRly");
      }
      setLoader(true);
      const formData = new FormData();
      formData.append("receiverId", tikData.adminId);
      formData.append("ticketId", tikData._id);
      formData.append("message", message);
      formData.append("image", image);

      const result = await apiReplyUpdate(formData);
      setLoader(false);
      if (result.data.success) {
        setImgName("");
        setFormValue(initialFormValue);
        toastAlert("success", result.data.message, "login");
        fetchData();
      } else {
        setLoader(false);
        toastAlert("error", result.data.message, "login");
      }
    } catch (err: any) {
      setLoader(false);
      if (err?.response?.data?.errors) {
        setError(err?.response?.data?.errors);
      }
      if (err?.response?.data.message) {
        toastAlert("error", err.response.data.message, "login");
      }
    }
  };

  return (
    <>
      <div className={styles.ctn}>
        <Image
          src="/assets/images/user_icon.png"
          className={`img-fluid ${styles.usr}`}
          alt="img"
          width={36}
          height={36}
        />
        <div>
          <span className={`mb-3 d-block ${styles.grey} `}>
            {momentFormat(tikData.createdAt)}
          </span>

          <div className={styles.chat_container}>
            {chatList?.length > 0 &&
              chatList.map((item: any, index: number) => {
                // console.log(item, "-----100");
                return (
                  <div className={styles.chat_messages} key={index}>
                    <>
                      {item.senderId == _id ? (
                        <div className={`${styles.admin} ${styles.message}`}>
                          {item?.message && (
                            <>
                              <div className={styles.message_text}>
                                {item.message}
                              </div>{" "}
                              <label className={styles.message_time}>
                                {momentFormat(item.createdAt)}
                              </label>
                            </>
                          )}
                          {item.image && (
                            <div className={styles.ticket_attachment}>
                              <a
                                className={styles.attachment_tag}
                                href={
                                  config.USER_API + "/support/" + item.image
                                }
                                target="_blank"
                              >
                                <i className="bi bi-paperclip"></i>
                                <span>Attachment</span>
                              </a>
                              {isEmpty(item.message) && (
                                <div className={styles.message_time}>
                                  {momentFormat(item.createdAt)}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className={styles.message}>
                          <p>Support Team</p>
                          <div className={styles.message_text}>
                            {item.message}
                          </div>
                          <div className={styles.message_time}>
                            {momentFormat(item.createdAt)}
                          </div>
                          {item.image && (
                            <div>
                              <a
                                className={styles.attachment_tag}
                                href={
                                  config.USER_API + "/support/" + item.image
                                }
                                target="_blank"
                              >
                                <i className="bi bi-paperclip"></i>
                                <span>Attachment</span>
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  </div>
                );
              })}
            {tikData.status == "open" && (
              <>
                <div className={styles.chat_input}>
                  <div className={`${styles.file_box} `}>
                    <Form.Group 
                    // controlId="formFile"
                    >
                      <Form.Control
                        type="file"
                        name="image"
                        onChange={handleFile}
                      />

                      <Form.Label className="bg-transparent">
                        <Image
                          src="/assets/images/file_icon.png"
                          className={`img-fluid ${styles.mrgin} `}
                          alt="img"
                          width={17}
                          height={15}
                        />
                      </Form.Label>
                    </Form.Group>
                  </div>
                  <div className={`w-100 me-2  ${styles.input_box}`}>
                    <Form.Control
                      type="text"
                      name="message"
                      onChange={handleChange}
                      value={message}
                    />
                  </div>
                  <button
                    className={styles.primary_btn}
                    onClick={handleSubmit}
                    disabled={loader}
                  >
                    {loader ? (
                      <i className="fa fa-spinner fa-spin"></i>
                    ) : (
                      <i
                        className="fa-solid fa-arrow-up"
                        aria-hidden="true"
                      ></i>
                    )}
                  </button>
                </div>
                {!isEmpty(error) && <p className="text-danger">{error?.image}</p>}
                <span className={styles.grey}>
                  (Note: .jpg/.png/.pdf/.jpeg max 1MB)
                </span>
                {!isEmpty(imgName) && (
                  <>
                    <br />
                    <Form.Label className="bg-transparent">
                      <span>
                        Attachments -{" "}
                        <span className={styles.ylw}>{imgName} </span>
                      </span>
                    </Form.Label>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
