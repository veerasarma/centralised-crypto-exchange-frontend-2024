import Image from "next/image";
import styles from "@/styles/common.module.css";
import { Container, Row, Col } from "react-bootstrap";
import { useState } from "react";
//import component
import EmailForm from "../Login/EmailForm";
import MobileForm from "../Login/MobileForm";
export default function LoginForm() {
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
                <h2>Log In</h2>
              </div>
              <div className={`mb-4  ${styles.login_navtab}`}>
                <button
                  className={`mb-2 ${styles.button} ${
                    activeTab === "tab1" ? styles.active : ""
                  }`}
                  onClick={() => handleTabClick("tab1")}
                >
                  Email
                </button>
                <button
                  className={`mb-2 ${styles.button} ${
                    activeTab === "tab2" ? styles.active : ""
                  }`}
                  onClick={() => handleTabClick("tab2")}
                >
                  Phone Number
                </button>
              </div>

              {activeTab == "tab1" ? <EmailForm /> : <MobileForm />}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
