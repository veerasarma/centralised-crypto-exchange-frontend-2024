import { useEffect, useState } from "react";
import styles from "@/styles/common.module.css";
import Mainnavbar from "../components/navbar";
import Footer from "../components/footer";
import dynamic from "next/dynamic";
import icon1 from "../public/assets/images/affiliate/icon1.png";
import icon2 from "../public/assets/images/affiliate/icon2.png";
import icon3 from "../public/assets/images/affiliate/icon3.png";
import icon4 from "../public/assets/images/affiliate/icon4.png";
import icon5 from "../public/assets/images/affiliate/icon5.png";
import icon6 from "../public/assets/images/affiliate/icon6.png";
import icon7 from "../public/assets/images/affiliate/icon7.png";
import icon8 from "../public/assets/images/affiliate/icon7.png";

import Image from "next/image";
//import service
import { apigetPairList } from "../services/Spot/SpotService";
import { Container, Col, Row } from "react-bootstrap";
//import Component
const MarketPageTable = dynamic(
  () => import("@/components/Market/MarketPageTable")
);
//import lib
import isEmpty from "@/lib/isEmpty";
export default function Innerhome() {
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
      <div className={styles.innerhome}>
        <div className={styles.innerhome_head}>
          <Mainnavbar />
          <div className={styles.page_box}>
            <Container>
              <div>
                <h2 className={styles.head}>For individual users</h2>
              </div>
              <Row className={styles.box_head}>
                <Col lg="6" md="6" className="mb-3">
                  {" "}
                  <div className={styles.box}>
                    <p>Get a Lifetime Income Ownership in B5 exchange</p>
                    <Image src={icon1} alt="Icon" className="img-fluid" />
                  </div>
                </Col>
                <Col lg="6" md="6" className="mb-3">
                  {" "}
                  <div className={styles.box}>
                    <p>Create your  personal B5 website sub-domain</p>
                    <Image src={icon2} alt="Icon" className="img-fluid" />
                  </div>
                </Col>
                <Col lg="6" md="6" className="mb-3">
                  {" "}
                  <div className={styles.box}>
                    <p>Get tradeable USDT 10,000 and crypto loans</p>
                    <Image src={icon3} alt="Icon" className="img-fluid" />
                  </div>
                </Col>
                <Col lg="6" md="6" className="mb-3">
                  {" "}
                  <div className={styles.box}>
                    <p>Earn millions with our Research</p>
                    <Image src={icon4} alt="Icon" className="img-fluid" />
                  </div>
                </Col>
              </Row>
              {/* <div className={styles.box}>
            <p>Get a Lifetime Income Ownership in B5 exchange</p>
            <Image src={icon1} alt="Icon" className="img-fluid" />
          </div> */}
            </Container>
          </div>
        </div>
        <div className={styles.black_bg}>
          <Container>
            <div>
              <h2 className={`pt-3 mt-0 ${styles.head}`}>
                For crypto-project owners
              </h2>
            </div>
            <Row className={styles.box_head}>
              <Col lg="6" md="6" className="mb-3">
                {" "}
                <div className={styles.box}>
                  <p>Register your product on our Global Launch-pad</p>
                  <Image src={icon5} alt="Icon" className="img-fluid" />
                </div>
              </Col>
              <Col lg="6" md="6" className="mb-3">
                {" "}
                <div className={styles.box}>
                  <p>List your token/coin with our Exchange</p>
                  <Image src={icon6} alt="Icon" className="img-fluid" />
                </div>
              </Col>
              <Col lg="6" md="6" className="mb-3">
                {" "}
                <div className={styles.box}>
                  <p>Globally Advertise your Business for almost Free</p>
                  <Image src={icon7} alt="Icon" className="img-fluid" />
                </div>
              </Col>
              <Col lg="6" md="6" className="mb-3">
                {" "}
                <div className={styles.box}>
                  <p>
                    Today secure your share in B5 Global Revenue for Life-time
                  </p>
                  <Image src={icon8} alt="Icon" className="img-fluid" />
                </div>
              </Col>
            </Row>
            {/* <div className={styles.box}>
            <p>Get a Lifetime Income Ownership in B5 exchange</p>
            <Image src={icon1} alt="Icon" className="img-fluid" />
          </div> */}
          </Container>
        </div>
      </div>
      <Footer />
    </>
  );
}
