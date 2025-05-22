import { useEffect, useState } from "react";
import styles from "@/styles/common.module.css";
import Mainnavbar from "../components/navbar";
import Footer from "../components/footer";
import dynamic from "next/dynamic";
//import service
import { apigetPairList } from "../services/Spot/SpotService";
import { Container, Col, Row } from "react-bootstrap";
//import Component
const MarketPageTableNew = dynamic(
  () => import("@/components/Market_new/MarketPageTable_new")
);
//import lib
import isEmpty from "@/lib/isEmpty";
import { getPairList } from "@/services/perpetual/PerpetualService";
import { apiGetPairList } from "@/services/inverse/InverseService"
export default function Assets() {
  const [pairList, setPairList] = useState([]);
  const [futurePair, setFuturePair] = useState([]);
  const [inversePair, setInversePair] = useState([]);

  const [isLoadingSp, setLoadingSp] = useState(true);
  const [isLoadingFu, setLoadingFu] = useState(false);
  const [isLoadingIn, setLoadingIn] = useState(false);

  useEffect(() => {
    fetchPairList();
    fetchFutureList();
    fetchInverseList();
  }, []);
  const fetchPairList = async () => {
    try {
      const data: any = await apigetPairList();
      setPairList(data?.data?.result);
    } catch {}
    finally {
      setLoadingSp(false);
    }
  };
  const fetchFutureList = async () => {
    setLoadingFu(true);
    try {
      let resp: any = await getPairList();
      if (!isEmpty(resp.result)) {
        setFuturePair(resp.result);
      }
    } catch {}
    finally {
      setLoadingFu(false);
    }
  };
  const fetchInverseList = async () => {
    setLoadingIn(true);
    try {
      let resp: any = await apiGetPairList();
      if (!isEmpty(resp.result)) {
        setInversePair(resp.result);
      }   
    } catch {}
    finally {
      setLoadingIn(false);
    }
  };

  return (
    <>
      <Mainnavbar />
      <div className={styles.Market_new}>

        <Container>
          <Row>
            <Col lg={4} className="text-start ">
              <h5 className={`mb-0 ${styles.inner_head_title}`}>Markets</h5>
            </Col>
          </Row>
        </Container>
      </div>
      <div className={`${styles.asset} ${styles.tab_sec} pb-4`}>
        <MarketPageTableNew pairList={pairList} isLoadingSp={isLoadingSp} futurePair={futurePair} isLoadingFu={isLoadingFu} inversePair={inversePair} isLoadingIn={isLoadingIn} />
      </div>

      <Footer />
    </>
  );
}
