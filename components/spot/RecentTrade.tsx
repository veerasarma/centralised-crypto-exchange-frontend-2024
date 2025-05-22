import { useState, useEffect, useContext } from "react";
import spot from "@/styles/Spot.module.css";
import { Table } from "react-bootstrap";
//import socket
import SocketContext from "../Context/SocketContext";
//import store
import { useSelector } from "../../store";
//improt lib
import isEmpty from "../../lib/isEmpty";
import { toFixed, toFixedDown } from "../../lib/roundOf";
//import service
import { getRecentTrade } from "../../services/Spot/SpotService";

export default function RecentTrade() {
  const { tradePair } = useSelector((state: any) => state.spot);
  const [tradeData, setTradeData] = useState<any>();
  const socketContext = useContext<any>(SocketContext);
  const fetchRecentTrade = async (pairId: string) => {
    try {
      let { status, result } = await getRecentTrade(pairId);
      if (status) {
        setTradeData(result);
      }
    } catch (err) { }
  };

  useEffect(() => {
    if (!isEmpty(tradePair)) {
      fetchRecentTrade(tradePair._id);
      socketContext.spotSocket.on("recentTrade", (result: any) => {
        if (result.pairId == tradePair._id) {
          setTradeData((prevMessages: any) => {
            if (prevMessages) {
              let data = [...prevMessages];
              data.pop();
              return [...result.data, ...data];
            }
          });
        }
      });
    }
    return () => {
      socketContext.spotSocket.off("recentTrade");
    };
  }, [tradePair]);
  return (
    <div className={`${spot.pair_crypto} ${spot.market_pair_info}`}>
      <div className={spot.box}>
        <div className={spot.head_box}>
          <h6 className={spot.spot_head}>Recent Trades</h6>
        </div>
        <div className={spot.table_box}>
          <Table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Price ({tradePair.secondCurrencySymbol})</th>
                <th>Volume ({tradePair.firstCurrencySymbol})</th>
              </tr>
            </thead>
            <tbody>
              {tradeData?.length > 0 &&
                tradeData.map((item: any, index: number) => {
                  let dataTime = new Date(item.createdAt);
                  let time =
                    dataTime.getHours() +
                    ":" +
                    dataTime.getMinutes() +
                    ":" +
                    dataTime.getSeconds();
                  return (
                    <>
                      <tr key={index}>
                        <td>{time}</td>
                        <td
                          className={
                            item?.Type == "sell" ? spot.red : spot.green
                          }
                        >
                          {toFixed(
                            item?.tradePrice,
                            tradePair?.secondFloatDigit
                          )}
                        </td>
                        <td>
                          {toFixed(
                            item?.tradeQty,
                            tradePair?.firstFloatDigit
                          )}
                        </td>
                      </tr>
                    </>
                  );
                })}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
