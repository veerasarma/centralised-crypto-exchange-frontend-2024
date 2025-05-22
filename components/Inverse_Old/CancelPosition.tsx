import { useState, useEffect, useContext } from "react";
import styles from "@/styles/common.module.css";
//import component
import CancelMOdal from "./CloseModal";
//import lib
import { encryptObject } from "../../lib/cryptoJS";
import { toastAlert } from "../../lib/toastAlert";
// import service
import { apiOrderPlace } from "../../services/inverse/InverseService";

export default function CancelBtn({ orderInfo }: any) {
  const [show, setShow] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);

  const handleSumbit = async () => {
    try {
      setShow(false);
      setLoader(true);
      let hash = encryptObject({
        quantity: orderInfo.quantity,
        buyorsell: orderInfo.side == "buy" ? "sell" : "buy",
        orderType: "market",
        pairId: orderInfo.pairId,
        leverage: orderInfo.leverage,
        action: "close",
        positionId: orderInfo._id,
      });
      let data = {
        token: hash,
      };
      let { status, message } = await apiOrderPlace(data);
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
        type={"pos"}
      />
      <button
        className={`mb-4 ${styles.primary_btn1}`}
        onClick={() => setShow(true)}
      >
        {loader ? <i className="fa fa-spinner fa-spin"></i> : "Close All"}
      </button>
    </>
  );
}
