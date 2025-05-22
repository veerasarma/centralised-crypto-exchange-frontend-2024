import Image from "next/image";
import styles from "@/styles/common.module.css";
import { Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
//import component
import MobileForm from "./MoblieForm";
import EmailForm from "./EmailForm";

export default function RegisterForm({ refId }: any) {
  const [activeTab, setActiveTab] = useState("tab1");

  const handleTabClick = (tabId: any) => {
    setActiveTab(tabId);
  };

  return (
    <Container>
      <Row>
        <Col lg={7} xxl={5} className="m-auto">
          <div className={styles.box_flx}>
            <div className={`login_right ${styles.right_box}`}>
              <div className="text-center">
                <h2>Register</h2>
              </div>
              <div className={`mb-4  ${styles.login_navtab}`}>
                <button
                  className={`mb-2 ${styles.button} ${activeTab === "tab1" ? styles.active : ""
                    }`}
                  onClick={() => handleTabClick("tab1")}
                >
                  Email
                </button>
                <button
                  className={`mb-2 ${styles.button} ${activeTab === "tab2" ? styles.active : ""
                    }`}
                  onClick={() => handleTabClick("tab2")}
                >
                  Phone Number
                </button>
              </div>

              {activeTab == "tab2" ? <MobileForm refId={refId} /> : <EmailForm refId={refId} />}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
