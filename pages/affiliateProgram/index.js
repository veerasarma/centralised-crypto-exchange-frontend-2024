import styles from "../../styles/common.module.css";
import Mainnavbar from "../../components/navbar";
import Footer from "../../components/footer";

//import service
import { Container, Col, Row } from "react-bootstrap";

import AffilProg from "../../components/Affiliate/index"

export default function AffiliateProgram() {

  return (
    <>
      <Mainnavbar />
      <div className={styles.page_box}>
        <div
          className={`mb-5 ${styles.inner_head_box} ${styles.inner_head_box_small}`}
        >
          <Container>
            <Row>
              <Col lg={6} className="text-center mx-auto">
                <h5 className={`mb-0 ${styles.inner_head_title}`}>Affiliate Program</h5>
              </Col>
            </Row>
          </Container>
        </div>
        <AffilProg />
      </div>
      <div className="mt-5 pt-5">
        <Footer />
      </div>
    </>
  );
}
