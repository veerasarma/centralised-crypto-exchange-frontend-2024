import { useState, useEffect, useContext } from "react";
import styles from "@/styles/common.module.css";
//import component
import CancelMOdal from "./CloseModal";
//import lib
import { encryptObject } from "../../lib/cryptoJS";
import { toastAlert } from "../../lib/toastAlert";
// import service
import { cancelOrder } from "../../services/inverse/InverseService";

export default function CancelBtn({ orderInfo, type }: any) {
  const [show, setShow] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);

  const handleSumbit = async () => {
    try {
      setShow(false);
      setLoader(true);
      let data = {
        tableId: `${orderInfo.buyorsell}OpenInverseOrders_` + orderInfo.pairId,
        orderId: orderInfo._id,
        pairId: orderInfo.pairId,
        buyorsell: orderInfo.buyorsell,
      };
      let hash = encryptObject(data);
      let { status, message } = await cancelOrder(hash);
      setLoader(false);
      if (status == "success") {
        toastAlert("success", message, "cancelOrder");
      } else {
        toastAlert("error", message, "cancelOrder");
      }
    } catch (err) {}
  };

  return (
    <>
      <CancelMOdal
        show={show}
        setShow={setShow}
        handleSumbit={handleSumbit}
        type={type}
      />
      <button
        className={`mb-4 ${styles.primary_btn1}`}
        onClick={() => setShow(true)}
      >
        {loader ? <i className="fa fa-spinner fa-spin"></i> : "Cancel"}
      </button>
    </>
  );
}
