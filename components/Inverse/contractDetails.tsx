import { useState, useEffect, useContext } from "react";
import spot from "@/styles/Spot.module.css";
import { useRouter } from "next/router";
import { Row, Col } from "react-bootstrap";
//improt store
import { useSelector, useDispatch } from "../../store";
import {
  setUpdateMarkData,
  setAllIMarkData,
} from "../../store/inverse/dataSlice";
//improt lib
import isEmpty from "@/lib/isEmpty";
import { toFixedDown, toFixed } from "@/lib/roundOf";
//improt context
import SocketContext from "../Context/SocketContext";

export default function PairList(props: any) {
  const socketContext = useContext<any>(SocketContext);
  const dispatch = useDispatch();
  const { pairList, marketData, allIMarketData, tradePair } = useSelector(
    (state: any) => state.inverse
  );
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
    // socket
    socketContext.inverSocket.on("usdtPerMarketPrice", (result: any) => {
      if (result.pairId == marketData._id) {
        dispatch(setUpdateMarkData(result.data));
      }
      if (isEmpty(allIMarketData)) {
        dispatch(setAllIMarkData([...pairList]));
      }
      let tempPairList = [...allIMarketData];
      let pairIndex = tempPairList.findIndex((el: any) => {
        return el._id == result.pairId;
      });
      if (pairIndex >= 0) {
        tempPairList[pairIndex] = {
          ...tempPairList[pairIndex],
          markPrice: result.data.markPrice,
          change: result.data.change,
          secondVolume: result.data.secondVolume,
          firstVolume: result.data.firstVolume,
          fundingRate: result.data.fundingRate,
          indexPrice: result.data.indexPrice,
        };
        dispatch(setAllIMarkData([...tempPairList]));
      }
    });

    return () => {
      socketContext.inverSocket.off("usdtPerMarketPrice");
    };
  }, [allIMarketData]);
  return (
    <div
      className={`${spot.market_pair_info}  ${spot.fixed} ${props.pair_box ? spot.show : ""
        } `}
    >
      <div className={spot.box}>
        <div className={spot.head_box}>
          <h6 className={spot.spot_head}>
            Contract Details {tradePair?.tikerRoot}
          </h6>
        </div>
        <div className={spot.contractInfo}>
          <Row>
            <Col lg={6} md={6} sm={6}>
              <small>Type</small>
            </Col>
            <Col lg={6} md={6} sm={6}>
              <small>Settled in USDT</small>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={6} sm={6}>
              <small>Index Price</small>
            </Col>
            <Col lg={6} md={6} sm={6}>
              <small>
                {" "}
                {toFixedDown(
                  marketData?.indexPrice,
                  marketData?.quoteFloatDigit
                )}
              </small>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={6} sm={6}>
              <small>Mark Price</small>
            </Col>
            <Col lg={6} md={6} sm={6}>
              <small>
                {" "}
                {toFixedDown(
                  marketData?.markPrice,
                  marketData?.quoteFloatDigit
                )}
              </small>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={6} sm={6}>
              <small>24H Turnover</small>
            </Col>
            <Col lg={6} md={6} sm={6}>
              <small>
                {" "}
                {toFixedDown(
                  marketData?.secondVolume,
                  marketData?.quoteFloatDigit
                )}
              </small>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={6} sm={6}>
              <small>24H Volume</small>
            </Col>
            <Col lg={6} md={6} sm={6}>
              <small>
                {" "}
                {toFixedDown(
                  marketData?.firstVolume,
                  marketData?.quoteFloatDigit
                )}
              </small>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={6} sm={6}>
              <small>Funding Rate</small>
            </Col>
            <Col lg={6} md={6} sm={6}>
              <small>{marketData?.fundingRate}%</small>
            </Col>
          </Row>
          <Row>
            <Col lg={6} md={6} sm={6}>
              <small>Funding Time</small>
            </Col>
            <Col lg={6} md={6} sm={6}>
              <small> {!isEmpty(count) ? count : "00:00:00"}</small>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
