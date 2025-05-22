import styles from "@/styles/common.module.css";
import { Dropdown, Table } from "react-bootstrap";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
// import services
import { apiGetMySpotHistory } from "@/services/history.service";
//import component
const Pagination = dynamic(() => import("@/lib/pagination"), { ssr: false });
//import lib
import { dateTimeFormat } from "@/lib/dateTimeHelper";
import { toFixed } from "@/lib/roundOf";
import { capitalize } from "@/lib/stringCase";
import isEmpty from "@/lib/isEmpty";
//import store
import { useSelector } from "@/store";

const initialFormValue = {
  page: 1,
  limit: 5,
  search: "",
  pairName: "all",
  orderType: "all",
  buyorsell: "all",
  status: "all",
};

const spinner: React.CSSProperties = {
  fontSize: "36px",
};

export default function OrderHistory() {
  // state
  const [count, setcount] = useState(0);
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState(initialFormValue);
  const { pairList } = useSelector((state: any) => state.spot);
  // function
  const fetchOrderHistory = async (filter: any) => {
    try {
      const respData: any = await apiGetMySpotHistory(filter);
      if (respData.data.result.data) {
        setData(respData.data.result.data);
        setcount(respData.data.result.count);
        setLoader(false);
      }
    } catch (err) {
      console.log(err, "err");
      setLoader(false);
    }
  };

  useEffect(() => {
    setFilter({ ...filter, page: currentPage });
    setData([]);
    setLoader(true);
  }, [currentPage]);

  useEffect(() => {
    fetchOrderHistory(filter);
  }, [filter]);

  const handleSearch = (e: any) => {
    e.preventDefault();
    fetchOrderHistory(filter);
  };

  const handleReset = (e: any) => {
    e.preventDefault();
    setFilter(initialFormValue);

    fetchOrderHistory(initialFormValue);
  };
  const handleCoin = (e: string) => {
    setFilter({ ...filter, ["pairName"]: e });
  };
  const handleSide = (e: string) => {
    setFilter({ ...filter, ["buyorsell"]: e });
  };
  const handleStatus = (e: string) => {
    setFilter({ ...filter, ["status"]: e });
  };
  const handleOrderType = (e: string) => {
    setFilter({ ...filter, ["orderType"]: e });
  };

  return (
    <div className={`mb-3 ${styles.table_box}`}>
      <div className={`${styles.table_box_flx} mw-75 border-0`}>
        <div>
          <label>Pair</label>
          <Dropdown
            className={styles.drp_down}
            onSelect={(e: any) => handleCoin(e)}
          >
            <Dropdown.Toggle variant="primary">
              {!isEmpty(filter) && filter.pairName != undefined
                ? capitalize(filter.pairName)
                : "All"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="all">All</Dropdown.Item>
              {pairList?.length > 0 &&
                pairList.map((item: any, index: number) => {
                  return (
                    <Dropdown.Item eventKey={item.tikerRoot} key={index}>
                      {item.tikerRoot}
                    </Dropdown.Item>
                  );
                })}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div>
          <label>Order Type</label>
          <Dropdown
            className={`${styles.drp_down}`}
            onSelect={(e: any) => handleOrderType(e)}
          >
            <Dropdown.Toggle variant="primary">
              {!isEmpty(filter) && filter.orderType != undefined
                ? capitalize(filter.orderType)
                : "All"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="all">All</Dropdown.Item>
              <Dropdown.Item eventKey="limit">Limit</Dropdown.Item>
              <Dropdown.Item eventKey="market">Market</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div>
          <label>Side </label>
          <Dropdown
            className={`${styles.drp_down}`}
            onSelect={(e: any) => handleSide(e)}
          >
            <Dropdown.Toggle variant="primary">
              {!isEmpty(filter) && filter.buyorsell != undefined
                ? capitalize(filter.buyorsell)
                : "All"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="all">All</Dropdown.Item>
              <Dropdown.Item eventKey="buy">Buy</Dropdown.Item>
              <Dropdown.Item eventKey="sell">Sell</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div>
          <label>Status </label>
          <Dropdown
            className={`${styles.drp_down}`}
            onSelect={(e: any) => handleStatus(e)}
          >
            <Dropdown.Toggle variant="primary">
              {!isEmpty(filter) && filter.status != undefined
                ? capitalize(filter.status)
                : "All"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="all">All</Dropdown.Item>
              <Dropdown.Item eventKey="open">Open</Dropdown.Item>
              <Dropdown.Item eventKey="completed">Completed</Dropdown.Item>
              <Dropdown.Item eventKey="cancel">cancelled</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="w-auto">
          <button className={styles.primary_btn} onClick={handleSearch}>
            Search
          </button>
        </div>
        <div className="w-auto">
          <button
            className={`${styles.dark} ${styles.primary_btn}`}
            onClick={handleReset}
          >
            Clear
          </button>
        </div>
      </div>

      <Table responsive borderless>
        <thead>
          <tr>
            <th>Order Date </th>
            <th>Transaction ID </th>
            <th className="pe-5">Trade Type </th>
            <th>Pair Name </th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Filled / Remaining </th>
            <th>Side</th>
            <th className="ps-5">Status</th>
          </tr>
        </thead>
        <tbody>
          {loader ? (
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td colSpan={9}>
                <i className="fa fa-spinner fa-spin" style={spinner}></i>
              </td>
            </tr>
          ) : data?.length >= 0 ? (
            data.map((item: any, key: number) => {
              return (
                <tr key={key}>
                  <td>{dateTimeFormat(item.orderDate)}</td>
                  <td>{item._id}</td>
                  <td>
                    {item.orderType == "limit"
                      ? "Limit"
                      : item.orderType == "market"
                      ? "Market"
                      : "Stop Limit"}
                  </td>
                  <td>{item.pairName}</td>
                  <td>
                    {item.orderType == "market"
                      ? "Market"
                      : toFixed(item.price, 4)}
                  </td>
                  <td>
                    {toFixed(
                      item.orderType == "market"
                        ? item.filledQuantity
                        : item.openQuantity,
                      4
                    )}
                  </td>
                  <td>
                    {toFixed(item.filledQuantity, 4)}/
                    {toFixed(
                      item.orderType == "market"
                        ? item.buyorsell == "buy"
                          ? 0
                          : item.openQuantity - item.filledQuantity
                        : item.openQuantity - item.filledQuantity,
                      4
                    )}
                  </td>
                  <td>{capitalize(item.buyorsell)}</td>
                  <td
                    className={
                      item.status == "cancel"
                        ? "text-red"
                        : item.status == "completed"
                        ? "text-green"
                        : ""
                    }
                  >
                    {" "}
                    {item.status == "cancel"
                      ? "Cancelled"
                      : capitalize(item.status)}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td colSpan={9}>
                <p className="mb-0">No Records Found</p>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {count > 0 && (
        <Pagination
          currentPage={currentPage}
          totalCount={count}
          pageSize={5}
          onPageChange={(page: number) => setCurrentPage(page)}
        />
      )}
    </div>
  );
}
