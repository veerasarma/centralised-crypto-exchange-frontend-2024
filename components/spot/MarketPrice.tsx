import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import spot from "@/styles/Spot.module.css";
import Dropdown from "react-bootstrap/Dropdown";

//improt store
import { useSelector } from "../../store";
//import lib
import { toFixed, toFixedDown } from "../../lib/roundOf";
import isEmpty from "../../lib/isEmpty";
import PairList from "./PairList"// "./DropdownPairs";
import SocketContext from "../Context/SocketContext";
import { setMarkData } from "@/store/trade/dataSlice";
import { useDispatch } from "react-redux";
import { nWComma } from "@/lib/calculation";
import { useRouter } from "next/router";

export default function MarketPrice(props: any) {
  const dispatch = useDispatch();
  const { asPath, isReady } = useRouter();
  const tikerRoot = asPath.split("/")[2];

  const [usdtValue, setusdValue] = useState<any>();
  const { marketData, tradePair } = useSelector((state: any) => state.spot);
  const { priceConversion } = useSelector((state: any) => state.wallet);
  const socketContext = useContext<any>(SocketContext);
  const [mpData, setmpData] = useState<any>();
  useEffect(() => {
    if (!isEmpty(marketData && tradePair)) {
      if (marketData._id.toString() == tradePair._id.toString()) {
        setmpData(marketData);
      }
    }
  }, [marketData, priceConversion, tradePair]);

  useEffect(() => {
    if (!isEmpty(mpData && priceConversion && tradePair)) {
      if (tradePair.secondCurrencySymbol == "USDT") {
        setusdValue(mpData.markPrice);
      } else {
        let MarkValue = priceConversion.find(
          (item: any) =>
            item.baseSymbol == tradePair.secondCurrencySymbol &&
            item.convertSymbol == "USDT"
        );
        if (MarkValue?.convertPrice) {
          setusdValue(mpData.markPrice * MarkValue.convertPrice);
        }
        // else {
        //   setusdValue(mpData.markPrice);
        // }
      }
    }
  }, [mpData, priceConversion, tradePair]);

  useEffect(() => {
    // socket
    socketContext.spotSocket.on("marketPrice", (result: any) => {
      if (tradePair._id == result.pairId) {
        setmpData(result?.data);
        dispatch(setMarkData(result?.data));
      }
      // let tempPairList = tradePair;
      // let pairIndex =
      //   tempPairList &&
      //   tempPairList.findIndex((el: any) => {
      //     return el._id == result.pairId;
      //   });
      // if (pairIndex >= 0 && !isEmpty(pairIndex)) {
      //   let usdtValue;
      //   if (tempPairList[pairIndex].secondCurrencySymbol == "USDT") {
      //     usdtValue = result.data.markPrice;
      //   } else {
      //     let MarkValue = priceConversion.find(
      //       (item: any) =>
      //         item.baseSymbol == tempPairList[pairIndex].secondCurrencySymbol &&
      //         item.convertSymbol == "USDT"
      //     );
      //     if (MarkValue) {
      //       usdtValue = result.data.markPrice * MarkValue.convertPrice;
      //     } else {
      //       usdtValue = result.data.markPrice;
      //     }
      //   }
      //   tempPairList[pairIndex] = {
      //     ...tempPairList[pairIndex],
      //     ...{
      //       markPrice: result.data.markPrice,
      //       change: result.data.change,
      //       usdtValue,
      //     },
      //   };
      //   setData(tempPairList);
      // }
    });
    return () => {
      socketContext.spotSocket.off("marketPrice");
    };
  }, [tradePair]);

  useEffect(() => {
    socketContext.spotSocket.emit("subscribe", "spot");
    return () => {
      socketContext.spotSocket.off("marketPrice");
      socketContext.spotSocket.emit("unSubscribe", "spot");
    };
  }, []);
  return (
    <>
      <div className={spot.marketinfo_wrap}>
        <div className={spot.marketinfo_inner}>
          <div className={spot.marketinfo_div}>
            <div className={spot.marketinfo_div_left}>
              <div className={spot.marketinfo_div_left_layout}>
                <div className={spot.marketinfo_pair_wrap}>
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="success"
                      id="dropdown-basic"
                      className={spot.drp_btn}
                    >
                      <div
                        className={spot.marketinfo_pair_div}
                      //   onClick={props.pair_sidebar} {/* open right side pairlist */}
                      >
                        {tradePair?.firstCurrencyImage && (
                          <Image
                            src={tradePair?.firstCurrencyImage}
                            className="img-fluid"
                            width={36}
                            height={36}
                            alt="image"
                          />
                        )}

                        <h1>
                          {isReady ? (
                            tikerRoot?.split("_")[0] + "/" + tikerRoot?.split("_")[1]
                           ) :
                            "--"
                          }
                        </h1>
                      </div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <PairList />
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
            <div className={spot.marketinfo_div_right}>
              <div className={spot.tickerlist_container}>
                <div className={spot.ticker_list}>
                  <div>
                    <div className={`${spot.tickerprice_text} ${spot.green}`}>
                      {toFixed(mpData?.markPrice, tradePair?.secondFloatDigit)}
                    </div>
                    <div className={spot.tickeritem_label}>
                      {" "}
                      =${toFixed(usdtValue, tradePair?.secondFloatDigit)}
                    </div>
                  </div>
                  <div>
                    <div className={spot.tickeritem_label}>24H Change </div>
                    <div
                      className={`${spot.tickerprice_text} ${mpData?.change < 0 ? spot.red : spot.green
                        }`}
                    >
                      {!isEmpty(mpData?.change)
                        ? nWComma(
                          toFixed(
                            mpData?.change,
                            mpData?.secondFloatDigit
                          )
                        )
                        : 0}
                      %
                    </div>
                  </div>
                  <div>
                    <div className={spot.tickeritem_label}>24H High </div>
                    <div className={spot.tickerprice_text}>
                      {nWComma(
                        toFixed(mpData?.high, tradePair?.secondFloatDigit)
                      )}
                    </div>
                  </div>
                  <div>
                    <div className={spot.tickeritem_label}>24H Low</div>
                    <div className={spot.tickerprice_text}>
                      {nWComma(
                        toFixed(mpData?.low, tradePair?.secondFloatDigit)
                      )}
                    </div>
                  </div>
                  <div>
                    <div className={spot.tickeritem_label}>
                      24H Volume({tradePair?.firstCurrencySymbol})
                      </div>
                    <div className={spot.tickerprice_text}>
                      {nWComma(
                        toFixed(
                          mpData?.firstVolume,
                          tradePair?.firstFloatDigit
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <div className={spot.tickeritem_label}>
                      24H Turnover({tradePair?.secondCurrencySymbol})
                    </div>
                    <div className={spot.tickerprice_text}>
                      {nWComma(
                        toFixed(
                          mpData?.secondVolume,
                          tradePair?.secondFloatDigit
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
