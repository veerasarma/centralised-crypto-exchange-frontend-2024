import { useEffect, useContext, useState } from "react";
import { Container, Table } from "react-bootstrap";
import styles from "@/styles/common.module.css";
import Image from "next/image";
//import lib
import isEmpty from "@/lib/isEmpty";
import { toFixed } from "@/lib/roundOf";
//improt context
import SocketContext from "../Context/SocketContext";
import { useRouter } from "next/router";
import { apigetPairList } from "@/services/Spot/SpotService";
import { nWComma } from "@/lib/calculation";

export default function MarketTable({ pairList }: any) {
  const router = useRouter();
  const socketContext = useContext<any>(SocketContext);
  const [data, setData] = useState<any>([]);

  // useEffect(() => {
  //     if (isEmpty(data)) {
  //         setData(pairList)
  //     }
  // }, [data])

  useEffect(() => {
    fetchPairList();
  }, []);
  const fetchPairList = async () => {
    if (isEmpty(data)) {
      const data: any = await apigetPairList();
      let pList = data?.data?.result
      const result = pList
        .filter((item: any) => item.secondCurrencySymbol === 'USDT')
        .sort((a: any, b: any) => b.secondVolume - a.secondVolume);
      setData(result);
    }
  };

  useEffect(() => {
    // socket
    socketContext.spotSocket.on("marketPrice", (result: any) => {
      // console.log(result, "-------result");
      let tempPairList = [...data];
      let pairIndex =
        tempPairList &&
        tempPairList.findIndex((el: any) => {
          return el._id == result.pairId;
        });
      if (pairIndex >= 0 && !isEmpty(pairIndex)) {
        tempPairList[pairIndex] = {
          ...tempPairList[pairIndex],
          ...{
            markPrice: result.data.markPrice,
            change: result.data.change,
            last: result.data.last,
          },
        };
        setData(tempPairList);
      }
    });
    // return () => {
    //     socketContext.spotSocket.off("marketPrice");
    // }
  }, [data]);

  console.log(data, "datadatadata");

  console.log(data, 'datadatadata')
  useEffect(() => {
    socketContext.spotSocket.emit("subscribe", "spot");
    return () => {
      socketContext.spotSocket.off("marketPrice");
      socketContext.spotSocket.emit("unSubscribe", "spot");
    };
  }, []);
  return (
    <section className={`${styles.popular_currency}`}>
      <Container>

        <h2 className={styles.h2tag} >Popular Cryptocurrencies</h2>
        <div className={styles.homeTableBg}>
          <Table responsive className={styles.table} data-aos="fade-up" data-aos-duration="1000"   >
            <thead>
              <tr>
                <th>Name</th>
                <th className='ps-3' >Last Price</th>
                <th>24 hours change</th>
                <th>Market Price (USDT)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                data?.length > 0 && data.slice(0, 5).map((item: any, index: number) => {
                  return (
                    <tr key={index}>
                      <td className='market-icon'>
                        <div className='d-flex align-items-center' >
                          {
                            !isEmpty(item.firstCurrencyImage) &&
                            <Image src={item.firstCurrencyImage} className="img-fluid me-3" alt="coin" width={36} height={36} />
                          }
                          {item.firstCurrencySymbol}   {/* /{item.secondCurrencySymbol} */}
                        </div>
                      </td>
                      <td className='ps-3' >{nWComma(toFixed(item.last, 2))}</td>
                      <td style={{ color: toFixed(item.change) > 0 ? 'green' : 'red' }}>{!isEmpty(item?.change) ? toFixed(item.change, 2) : 0}%</td>
                      <td>${nWComma(toFixed(item.markPrice, 2))}</td>
                      <td>
                        <button className={`${styles.trade_btn} ${styles.primary_btn}`} onClick={() => router.push(`/spot/${item.firstCurrencySymbol}_${item.secondCurrencySymbol}`)}><span></span> <label>Trade</label></button>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </Table>
        </div>
        <div className="text-center mt-4" data-aos="fade-up" data-aos-duration="1000"  >
          <button className={`${styles.animate} ${styles.primary_btn}`} onClick={() => router.push('/market')}><span></span> <label>View More Pairs</label></button>
        </div>
      </Container>
    </section>
  )
}
