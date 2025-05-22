import { useEffect, useState } from "react";
import styles from "@/styles/common.module.css";
import Mainnavbar from "../components/navbar";
import Footer from "../components/footer";
import dynamic from "next/dynamic";
//import service
import { apigetPairList } from "../services/Spot/SpotService";
import { Container, Col, Row } from "react-bootstrap";
//import Component
const MarketPageTable = dynamic(
  () => import("@/components/Market/MarketPageTable")
);
//import lib
import isEmpty from "@/lib/isEmpty";
export default function Assets() {
  const [activeTab, setactiveTab] = useState(0);
  const [pairList, setPairList] = useState([]);

  useEffect(() => {
    fetchPairList();
  }, []);
  const fetchPairList = async () => {
    const data: any = await apigetPairList();
    setPairList(data?.data?.result);
  };
  const handleTabClick = (tabid: any) => {
    setactiveTab(tabid);
  };

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
                <h5 className={`mb-0 ${styles.inner_head_title}`}>Markets</h5>
              </Col>
            </Row>
          </Container>
        </div>
        <div className={`${styles.asset} pb-4`}>
          <MarketPageTable pairList={pairList} />
        </div>
      </div>
      <Footer />
    </>
  );
}
