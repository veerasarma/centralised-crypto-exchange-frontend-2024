import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import spot from "@/styles/Spot.module.css";
import { useRouter, asPath } from "next/router";
import { Form, Table, DropdownButton, Dropdown } from "react-bootstrap";
//improt store
import { useSelector, useDispatch } from "../../store";
import {
  setMarkData,
  setTradePair,
  setUpdateMarkData,
  setFavPair,
  setUpdateAllMarkData,
} from "../../store/trade/dataSlice";
//improt lib
import isEmpty from "@/lib/isEmpty";
import { toFixed } from "@/lib/roundOf";
import { toastAlert } from "@/lib/toastAlert";
//improt context
import SocketContext from "../Context/SocketContext";
//improt service
import { addFav, getPairList } from "../../services/Spot/SpotService";
import { getFavourite } from "@/store/UserSetting/dataSlice";

const FavColor: React.CSSProperties = {
  color: "#FFCC66",
};

const spinner: React.CSSProperties = {
  fontSize: "26px",
};

export default function PairList(props: any) {
  let history = useRouter();
  const socketContext = useContext<any>(SocketContext);
  const dispatch = useDispatch();
  const { pairList, marketData, tradePair, allMarketData } = useSelector(
    (state: any) => state.spot
  );
  const { favourite } = useSelector((state: any) => state.UserSetting.data);
  let fav = favourite?.spotCount ? favourite.spotCount : [];
  // const [pair_box, setpair_box] = useState(false);
  const [selectedValue, setSelectedValue] = useState("Change");
  const [secondCurrencyList, setsecondCurrencyList] = useState<any>([]);
  const [selectCurr, setSelectCurr] = useState<string>("");
  const [selectTabCurr, setSelectTabCurr] = useState<string>("");
  const [search, setSearch] = useState<boolean>(false);
  const [favPair, setFavourite] = useState<any>(fav);
  const [isVol, setisVlo] = useState<boolean>(false);
  const [pairData, setPairData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const isLogin = useSelector((state: any) => state.auth.session.signedIn);

  const pair_tab = (tabId: string) => {
    setSelectCurr(tabId);
    setSearch(false);
    setSelectTabCurr(tabId);
  };

  const handleDropdownSelect = (eventKey: any) => {
    setSelectedValue(eventKey);
  };

  // const pair_sidebar_close = () => {
  //     setpair_box(false)
  // };
  const secondCurrencyArray = (pairList: any) => {
    let uniqueChars: any = [];
    dispatch(setUpdateAllMarkData(pairList));
    pairList.forEach((c: any) => {
      if (!uniqueChars.includes(c.secondCurrencySymbol)) {
        uniqueChars.push(c.secondCurrencySymbol);
      }
    });
    setsecondCurrencyList(uniqueChars);
    const URLPair = asPath.split("/")[2];
    const currency = URLPair.split("_");
    if (uniqueChars.includes(currency[1])) {
      setSelectTabCurr(currency[1]);
      setSelectCurr(currency[1]);
    } else {
      setSelectTabCurr(uniqueChars[0]);
      setSelectCurr(uniqueChars[0]);
    }
  };

  const handlePair = (item: any) => {
    dispatch(setTradePair(item));
    dispatch(setMarkData(item));
    const URLPair = asPath.split("/")[2];
    const currency = URLPair.split("_");
    socketContext.spotSocket.emit("unSubscribe", currency[0] + currency[1]);
    history.push(
      {
        pathname:
          "/spot/" + item.firstCurrencySymbol + "_" + item.secondCurrencySymbol,
      },
      undefined,
      { shallow: true }
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const URLPair = asPath.split("/")[2];
    const currency = URLPair.split("_");
    let { value } = e.target;
    if (isEmpty(value)) {
      setSearch(false);
      setSelectCurr(currency[1]);
      setSelectTabCurr(currency[1]);
    } else {
      setSearch(true);
      setSelectCurr(value);
    }
  };

  // useEffect(() => {
  //   if (!isEmpty(pairData)) {
  //     secondCurrencyArray(pairData);
  //   }
  //   console.log(pairData, "pairList34")
  // }, [pairData]);

  // const handleFav = async (pairId: string) => {
  //   let data = {
  //     pairId,
  //   };

  //   if (isLogin) addFav(data);
  //   let tempPairList = [...favPair];
  //   let pairIndex: number = -1;
  //   pairIndex = tempPairList.indexOf(pairId);
  //   if (pairIndex >= 0 && !isEmpty(pairIndex)) {
  //     if (isEmpty(tempPairList.splice(pairIndex, 1))) {
  //       dispatch(setFavPair([]));
  //     } else {
  //       dispatch(setFavPair(tempPairList));
  //     }
  //     toastAlert("success", "Removed successfully", "fav");
  //   } else {
  //     toastAlert("success", "Added successfully", "fav");
  //     tempPairList.push(pairId);
  //     dispatch(setFavPair(tempPairList));
  //   }
  // };
  const getFavorites = (): string[] => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("spotFav") || "[]");
    }
    return [];
  };
  const handleFav = async (pairId: string) => {
    const currentFavorites = getFavorites();
    let updatedFavorites;
    if (currentFavorites.includes(pairId)) {
      updatedFavorites = currentFavorites.filter((fav) => fav !== pairId);
    } else {
      updatedFavorites = [...currentFavorites, pairId];
    }
    localStorage.setItem("spotFav", JSON.stringify(updatedFavorites));
    dispatch(getFavourite());
  };
  useEffect(() => {
    let favourites = favourite?.spotCount ? favourite.spotCount : [];
    setFavourite(favourites);
  }, [favourite]);
  useEffect(() => {
    // socket
    socketContext.spotSocket.on("marketPrice", (result: any) => {
      if (result.pairId == marketData._id) {
        dispatch(setUpdateMarkData(result.data));
      }
      let tempPairList = [...allMarketData];
      let pairIndex = tempPairList.findIndex((el: any) => {
        return el._id == result.pairId;
      });
      if (pairIndex >= 0) {
        tempPairList[pairIndex] = {
          ...tempPairList[pairIndex],
          markPrice: result.data.markPrice,
          change: result.data.change,
          secondVolume: result.data.secondVolume,
        };
        dispatch(setUpdateAllMarkData([...tempPairList]));
        // setPairListData([...tempPairList]);
      }

      setPairData((prev: any) => {
        if (prev.length === 0) return prev;
        return prev.map((pair: any) =>
          pair._id == result.pairId
            ? {
                ...pair,
                markPrice: result.data.markPrice,
                change: result.data.change,
                secondVolume: result.data.secondVolume,
              }
            : pair
        );
      });
    });

    return () => {
      socketContext.spotSocket.off("marketPrice");
    };
  }, [allMarketData]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let resp: any = await getPairList();
      if (!isEmpty(resp.result)) {
        secondCurrencyArray(resp.result);
        setPairData(resp.result);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  console.log(favPair, "------185");
  return (
    <div
      className={`${spot.market_pair_info}  ${spot.fixed} ${
        props.pair_box ? spot.show : ""
      } `}
    >
      <div className={spot.box}>
        <div className={spot.close}>
          <Image
            src="/assets/images/close.svg"
            alt="Icon"
            className="img-fluid"
            width={16}
            height={16}
            onClick={props.pair_sidebar}
          />
        </div>
        <div className={spot.head_box}>
          <Form.Control
            type="text"
            placeholder="Search"
            onChange={handleSearch}
          />
          {/* <DropdownButton
            id="dropdown-basic-button"
            className={spot.drp_btn}
            title={selectedValue}
            onSelect={handleDropdownSelect}
          >
            <Dropdown.Item eventKey="Change" onClick={() => setisVlo(false)}>
              Change
            </Dropdown.Item>
            <Dropdown.Item eventKey="Vol" onClick={() => setisVlo(true)}>
              Vol{" "}
            </Dropdown.Item>
          </DropdownButton> */}
        </div>
        <div className={spot.pairs}>
          {secondCurrencyList?.length > 0 &&
            secondCurrencyList.map((item: string, index: number) => {
              return (
                <h6
                  className={`${
                    selectTabCurr?.toUpperCase() === item?.toUpperCase()
                      ? spot.active
                      : ""
                  } `}
                  onClick={() => pair_tab(item)}
                  key={index}
                >
                  {item}
                </h6>
              );
            })}
        </div>
        <div className={`${spot.table_box} ${spot.table_box_dropdown}`}>
          <Table>
            <thead>
              <tr>
                <th>
                  Pairs<i className="fa-solid fa-sort"></i>
                </th>
                <th>
                  Price <i className="fa-solid fa-sort"></i>
                </th>
                <th>
                  {isVol ? "Vol" : "Change"}{" "}
                  <i className="fa-solid fa-sort"></i>
                </th>
              </tr>
            </thead>

            <tbody>
              {!loading &&
                pairData?.length > 0 &&
                pairData.map((item: any, index: number) => {
                  {
                    if (
                      selectCurr?.toUpperCase() ==
                      (search
                        ? item?.firstCurrencySymbol?.toUpperCase()
                        : item?.secondCurrencySymbol?.toUpperCase())
                    ) {
                      if (
                        search &&
                        selectTabCurr?.toUpperCase() ===
                          item?.secondCurrencySymbol?.toUpperCase()
                      ) {
                        return (
                          <>
                            <tr onClick={() => handlePair(item)} key={index}>
                              <td>
                                {favPair?.includes(item._id) ? (
                                  <i
                                    className={`fa-solid fa-bookmark`}
                                    style={FavColor}
                                    onClick={() => handleFav(item._id)}
                                  ></i>
                                ) : (
                                  <i
                                    className={`fa-solid fa-bookmark`}
                                    onClick={() => handleFav(item._id)}
                                  ></i>
                                )}
                                {item.firstCurrencySymbol}/
                                {item.secondCurrencySymbol}
                              </td>
                              <td>
                                {" "}
                                {toFixed(item.markPrice, item.secondFloatDigit)}
                              </td>
                              {isVol ? (
                                <td
                                  className={
                                    item.secondVolume < 0
                                      ? spot.red
                                      : spot.green
                                  }
                                >
                                  {" "}
                                  {toFixed(
                                    item.secondVolume,
                                    item.secondFloatDigit
                                  )}
                                </td>
                              ) : (
                                <td
                                  className={
                                    item.change < 0 ? spot.red : spot.green
                                  }
                                >
                                  {!isEmpty(item.change)
                                    ? toFixed(
                                        item.change,
                                        item.secondFloatDigit
                                      )
                                    : 0}
                                  %
                                </td>
                              )}
                            </tr>
                          </>
                        );
                      } else if (!search) {
                        return (
                          <>
                            <tr onClick={() => handlePair(item)} key={index}>
                              <td>
                                {favPair?.includes(item._id) ? (
                                  <i
                                    className={`fa-solid fa-bookmark`}
                                    style={FavColor}
                                    onClick={() => handleFav(item._id)}
                                  ></i>
                                ) : (
                                  <i
                                    className={`fa-solid fa-bookmark`}
                                    onClick={() => handleFav(item._id)}
                                  ></i>
                                )}
                                {item.firstCurrencySymbol}/
                                {item.secondCurrencySymbol}
                              </td>
                              <td>
                                {" "}
                                {toFixed(item.markPrice, item.secondFloatDigit)}
                              </td>
                              {isVol ? (
                                <td
                                  className={
                                    item.secondVolume < 0
                                      ? spot.red
                                      : spot.green
                                  }
                                >
                                  {" "}
                                  {toFixed(
                                    item.secondVolume,
                                    item.secondFloatDigit
                                  )}
                                </td>
                              ) : (
                                <td
                                  className={
                                    item.change < 0 ? spot.red : spot.green
                                  }
                                >
                                  {!isEmpty(item.change)
                                    ? toFixed(
                                        item.change,
                                        item.secondFloatDigit
                                      )
                                    : 0}
                                  %
                                </td>
                              )}
                            </tr>
                          </>
                        );
                      }
                    }
                  }
                })}
              {loading && (
              <tr>
                <td colSpan={3}>
                  <div className="spinner_div">
                    <i className="fa fa-spinner fa-spin" style={spinner}></i>
                  </div>
                </td>
              </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
