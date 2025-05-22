import styles from "@/styles/common.module.css";
import Mainnavbar from "../components/navbar";
import Footer from "../components/footer";
import { getAllFaq } from "../services/common.service";
import { Accordion, Container, Row, Col } from "react-bootstrap";
//import lib
import isEmpty from "@/lib/isEmpty";
import { useEffect, useState } from "react";
export default function FAQ() {
  const [faqList, setFaq] = useState();
  useEffect(() => {
    fetchFaq();
  }, []);
  const fetchFaq = async () => {
    const data = await getAllFaq();
    setFaq(data?.data?.result);
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
                <h5 className={`mb-0 ${styles.inner_head_title}`}>FAQs</h5>
              </Col>
            </Row>
          </Container>
        </div>
        <section className={styles.faq}>
          <div className="container faq-content">
            <div className={styles.accordion_box}>
              {faqList?.length > 0 &&
                faqList.map((item: any, index: number) => {
                  return (
                    <>
                      <h5>{item.categoryName}</h5>
                      <Accordion>
                        {item?.categoryDetails?.length >= 0 &&
                          item.categoryDetails.map((data: any, key: number) => {
                            return (
                              <>
                                <Accordion.Item eventKey={key}>
                                  <Accordion.Header>
                                    {key + 1}. {data.question}?
                                  </Accordion.Header>
                                  <Accordion.Body>
                                    <p className={styles.para}>{data.answer}</p>
                                  </Accordion.Body>
                                </Accordion.Item>
                              </>
                            );
                          })}
                      </Accordion>
                    </>
                  );
                })}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
