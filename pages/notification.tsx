import styles from "@/styles/common.module.css";
import Mainnavbar from "../components/navbar";
import Footer from "../components/footer";
import dynamic from "next/dynamic";
import { Container, Form, Modal, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { handleAuthSSR } from "../utils/auth";
//import service
import {
  apiNotificationHistory,
  readNotification,
  apiAnnouncement,
} from "../services/User/UserServices";
//import store
import { useSelector } from "../store";
//import lib
import { momentFormat } from "@/lib/dateTimeHelper";
import { dateTimeFormat } from "@/lib/dateTimeHelper";
import isEmpty from "@/lib/isEmpty";

const Pagination = dynamic(() => import("../lib/pagination"), { ssr: false });
export default function Notification({ announcement }: any) {
  const [isClient, setIsClient] = useState<boolean>(false);
  const { loginHistory } = useSelector((state: any) => state.auth.user);
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0);
  const [filter, setFilter] = useState({
    page: 1,
    limit: 5,
  });

  const fetchData = async (respData: any) => {
    let resp = await apiNotificationHistory(respData);
    if (resp.data.success) {
      setData(resp.data.result);
      setCount(resp.data.count);
    }
  };
  const handleSubmit = async () => {
    let resp = await readNotification();
    if (resp.data.success) {
      fetchData(filter);
      setShow(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
    setFilter({ ...filter, page: currentPage });
  }, [currentPage]);

  useEffect(() => {
    fetchData(filter);
  }, [filter.page]);
  return (
    <>
      <Mainnavbar />
      <div className={styles.page_box}>
        <div className={`${styles.security} ${styles.notification}`}>
          <div className={`mb-5 ${styles.inner_head_box}`}>
            <Container>
              <Row>
                <Col lg={5} className="text-center mx-auto">
                  <h5 className={`${styles.inner_head_title}`}>Notification</h5>
                  <p className={`${styles.inner_subtitle}`}>
                    Notifications are essentially alert messages delivered by
                    software applications or systems to keep you informed about
                    something
                  </p>
                </Col>
              </Row>
            </Container>
          </div>
          <Container>
            <div className={styles.s_flx}>
              <div>
                {/* <h6 className={styles.h5tag}>Admin Announcement</h6> */}
                {isClient && (
                  <div>
                    {/* <p>{announcement?.content}</p> */}
                    {/* {announcement?.length > 0 &&
                      announcement.map((item: any, index: number) => {
                        return (
                          <p>
                            {index + 1}.{item.content}
                          </p>
                        );
                      })} */}
                    <p>
                      {dateTimeFormat(loginHistory?.createdDate)},{" "}
                      {loginHistory?.broswername}, {loginHistory?.ipaddress} -
                      Last login
                    </p>
                  </div>
                )}
              </div>
              {/* <div className="d-flex align-items-center justify-content-between">
                <Form.Group
                  className={`${styles.check_box}`}
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Label onClick={() => setShow(true)}>
                    {" "}
                    Mark all as read
                  </Form.Label>
                </Form.Group>
              </div> */}
            </div>

            <div className={`mb-5 ${styles.box} ${styles.notify_box_panel}`}>
              {data?.length > 0 &&
                data.map((item: any, index: number) => {
                  return (
                    <div
                      className={
                        item.noti_view_status
                          ? `${styles.set_flx} `
                          : `${styles.set_flx} ${styles.active}`
                      }
                      key={index}
                    >
                      <div className="align-items-start">
                        <div>
                          <p>{item.title}</p>
                          <span>{item.description}</span>
                        </div>
                        <div className={`${styles.ylw}`}>
                          {momentFormat(item.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            <Pagination
              currentPage={currentPage}
              totalCount={count}
              pageSize={5}
              onPageChange={(page: number) => setCurrentPage(page)}
            />
          </Container>
        </div>
      </div>
      <Footer />
      <Modal
        show={show}
        onHide={() => setShow(false)}
        centered
        className={styles.custom_modal}
      >
        <Modal.Header closeButton className={styles.modal_head}>
          <Modal.Title>Tip</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Confirm to mark all messages as read</p>
          <div>
            <button
              className={styles.primary_btn}
              onClick={() => handleSubmit()}
            >
              <span></span>
              <label>Confirm</label>
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
