import React, { useEffect, useState } from "react";
import styles from "@/styles/common.module.css";
import { Form, Row, Col, Modal } from "react-bootstrap";
import spot from "@/styles/Spot.module.css";
import { useSelector } from "react-redux";
//import action
import { changeOrder } from "../../services/perpetual/PerpetualService";
//import lib
import isEmpty from "@/lib/isEmpty";
import { toastAlert } from "@/lib/toastAlert";
import { encryptObject } from "@/lib/cryptoJS";
type tpPriceType = number | string;
type Props = {
  tpEditShow: boolean;
  tpEditClose: Function;
  side: string;
  tpPrice: number;
  _id: string;
  pairId?: string;
  type: string;
};

export default function TpEditPrice({
  tpEditShow,
  tpEditClose,
  tpPrice,
  side,
  _id,
  type,
  pairId,
}: Props) {
  const [takeProfit, setTakeProfit] = useState<tpPriceType>("");
  const { marketData, tradePair } = useSelector(
    (state: any) => state.perpetual
  );
  const handleClick = async () => {
    try {
      let data = {
        side,
        takeProfit: takeProfit,
        type: type,
        orderId: _id,
        markPrice: marketData.markPrice,
        positionId: _id,
        pairId,
        tp: true,
      };

      if (!isEmpty(takeProfit) && takeProfit <= 0) {
        toastAlert(
          "error",
          "Take Profit must be greater than current price",
          "marketOrder_tp"
        );
        return;
      }
      if (side == "buy") {
        if (
          !isEmpty(takeProfit) &&
          takeProfit > 0 &&
          takeProfit < marketData?.markPrice
        ) {
          toastAlert(
            "error",
            "Take Profit must be greater than current price",
            "marketOrder_tp"
          );
          return;
        }
      } else {
        if (
          !isEmpty(takeProfit) &&
          takeProfit > 0 &&
          takeProfit > marketData?.markPrice
        ) {
          toastAlert(
            "error",
            "Take Profit should be lower than current price",
            "marketOrder_tp"
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
        tpEditClose();
      } else {
        toastAlert("error", message, "Stop Loss Price");
      }
    } catch (err) {
      console.log("error:", err);
    }
  };
  const handleClose = () => {
    setTakeProfit("");
    tpEditClose();
  };
  useEffect(() => {
    setTakeProfit(tpPrice);
  }, [tpPrice, tpEditShow]);
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
    setTakeProfit(value);
  };
  return (
    <Modal
      show={tpEditShow}
      onHide={() => handleClose()}
      centered
      className="primary_modal profit-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Take Profit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Modal.Body>
          <div className={`${spot.form_box}`}>
            <div className="row">
              <div className={`mb-3 ${styles.input_box}`}>
                <Form.Control
                  placeholder="Take Profit"
                  className="p-2"
                  name="upiId"
                  value={takeProfit}
                  type="text"
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
