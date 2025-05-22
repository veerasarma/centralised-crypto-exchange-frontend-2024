import React, { useEffect, useState } from "react";
import styles from "../../styles/common.module.css";
import Mainnavbar from "../../components/navbar";
import Footer from "../../components/footer";
import dynamic from "next/dynamic";
import DataTable from "react-data-table-component";
import Image from "next/image";
import ProgressBar from "react-bootstrap/ProgressBar";
import { Dropdown, Table } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Form, InputGroup, Modal, Button, ButtonGroup } from "react-bootstrap";

//import service
import { toFixed, truncateDecimals } from "../../lib/roundOf";
import { apigetPairList } from "../../services/Spot/SpotService";
import { Container, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toastAlert } from "@/lib/toastAlert";
import Link from "next/link";
import {
  getPlans,
  getStakersHistory,
  getTotalCounts,
} from "../../services/affiliate/AffiliateService";
import { momentFormat } from "@/lib/dateTimeHelper";
import Transfer from "../../components/AffiliateDetails/Transfer.tsx";
import { useTheme } from "next-themes";
import isEmpty from "../../lib/isEmpty.js";
import { IncCntObjId } from "../../lib/generalFun.js";
import moment from "moment";
import config from "../../config/index.js"
const Pagination = dynamic(() => import("../../lib/pagination"), {
  ssr: false,
});

