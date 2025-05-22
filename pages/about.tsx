import styles from "@/styles/common.module.css";
import Image from "next/image";
import Mainnavbar from "../components/navbar";
import Footer from "../components/footer";
import { Container, Col, Row } from "react-bootstrap";

export default function Assets() {
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
                <h5 className={`mb-0 ${styles.inner_head_title}`}>
                About Us
                </h5>
              </Col>
            </Row>
          </Container>
        </div>
        <div className={`${styles.about}`}>
          <Container>            
            <section className={styles.sec_1}>
              <Row>
                <Col lg={6} className="m-auto">
                  <h5>B5 Crypto Exchange</h5>
                  <p>
                    B5 Crypto Exchange is your trusted partner in the world of
                    digital assets.
                  </p>
                  <p>
                    We're committed to simplifying cryptocurrency trading,
                    providing you with a secure and user-friendly platform. With
                    a team of experts dedicated to your success, we offer a wide
                    range of cryptocurrencies and top-notch customer support.
                  </p>
                  <p>
                    Join us today and discover the future of finance with
                    B5 Crypto Exchange.
                  </p>
                </Col>
                <Col lg={6} className="m-auto">
                  <Image
                    src="/assets/images/about.svg"
                    className="img-fluid me-3"
                    alt="img"
                    width={500}
                    height={500}
                  />
                </Col>
              </Row>
            </section>

            {/* <section className={`${styles.crypto_exchange} ${styles.crypto_exchange_chg}`}>
        <Container>
          <div className={`${styles.head} pb-4 `}  >
            <h2 className={styles.h2tag} >Lorem ipsum dolor sit amet</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed</p>
          </div>
          <Row>
            <Col lg={4} className='d-flex' >
              <div className={`mb-3 mb-lg-0 ${styles.box}`}>
                <div className={styles.inbox} > 
                  <h5 className={styles.h5tag}>Lorem ipsum</h5>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                </div>
              </div>
            </Col>
            <Col lg={4} className='d-flex' >
              <div className={`mb-3 mb-lg-0 ${styles.box}`}>
                <div className={styles.inbox} > 
                  <h5 className={styles.h5tag}>  Lorem ipsum </h5>
                  <p>Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit, </p>
                </div>
              </div>
            </Col>
            <Col lg={4} className='d-flex' >
              <div className={`mb-3 mb-lg-0 ${styles.box}`}>
                <div className={styles.inbox} > 
                  <h5 className={styles.h5tag}>  Lorem ipsum  </h5>
                  <p>Risus commodo viverra maecenas accumsan lacus vel facilisis. Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
                </div>
              </div>
            </Col>
          </Row>

        </Container>
      </section> */}
          </Container>
        </div>
      </div>
      <Footer />
    </>
  );
}
