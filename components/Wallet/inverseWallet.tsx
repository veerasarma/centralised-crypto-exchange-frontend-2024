import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import styles from "@/styles/common.module.css";
import { Table } from "react-bootstrap";
//import store
import { useSelector } from "../../store";
//import lib
import isEmpty from "@/lib/isEmpty";
import { toFixed, truncateDecimals } from "@/lib/roundOf";
//import Component
import { getPositionOrder } from "@/services/inverse/InverseService";
import { capitalize } from "@/lib/stringCase";
import { dateTimeFormat } from "@/lib/dateTimeHelper";
import { unrealizedPnlInvers } from "@/lib/bybit";
import SocketContext from "../Context/SocketContext";
import { useTheme } from "next-themes";

const red: React.CSSProperties = {
    color: "#EF5350",
};
const green: React.CSSProperties = {
    color: "#14B778",
};
export default function InverseList({ Wallet, check, filter }: any) {
    const socketContext = useContext<any>(SocketContext);
    const { tradePair } = useSelector((state: any) => state.inverse);
    const [loader, setLoader] = useState<boolean>(false);
    const [orderData, setOrderData] = useState<any>();
    const [totUnreal, setTotUnreal] = useState<number>(0);
    const [subTab, setSubActive] = useState(1);
    const { theme, setTheme } = useTheme();

    const handleSubTab = (tabid: any) => {
        setSubActive(tabid);
    };
    // function
    const fetchPositionHistory = async (reqData: any, pairId: string) => {
        try {
            let params = { ...reqData, ...{ pairId } };
            const { status, loading, result } = await getPositionOrder(params);
            setLoader(loading);
            if (status == "success") {
                setOrderData(result.data);
                let totUnrealized = 0
                for (let item of result.data) {
                    let unReal = parseFloat(
                        toFixed(
                            unrealizedPnlInvers({
                                entryPrice: item.entryPrice,
                                quantity: item.quantity,
                                lastPrice: item.pairDetail.markPrice || item.entryPrice,
                                buyorsell: item.side,
                            }),
                            item.pairDetail.quoteFloatDigit
                        ))
                    totUnrealized += unReal
                }
                setTotUnreal(totUnrealized)
            } else {
                setOrderData({
                    ...orderData,
                });
            }
        } catch (err) {
            console.log("err: ", err);
        }
    };

    useEffect(() => {
        let reqData = {
            page: 1,
            limit: 100,
        };
        fetchPositionHistory(reqData, tradePair._id);
        socketContext.inverSocket.emit("subscribe", tradePair.tikerRoot + "inv");
        socketContext.inverSocket.emit("subscribe", "inverse");
        // socket
        socketContext.inverSocket.on("usdtPerMarketPrice", (result: any) => {
            setOrderData((el: any) => {
                let orderList: any = [];
                let totUnrealized = 0
                el && el.map((item: any) => {
                    if (item.pairId == result.pairId) {
                        let unReal = parseFloat(toFixed(
                            unrealizedPnlInvers({
                                entryPrice: item.entryPrice,
                                quantity: item.quantity,
                                lastPrice: result.data.markPrice || item.entryPrice,
                                buyorsell: item.side,
                            }),
                            item.pairDetail.quoteFloatDigit
                        ))
                        totUnrealized += unReal

                        orderList.push({
                            ...item,
                            pairDetail: result.data,
                        });
                    } else {
                        let unReal = parseFloat(toFixed(
                            unrealizedPnlInvers({
                                entryPrice: item.entryPrice,
                                quantity: item.quantity,
                                lastPrice: item.pairDetail.markPrice || item.entryPrice,
                                buyorsell: item.side,
                            }),
                            item.pairDetail.quoteFloatDigit
                        ))
                        totUnrealized += unReal
                        orderList.push(item);
                    }
                });

                setTotUnreal(totUnrealized)
                return orderList;
            });
        });

        return () => {
            socketContext.inverSocket.off("usdtPerMarketPrice");
        };
    }, [tradePair._id])
    useEffect(() => {
        return () => {
            socketContext.inverSocket.emit("unSubscribe", tradePair.tikerRoot + "inv");
            socketContext.inverSocket.emit("unSubscribe", "inverse");
        };
    }, []);
    return (
        <>
            <section className={`${styles.peer} ${styles.myorder}`}>
                <div className={styles.tabbox}>
                    <div
                        className={`${subTab === 1 ? styles.active : ""}`}
                        onClick={() => handleSubTab(1)}
                    >
                        Assets
                    </div>
                    <div
                        className={`${subTab === 0 ? styles.active : ""}`}
                        onClick={() => handleSubTab(0)}
                    >
                        Positions
                    </div>
                    <label>
                        Unrealized PNL:{" "}
                        <span style={toFixed(totUnreal, 2) > 0 ? green : red}>{toFixed(totUnreal, 2)}</span>
                    </label>
                    {/* <label>
                Realized PNL:{" "}
                <span style={red}>-0.001</span>
              </label> */}
                </div>
                {subTab === 0 && <div className={styles.asset_table}>
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>Contracts</th>
                                <th>Date</th>
                                <th>Side</th>
                                <th>Amount</th>
                                <th>Entry Price</th>
                                <th>Liquidation Price</th>
                                <th>Take Profit</th>
                                <th>Stop Loss</th>
                                <th>Unrealized PNL</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loader &&
                                orderData?.length > 0 ? (
                                orderData.map((item: any, index: number) => {
                                    let unReal = toFixed(
                                        unrealizedPnlInvers({
                                            entryPrice: item.entryPrice,
                                            quantity: item.quantity,
                                            lastPrice: item.pairDetail.markPrice || item.entryPrice,
                                            buyorsell: item.side,
                                        }),
                                        item.pairDetail.quoteFloatDigit
                                    )
                                    return (
                                        <tr key={index}>
                                            <td>
                                                {item.pairName}
                                                <br />
                                                <p style={green} className="mb-0">
                                                    {capitalize(item.mode)} {item.leverage}x
                                                </p>
                                            </td>
                                            <td>
                                                {" "}
                                                {dateTimeFormat(item.createdAt, "YYYY-MM-DD HH:mm")}
                                            </td>
                                            <td>
                                                {item.side === "buy" ? (
                                                    <p style={green} className="mb-0">
                                                        Long
                                                    </p>
                                                ) : (
                                                    <p style={red} className="mb-0">
                                                        Short
                                                    </p>
                                                )}
                                            </td>
                                            <td>
                                                {truncateDecimals(
                                                    item.quantity,
                                                    item.pairDetail.baseFloatDigit
                                                )}
                                            </td>
                                            <td>
                                                {truncateDecimals(
                                                    item.entryPrice,
                                                    item.pairDetail.quoteFloatDigit
                                                )}
                                            </td>
                                            <td>
                                                {truncateDecimals(
                                                    item.liquidationPrice,
                                                    item.pairDetail.quoteFloatDigit
                                                )}
                                            </td>

                                            <td>
                                                {item.isTP ? (
                                                    <span>
                                                        {item.tpPrice}
                                                    </span>
                                                ) : "-"}
                                            </td>
                                            <td>
                                                {item.isSL ? (
                                                    <span>
                                                        {item.slPrice}
                                                    </span>
                                                ) : "-"}
                                            </td>
                                            <td>
                                                {
                                                    unReal > 0 ? (
                                                        <span className="text-success">{unReal}</span>
                                                    ) : (
                                                        <span className="text-danger">{unReal}</span>
                                                    )
                                                }
                                            </td>

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
                            )
                            }
                        </tbody>
                    </Table>
                </div>}
                {subTab === 1 &&
                    <div className={styles.asset_table}>
                        <Table responsive>
                            <thead>
                                <tr>
                                    <th>Coin</th>
                                    <th> Equity </th>
                                    <th> Free </th>
                                    <th> In Market </th>
                                </tr>
                            </thead>
                            <tbody>
                                {Wallet?.length > 0 ? (
                                    Wallet.map((item: any, index: number) => {
                                        if (filter && item.type != "fiat") {
                                            if (check) {
                                                if (item.inverseBal > 0) {
                                                    return (
                                                        <tr key={index}>
                                                            <td>
                                                                <div>
                                                                    {!isEmpty(item.image) && (
                                                                        <Image
                                                                            src={item.image}
                                                                            alt="image"
                                                                            className="img-fluid me-3"
                                                                            width={27}
                                                                            height={27}
                                                                        />
                                                                    )}
                                                                    <span>{item.coin}</span>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                {parseFloat(item.inverseBal) >= 0
                                                                    ? truncateDecimals(
                                                                        parseFloat(item.inverseBal),
                                                                        item.decimals
                                                                    )
                                                                    : 0}
                                                            </td>
                                                            <td>
                                                                {parseFloat(item.inverseBal) >= 0
                                                                    ? truncateDecimals(
                                                                        parseFloat(item.inverseBal) -
                                                                        parseFloat(item.inverseLockBal),
                                                                        item.decimals
                                                                    )
                                                                    : 0}
                                                            </td>
                                                            <td>
                                                                {parseFloat(item.inverseBal) >= 0
                                                                    ? truncateDecimals(
                                                                        parseFloat(item.inverseLockBal),
                                                                        item.decimals
                                                                    )
                                                                    : 0}
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            } else {
                                                return (
                                                    <tr>
                                                        <td>
                                                            <div>
                                                                {!isEmpty(item.image) && (
                                                                    <Image
                                                                        src={item.image}
                                                                        alt="image"
                                                                        className="img-fluid me-3"
                                                                        width={27}
                                                                        height={27}
                                                                    />
                                                                )}
                                                                <span>{item.coin}</span>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {parseFloat(item.inverseBal) >= 0
                                                                ? truncateDecimals(
                                                                    parseFloat(item.inverseBal),
                                                                    item.decimals
                                                                )
                                                                : 0}
                                                        </td>
                                                        <td>
                                                            {parseFloat(item.inverseBal) >= 0
                                                                ? truncateDecimals(
                                                                    parseFloat(item.inverseBal) -
                                                                    parseFloat(item.inverseLockBal),
                                                                    item.decimals
                                                                )
                                                                : 0}
                                                        </td>
                                                        <td>
                                                            {parseFloat(item.inverseBal) >= 0
                                                                ? truncateDecimals(
                                                                    parseFloat(item.inverseLockBal),
                                                                    item.decimals
                                                                )
                                                                : 0}
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        }
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
                                )
                                }
                            </tbody>
                        </Table>
                    </div>}
            </section>
        </>
    );
}
