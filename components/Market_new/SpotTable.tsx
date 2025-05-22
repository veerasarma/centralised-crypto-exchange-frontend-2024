import { useEffect, useContext, useState, useMemo } from "react";
import { Container, Table } from "react-bootstrap";
import styles from "@/styles/common.module.css";
import DataTable from "react-data-table-component";
import Image from "next/image";
import isEmpty from "@/lib/isEmpty";
import { useDispatch, useSelector } from "@/store";
import { nWComma } from "@/lib/calculation";
import { toFixed } from "@/lib/roundOf";
import SocketContext from "../Context/SocketContext";
import Link from "next/link";
import config from "../../config"
import { getFavourite, setFavourite } from "@/store/UserSetting/dataSlice";
import { useRouter } from "next/router";
import Humanize from "humanize-plus"


export default function USDTTable({ pairList, spotMark, isLoading }: any) {
  // redux
  const { favourite } = useSelector((state: any) => state.UserSetting.data)
  const { priceConversion } = useSelector((state: any) => state.wallet);
  const router = useRouter()
  const socketContext = useContext<any>(SocketContext);
  // state
  const [data, setData] = useState<any>([]);

  const dispatch = useDispatch();
  const [secondCurrencyList, setsecondCurrencyList] = useState<any>([]);
  const [selectCurr, setSelectCurr] = useState<string>("");
  const [selectTabCurr, setSelectTabCurr] = useState<string>("");
  const [search, setSearch] = useState<boolean>(false);

  const columns = [
    {
      name: "Name",
      selector: (row: any) => row.Name,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row: any) => row.Price,
      sortable: true,
    },

    {
      name: "Change",
      selector: (row: any) => row.Change,
      sortable: true,
    },
    {
      name: "24h high / 24h low",
      selector: (row: any) => row.low,
      sortable: true,
    },
    {
      name: "24h Volume",
      selector: (row: any) => Humanize.compactInteger(row.Volume),
      sortable: true,
    },
    // {
    //   name: "Market Cap",
    //   selector: (row: any) => row.Market,
    //   sortable: true,
    // },
    {
      name: "Actions",
      selector: (row: any) => row.Actions,
      sortable: true,
    },
  ];

  const handleTabClick = (tabid: any) => {
    setSelectCurr(tabid);
    setSearch(false);
    setSelectTabCurr(tabid);
    dataSet(tabid)
  };
  // Retrieve favorites from localStorage
  const getFavorites = (): string[] => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('spotFav') || '[]');
    }
    return [];
  };

  // Toggle favorite status for an item
  const toggleFavorite = (id: string, coin: string) => {
    const currentFavorites = getFavorites();
    let updatedFavorites;
    if (currentFavorites.includes(id)) {
      updatedFavorites = currentFavorites.filter(fav => fav !== id);
    } else {
      updatedFavorites = [...currentFavorites, id];
    }
    localStorage.setItem('spotFav', JSON.stringify(updatedFavorites));
    dispatch(getFavourite())
    dataSet(coin)
  };
  const dataSet = (secondCurr: any) => {
    let newArr: any = [];
    pairList?.length > 0 &&
      pairList.map((item: any) => {
        let usdtValue;
        if (secondCurr == item.secondCurrencySymbol) {
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
          let favorites = favourite?.spotCount ? favourite.spotCount : []
          let favSel = favorites.includes(item._id) ? "yellow" : ""
          let data = {
            Name: (
              <div className="d-flex align-items-center">
                {/* <Image
                  src={require("../../public/assets/images/star.png")}
                  alt="Icon"
                  width={20}
                  height={20}
                  className="me-1"
                /> */}
                <i className="bi bi-star-fill" style={{ color: favSel, marginRight: '8px' }} onClick={() => toggleFavorite(item._id, item.secondCurrencySymbol)}></i>{ }
                <span>{item.tikerRoot}</span>
              </div>
            ),
            Price: (`${nWComma(toFixed(
              isEmpty(usdtValue)
                ? item.markPrice
                : usdtValue,
              2
            ))}`
            ),
            Change: (
              <div className={toFixed(item.change, 2) > 0 ? styles.green_text : styles.red_text}>
                {toFixed(item.change, 2)} %
              </div >
            ),
            low: (
              !isEmpty(item?.low) ? nWComma(toFixed(item.low, 2)) : 0
            ),
            Volume: (
              !isEmpty(item?.secondVolume)
                ? toFixed(item.secondVolume, 2)
                : 0
            ),
            Market: "$99,989.99B",
            Actions: (
              <div className="d-flex align-items-center">
                <Link
                  href={`/spot/${item.firstCurrencySymbol}_${item.secondCurrencySymbol}`}
                  target="_blank"
                >
                  <Image
                    src={require("../../public/assets/images/trade_icon.png")}
                    alt="Icon"
                    width={24}
                    height={24}
                    className={`me-1 ${styles.img_trade}`}
                  />
                </Link>
              </div >
            )
          };
          newArr.push({ ...item, ...data });
        }
      });
    newArr = newArr.sort((a: any, b: any) => b.secondVolume - a.secondVolume);
    setData(newArr)
  }
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

  const getPairData = (pairList: any) => {
    let secondCurr = pairList[0]?.secondCurrencySymbol
    dataSet(secondCurr)
  };

  useEffect(() => {
    if (isEmpty(data)) {
      getPairData(pairList);
      secondCurrencyArray(pairList);
    }
  }, [data]);
  useEffect(() => {
    dataSet(selectTabCurr)
  }, [favourite, selectTabCurr])
  useEffect(() => {
    // socket
    setData((el: any) => {
      let sockList: any = [];
      el &&
        el.map((item: any) => {
          if (item._id == spotMark.pairId) {
            let usdtValue;
            if (item.secondCurrencySymbol == "USDT") {
              usdtValue = spotMark.data.markPrice;
            } else {
              let MarkValue = priceConversion.find(
                (item: any) =>
                  item.baseSymbol == item.secondCurrencySymbol &&
                  item.convertSymbol == "USDT"
              );
              if (MarkValue) {
                usdtValue = spotMark.data.markPrice * MarkValue.convertPrice;
              } else {
                usdtValue = spotMark.data.markPrice;
              }
            }
            sockList.push({
              ...item,
              Price: (`${nWComma(toFixed(
                isEmpty(usdtValue)
                  ? spotMark.data.markPrice
                  : usdtValue,
                2
              ))}`
              ),
              markPrice: spotMark.data.markPrice,
              Change: (
                <div className={toFixed(spotMark.data.change, 2) > 0 ? styles.green_text : styles.red_text}>
                  {toFixed(spotMark.data.change, 2)} %
                </div >
              ),
              low: (
                !isEmpty(spotMark.data?.low) ? nWComma(toFixed(spotMark.data.low, 2)) : 0
              ),
              Volume: (
                !isEmpty(spotMark.data?.secondVolume)
                  ? toFixed(spotMark.data.secondVolume, 2)
                  : 0
              ),
            });
          } else {
            sockList.push(item);
          }
        });
      return sockList;
    });
  }, [data]);

  // const CustomLoader = () => (<p className="text-primary" style={{ background: "transparent" }}>Loading...</p>);

  return (
    <section >
      <Container>

        <div className=" innertab pb-2 my-4 w-100">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            {secondCurrencyList?.length > 0 &&
              secondCurrencyList.map((item: string, index: number) => {
                return (
                  <li className="nav-item" role="presentation">
                    <button
                      className={`${selectTabCurr.toUpperCase() === item.toUpperCase()
                        ? "nav-link active"
                        : "nav-link"
                        }`}
                      id={`${item}-tab`}
                      data-bs-toggle="tab"
                      data-bs-target={`#${item}`}
                      type="button"
                      role="tab"
                      aria-controls={item}
                      aria-selected="true"
                      onClick={() => handleTabClick(item)}
                    >
                      {item}
                    </button>
                  </li>
                );
              })}
          </ul>
          <div className="tab-content" id="myTabContent">
            {
              (!isLoading && data.length > 0) && 
              <DataTable columns={columns} data={data} onRowClicked={(row) => window.open(`/spot/${row.firstCurrencySymbol}_${row.secondCurrencySymbol}`, "_blank")} />
            }
            {
              (!isLoading && data.length == 0) &&
                <div className="text-center">
                <p>There are no records to display</p>
              </div>
            }
            {/* <div
              className="tab-pane fade show active"
              id="USDT"
              role="tabpanel"
              aria-labelledby="USDT-tab"
            >
              <DataTable columns={columns} data={data} /> <div className="text-center">
                <Image src={require("../.././public/assets/images/nodata.png")} alt="" className="img-fluid " />
                <p>No results. Go to USDT market to add your favorite tokens.</p>
                <button className={styles.primary_btn_2}>Add Favorites</button>
              </div> 
              </div>
             <div
              className="tab-pane fade"
              id="BTC"
              role="tabpanel"
              aria-labelledby="BTC-tab"
            >
              <DataTable columns={columns} data={datas} />
            </div> */}
          </div>
        </div>
      </Container>
    </section >
  );
}
