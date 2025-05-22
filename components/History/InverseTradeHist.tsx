import styles from "@/styles/common.module.css";
import { Dropdown, Table } from "react-bootstrap";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
// import services
//import component
const Pagination = dynamic(() => import("@/lib/pagination"), { ssr: false });
//import lib
import { dateTimeFormat } from "@/lib/dateTimeHelper";
import { toFixed } from "@/lib/roundOf";
import { capitalize } from "@/lib/stringCase";
import isEmpty from "@/lib/isEmpty";
//import store
import { useSelector } from "@/store";
import Image from "next/image";
import { PerpetualTradeHistory } from "@/services/inverse/InverseService";
import { useTheme } from "next-themes";

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
const red: React.CSSProperties = {
    color: "#EF5350",
};
const green: React.CSSProperties = {
    color: "#14B778",
};
export default function TradeHistory() {
    // state
    const [count, setcount] = useState(0);
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState(initialFormValue);
    const { pairList } = useSelector((state: any) => state.inverse);
    const { theme, setTheme } = useTheme();
    // function
    const fetchOrderHistory = async (filter: any) => {
        try {
            setLoader(true);
            const { result, status } = await PerpetualTradeHistory(filter);
            setLoader(false);
            if (status == "success") {
                if (result && result.data && result.data.length > 0) {
                    let resultArr: any = [];
                    result.data.map((item: any) => {
                        resultArr.push({
                            Date: dateTimeFormat(item.orderDate, "DD-MM-YYYY HH:mm"),
                            Symbol: `${item.baseCoinSymbol}/${item.quoteCoinSymbol}`,
                            Side: (
                                <div className="apy_section">
                                    <span style={item.buyorsell == "buy" ? green : red}>
                                        {item.buyorsell == "sell" ? "Short" : "Long"}
                                    </span>
                                </div>
                            ),
                            Price:
                                item.price > 1 ? item.price.toFixed(2) : item.price.toFixed(5),
                            Quantity:
                                item.filledQuantity == 0
                                    ? "-"
                                    : item.filledQuantity > 1
                                        ? item.filledQuantity.toFixed(2)
                                        : item.filledQuantity.toFixed(5),
                            Volume: toFixed(
                                parseFloat(item.price) * parseFloat(item.filledQuantity),
                                5
                            ),
                            Order: capitalize(item.orderType),
                            Status: capitalize(item.status),
                        });
                    });
                    setData(resultArr);
                    setcount(result.count);
                } else {
                    setData([]);
                    setcount(0);
                }
            }
        } catch (err) {
            console.log(err, "err");
            setLoader(false);
        }
    };

    useEffect(() => {
        setFilter({ ...filter, page: currentPage });
        setData([]);
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
    return (
        <div className={`mb-3 ${styles.table_box}`}>
            <div className={`${styles.table_box_flx} mw-75 border-0`}>
                <div>
                    <label>Pair</label>
                    <Dropdown
                        className={styles.drp_down}
                        onSelect={(e: any) => handleCoin(e)}
                    >
                        <Dropdown.Toggle variant="primary" className="ms-0">
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
                    <label>Side </label>
                    <Dropdown
                        className={`${styles.drp_down}`}
                        onSelect={(e: any) => handleSide(e)}
                    >
                        <Dropdown.Toggle variant="primary" className="ms-0">
                            {!isEmpty(filter) && filter.buyorsell != undefined
                                ? filter.buyorsell == "buy"
                                    ? "Long"
                                    : filter.buyorsell == "sell"
                                        ? "Short"
                                        : "All"
                                : "All"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item eventKey="all">All</Dropdown.Item>
                            <Dropdown.Item eventKey="buy">Long</Dropdown.Item>
                            <Dropdown.Item eventKey="sell">Short</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                {/* <div className="w-auto">
                    <button
                        className={`${styles.dark} ${styles.primary_btn}`}
                        onClick={handleSearch}
                    >
                        <span></span>
                        <label>Search</label>
                    </button>
                </div> */}
                <div className="w-auto">
                    <button className={`${styles.clear_btn}`} onClick={handleReset}>
                        <label>Clear</label>
                        <Image
                            src="/assets/images/clear_icon.png"
                            className="img-fluid me-3"
                            alt="img"
                            width={16}
                            height={17}
                        />
                    </button>
                </div>
            </div>

            <Table responsive borderless>
                <thead>
                    <tr>
                        <th>Order Date</th>
                        <th>Contract</th>
                        <th>Side</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Volume</th>
                        <th>Order</th>
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
                    ) : data?.length > 0 ? (
                        data.map((item: any, key: number) => {
                            return (
                                <tr key={key}>
                                    <td>{item.Date}</td>
                                    <td>{item.Symbol}</td>
                                    <td>{item.Side}</td>
                                    <td>{toFixed(item.Price, 4)}</td>
                                    <td>{toFixed(item.Quantity, 4)}</td>
                                    <td>{toFixed(item.Volume, 4)}</td>
                                    <td>{item.Order}</td>
                                    <td>{item.Status}</td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={12}>
                                <div className="d-flex flex-column gap-3 align-items-center m-5">
                                    {theme === "light_theme" ? (
                                        <Image
                                            src="/assets/images/nodata_light.svg"
                                            alt="No data"
                                            className="img-fluid"
                                            width={96}
                                            height={96}
                                        />
                                    ) : (
                                        <Image
                                            src="/assets/images/nodata.svg"
                                            alt="No data"
                                            className="img-fluid"
                                            width={96}
                                            height={96}
                                        />
                                    )}
                                    <h6>No Records Found</h6>
                                </div>
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
