import { useEffect, useContext, useState } from "react";
import styles from "@/styles/common.module.css";
import Image from "next/image";
import Link from "next/link";
import { Container, InputGroup, Table, Form, Row, Col } from "react-bootstrap";
//import lib
import isEmpty from "@/lib/isEmpty";
import { toFixed } from "@/lib/roundOf";
//improt context
import SocketContext from "../Context/SocketContext";
//improt store
import { useSelector } from "../../store";
import { nWComma } from "@/lib/calculation";
import FavoritesTable from "./FavoritesTable";
import CryptoTable from "./CryptoTable";
import InverseTable from "./InverseTable";
import SpotTable from "./SpotTable";
import NewlistingTable from "./Newlisting";
import FuturesTable from "./FuturesTable";
import { Button } from "react-bootstrap/lib/InputGroup";
import config from "../../config";
import NewList from "./NewList";
import TopGainers from "./TopGainers";
import TopVolume from "./TopVolume";
import HotCoins from "./HotCoin";
import { useRouter } from "next/router";
import Humanize from "humanize-plus"

export default function MarketPageTableNew({ pairList, futurePair, inversePair, isLoadingSp }: any) {
  const router = useRouter();
  const { type: queryType } = router.query; // Read the query parameter
  const [type, setType] = useState<string>(queryType || "spot")
  const [usdtValue, setusdValue] = useState<any>();
  const socketContext = useContext<any>(SocketContext);
  const [data, setData] = useState<any>([]);
  const [marketData, setMarkData] = useState<any>({
    spotMark: {},
    futureMark: {},
    inverseMark: {}
  });
  const [secondCurrencyList, setsecondCurrencyList] = useState<any>([]);
  const [selectCurr, setSelectCurr] = useState<string>("");
  const [selectTabCurr, setSelectTabCurr] = useState<string>("");
  const [search, setSearch] = useState<boolean>(false);
  const { priceConversion } = useSelector((state: any) => state.wallet);

  const { spotMark, futureMark, inverseMark } = marketData
  const handleTabClick = (tabid: any) => {
    setSelectCurr(tabid);
    setSearch(false);
    setSelectTabCurr(tabid);
  };

  const secondCurrencyArray = (pairList: any) => {
    let uniqueChars: any = [];
    pairList.forEach((c: any) => {
      if (!uniqueChars.includes(c.secondCurrencySymbol)) {
        uniqueChars.push(c.secondCurrencySymbol);
      }
    });
    setsecondCurrencyList(uniqueChars);
    setSelectTabCurr(uniqueChars[0]);
    setSelectCurr(uniqueChars[0]);
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;
    if (isEmpty(value)) {
      setSearch(false);
      setSelectCurr(secondCurrencyList[0]);
      setSelectTabCurr(secondCurrencyList[0]);
    } else {
      setSearch(true);
      setSelectCurr(value);
    }
  };

  const getPairData = (pairList: any) => {
    let newArr: any = [];
    pairList?.length > 0 &&
      pairList.map((item: any) => {
        let usdtValue;
        if (item.secondCurrencySymbol == "USDT") {
          usdtValue = item.markPrice;
        } else {
          let MarkValue = priceConversion.find(
            (elem: any) =>
              elem.baseSymbol == item.secondCurrencySymbol &&
              elem.convertSymbol == "USDT"
          );
          if (MarkValue) {
            usdtValue = item.markPrice * MarkValue.convertPrice;
          } else {
            usdtValue = item.markPrice;
          }
        }
        newArr.push({ ...item, ...{ usdtValue } });
      });
    newArr = newArr.sort((a: any, b: any) => b.secondVolume - a.secondVolume);
    setData(newArr);
  };

  useEffect(() => {
    if (isEmpty(data)) {
      getPairData(pairList);
      secondCurrencyArray(pairList);
    }
  }, [data]);

  useEffect(() => {
    // socket
    socketContext.spotSocket.on("marketPrice", (result: any) => {
      let tempPairList = [...data];
      let pairIndex =
        tempPairList &&
        tempPairList.findIndex((el: any) => {
          return el._id == result.pairId;
        });
      if (pairIndex >= 0 && !isEmpty(pairIndex)) {
        let usdtValue;
        if (tempPairList[pairIndex].secondCurrencySymbol == "USDT") {
          usdtValue = result.data.markPrice;
        } else {
          let MarkValue = priceConversion.find(
            (item: any) =>
              item.baseSymbol == tempPairList[pairIndex].secondCurrencySymbol &&
              item.convertSymbol == "USDT"
          );
          if (MarkValue) {
            usdtValue = result.data.markPrice * MarkValue.convertPrice;
          } else {
            usdtValue = result.data.markPrice;
          }
        }
        tempPairList[pairIndex] = {
          ...tempPairList[pairIndex],
          ...{
            markPrice: result.data.markPrice,
            change: result.data.change,
            usdtValue,
          },
        };
        setData(tempPairList);
      }
    });
  }, [data]);

  useEffect(() => {
    socketContext.spotSocket.emit("subscribe", "spot");
    return () => {
      socketContext.spotSocket.off("marketPrice");
      socketContext.spotSocket.emit("unSubscribe", "spot");
    };
  }, []);
  useEffect(() => {
    // socket
    socketContext.spotSocket.on("marketPrice", (result: any) => {
      setMarkData({ ...marketData, ...{ spotMark: result } })
    });
  }, []);
  useEffect(() => {
    socketContext.spotSocket.emit("subscribe", "spot");
    return () => {
      socketContext.spotSocket.off("marketPrice");
      socketContext.spotSocket.emit("unSubscribe", "spot");
    };
  }, []);
  return (
    <Container>
      <div className={`${styles.trending_pair1}`}>
        <Row>
          <Col
            xl={3}
            lg={6}
            md={6}
            sm={6}
            className={`mb-4 ${styles.box1_head}`}
          >
            <div className={`W-100 ${styles.box1} ${styles.minheight}`}>
              <div className={styles.box_head}>
                <a href="#" className={`mb-4 ${styles.atag} `}>
                  Hot Coins
                </a>
              </div>
              <HotCoins pairList={pairList} spotMark={spotMark} />
            </div>
          </Col>
          <Col
            xl={3}
            lg={6}
            md={6}
            sm={6}
            className={`mb-4 ${styles.box1_head}`}
          >
            <div className={`W-100 ${styles.box1} ${styles.minheight}`}>
              <div className={styles.box_head}>
                <a href="#" className={`mb-4 ${styles.atag} `}>
                  New Listing
                </a>
              </div>
              <NewList pairList={pairList} spotMark={spotMark} />

            </div>
          </Col>
          <Col
            xl={3}
            lg={6}
            md={6}
            sm={6}
            className={`mb-4 ${styles.box1_head}`}
          >
            <div className={`W-100 ${styles.box1} ${styles.minheight}`}>
              <div className={styles.box_head}>
                <a href="#" className={`mb-4 ${styles.atag} `}>
                  Top Gainer Coin
                </a>
              </div>
              <TopGainers pairList={pairList} spotMark={spotMark} />
            </div>
          </Col>
          <Col
            xl={3}
            lg={6}
            md={6}
            sm={6}
            className={`mb-4 ${styles.box1_head}`}
          >
            <div className={`W-100 ${styles.box1} ${styles.minheight}`}>
              <div className={styles.box_head}>
                <a href="#" className={`mb-4 ${styles.atag} `}>
                  Top Volume Coin
                </a>
              </div>
              <TopVolume pairList={pairList} spotMark={spotMark} />
            </div>
          </Col>
        </Row>
      </div>
      <div className={styles.tab_search}>
        <InputGroup className={styles.tab_search_input}>
          <Form.Control
            className={styles.tab_search_inputbox}
            placeholder="Search coin name"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
          />
          <InputGroup.Text id="basic-addon2">
            {" "}
            <Image
              src="/assets/images/search.png"
              alt="image"
              className="img-fluid"
              width={16}
              height={16}
            />
          </InputGroup.Text>
        </InputGroup>

      </div>
      <div className=" tabs1 pb-2 my-4 w-100">
        <div className={styles.flex_nav}>
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className={isEmpty(type) ? "nav-link active" : "nav-link"}
                id="home-tab"
                data-bs-toggle="tab"
                data-bs-target="#home"
                type="button"
                role="tab"
                aria-controls="home"
                aria-selected="true"
              >
                Favorites
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${type === "spot" ? "active" : ""}`}
                id="contact-tab"
                data-bs-toggle="tab"
                data-bs-target="#contact"
                type="button"
                role="tab"
                aria-controls="contact"
                aria-selected={type === "spot"}
              >
                Spot Markets
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${type === "future" ? "active" : ""}`}
                id="Futures-tab"
                data-bs-toggle="tab"
                data-bs-target="#Futures"
                type="button"
                role="tab"
                aria-controls="Futures"
                aria-selected={type === "future"}
              >
                Futures Markets
              </button>
            </li>
            {config.MODE !== "prod" &&
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link ${type === "inverse" ? "active" : ""}`}
                  id="profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#profile"
                  type="button"
                  role="tab"
                  aria-controls="profile"
                  aria-selected={type === "inverse"}
                >
                  Inverse Markets
                </button>
              </li>
            }
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="Listing-tab"
                data-bs-toggle="tab"
                data-bs-target="#Listing"
                type="button"
                role="tab"
                aria-controls="Listing"
                aria-selected="false"
              >
                New Listing
              </button>
            </li>
          </ul>
          {/* <div className={styles.search_box_head}>
            <div className={styles.search_box}>
              <input
                className={styles.search_txt}
                type="text"
                name=""
                placeholder="Search coin name"
              />
              <a className={styles.search_btn} href="#">
                <Image
                  src="/assets/images/search.png"
                  alt="image"
                  className="img-fluid"
                  width={16}
                  height={16}
                />
              </a>
            </div>
          </div> */}

        </div>
        <div className="tab-content" id="myTabContent">
          <div
            className={isEmpty(type) ? "tab-pane fade show active" : "tab-pane"}
            id="home"
            role="tabpanel"
            aria-labelledby="home-tab"
          >
            <FavoritesTable pairList={pairList} spotMark={spotMark} futurePair={futurePair} inversePair={inversePair} />
          </div>
          <div
            className={type == "inverse" ? "tab-pane fade show active" : "tab-pane"}
            id="profile"
            role="tabpanel"
            aria-labelledby="profile-tab"
          >
            {/* <CryptoTable /> */}
            <InverseTable inversePair={inversePair} />
          </div>
          <div
            className={type == "spot" ? "tab-pane fade show active" : "tab-pane"}
            id="contact"
            role="tabpanel"
            aria-labelledby="contact-tab"
          >
            <SpotTable pairList={pairList} isLoading={isLoadingSp} spotMark={spotMark} />
          </div>
          <div
            className={type == "future" ? "tab-pane fade show active" : "tab-pane"}
            id="Futures"
            role="tabpanel"
            aria-labelledby="Futures-tab"
          >
            <FuturesTable futurePair={futurePair} />
          </div>
          <div
            className="tab-pane fade"
            id="Listing"
            role="tabpanel"
            aria-labelledby="Listing-tab"
          >
            <NewlistingTable pairList={pairList} spotMark={spotMark} />
          </div>
        </div>
      </div>
      {/* <div className="d-lg-flex justify-content-between  pb-2 my-4 w-100">
        <div className="tabs d-flex">
          {secondCurrencyList?.length > 0 &&
            secondCurrencyList.map((item: string, index: number) => {
              return (
                <div className="nav-item" key={index}>
                  <button
                    onClick={() => handleTabClick(item)}
                    className={`${
                      selectTabCurr.toUpperCase() === item.toUpperCase()
                        ? "active"
                        : ""
                    }   `}
                  >
                    {item}
                  </button>
                </div>
              );
            })}
        </div>
        <div>
          <InputGroup className={`${styles.input_grp} mt-3 mt-lg-0`}>
            <Form.Control
              placeholder="Search"
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
              className={styles.text}
              onChange={handleSearch}
            />
            <InputGroup.Text id="basic-addon2" className={styles.grp_text}>
              <Image
                src="/assets/images/search.png"
                alt="image"
                className="img-fluid"
                width={25}
                height={25}
              />
            </InputGroup.Text>
          </InputGroup>
        </div>
      </div> */}
      {/* <div className={`${styles.asset_table} ${styles.asset_table_chg}`}>
        <Table responsive>
          <thead>
            <tr>
              <th>Pairs</th>
              <th> Last Price </th>
              <th className="text-end"> 24h Change </th>
              <th className="text-end">24h High</th>
              <th className="text-end px-4">24h Low</th>
              <th className="text-end">24h Volume</th>
              <th className="text-end pe-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.length > 0 &&
              data.map((item: any, index: number) => {
                if (
                  selectCurr?.toUpperCase() ==
                  (search
                    ? item?.firstCurrencySymbol.toUpperCase()
                    : item?.secondCurrencySymbol.toUpperCase())
                ) {
                  if (
                    search &&
                    selectTabCurr.toUpperCase() ===
                      item?.secondCurrencySymbol.toUpperCase()
                  ) {
                    return (
                      <tr key={index}>
                        <td>
                          <div className="py-1">
                            {!isEmpty(item.firstCurrencyImage) && (
                              <Image
                                src={item.firstCurrencyImage}
                                alt="image"
                                className={`rounded-5 ${styles.right_icon} img-fluid`}
                                width={25}
                                height={25}
                              />
                            )}{" "}
                            <span>
                              {item.firstCurrencySymbol}/
                              {item.secondCurrencySymbol}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className={styles.green_text}>
                            {nWComma(toFixed(item.markPrice, 2))}
                          </span>{" "}
                          <span className={styles.grey_text}>
                            / $
                            {nWComma(
                              toFixed(
                                isEmpty(item.usdtValue)
                                  ? item.markPrice
                                  : item.usdtValue,
                                2
                              )
                            )}
                          </span>
                        </td>
                        <td className="text-end">
                          <span
                            style={{
                              color: toFixed(item.change) > 0 ? "green" : "red",
                            }}
                            className={
                              item.change > 0
                                ? styles.green_text
                                : styles.red_text
                            }
                          >
                            {!isEmpty(item?.change)
                              ? toFixed(item.change, 2)
                              : 0}
                            %
                          </span>
                        </td>
                        <td className="text-end">
                          {!isEmpty(item?.high)
                            ? nWComma(toFixed(item.high, 2))
                            : 0}
                        </td>
                        <td className="text-end px-4">
                          {!isEmpty(item?.low)
                            ? nWComma(toFixed(item.low, 2))
                            : 0}
                        </td>
                        <td className="text-end">
                          {!isEmpty(item?.secondVolume)
                            ? nWComma(toFixed(item.secondVolume, 2))
                            : 0}
                        </td>
                        <td className="text-end pe-4">
                          <Link
                            href={`/spot/${item.firstCurrencySymbol}_${item.secondCurrencySymbol}`}
                            className={`${styles.green_text} text-decoration-none`}
                          >
                            Trade
                          </Link>
                        </td>
                      </tr>
                    );
                  } else if (!search) {
                    return (
                      <tr key={index}>
                        <td>
                          <div className="py-1">
                            {!isEmpty(item.firstCurrencyImage) && (
                              <Image
                                src={item.firstCurrencyImage}
                                alt="image"
                                className={`rounded-5 ${styles.right_icon} img-fluid`}
                                width={25}
                                height={25}
                              />
                            )}{" "}
                            <span>
                              {item.firstCurrencySymbol}/
                              {item.secondCurrencySymbol}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className={styles.green_text}>
                            {nWComma(toFixed(item.markPrice, 2))}
                          </span>{" "}
                          <span className={styles.grey_text}>
                            / $
                            {nWComma(
                              toFixed(
                                isEmpty(item.usdtValue)
                                  ? item.markPrice
                                  : item.usdtValue,
                                2
                              )
                            )}
                          </span>
                        </td>
                        <td className="text-end">
                          <span
                            style={{
                              color: toFixed(item.change) > 0 ? "green" : "red",
                            }}
                            className={
                              item.change > 0
                                ? styles.green_text
                                : styles.red_text
                            }
                          >
                            {!isEmpty(item?.change)
                              ? toFixed(item.change, 2)
                              : 0}
                            %
                          </span>
                        </td>
                        <td className="text-end">
                          {!isEmpty(item?.high)
                            ? nWComma(toFixed(item.high, 2))
                            : 0}
                        </td>
                        <td className="text-end px-4">
                          {!isEmpty(item?.low)
                            ? nWComma(toFixed(item.low, 2))
                            : 0}
                        </td>
                        <td className="text-end">
                          {!isEmpty(item?.secondVolume)
                            ? nWComma(toFixed(item.secondVolume, 2))
                            : 0}
                        </td>
                        <td className="text-end pe-4">
                          <Link
                            href={`/spot/${item.firstCurrencySymbol}_${item.secondCurrencySymbol}`}
                            className={`${styles.green_text} text-decoration-none`}
                          >
                            Trade
                          </Link>
                        </td>
                      </tr>
                    );
                  }
                }
              })}
          </tbody>
        </Table>
      </div> */}
    </Container>
  );
}