export default function AffiliateUserDetail() {
  const { theme, setTheme } = useTheme();
  const [orderShow, setOrderShow] = useState(false);
  const { refferalCode, userId } = useSelector((state) => state.auth.user);
  const handleShow = () => setOrderShow(true);
  const handleClose = () => setOrderShow(false);
  const [selectedDate, setSelectedDate] = useState("");
  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <div
      className="custom-date-picker"
      onClick={onClick}
      ref={ref}
      style={{
        backgroundColor: "#0f0f10",
        border: "1px solid transparent",
        borderRadius: "10px",
        padding: "16px 12px",
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        color: "#ababab",
        width: "180px",
      }}
    >
      <Image
        src={require("../../public/assets/images/affiliate-program/calender.png")}
        alt="Icon"
        width={14}
        height={16}
        className="me-2"
      />
      <span>{value || "Search By Date"}</span>
    </div>
  ));
  const [selectedValue, setSelectedValue] = useState("Search By Type"); // default value

  const [currentPlan, setCurrentPlan] = useState({});

  const [show, setShow] = useState(false);
  const handleCloseTrans = () => setShow(false);
  const handleShowTrans = (item) => {
    setCurrentPlan(item);
    setShow(true);
  };

  const copyToClipboard = (text) => {
    const tempInput = document.createElement("input");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    toastAlert("success", "Copied", "copy");
  };

  const [data, setData] = useState([]);

  const [count, setCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);

  const [filterData, setFilterData] = useState({
    fd_createdAt: "",
    fs_historyType: "",
  });

  const [filter, setFilter] = useState({
    page: 1,
    limit: 5,
    fillters: filterData,
  });

  const [historyLoader, setHistoryLoader] = useState(true);

  const fetchStakersHistory = async (fillter) => {
    try {
      setHistoryLoader(true);
      const { status, result } = await getStakersHistory(fillter);
      if (status) {
        setData(result.data);
        setCount(result.count);
      }
      setHistoryLoader(false);
    } catch (error) {
      setHistoryLoader(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStakersHistory(filter);
  }, [filter]);

  useEffect(() => {
    setFilter({ ...filter, page: currentPage });
  }, [currentPage]);

  useEffect(() => {
    console.log(selectedDate, "------135");
    setFilterData({
      ...filterData,
      fd_createdAt: selectedDate
        ? moment(selectedDate).format("YYYY-MM-DD")
        : "",
      fs_historyType: selectedValue != "Search By Type" ? selectedValue : "",
    });
  }, [selectedDate, selectedValue]);

  useEffect(() => {
    setFilter({ ...filter, fillters: filterData });
  }, [filterData]);

  // const [types, setTypes] = useState([])

  // useEffect(() => {
  //   if (data && data.length > 0) {
  //     setTypes([...new Set(data.map((item) => item.historyType))])
  //   }
  // }, [data])

  const [total, setTotal] = useState({});

  const [countLoader, setCountLoader] = useState(false);

  const fetchTotal = async () => {
    try {
      setCountLoader(true);
      const { status, result } = await getTotalCounts();
      if (status) {
        setTotal(result);
      }
      setCountLoader(false);
    } catch (error) {
      setCountLoader(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTotal();
  }, []);
  const onDateChange = (date) => {
    setSelectedDate(date);
  };
  const [planData, setPlanData] = useState([]);

  const [planLoader, setPlanLoader] = useState(false);

  const fetchPlans = async () => {
    try {
      setPlanLoader(true);
      const { status, result } = await getPlans();
      if (status) {
        setPlanData(result);
      }
      setPlanLoader(false);
    } catch (error) {
      setPlanLoader(false);
      console.log(error);
    }
  };
  
  useEffect(() => {
    fetchPlans();
  }, []);
  function formatHistoryType(str) {
    return str
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
  return (
    <>
      <Mainnavbar />
      <div className={styles.page_box}>
        <div
          className={`mb-4 ${styles.inner_head_box} ${styles.inner_head_box_small}`}
        >
          <Container>
            <Row>
              <Col lg={12} className="">
                <div className={`${styles.affilaite_user_investment}`}>
                  <h5 className={`mb-0 ${styles.inner_head_title}`}>
                    User Investment
                  </h5>
                  <div className={`mb-0 ${styles.user_id}`}>
                    <Image
                      src={require("../../public/assets/images/affiliate-program/user_icon.png")}
                      alt="Icon"
                      width={32}
                      height={32}
                      className="ms-2 me-2"
                    />
                    <div className="text-left">
                      <span>Referral Id</span>
                      <p>
                        {`${config.FRONT_URL}/register-B5/TOP/${userId}`}
                        {/* {refferalCode && refferalCode} */}
                        <span className="copy">
                          {" "}
                          <Image
                            src={require("../../public/assets/images/affiliate-program/copy_icon.png")}
                            alt="Icon"
                            width={18}
                            height={20}
                            className="ms-2 me-2"
                            style={{ cursor: "pointer" }}
                            // onClick={() => copyToClipboard(refferalCode)}
                            onClick={() => copyToClipboard(`${config.FRONT_URL}/register-B5/TOP/${userId}`)}
                          />
                          {/* <Image
                            src={require("../../public/assets/images/affiliate-program/share_icon.png")}
                            alt="Icon"
                            width={21}
                            height={20}
                            style={{cursor:"pointer"}}
                          /> */}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
        <div className={`${styles.asset}`}>
          <Container>
            <div className={`${styles.affiliate_user} pb-4`}>
              <div className={`${styles.user_invest}`}>
                <Image
                  src={require("../../public/assets/images/affiliate-program/total_icon.png")}
                  alt="Icon"
                  width={28}
                  height={33}
                  className=""
                />
                <div>
                  <span>Total Investment</span>
                  {countLoader ? (
                    <p className="mb-0 mt-2">
                      <div
                        class="spinner-border spinner-border-sm"
                        role="status"
                      >
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </p>
                  ) : (
                    <p className="mb-0 mt-2">
                      ${toFixed(total?.totInvestment, 4) + " USDT"}
                    </p>
                  )}
                </div>
              </div>
              <div className={`${styles.user_invest}`}>
                <Image
                  src={require("../../public/assets/images/affiliate-program/total_icon_1.png")}
                  alt="Icon"
                  width={33}
                  height={33}
                  className=""
                />
                <div>
                  <span>Total Reward</span>
                  {countLoader ? (
                    <p className="mb-0 mt-2">
                      <div
                        class="spinner-border spinner-border-sm"
                        role="status"
                      >
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </p>
                  ) : (
                    <p className="mb-0 mt-2">
                      ${toFixed(total?.totReward, 4) + " USDT"}
                    </p>
                  )}
                </div>
              </div>
              <div className={`${styles.user_invest}`}>
                <Image
                  src={require("../../public/assets/images/affiliate-program/total_icon_2.png")}
                  alt="Icon"
                  width={29}
                  height={33}
                  className=""
                />
                <div>
                  <span>Total Brokerage</span>
                  {countLoader ? (
                    <p className="mb-0 mt-2">
                      <div
                        class="spinner-border spinner-border-sm"
                        role="status"
                      >
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </p>
                  ) : (
                    <p className="mb-0 mt-2">
                      ${toFixed(total?.totBrokerage, 4) + " USDT"}
                    </p>
                  )}
                </div>
              </div>
              <div className={`${styles.user_invest}`}>
                <Image
                  src={require("../../public/assets/images/affiliate-program/total_icon_3.png")}
                  alt="Icon"
                  width={30}
                  height={33}
                  className=""
                />
                <div>
                  <span>Total Contributors</span>
                  {countLoader ? (
                    <p className="mb-0 mt-2">
                      <div
                        class="spinner-border spinner-border-sm"
                        role="status"
                      >
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </p>
                  ) : (
                    <p className="mb-0 mt-2">{total?.totContributor}</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h5 className={`mb-4 mt-4 ${styles.inner_head_title}`}>
                Investment List
              </h5>
              {planLoader ? (
                <div className="text-center mb-5 pb-5 mt-5">
                  <div class="spinner-border spinner-border-lg" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className={`${styles.user_investment_list} mb-5 row`}>
                  {Array.isArray(planData) &&
                    planData.length > 0 &&
                    planData.map((item, index) => (
                      <div className="col-xl-4 col-lg-6">
                        <div
                          key={index}
                          className={` ${styles.user_invest_list_box}`}
                        >
                          <div className={` ${styles.user_invest_list}`}>
                            <div>
                              <span>Total Investment</span>
                              <p className="mb-0 mt-2">
                                {toFixed(item.totalInvestment, 2) +
                                  " " +
                                  item.coin}
                              </p>
                            </div>
                          </div>
                          <div className={` ${styles.user_referal}`}>
                            <span>Referral Bonus</span>
                            <div className="staked_progress">
                              <div className="progress_bar">
                                <div
                                  className="progress_fill"
                                  style={{
                                    width: `${(item.totalRewardClaimed /
                                      item.totalRewardVal) *
                                      100
                                      }%`,
                                  }}
                                ></div>{" "}
                                {/* Adjust width for progress */}
                              </div>
                              <div className="staked_progress_flex">
                                <label>
                                  {truncateDecimals(item.totalRewardClaimed, 2)}
                                </label>
                                <label>B5 Token</label>
                                <label>
                                  {truncateDecimals(item.totalRewardVal, 2)}
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className={` ${styles.user_contribute}`}>
                            <div className="d-flex align-items-center justify-content-between">
                              <span>1st Contributor</span>
                              <p className="mb-0">
                                {toFixed(item.firstCont, 2)}
                              </p>
                            </div>
                            <div className="d-flex align-items-center justify-content-between gap-5 mt-2">
                              <span>2nd Contributor</span>
                              <p className="mb-0">
                                {toFixed(item.secondCont, 2)}
                              </p>
                            </div>
                            <div className="d-flex align-items-center justify-content-between gap-5 mt-2">
                              <span>3rd Contributor</span>
                              <p className="mb-0">
                                {toFixed(item.thirdCont, 2)}
                              </p>
                            </div>
                            <div className="d-flex align-items-center justify-content-between gap-5 mt-2">
                              <span>Brokerage</span>
                              <p className="mb-0">
                                {toFixed(item.totalBrokerage, 2)}
                              </p>
                            </div>
                            <div className="d-flex align-items-center justify-content-between gap-5 mt-3">
                              <p className="align-self-center">
                                Total Earnings Token
                              </p>
                              <p>
                                <span>
                                  {" "}
                                  <Image
                                    src={require("../../public/assets/images/affiliate-program/b5_icon.png")}
                                    alt="Icon"
                                    width={32}
                                    height={32}
                                    className="me-2 mobile_none"
                                  />
                                </span>
                                {truncateDecimals(item.totalRewardClaimed, 2)}
                              </p>
                            </div>
                            <div className="mx-auto text-center">
                              <button
                                className={`${styles.dark} ${styles.primary_btn} register butn mt-4`}
                                onClick={() => handleShowTrans(item)}
                              >
                                <span></span>
                                <label>Transfer</label>
                              </button>
                            </div>
                            <h6 className="text-center mt-4">
                              All withdrawals are only using B5 Tokens
                            </h6>
                          </div>
                        </div>
                      </div>
                    ))}
                  <div className="col-xl-4 col-lg-6">
                    <div
                      className={` ${styles.user_invest_list_box} ${styles.user_invest_package_box}`}
                    >
                      <Link
                        href={"/affiliateProgram"}
                        className="text-decoration-none"
                      >
                        <div className={` ${styles.add_package}`}>
                          <Image
                            src={require("../../public/assets/images/affiliate-program/package_icon.png")}
                            alt="Icon"
                            width={36}
                            height={32}
                            className=""
                          />
                          <p className="mb-0 mt-2">Add Package</p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className={`${styles.affilaite_user_investment} mb-5`}>
                <h5 className={`mb-0 ${styles.inner_head_title}`}>
                  Transaction History
                </h5>
                <div className={`${styles.history_select_box} mw-75 border-0`}>
                  <div className="chartFilter">
                    <div className="datapick">
                      <DatePicker
                        maxDate={new Date(moment().format("MM-DD-YYYY"))}
                        className="datapick_head"
                        selected={selectedDate}
                        onChange={(date) => onDateChange(date)}
                        isClearable
                        dateFormat="dd/MM/yyyy"
                        customInput={<CustomInput />}
                      />
                    </div>
                  </div>
                  <div>
                    {/* <label>All Time</label> */}
                    <Dropdown
                      className={styles.drp_down}
                      onSelect={(value) => setSelectedValue(value)}
                    >
                      <Dropdown.Toggle variant="primary" className="ms-0">
                        {formatHistoryType(selectedValue)}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item eventKey={"small_staker_purchase"}>
                          Small Stakers Purchase
                        </Dropdown.Item>
                        <Dropdown.Item eventKey={"affiliate_to_spot_transfer"}>
                          Affiliate To Spot Transfer
                        </Dropdown.Item>
                        <Dropdown.Item eventKey={"big_staker_purchase"}>
                          Big Stakers Purchase
                        </Dropdown.Item>
                        <Dropdown.Item
                          eventKey={"small_staker_purchase_reward"}
                        >
                          Small Stakers Purchase Reward
                        </Dropdown.Item>
                        <Dropdown.Item eventKey={"big_staker_purchase_reward"}>
                          Big Stakers Purchase Reward
                        </Dropdown.Item>
                        <Dropdown.Item
                          eventKey={"small_staker_contributor_reward"}
                        >
                          Small Stakers Contributor Reward
                        </Dropdown.Item>
                        <Dropdown.Item
                          eventKey={"big_staker_contributor_reward"}
                        >
                          Big Stakers Contributor Reward
                        </Dropdown.Item>
                        <Dropdown.Item eventKey={"brokerage_fee"}>
                          Brokerage Fee
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item eventKey={"Search By Type"}>
                          Clear Search
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              </div>
              <div class="table-responsive">
                <table class="table transaction_table">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="text-center"
                        style={{ width: "16%" }}
                      >
                        Order Date
                      </th>
                      <th scope="col" className="text-center">
                        User ID
                      </th>
                      <th scope="col" className="text-center">
                        Contributor User ID
                      </th>
                      <th scope="col" className="text-center">
                        Currency
                      </th>
                      <th scope="col" className="text-center">
                        Amount
                      </th>
                      <th scope="col" className="text-center">
                        Reward Currency
                      </th>
                      <th scope="col" className="text-center">
                        Reward Amount
                      </th>
                      <th scope="col" className="text-center">
                        Type
                      </th>
                    </tr>
                  </thead>
                  {historyLoader ? (
                    <div className="text-center mt-5">
                      <div
                        class="spinner-border spinner-border-lg"
                        role="status"
                      >
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : Array.isArray(data) && data.length === 0 ? (
                    <tbody>
                      <tr>
                        <td colSpan={8}>
                          <div className="nodata">
                            {theme === "light_theme" ? (
                              <Image
                                src="/assets/images/nodata_light.svg"
                                alt="image"
                                className="img-fluid"
                                width={96}
                                height={96}
                              />
                            ) : (
                              <Image
                                src="/assets/images/nodata.svg"
                                alt="image"
                                className="img-fluid"
                                width={96}
                                height={96}
                              />
                            )}
                            <h6 className="text-center">No records found</h6>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  ) : (
                    <tbody>
                      {Array.isArray(data) &&
                        data.map((item) => (
                          <tr>
                            <th scope="row" className="text-center">
                              {momentFormat(item.createdAt)}
                            </th>
                            <td>{item.userCode}</td>
                            <td>
                              {!isEmpty(item?.childId)
                                ? IncCntObjId(item.childId)
                                : "-"}
                            </td>
                            <td>
                              {item.type === "small"
                                ? item.tokenName
                                : item.coinName}
                            </td>
                            <td>{item.amount}</td>
                            <td>{item.rewardCoin ? item.rewardCoin : "-"}</td>
                            <td>
                              {item.rewardAmount ? item.rewardAmount : "-"}
                            </td>
                            <td>{formatHistoryType(item.historyType)}</td>
                          </tr>
                        ))}
                      <tr>
                        {/* <td
                        colSpan="6"
                        className="flex-end"
                        scope="row"
                        style={{ textAlign: "right" }}
                      >
                        <p className="mb-0">Gross Total</p>
                      </td>
                      <td>
                        <p className="mb-0">76.92</p>
                      </td> */}
                      </tr>
                    </tbody>
                  )}
                </table>
              </div>
              <Pagination
                currentPage={currentPage}
                totalCount={count}
                pageSize={5}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </Container>
        </div>
      </div>
      <div className="mt-5 pt-5">
        <Footer />
      </div>
      <Transfer
        show={show}
        handleCloseTrans={handleCloseTrans}
        planData={currentPlan}
        fetchStakersHistory={fetchStakersHistory}
        filter={filter}
      />
    </>
  );
}
