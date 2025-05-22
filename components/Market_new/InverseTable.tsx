import { useEffect, useContext, useState } from "react";
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
import { config } from "process";
import { getFavourite } from "@/store/UserSetting/dataSlice";
import { useRouter } from "next/router";


export default function InverseTable({ inversePair }: any) {
    // redux
    const { favourite } = useSelector((state: any) => state.UserSetting.data)
    const { priceConversion } = useSelector((state: any) => state.wallet);
    const dispatch = useDispatch()
    const router = useRouter()
    const socketContext = useContext<any>(SocketContext);
    // state
    const [data, setData] = useState<any>([]);
    const [firstCurList, setFirstCurList] = useState<any>([]);
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
            selector: (row: any) => row.Volume,
            sortable: true,
        },
        // {
        //   name: "Market Cap",
        //   selector: (row:any) => row.Market,
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
            return JSON.parse(localStorage.getItem('inverseFav') || '[]');
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
        localStorage.setItem('inverseFav', JSON.stringify(updatedFavorites));
        dispatch(getFavourite())
        dataSet(coin)
    };
    const dataSet = (secondCurr: any) => {
        let newArr: any = [];
        inversePair?.length > 0 &&
            inversePair.map((item: any) => {
                let usdtValue;
                if (secondCurr == item.baseCoinSymbol) {
                    if (item.baseCoinSymbol == "USDT") {
                        usdtValue = item.markPrice;
                    } else {
                        let MarkValue = priceConversion.find(
                            (elem: any) =>
                                elem.baseSymbol == item.baseCoinSymbol &&
                                elem.convertSymbol == "USDT"
                        );
                        if (MarkValue) {
                            usdtValue = item.markPrice * MarkValue.convertPrice;
                        } else {
                            usdtValue = item.markPrice;
                        }
                    }
                    let favorites = getFavorites() // favourite?.inverseCount ? favourite.inverseCount : []
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
                                <i className="bi bi-star-fill" style={{ color: favSel, marginRight: '8px' }} onClick={() => toggleFavorite(item._id, item.baseCoinSymbol)}></i>
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
                                ? nWComma(toFixed(item.secondVolume, 2))
                                : 0
                        ),
                        Market: "$99,989.99B",
                        Actions: (
                            <div className="d-flex align-items-center">
                                <Link
                                    target="_blank"
                                    href={`/inverse/${item.quoteCoinSymbol}_${item.baseCoinSymbol}`}
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
            if (!uniqueChars.includes(c.baseCoinSymbol)) {
                uniqueChars.push(c.baseCoinSymbol);
            }
        });
        setFirstCurList(uniqueChars);
        setSelectTabCurr(uniqueChars[0]);
        setSelectCurr(uniqueChars[0]);
    };

    const getPairData = (pairList: any) => {
        let secondCurr = pairList[0]?.baseCoinSymbol
        dataSet(secondCurr)
    };

    useEffect(() => {
        if (isEmpty(data)) {
            getPairData(inversePair);
            secondCurrencyArray(inversePair);
        }
    }, [data]);
    useEffect(() => {
        // socket
        socketContext.inverSocket.on("usdtPerMarketPrice", (result: any) => {
            setData((el: any) => {
                let sockList: any = [];
                el &&
                    el.map((item: any) => {
                        if (item._id == result.pairId) {
                            let usdtValue;
                            if (item.baseCoinSymbol == "USDT") {
                                usdtValue = result.data.markPrice;
                            } else {
                                let MarkValue = priceConversion.find(
                                    (item: any) =>
                                        item.baseSymbol == item.baseCoinSymbol &&
                                        item.convertSymbol == "USDT"
                                );
                                if (MarkValue) {
                                    usdtValue = result.data.markPrice * MarkValue.convertPrice;
                                } else {
                                    usdtValue = result.data.markPrice;
                                }
                            }
                            sockList.push({
                                ...item,
                                Price: (`${nWComma(toFixed(
                                    isEmpty(usdtValue)
                                        ? result.data.markPrice
                                        : usdtValue,
                                    2
                                ))}`
                                ),
                                markPrice: result.data.markPrice,
                                Change: (
                                    <div className={toFixed(result.data.change, 2) > 0 ? styles.green_text : styles.red_text}>
                                        {toFixed(result.data.change, 2)} %
                                    </div >
                                ),
                                low: (
                                    !isEmpty(result.data?.low) ? nWComma(toFixed(result.data.low, 2)) : 0
                                ),
                                Volume: (
                                    !isEmpty(result.data?.secondVolume)
                                        ? nWComma(toFixed(result.data.secondVolume, 2))
                                        : 0
                                ),
                            });
                        } else {
                            sockList.push(item);
                        }
                    });
                return sockList;
            });
        });
    }, [data]);
    useEffect(() => {
        socketContext.inverSocket.emit("subscribe", "inverse");
        return () => {
            socketContext.inverSocket.off("usdtPerMarketPrice");
            socketContext.inverSocket.emit("unSubscribe", "inverse");
        };
    }, []);
    return (
        <section >
            <Container>

                <div className=" innertab pb-2 my-4 w-100">
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        {firstCurList?.length > 0 &&
                            firstCurList.map((item: string, index: number) => {
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
                        <DataTable columns={columns} data={data} onRowClicked={(row) => window.open(`/inverse/${row.quoteCoinSymbol}_${row.baseCoinSymbol}`, "_blank")} />
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
