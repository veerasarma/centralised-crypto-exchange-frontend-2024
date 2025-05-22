import { useState, useEffect } from "react";
import Image from "next/image";
import spot from "@/styles/Spot.module.css";
import Dropdown from "react-bootstrap/Dropdown";

//improt store
import { useSelector } from "../../store";
//import lib
import { toFixed } from "../../lib/roundOf";
import isEmpty from "../../lib/isEmpty";
import PairList from "./DropdownPairs";
import { nWComma } from "@/lib/calculation";

export default function MarketPrice(props: any) {
  const [usdtValue, setusdValue] = useState<any>();
  const { marketData, tradePair } = useSelector(
    (state: any) => state.perpetual
  );
  const { priceConversion } = useSelector((state: any) => state.wallet);
  const [count, setCount] = useState<string>();

  let interval: any;

  const diff_hours = () => {
    if (!isEmpty(tradePair)) {
      let nowDate = new Date();
      let delta =
        Math.abs(new Date(parseInt(tradePair.fundingTime)) - nowDate) / 1000;
      if (isNaN(delta)) return;
      let hours = Math.floor(delta / 3600) % 24;
      delta -= hours * 3600;
      let minutes = Math.floor(delta / 60) % 60;
      delta -= minutes * 60;
      let seconds = delta % 60;
      setCount(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${toFixed(seconds, 0).toString().padStart(2, "0")}`
      );
    }
  };

  interval = setInterval(() => diff_hours(), 1000);
  useEffect(() => {
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (marketData && priceConversion) {
      if (tradePair.secondCurrencySymbol == "USDT") {
        setusdValue(marketData.markPrice);
      } else {
        let MarkValue = priceConversion.find(
          (item: any) =>
            item.baseSymbol == tradePair.quoteCoinSymbol &&
            item.convertSymbol == "USDT"
        );
        if (MarkValue) {
          setusdValue(marketData.markPrice * MarkValue.convertPrice);
        } else {
          setusdValue(marketData.markPrice);
        }
      }
    }
  }, [marketData, priceConversion, tradePair]);

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
                        {marketData?.firstCurrencyImage && (
                          <Image
                            src={marketData?.firstCurrencyImage}
                            className="img-fluid"
                            width={36}
                            height={36}
                            alt="image"
                          />
                        )}

                        <h1>
                          {marketData?.baseCoinSymbol}/
                          {marketData?.quoteCoinSymbol}
                          <br />
                          <span className={spot.typeText} >
                            USDT Perpetual
                          </span>
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
                      {/* {nWComma(toFixed( */}
                      {toFixed(marketData?.markPrice,
                        marketData?.quoteFloatDigit)}
                      {/* ))} */}
                    </div>
                    <div className={spot.tickeritem_label}>
                      {" "}
                      =${toFixed(usdtValue, marketData?.quoteFloatDigit)}
                    </div>
                  </div>
                  <div>
                    <div className={spot.tickeritem_label}>Index Price</div>
                    <div className={`${spot.tickerprice_text} ${spot.green}`}>
                      {/* {nWComma(toFixed( */}
                      {toFixed(marketData?.indexPrice,
                        marketData?.quoteFloatDigit)}
                      {/* ))} */}
                    </div>
                  </div>
                  <div>
                    <div className={spot.tickeritem_label}>24H Change </div>
                    <div
                      className={`${spot.tickerprice_text} ${marketData?.change < 0 ? spot.red : spot.green
                        }`}
                    >
                      {!isEmpty(marketData?.change)
                        ? toFixed(
                          marketData?.change,
                          marketData?.quoteFloatDigit
                        )
                        : 0}
                      %
                    </div>
                  </div>
                  <div>
                    <div className={spot.tickeritem_label}>24H High </div>
                    <div className={spot.tickerprice_text}>
                      {/* {nWComma(toFixed( */}
                      {toFixed(marketData?.high,
                        marketData?.quoteFloatDigit)}
                      {/* ))} */}
                    </div>
                  </div>
                  <div>
                    <div className={spot.tickeritem_label}>24H Low</div>
                    <div className={spot.tickerprice_text}>
                      {/* {nWComma(toFixed( */}
                      {toFixed(marketData?.low,
                        marketData?.quoteFloatDigit)}
                      {/* ))} */}
                    </div>
                  </div>
                  <div>
                    <div className={spot.tickeritem_label}>24H Volume({marketData?.baseCoinSymbol})</div>
                    <div className={spot.tickerprice_text}>
                      {/* {nWComma(toFixed( */}
                      {toFixed(marketData?.firstVolume,
                        marketData?.quoteFloatDigit)}
                      {/* ))} */}
                    </div>
                  </div>
                  <div>
                    <div className={spot.tickeritem_label}>
                      24H Turnover({marketData?.quoteCoinSymbol})
                    </div>
                    <div className={spot.tickerprice_text}>
                      {/* {nWComma(toFixed( */}
                      {toFixed(marketData?.secondVolume,
                        marketData?.quoteFloatDigit)}
                      {/* ))} */}
                    </div>
                  </div>
                  <div>
                    <div className={spot.tickeritem_label}>Funding Rate</div>
                    <div className={spot.tickerprice_text}>
                      {marketData?.fundingRate}%
                    </div>
                  </div>
                  <div>
                    <div className={spot.tickeritem_label}>Funding Time</div>
                    <div className={spot.tickerprice_text}>
                      {!isEmpty(count) ? count : "00:00:00"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
}
