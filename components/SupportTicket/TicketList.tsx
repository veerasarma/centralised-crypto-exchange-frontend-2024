import styles from "@/styles/common.module.css";
import { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { Accordion } from "react-bootstrap";
//import service
import { apiSupportTickets } from "../../services/User/UserServices";
//improt lib
import { toastAlert } from "@/lib/toastAlert";
//improt component
import TicketReplay from "./TicketReplay";
//import service
import { apiCloseTicket } from "../../services/User/UserServices";

const TicketList = forwardRef((props, ref) => {
  const [data, setData] = useState<any>({});

  const fetchTicketList = async () => {
    try {
      const res = await apiSupportTickets();
      if (res.data.success) {
        setData(res.data.result);
      }
    } catch (err) { }
  };

  const handleClose = async (ticketId: string) => {
    try {
      let data = {
        ticketId: ticketId,
      };
      const result = await apiCloseTicket(data);
      console.log(result, "-resultresult")
      if (result.data.success) {
        toastAlert("success", result.data.message, "tickClose");
        fetchTicketList();
      } else {
        toastAlert("error", result.data.message, "tickClose");
      }
    } catch (err: any) {
      if (err?.response?.data.message) {
        toastAlert("error", err.response.data.message, "login");
      }
    }
  };

  useEffect(() => {
    fetchTicketList();
  }, []);

  useImperativeHandle(ref, () => ({
    show() {
      fetchTicketList();
    },
  }));
  return (
    <div className={styles.box}>
      <h5>Ticket Details</h5>
      <Accordion defaultActiveKey={0} className={styles.accordion}>
        {data?.ticketList?.length > 0 &&
          data.ticketList.map((item: any, index: number) => {
            return (
              <Accordion.Item eventKey={index}>
                <Accordion.Header>
                  <div className={styles.title}>
                    <p>
                      <span className={styles.grey}>Sub:</span>{" "}
                      {item.categoryName}
                    </p>
                    {item.status == "open" && (
                      <p onClick={() => handleClose(item._id)}>Close Ticket</p>
                    )}
                    <div>
                      <span>[ Ticket ID: {item.tickerId} ]</span>{" "}
                      <span> [ Status: {item.status} ]</span>
                    </div>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <TicketReplay
                    tikData={item}
                    chatList={item.reply}
                    fetchData={fetchTicketList}
                  />
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
      </Accordion>
    </div>
  );
});

export default TicketList;
