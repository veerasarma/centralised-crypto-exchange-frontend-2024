import styles from "@/styles/common.module.css";
import { Container, Row, Col } from "react-bootstrap";
import Mainnavbar from "../components/navbar";
import Footer from "../components/footer";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
//import Component
import CreateTicket from "@/components/SupportTicket/CreateTicket";
import TicketList from "@/components/SupportTicket/TicketList";
import { handleAuthSSR } from "../utils/auth";
//import service
import { apiSupportCategory } from "../services/User/UserServices";
//improt isEmpty
import isEmpty from "@/lib/isEmpty";
export default function Support_ticket({ categoryList }: any) {
  const [cList, setCList] = useState(false);

  let fetchRef = useRef();

  const fetchSupport = async () => {
    let resp: any = await apiSupportCategory();
    console.log(resp, "------22");
    if (!isEmpty(resp?.data?.result)) {
      setCList(resp.data.result);
    }
  };
  useEffect(() => {
    fetchSupport();
  }, []);
  return (
    <>
      <Mainnavbar />
      <div className={styles.page_box}>
        <div className={`mb-5 ${styles.support}`}>
          <div className={`mb-5 ${styles.inner_head_box}`}>
            <Container>
              <Row>
                <Col lg={4} className="text-center mx-auto">
                  <h5 className={`${styles.inner_head_title}`}>
                    Support Ticket
                  </h5>
                  <p className={`${styles.inner_subtitle}`}>
                    Raise an issue, ask a question, or request help from a
                    admin's support department.
                  </p>
                </Col>
              </Row>
            </Container>
          </div>
          <Container>
            <Row>
              <Col lg={4}>
                <CreateTicket categoryList={cList} fetchRef={fetchRef} />
              </Col>
              <Col lg={8}>
                <TicketList ref={fetchRef} />
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      <Footer />
    </>
  );
}
