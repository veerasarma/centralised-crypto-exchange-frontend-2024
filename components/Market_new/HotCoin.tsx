import { useEffect, useContext, useState } from "react";
import { Container, Table } from "react-bootstrap";
import styles from "@/styles/common.module.css";
import DataTable from "react-data-table-component";
import Image from "next/image";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import isEmpty from "@/lib/isEmpty";
import { useSelector } from "@/store";
import { nWComma } from "@/lib/calculation";
import { toFixed } from "@/lib/roundOf";
import { momentFormat } from "@/lib/dateTimeHelper";

const HotCoins = ({ pairList, spotMark }: any) => {
    // redux
    const { priceConversion } = useSelector((state: any) => state.wallet);
    // state
    const [data, setData] = useState<any>([]);
    const getPairData = (pairList: any) => {
        dataSet()
    };
    const dataSet = () => {
        let newArr: any = [];
        pairList?.length > 0 &&
            pairList
            .filter((pair: any) => pair.secondCurrencySymbol == "USDT")
            .map((item: any) => {
                console.log(item, 'itemitem')
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

                let data = {
                    Name: item.tikerRoot,
                    Price: (nWComma(toFixed(isEmpty(usdtValue) ? item.markPrice : usdtValue, 2))),
                    Change: toFixed(item.change, 2),
                    low: !isEmpty(item?.low) ? nWComma(toFixed(item.low, 2)) : 0,
                    Volume: !isEmpty(item?.secondVolume) ? nWComma(toFixed(item.secondVolume, 2)) : 0,
                    Date: momentFormat(item.createdAt),

                };
                newArr.push({ ...item, ...data });
            });
        setData(newArr)
    }

    useEffect(() => {
        dataSet()
    }, [pairList])

    useEffect(() => {
        if (isEmpty(data)) {
            getPairData(pairList);
        }
    }, [data]);


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
                            Price: (nWComma(toFixed(isEmpty(usdtValue) ? spotMark.data.markPrice : usdtValue, 2))),
                            markPrice: spotMark.data.markPrice,
                            Change: toFixed(spotMark.data.change, 2),
                            low: !isEmpty(spotMark.data?.low) ? nWComma(toFixed(spotMark.data.low, 2)) : 0,
                            Volume: !isEmpty(spotMark.data?.secondVolume) ? nWComma(toFixed(spotMark.data.secondVolume, 2)) : 0,
                        });
                    } else {
                        sockList.push(item);
                    }
                });
            return sockList;
        });
    }, [data]);
    return (
        <>

            <div>
                {data && data.length > 0 && data
                    .sort((a: any, b: any) => Number(b.Volume) - Number(a.Volume)).slice(0, 5)
                    .map((item: any, key: any) => (
                        <a href={`/spot/${item.firstCurrencySymbol}_${item.secondCurrencySymbol}`} target="_blank" className={styles.dflex} key={key}>
                            <div>
                                <Image
                                    src={item.firstCurrencyImage}
                                    alt=""
                                    className="img-fluid"
                                    width={24}
                                    height={24}
                                />
                                <p>{item.firstCurrencySymbol}</p>
                            </div>
                            <div>
                                <p>{item.Price}</p>
                            </div>
                            <div>
                                <p className={toFixed(item.Change, 2) > 0 ? styles.green_text : styles.red_text}>
                                    {item.Change}%
                                </p>
                            </div>
                        </a>
                    ))}
            </div>
        </>
    )
}


export default HotCoins;