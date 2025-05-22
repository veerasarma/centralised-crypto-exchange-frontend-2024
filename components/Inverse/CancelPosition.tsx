import { useEffect, useState, } from 'react'
import { Button, ButtonGroup, Form, Modal, Row } from 'react-bootstrap';

import styles from '@/styles/common.module.css';
import spot from "@/styles/Spot.module.css";
//import component
import CancelMOdal from './CloseModal'
//import lib
import { encryptObject } from '../../lib/cryptoJS'
import { toastAlert } from '../../lib/toastAlert'
// import service
import { apiOrderPlace } from '../../services/inverse/InverseService'
import { Col } from 'react-bootstrap';
import { closeFormValues } from './types';
import isEmpty from '@/lib/isEmpty';
import { useSelector } from '@/store';
import { toFixed, toFixedDown } from '@/lib/roundOf';


let initVal: closeFormValues = {
  quantity: 0,
  price: 0,
  orderType: 'limit'
};
export default function CancelBtn({ orderInfo }: any) {
  const [mShow, setMShow] = useState<boolean>(false)
  const [lShow, setLShow] = useState<boolean>(false)
  const [loader, setLoader] = useState<boolean>(false)
  const [percent, setPercent] = useState<number>(100)
  const [formValue, setFormValue] =
    useState<closeFormValues>(initVal);
  const { marketData, tradePair } = useSelector(
    (state: any) => state.inverse
  );
  const { price, quantity, orderType } = formValue


  const handleClose = () => {
    setFormValue({ ...formValue, ...{ quantity: orderInfo?.quantity, price: 0 } })
    setMShow(false)
    setLShow(false)
  };

  const handleSumbit = async () => {
    try {
      handleClose()
      if (orderType == "limit") {
        if (isEmpty(price)) {
          return toastAlert("error", "Price Field is Required", "orderPlace");
        } else if (parseFloat(price) <= 0) {
          return toastAlert(
            "error",
            "Price Must Be Greater Than Zero",
            "orderPlace"
          );
        }
      }
      if (isEmpty(quantity)) {
        return toastAlert("error", "Quantity Field is Required", "orderPlace");
      } else if (parseFloat(quantity) <= 0) {
        return toastAlert(
          "error",
          "Quantity Must Be Greater Than Zero",
          "orderPlace"
        );
      }
      setLoader(true)
      let hash = encryptObject({
        quantity: quantity,
        buyorsell: orderType == "market" ? orderInfo.side == "buy" ? "sell" : "buy" : orderInfo.side,
        orderType: orderType,
        pairId: orderInfo.pairId,
        leverage: orderInfo.leverage,
        action: "close",
        positionId: orderInfo._id,
        price: price
      })
      let data = {
        token: hash
      }
      let { status, message } = await apiOrderPlace(data);
      setLoader(false)
      if (status == "success") {
        toastAlert('success', message, 'cancelOrder');
      } else {
        toastAlert('error', message, 'cancelOrder');
      }
    } catch (err) { }
  }

  const handlePercentageClick = (percentage: any) => {
    setPercent(percentage)
    const newAmount = (percentage / 100) * orderInfo.quantity;
    setFormValue({ ...formValue, ...{ quantity: newAmount } });
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    let { name, value } = e.target;
    if (!isEmpty(value) && !/^\d*\.?\d*$/.test(value)) {
      return;
    }
    setFormValue({ ...formValue, ...{ [name]: value } });
  };
  useEffect(() => {
    if (orderInfo?.quantity) {
      setFormValue({ ...formValue, ...{ quantity: orderInfo.quantity, price: marketData?.markPrice } });
    }
  }, [orderInfo.quantity])
  const handleShow = (type: any) => {
    if (type == "market") {
      setMShow(true)
    }
    if (type == "limit") {
      setLShow(true)
    }
    setFormValue({ ...formValue, ...{ orderType: type } })
  }
  return (
    <>
      {/* <CancelMOdal show={show} setShow={setShow} handleSumbit={handleSumbit} type={'pos'} /> */}
      <button className="btn-primary" onClick={() => handleShow('limit')}>{loader ? <i className="fa fa-spinner fa-spin" ></i> : 'Limit'}</button>
      <button className="btn-primary" onClick={() => handleShow('market')}>{loader ? <i className="fa fa-spinner fa-spin" ></i> : 'Market'}</button>

      {/* Market Order Modal */}
      <Modal
        show={mShow}
        onHide={() => handleClose()}
        centered
        backdrop="static"
        className={`${styles.custom_modal} ${styles.post_order}`}
      >
        <Modal.Header closeButton className={`${styles.modal_head}`}>
          <Modal.Title className={styles.title}>Market Close</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pb-4">
          <Row>
            <Col lg={12}>
              <Form.Group className={`mb-2 ${styles.input_grp}`}>
                <Form.Label>{`Closed Qty ${orderInfo?.pairDetail?.baseCoinSymbol}`}</Form.Label>
                <Form.Control type="number" style={{ textAlign: 'center' }} name="quantity" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)} value={quantity} />
                <ButtonGroup className="mt-2 w-100">
                  {[10, 25, 50, 75, 100].map((percentage, idx) => (
                    <Button
                      key={idx}
                      variant={
                        percent == percentage ? "primary" : "outline-secondary"
                      }
                      onClick={() => handlePercentageClick(percentage)}
                      className="w-100"
                    >
                      {percentage}%
                    </Button>
                  ))}
                </ButtonGroup>
              </Form.Group>
              {/* <p className="mt-3">
                                0.050 contract(s) will be closed at Last Traded Price price, and
                                your expected loss will be 1212 USDT.
                                (inclusive of est. closing fees)
                            </p> */}
            </Col>
          </Row>
          <div className={`mt-4 ${styles.modal_footer}`}>
            <button
              className={`${styles.primary_btn} ${styles.dark}`}
              disabled={loader}
              onClick={() => handleSumbit()}
            >
              <span></span>
              <label>
                {loader ? <i className="fa fa-spinner fa-spin"></i> : "Confirm"}
              </label>
            </button><button className={`${styles.primary_btn}`} onClick={() => handleClose()}>
              <span></span>
              <label>Cancel</label>
            </button>
          </div>
        </Modal.Body>
      </Modal >

      {/* Limit Order Modal */}
      <Modal
        show={lShow}
        onHide={() => handleClose()}
        centered
        backdrop="static"
        className={`${styles.custom_modal} ${styles.post_order}`}
      >
        <Modal.Header closeButton className={`${styles.modal_head}`}>
          <Modal.Title className={styles.title}>Limit Close</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pb-4">
          <div className={styles.modalContent}>
            <div className={styles.modalRow}>
              <div>Entry Price</div>
              <div>{toFixed(orderInfo.entryPrice, tradePair?.quoteFloatDigit)}</div>
            </div>
            <div className={styles.modalRow}>
              <div>Market Price</div>
              <div>{toFixed(marketData?.markPrice, tradePair?.quoteFloatDigit)}</div>
            </div>
          </div>
          <Row>
            <Col lg={12}>
              <Form.Group className={`mb-2 ${styles.input_grp}`}>
                <Form.Label>{`Closing Price ${orderInfo?.pairDetail?.quoteCoinSymbol}`}</Form.Label>
                <Form.Control type="number" style={{ textAlign: 'center' }} name="price" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)} value={price} />
                <Form.Label>{`Closed Qty ${orderInfo?.pairDetail?.baseCoinSymbol}`}</Form.Label>
                <Form.Control type="number" style={{ textAlign: 'center' }} name="quantity" onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)} value={quantity} />
                <ButtonGroup className="mt-2 w-100">
                  {[10, 25, 50, 75, 100].map((percentage, idx) => (
                    <Button
                      key={idx}
                      variant={
                        percent == percentage ? "primary" : "outline-secondary"
                      }
                      onClick={() => handlePercentageClick(percentage)}
                      className="w-100"
                    >
                      {percentage}%
                    </Button>
                  ))}
                </ButtonGroup>
              </Form.Group>
              {/* <p className="mt-3">
                                0.050 contract(s) will be closed at Last Traded Price price, and
                                your expected loss will be 1212 USDT.
                                (inclusive of est. closing fees)
                            </p> */}
            </Col>
          </Row>
          <div className={`mt-4 ${styles.modal_footer}`}>
            <button
              className={`${styles.primary_btn} ${styles.dark}`}
              disabled={loader}
              onClick={() => handleSumbit()}
            >
              <span></span>
              <label>
                {loader ? <i className="fa fa-spinner fa-spin"></i> : "Confirm"}
              </label>
            </button><button className={`${styles.primary_btn}`} onClick={() => handleClose()}>
              <span></span>
              <label>Cancel</label>
            </button>
          </div>
        </Modal.Body>
      </Modal >

    </>
  );
}
