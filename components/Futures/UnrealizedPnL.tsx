// import package
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

// import lib
import { unrealizedPnL } from "../../lib/bybit";
import { toFixed } from "../../lib/roundOf";
import SocketContext from "../Context/SocketContext";

const UnrealizedProfitLoss = (props: any) => {

    const socketContext = useContext<any>(SocketContext);
    const { positionDetail } = props;
    const tickerData = useSelector((state: any) => state.marketPrice);

    const { marketData, tradePair } = useSelector(
        (state: any) => state.perpetual
    );
    const [value, setValue] = useState<number>(0);
    // function
    useEffect(() => {
        socketContext.perpSocket.on("usdtPerMarketPrice", (result: any) => {
            if (result.pairId == positionDetail.pairId) {
                setValue(
                    toFixed(
                        unrealizedPnL({
                            entryPrice: positionDetail.entryPrice,
                            quantity: positionDetail.quantity,
                            lastPrice: result.data.markPrice || positionDetail.entryPrice,
                            buyorsell: positionDetail.side,
                        }),
                        positionDetail.pairDetail.quoteFloatDigit
                    )
                );
            }
        })
        // return () => {
        //     socketContext.perpSocket.off("usdtPerMarketPrice");
        // };
    }, [positionDetail, marketData]);
    return (
        <>
            {
                value > 0 ? (
                    <span className="text-success">{value}</span>
                ) : (
                    <span className="text-danger">{value}</span>
                )
            }
        </>
    );
};

export default UnrealizedProfitLoss;
