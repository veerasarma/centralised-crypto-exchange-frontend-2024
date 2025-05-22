import styles from "@/styles/common.module.css";
import Mainnavbar from "../components/navbar";
import Footer from "../components/footer";
import { Container, Row, Col } from "react-bootstrap";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import isEmpty from "@/lib/isEmpty";
//import component
const TransactionHistory = dynamic(
  () => import("../components/History/TransactionHist")
);
const FuturesHist = dynamic(() => import("../components/History/Futures"));
const InverseHis = dynamic(() => import("../components/History/Inverse"));
const SpotHist = dynamic(() => import("../components/History/Spot"));

export default function History() {
  let queryParams;
  if (typeof window !== "undefined") {
    queryParams = new URLSearchParams(window.location.search);
  } else {
    queryParams = new URLSearchParams(""); // Or some default value or logic
  }
  let type;
  type = queryParams.get("type");
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };
  useEffect(() => {
    if (!isEmpty(type)) {
      let actCount = 0;
      if (type == "spot") {
        actCount = 0;
      } else if (type == "deposit") {
        actCount = 2;
      } else if (type == "withdraw") {
        actCount = 3;
      }
      setActiveTab(actCount);
    }
  }, [type]);
  return (
    <>
      <Mainnavbar />
      <div className={styles.page_box}>
        <div
          className={`mb-5 ${styles.inner_head_box} ${styles.inner_head_box_small}`}
        >
          <Container>
            <Row>
              <Col lg={4} className="text-center mx-auto">
                <h5 className={`${styles.inner_head_title} mb-0`}>
                  My History
                </h5>
              </Col>
            </Row>
          </Container>
        </div>
        <section className={`${styles.peer} ${styles.myorder}`}>
          <Container>
            <div className={styles.tabbox}>
              <div
                className={`${activeTab === 0 ? styles.active : ""}`}
                onClick={() => handleTabClick(0)}
              >
                Spot
              </div>
              <div
                className={`${activeTab === 1 ? styles.active : ""}`}
                onClick={() => handleTabClick(1)}
              >
                Future
              </div>
              <div
                className={`${activeTab === 4 ? styles.active : ""}`}
                onClick={() => handleTabClick(4)}
              >
                Inverse
              </div>
              <div
                className={`${activeTab === 2 ? styles.active : ""}`}
                onClick={() => handleTabClick(2)}
              >
                Deposit
              </div>
              <div
                className={`${activeTab === 3 ? styles.active : ""}`}
                onClick={() => handleTabClick(3)}
              >
                Withdraw{" "}
              </div>
            </div>
            {activeTab === 0 && <SpotHist />}
            {activeTab === 1 && <FuturesHist />}
            {activeTab === 2 && <TransactionHistory type={"coin_deposit"} />}
            {activeTab === 3 && <TransactionHistory type={"coin_withdraw"} />}
            {activeTab === 4 && <InverseHis />}
          </Container>
        </section>
      </div>
      <Footer />
    </>
  );
}
