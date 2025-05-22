import { useEffect, useState } from "react";
import TooltipSlider from "../TooltipSlider";
import { InputGroup, Form, Modal, Row, Col } from "react-bootstrap";
import styles from "@/styles/common.module.css";
import spot from "@/styles/Spot.module.css";
//import lib
import isEmpty from "@/lib/isEmpty";
import { toFixed } from "@/lib/roundOf";
import { initialMargin, unrealizedPnL, unrealizedPnLPerc } from "@/lib/bybit";
const initialFormValue = {
  amount: "",
  entryPrice: "",
  exitPrice: "",
  margin: 0,
  pnl: 0,
  pnlPerc: 0,
  lev: 1,
};
const marks = {
  1: 1,
  25: 25,
  50: 50,
  75: 75,
  100: 100,
};
const red: React.CSSProperties = {
  color: "#EF5350",
};
const green: React.CSSProperties = {
  color: "#14B778",
};

export default function AssetPassword({ pnl_modal, setpnl_modal }: any) {
  const [formValue, setFormValue] = useState<any>(initialFormValue);
  const [side, setSide] = useState<string>("buy");
  const { amount, entryPrice, exitPrice, margin, pnl, pnlPerc, lev } =
    formValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    setFormValue({ ...formValue, ...{ [name]: value } });
  };

  const handleClose = () => {
    setpnl_modal(false);
    setFormValue(initialFormValue);
  };

  const handleSubmit = async (e: any, type: string) => {
    e.preventDefault();
    try {
    } catch (err: any) {}
  };

  const calculation = () => {
    try {
      let m: any = initialMargin({
        price: entryPrice,
        quantity: amount,
        leverage: lev,
      });

      let p: any = unrealizedPnL({
        entryPrice,
        quantity: amount,
        lastPrice: exitPrice,
        buyorsell: side,
      });

      let perc: any = unrealizedPnLPerc({
        entryPrice,
        quantity: amount,
        lastPrice: exitPrice,
        takerFee: 0,
        leverage: lev,
        buyorsell: side,
      });
      let formData = {
        margin: m,
        pnl: p,
        pnlPerc: perc,
      };
      setFormValue({ ...formValue, ...formData });
    } catch (err) {
      console.log("err: ", err);
    }
  };

  const handleSlider = (e: number) => {
    setFormValue({ ...formValue, ...{ lev: e } });
  };
  useEffect(() => {
    if (!isEmpty(amount) && !isEmpty(entryPrice) && !isEmpty(exitPrice)) {
      calculation();
    }
  }, [amount, entryPrice, exitPrice, lev, side]);

  return (
    <>
      <Modal
        show={pnl_modal}
        onHide={handleClose}
        centered
        className={styles.custom_modal}
        backdrop="static"
      >
        <Modal.Header closeButton className={styles.modal_head}>
          <Modal.Title>Profit & Loss</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <InputGroup className={`mb-3 ${styles.input_grp}`}>
              <Form.Control
                type="text"
                placeholder="Amount"
                name="amount"
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup className={`mb-3 ${styles.input_grp}`}>
              <Form.Control
                type="text"
                placeholder="Entry Price"
                name="entryPrice"
                onChange={handleChange}
              />
            </InputGroup>
            <InputGroup className={`mb-3 ${styles.input_grp}`}>
              <Form.Control
                type="text"
                placeholder="Exit Price"
                name="exitPrice"
                onChange={handleChange}
              />
            </InputGroup>
            <div className={`mb-3 ${spot.form_box}`}>
              <div className={spot.input_grp}>
                <InputGroup.Text className={spot.input_text}>
                  <b>Leverage</b>
                </InputGroup.Text>
                <InputGroup>
                  <Form.Control
                    placeholder=""
                    type="text"
                    className={spot.input_box}
                    name="leverage"
                    value={lev}
                    disabled={true}
                  />
                  <InputGroup.Text className={spot.input_text}>
                    <b>X</b>
                  </InputGroup.Text>
                </InputGroup>
              </div>
            </div>
            <div className={`${spot.form_box} ${spot.form_box_slider}`}>
              <TooltipSlider
                min={1}
                max={100}
                marks={marks}
                tipFormatter={(value: any) => `${value}`}
                tipProps={undefined}
                onChange={(e: number) => handleSlider(e)}
                dotStyle={{
                  backgroundColor: "var(--slider1)",
                  borderColor: "transparent",
                }}
                activeDotStyle={{
                  backgroundColor: "var(--text_white)",
                  borderColor: "var(--text_white)",
                }}
                handleStyle={{
                  border: "3px solid var(--color-3)",
                  backgroundColor: "var(--text_white)",
                  opacity: "1",
                  boxShadow: "0 0 10px 0 var(--text_white)",
                }}
                railStyle={{
                  backgroundColor: "var(--slider1)",
                  height: "1px",
                }}
                trackStyle={{
                  backgroundColor: "var(--text_white)",
                  height: "1px",
                }}
              />
            </div>
          </Form>
          <div className={`mt-5 ${styles.modal_footer}`}>
            <button
              className={spot.order_buy_btn}
              onClick={(e) => setSide("buy")}
            >
              Long
            </button>
            <button
              className={spot.order_sell_btn}
              onClick={(e) => setSide("sell")}
            >
              Short
            </button>
          </div>
          &nbsp; &nbsp;
          <Row>
            <Col>
              <p>Position Margin</p>
              <p>Profit & Loss</p>
              <p>ROI</p>
            </Col>
            <Col>
              <div className={styles.pnl}>
                <p>{toFixed(margin, 4)} USDT</p>
                <p>
                  <span style={pnl >= 0 ? green : red}>{toFixed(pnl, 4)} </span>
                  USDT
                </p>
                <p>
                  <span style={pnl >= 0 ? green : red}>
                    {toFixed(pnlPerc, 4)}{" "}
                  </span>
                  %
                </p>
              </div>
            </Col>
          </Row>
          &nbsp;
          <Row>
            <small>
              <b>Disclaimer:</b> This calculation is an estimate, It does not
              include any fee.
            </small>
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
}
