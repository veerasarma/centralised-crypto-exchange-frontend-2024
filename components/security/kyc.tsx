import React, { useMemo, useState } from "react";
import styles from "@/styles/common.module.css";
import SumsubWebSdk from "@sumsub/websdk-react";
import { Modal } from "react-bootstrap";
//action
import { getAccessToken } from "../../services/User/UserServices";

export default function ChangePassword({ kyc_modal, setkyc_modal }: any) {
  const [accessToken, setaccessToken] = useState<string>("");
  const getToken = async () => {
    try {
      const response = await getAccessToken({});
      if (response?.data?.status) {
        setaccessToken(response?.data?.result?.token?.token);
      }
    } catch (err) {}
  };
  const handleClose = () => {
    setkyc_modal(false);
  };

  useMemo(() => {
    getToken();
  }, []);
  console.log("-------25");
  return (
    <>
      <Modal
        show={kyc_modal}
        onHide={handleClose}
        centered
        className={styles.custom_modal}
        backdrop="static"
      >
        <Modal.Header closeButton className={styles.modal_head}>
          <Modal.Title>KYC Verification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {accessToken ? (
            <SumsubWebSdk
              accessToken={accessToken}
              expirationHandler={() => {
                Promise.resolve(accessToken);
                handleClose();
                getToken();
              }}
              config={{
                lang: "en",
                email: "",
                phone: "",
              }}
              options={{ addViewportTag: false, adaptIframeHeight: true }}
              onMessage={(type, payload) => {
                console.log(payload, "payload 12321313");
                if (
                  payload &&
                  payload.levelName == "basic-kyc-level" &&
                  payload.reviewResult
                ) {
                  if (payload.reviewResult.reviewAnswer == "GREEN") {
                    setTimeout(function () {
                      handleClose();
                    }, 3000);
                  }
                } else if (
                  payload &&
                  payload.levelName != "basic-kyc-level" &&
                  payload.reviewResult
                ) {
                  if (payload.reviewResult.reviewAnswer == "GREEN") {
                    setTimeout(function () {
                      handleClose();
                    }, 3000);
                  } else if (
                    payload.reviewResult.reviewAnswer == "RED" ||
                    payload.reviewResult.reviewRejectType == "FINAL"
                  ) {
                    setTimeout(function () {
                      handleClose();
                    }, 3000);
                  }
                }

                console.log("onMessage", type, payload);
              }}
              onError={(data) => console.log("onError", data)}
            />
          ) : (
            <center>
              <h3>Checking on it ,Please Wait ...</h3>
            </center>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}
