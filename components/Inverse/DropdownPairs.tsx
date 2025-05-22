import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import spot from "@/styles/Spot.module.css";
import { useRouter } from "next/router";
import { Form, Table } from "react-bootstrap";
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
import { toFixedDown } from "@/lib/roundOf";
import { toastAlert } from "@/lib/toastAlert";
//improt context
import SocketContext from "../Context/SocketContext";
//improt service
import { addFav } from "../../services/Spot/SpotService";
import { getFavourite } from "@/store/UserSetting/dataSlice";

const FavColor: React.CSSProperties = {
  color: "#FFCC66",
};

export default function PairList(props: any) {
  let history = useRouter();
  const socketContext = useContext<any>(SocketContext);
  const dispatch = useDispatch();
  const { marketData, allIMarketData } = useSelector(
    (state: any) => state.inverse
  );

  const { favourite } = useSelector((state: any) => state.UserSetting.data)
  let fav = favourite?.inverseCount ? favourite.inverseCount : []
  // const [pair_box, setpair_box] = useState(false);
  const [currTab, setCurrTab] = useState<string>("futures");
  const [searchVal, setSearchVal] = useState<string>("");
  const [search, setSearch] = useState<boolean>(false);
  const [favPair, setFavourite] = useState<any>(fav);
  const [isVol, setisVlo] = useState<boolean>(false);
  const isLogin = useSelector((state: any) => state.auth.session.signedIn);

  const pair_tab = (tabId: string) => {
    setCurrTab(tabId);
    setSearch(false);
  };

  const handlePair = (item: any) => {
    dispatch(setTradePair(item));
    dispatch(setMarkData(item));
    history.push(
      {
        pathname:
          "/inverse/" + item.baseCoinSymbol + "_" + item.quoteCoinSymbol,
      },
      undefined,
      { shallow: true }
    );
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;
    setSearchVal(value);
    if (isEmpty(value)) {
      setSearch(false);
    } else {
      setSearch(true);
    }
  };

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
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('inverseFav') || '[]');
    }
    return [];
  };
  const handleFav = async (pairId: string) => {
    const currentFavorites = getFavorites();
    let updatedFavorites;
    if (currentFavorites.includes(pairId)) {
      updatedFavorites = currentFavorites.filter(fav => fav !== pairId);
    } else {
      updatedFavorites = [...currentFavorites, pairId];
    }
    localStorage.setItem('inverseFav', JSON.stringify(updatedFavorites));
    dispatch(getFavourite())
  };
  useEffect(() => {
    let favourites = favourite?.inverseCount ? favourite.inverseCount : []
    setFavourite(favourites)
  }, [favourite])

  useEffect(() => {
    // socket
    socketContext.inverSocket.on("marketPrice", (result: any) => {
      if (result.pairId == marketData._id) {
        dispatch(setUpdateMarkData(result.data));
      }
      let tempPairList = [...allIMarketData];
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
      }
    });

    return () => {
      socketContext.inverSocket.off("marketPrice");
    };
  }, [allIMarketData]);

  return (
    <div
      className={`${spot.market_pair_info}  ${spot.fixed} ${props.pair_box ? spot.show : ""
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
        </div>
        <div className={spot.pairs}>
          <h6
            className={`${currTab == "fav" ? spot.active : ""} `}
            onClick={() => pair_tab("fav")}
          >
            Favourite
          </h6>
          <h6
            className={`${currTab == "futures" ? spot.active : ""} `}
            onClick={() => pair_tab("futures")}
          >
            Future
          </h6>
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
                  Change <i className="fa-solid fa-sort"></i>
                </th>
              </tr>
            </thead>

            <tbody>
              {allIMarketData?.length > 0 &&
                allIMarketData.map((item: any, index: number) => {
                  {
                    if (
                      search && currTab == "fav"
                        ? favPair.includes(item._id) &&
                        (searchVal?.toUpperCase() ===
                          item?.quoteCoinSymbol?.toUpperCase() ||
                          searchVal?.toUpperCase() ===
                          item?.baseCoinSymbol?.toUpperCase())
                        : searchVal?.toUpperCase() ===
                        item?.baseCoinSymbol?.toUpperCase() ||
                        searchVal?.toUpperCase() ===
                        item?.quoteCoinSymbol?.toUpperCase()
                    ) {
                      if (currTab == "fav") {
                        if (favPair.includes(item._id)) {
                          return (
                            <>
                              <tr onClick={() => handlePair(item)} key={index}>
                                <td>
                                  {favPair.includes(item._id) ? (
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
                                  {item.baseCoinSymbol}/{item.quoteCoinSymbol}
                                </td>
                                <td>
                                  {" "}
                                  {toFixedDown(
                                    item.markPrice,
                                    item.quoteFloatDigit
                                  )}
                                </td>
                                {isVol ? (
                                  <td>
                                    {" "}
                                    {toFixedDown(
                                      item.secondVolume,
                                      item.quoteFloatDigit
                                    )}
                                  </td>
                                ) : (
                                  <td
                                    className={
                                      item.change < 0 ? spot.red : spot.green
                                    }
                                  >
                                    {!isEmpty(item.change)
                                      ? toFixedDown(
                                        item.change,
                                        item.quoteFloatDigit
                                      )
                                      : 0}
                                    %
                                  </td>
                                )}
                              </tr>
                            </>
                          );
                        }
                      } else {
                        return (
                          <>
                            <tr onClick={() => handlePair(item)} key={index}>
                              <td>
                                {favPair.includes(item._id) ? (
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
                                {item.baseCoinSymbol}/{item.quoteCoinSymbol}
                              </td>
                              <td>
                                {" "}
                                {toFixedDown(
                                  item.markPrice,
                                  item.quoteFloatDigit
                                )}
                              </td>
                              {isVol ? (
                                <td>
                                  {" "}
                                  {toFixedDown(
                                    item.secondVolume,
                                    item.quoteFloatDigit
                                  )}
                                </td>
                              ) : (
                                <td
                                  className={
                                    item.change < 0 ? spot.red : spot.green
                                  }
                                >
                                  {!isEmpty(item.change)
                                    ? toFixedDown(
                                      item.change,
                                      item.quoteFloatDigit
                                    )
                                    : 0}
                                  %
                                </td>
                              )}
                            </tr>
                          </>
                        );
                      }
                      return (
                        <>
                          <tr onClick={() => handlePair(item)} key={index}>
                            <td>
                              {favPair.includes(item._id) ? (
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
                              {item.baseCoinSymbol}/{item.quoteCoinSymbol}
                            </td>
                            <td>
                              {" "}
                              {toFixedDown(
                                item.markPrice,
                                item.quoteFloatDigit
                              )}
                            </td>
                            {isVol ? (
                              <td>
                                {" "}
                                {toFixedDown(
                                  item.secondVolume,
                                  item.quoteFloatDigit
                                )}
                              </td>
                            ) : (
                              <td
                                className={
                                  item.change < 0 ? spot.red : spot.green
                                }
                              >
                                {!isEmpty(item.change)
                                  ? toFixedDown(
                                    item.change,
                                    item.quoteFloatDigit
                                  )
                                  : 0}
                                %
                              </td>
                            )}
                          </tr>
                        </>
                      );
                    } else if (!search) {
                      if (currTab == "fav") {
                        if (favPair.includes(item._id)) {
                          return (
                            <>
                              <tr onClick={() => handlePair(item)} key={index}>
                                <td>
                                  {favPair.includes(item._id) ? (
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
                                  {item.baseCoinSymbol}/{item.quoteCoinSymbol}
                                </td>
                                <td>
                                  {" "}
                                  {toFixedDown(
                                    item.markPrice,
                                    item.quoteFloatDigit
                                  )}
                                </td>
                                {isVol ? (
                                  <td>
                                    {" "}
                                    {toFixedDown(
                                      item.secondVolume,
                                      item.quoteFloatDigit
                                    )}
                                  </td>
                                ) : (
                                  <td
                                    className={
                                      item.change < 0 ? spot.red : spot.green
                                    }
                                  >
                                    {!isEmpty(item.change)
                                      ? toFixedDown(
                                        item.change,
                                        item.quoteFloatDigit
                                      )
                                      : 0}
                                    %
                                  </td>
                                )}
                              </tr>
                            </>
                          );
                        }
                      } else {
                        return (
                          <>
                            <tr onClick={() => handlePair(item)} key={index}>
                              <td>
                                {favPair.includes(item._id) ? (
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
                                {item.baseCoinSymbol}/{item.quoteCoinSymbol}
                              </td>
                              <td>
                                {" "}
                                {toFixedDown(
                                  item.markPrice,
                                  item.secondFloatDigit
                                )}
                              </td>
                              {isVol ? (
                                <td>
                                  {" "}
                                  {toFixedDown(
                                    item.secondVolume,
                                    item.quoteFloatDigit
                                  )}
                                </td>
                              ) : (
                                <td
                                  className={
                                    item.change < 0 ? spot.red : spot.green
                                  }
                                >
                                  {!isEmpty(item.change)
                                    ? toFixedDown(
                                      item.change,
                                      item.quoteFloatDigit
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
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
