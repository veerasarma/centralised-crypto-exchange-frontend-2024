import styles from "@/styles/common.module.css";
import { Container, Row, Col, Dropdown } from "react-bootstrap";
import Mainnavbar from "../components/navbar";
import Footer from "../components/footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
//import lib
import isEmpty from "@/lib/isEmpty";
//import component
const AddBank = dynamic(() => import("@/components/security/AddBank"));
const AddQr = dynamic(() => import("@/components/security/AddQr"));
const AddUpi = dynamic(() => import("@/components/security/AddUpi"));
export default function Home({}: any) {
  const router = useRouter();
  const { query } = router;

  const [selectedValue02, setSelectedValue02] = useState("Bank Account");

  const handleItemClick02 = (value: any) => {
    setSelectedValue02(value);
  };
  useEffect(() => {
    if (!isEmpty(query)) {
      if (query.type == "bank") {
        handleItemClick02("Bank Account");
      } else if (query.type == "upi") {
        handleItemClick02("UPI");
      } else if (query.type == "qr") {
        handleItemClick02("QR Scan");
      } else {
        router.push("/payment-method");
      }
    }
  }, []);
  return (
    <>
      <Mainnavbar />

      <div className={styles.page_box}>
        <div
          className={`mb-5 ${styles.inner_head_box} ${styles.inner_head_box_small}`}
        >
          <Container>
            <Row>
              <Col lg={8} className="text-center mx-auto">
                <h5 className={`mb-0 ${styles.inner_head_title}`}>
                    {isEmpty(query) ? "Add payment method" : "Edit payment method"}
                </h5>
              </Col>
            </Row>
          </Container>
        </div>
        <Container>
          <div className={styles.asset}>            
            <div className={`mb-4 ${styles.asset_box}`}>
              <div className="w-100">
                {isEmpty(query) && (
                  <Row>
                    <Col lg={4}>
                      <label className="mb-2">Payment Type</label>
                      <Dropdown className={`${styles.drp_down} mb-4`}>
                        <Dropdown.Toggle variant="primary">
                          {selectedValue02}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item
                            onClick={() => handleItemClick02("Bank Account")}
                          >
                            Bank Account
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => handleItemClick02("UPI")}
                          >
                            UPI
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => handleItemClick02("QR Scan")}
                          >
                            QR Scan
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Col>
                  </Row>
                )}
                {selectedValue02 == "Bank Account" && (
                  <AddBank query={query} type={query.type} />
                )}
                {selectedValue02 == "UPI" && (
                  <AddUpi query={query} type={query.type} />
                )}
                {selectedValue02 == "QR Scan" && (
                  <AddQr query={query} type={query.type} />
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Footer />
    </>
  );
}
