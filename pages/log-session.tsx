import { useEffect, useState } from "react";
import styles from "@/styles/common.module.css";
import Mainnavbar from "../components/navbar";
import Footer from "../components/footer";
import { Container, Col, Row, Table } from "react-bootstrap";
import dynamic from "next/dynamic";
//import service
import { apiLoginDetails } from "@/services/User/UserServices";
//import component
const Pagination = dynamic(() => import("@/lib/pagination"), { ssr: false });
//import lib
import { dateTimeFormat } from "@/lib/dateTimeHelper";

export default function LoginHistory() {
  const [count, setcount] = useState(0);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState({
    page: 1,
    limit: 5,
  });

  const fetchLoginHistory = async (filterData: any) => {
    try {
      const result = await apiLoginDetails(filterData);

      if (result.data.success) {
        setData(result.data.result);
        setcount(result.data.count);
      }
    } catch (err) {}
  };

  useEffect(() => {
    setData([]);
    setFilter({ ...filter, page: currentPage });
  }, [currentPage]);

  useEffect(() => {
    fetchLoginHistory(filter);
  }, [filter.page]);
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
                  Log Session
                </h5>
              </Col>
            </Row>
          </Container>
        </div>
        <div className={`${styles.asset} pb-4`}>
          <Container>
            <div className={`${styles.asset_table} ${styles.asset_table_chg}`}>
              <Table responsive>
                <thead>
                  <tr>
                    <th className="fw-bold">Date</th>
                    <th className="fw-bold">IP </th>
                    <th className="text-end fw-bold"> Location </th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data?.length > 0 &&
                    data.map((item: any, index: number) => {
                      return (
                        <tr key={index}>
                          <td>
                            {dateTimeFormat(
                              item.createdDate,
                              "DD-MM-YYYY HH:mm"
                            )}
                          </td>
                          <td>{item.ipaddress}</td>
                          <td className="text-end py-3">{item.countryName}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
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
    </>
  );
}
