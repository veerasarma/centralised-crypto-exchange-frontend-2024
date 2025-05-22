import React, { useEffect, useContext, useState } from "react";
import { DepthChart } from "pennant";
import "pennant/dist/style.css";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import isEmpty from "@/lib/isEmpty";
import SocketContext from "../Context/SocketContext";
import spot from "@/styles/Spot.module.css";
//import service 
import { getDepthChart } from "../../services/Spot/SpotService";


let initial = [{ price: 0, volume: 0 }];

const DepthChartMob = () => {
    const socketContext = useContext(SocketContext);
    const { query } = useRouter();
    const [AAPL_data, setAAPL_Data] = useState({ buy: initial, sell: initial });

    const fetchData = async (pairID) => {
        getDepthChart(pairID)
    }

    useEffect(() => {
        alert()
        if (!isEmpty(query.pairId)) {
            fetchData(query.pairId)
            socketContext.spotSocket.on("depthChart", (result) => {
                if (result.pairId == query.pairId) {
                    setAAPL_Data({ buy: result.buy, sell: result.sell });
                }
            });
        }
    }, [query.pairId]);

    useEffect(() => {
        socketContext.spotSocket.emit('subscribe', 'depthChart')
        return () => {
            socketContext.spotSocket.off("depthChart");
            socketContext.spotSocket.emit('unSubscribe', 'depthChart')
        }
    }, [])
    return (
        <div className={spot.depthChart_mob}>
            <DepthChart
                data={AAPL_data}
                theme={query.theme}
                notEnoughDataText="No data "
            />
        </div>
    );
};

export default dynamic(() => Promise.resolve(DepthChartMob), {
    ssr: false,
});
