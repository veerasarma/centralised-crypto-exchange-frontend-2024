import React, { useEffect, useState } from "react";
import styles from "@/styles/common.module.css";
import { Form, Row, Col, Modal } from "react-bootstrap";
import spot from "@/styles/Spot.module.css";
import { useSelector } from "react-redux";
//import action
import { changeOrder } from "../../services/inverse/InverseService";
//import lib
import { toastAlert } from "@/lib/toastAlert";
import isEmpty from "@/lib/isEmpty";
import { encryptObject } from "@/lib/cryptoJS";
type Props = {
  slEditShow: boolean;
  slEditClose: Function;
  side: string;
  slPrice: number;
  _id: string;
  pairId?: string;
  type: string;
};
type StopLossType = number | string;

export default function TpEditPrice({
  slPrice,
  slEditShow,
  slEditClose,
  side,
  _id,
  type,
  pairId,
}: Props) {
  let [stopLoss, setStopLoss] = useState<StopLossType>("");
  const { tradePair, pairList } = useSelector(
    (state: any) => state.inverse
  );
  const handleClick = async () => {
    try {
      console.log(pairId, '-----38')
      let mData = pairList.find((el: any) => el._id.toString() == pairId?.toString())
      let data = {
        side,
        stopLoss,
        type: type,
        orderId: _id,
        markPrice: mData.markPrice,
        positionId: _id,
        pairId,
        tradePairId: tradePair._id,
        sl: true,
      };
      if (!isEmpty(stopLoss) && stopLoss <= 0) {
        toastAlert(
          "error",
          "Stop loss must be greater than 0",
          "marketOrder_tp"
        );
        return;
      }
      if (side == "buy") {
        if (!isEmpty(stopLoss) && stopLoss > mData?.markPrice) {
          toastAlert(
            "error",
            "Stop loss price should be lower than current price",
            "marketOrder_tp"
          );
          return;
        }
      } else {
        if (!isEmpty(stopLoss) && stopLoss < mData?.markPrice) {
          toastAlert(
            "error",
            "Stop loss price should be greater than current price",
            "marketOrder_sl"
          );
          return;
        }
      }
      let encryptToken = {
        token: encryptObject(data),
      };
      const { status, message } = await changeOrder(encryptToken);
      if (status == "success") {
        toastAlert("success", message, "Stop Loss Price");
        slEditClose();
      } else {
        toastAlert("error", message, "Stop Loss Price");
      }
    } catch (err) {
      console.log("error:", err);
    }
  };
  const handleClose = () => {
    slEditClose("");
    setStopLoss("");
  };
  useEffect(() => {
    setStopLoss(slPrice);
  }, [slPrice, slEditShow]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (
      (!isEmpty(value) && !/^\d*\.?\d*$/.test(value)) ||
      (isEmpty(value.split(".")[0]) && value.indexOf(".") != -1) ||
      (value.split(".")[1] &&
        value.split(".")[1].length > tradePair.quoteFloatDigit)
    ) {
      return;
    }
    setStopLoss(value);
  };
  return (
    <Modal
      show={slEditShow}
      onHide={() => handleClose()}
      centered
      className="primary_modal profit-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Stop Loss</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Modal.Body>
          <div className={`${spot.form_box}`}>
            <div className="row">
              <div className={`mb-3 ${styles.input_box}`}>
                <Form.Control
                  placeholder="Stop Loss"
                  className="p-2"
                  value={stopLoss}
                  type="number"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(e)
                  }
                />
              </div>
            </div>
            &nbsp;
            <div className="row">
              <div className="col-md-6">
                <button
                  className={spot.order_sell_btn}
                  onClick={() => handleClose()}
                >
                  Cancel
                </button>
              </div>
              <div className="col-md-6">
                <button
                  className={spot.order_buy_btn}
                  onClick={() => handleClick()}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal.Body>
    </Modal>
  );
}
