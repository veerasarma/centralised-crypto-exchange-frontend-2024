import { useEffect, useContext, useState } from "react";
import { Container, Table } from "react-bootstrap";
import styles from "@/styles/common.module.css";
import DataTable from "react-data-table-component";
import Link from "next/link";
import Image from "next/image";
import isEmpty from "@/lib/isEmpty";
import { useDispatch, useSelector } from "@/store";
import { nWComma } from "@/lib/calculation";
import { toFixed } from "@/lib/roundOf";
import config from "../../config"

import SocketContext from "../Context/SocketContext";
import { useRouter } from "next/router";

export default function FavoritesTable({ pairList, futurePair, inversePair, spotMark }: any) {
  const columns = [
    { name: "Name", selector: (row: any) => row.Name, sortable: true },
    { name: "Price", selector: (row: any) => row.Price, sortable: true },
    { name: "Change", selector: (row: any) => row.Change, sortable: true },
    { name: "24h high / 24h low", selector: (row: any) => row.low, sortable: true },
    { name: "24h Volume", selector: (row: any) => row.Volume, sortable: true },
    { name: "Actions", selector: (row: any) => row.Actions, sortable: true },
  ];

  // redux
  const { priceConversion } = useSelector((state: any) => state.wallet);
  const { favourite } = useSelector((state: any) => state.UserSetting.data)
  const dispatch = useDispatch()

  const router = useRouter()
  // state
  const [type, setType] = useState("spot");
  const [favPair, setFavPair] = useState([]);
  const [totFav, setTotFav] = useState({
    spotCount: 0,
    futureCount: 0,
    inverseCount: 0
  })
  const socketContext = useContext(SocketContext);
  const { spotCount, futureCount, inverseCount } = totFav
  const handleClick = (data: any) => setType(data);

  const filterPairs = (favKey: any, pairs: any) => {
    const spotFav = JSON.parse(localStorage.getItem("spotFav") || "[]")
    const spotCount = []
    const futureFav = JSON.parse(localStorage.getItem("futureFav") || "[]")
    const futureCount = []
    const inverseFav = JSON.parse(localStorage.getItem("inverseFav") || "[]")
    const inverseCount = []
    pairs.map((item: any) => {
      spotCount.push(...spotFav.filter((id: any) => id == item._id))
      futureCount.push(...futureFav.filter((id: any) => id == item._id))
      inverseCount.push(...inverseFav.filter((id: any) => id == item._id))
    })
    let data = {
      spotCount: spotCount.length,
      futureCount: futureCount.length,
      inverseCount: inverseCount.length
    }
    setTotFav(data)
    const favorites = JSON.parse(localStorage.getItem(favKey) || "[]");
    return pairs.filter((el: any) => favorites.includes(el._id));
  };

  const calculatePrice = (item: any, markPrice: any) => {
    if (item.secondCurrencySymbol === "USDT") return markPrice;
    const conversion = priceConversion.find(
      (elem: any) => elem.baseSymbol === item.secondCurrencySymbol && elem.convertSymbol === "USDT"
    );
    return markPrice * (conversion?.convertPrice || 1);
  };


  const mapPairsToData = (pairs: any) => {
    return pairs.map((item: any) => {
      const usdtValue = calculatePrice(item, item.markPrice);
      const isFavorite = JSON.parse(localStorage.getItem("spotFav") || "[]").includes(item.tikerRoot);

      const URL = type === 'spot' ? "spot" : type === 'future' ? "futures" : "inverse"
      let hRef = type === 'spot' ? `/${URL}/${item.firstCurrencySymbol}_${item.secondCurrencySymbol}` : `/${URL}/${item.baseCoinSymbol}_${item.quoteCoinSymbol}`
      return {
        ...item,
        Name: (
          <div className="d-flex align-items-center">
            {/* <i className="bi bi-star-fill" style={{ color: isFavorite ? "yellow" : "" }} /> */}
            <span>{item.tikerRoot}</span>
          </div>
        ),
        Price: `${nWComma(toFixed(usdtValue, 2))}`,
        Change: (
          <div className={toFixed(item.change, 2) > 0 ? styles.green_text : styles.red_text}>
            {toFixed(item.change, 2)} %
          </div>
        ),
        low: nWComma(toFixed(item.low || 0, 2)),
        Volume: nWComma(toFixed(item.secondVolume || 0, 2)),
        Actions: (
          <div className="d-flex align-items-center">
            <Link target="_blank" href={hRef}>
              <Image src={require("../../public/assets/images/trade_icon.png")} alt="Icon" width={24} height={24} className={`me-1 ${styles.img_trade}`} />
            </Link>
          </div>
        ),
      };
    });
  };


  useEffect(() => {
    let filteredPairs = [];
    if (type === 'spot') filteredPairs = filterPairs("spotFav", [...pairList, ...futurePair, ...inversePair]);
    else if (type === 'future') filteredPairs = filterPairs("futureFav", [...pairList, ...futurePair, ...inversePair]);
    else if (type === 'inverse') filteredPairs = filterPairs("inverseFav", [...pairList, ...futurePair, ...inversePair]);

    setFavPair(mapPairsToData(filteredPairs).sort((a: any, b: any) => b.secondVolume - a.secondVolume));
  }, [type, pairList, inversePair, futurePair, favourite]);

  const updateFavPairWithSocketData = (item: any, data: any) => {
    const usdtValue = calculatePrice(item, data.markPrice);
    return {
      ...item,
      Price: `${nWComma(toFixed(usdtValue, 2))}`,
      Change: (
        <div className={toFixed(data.change, 2) > 0 ? styles.green_text : styles.red_text}>
          {toFixed(data.change, 2)} %
        </div>
      ),
      low: nWComma(toFixed(data.low || 0, 2)),
      Volume: nWComma(toFixed(data.secondVolume || 0, 2)),
    };
  };
  useEffect(() => {
    if (type === 'spot' && spotMark) {
      setFavPair((prev: any) => {
        return prev.map((item: any) => {
          if (item._id === spotMark.pairId) {
            const usdtValue = item.secondCurrencySymbol === "USDT"
              ? spotMark.data.markPrice
              : spotMark.data.markPrice * (priceConversion.find(
                (conv: any) => conv.baseSymbol === item.secondCurrencySymbol && conv.convertSymbol === "USDT"
              )?.convertPrice || 1);

            return {
              ...item,
              Price: `${nWComma(toFixed(usdtValue, 2))}`,
              markPrice: spotMark.data.markPrice,
              Change: (
                <div className={toFixed(spotMark.data.change, 2) > 0 ? styles.green_text : styles.red_text}>
                  {toFixed(spotMark.data.change, 2)} %
                </div>
              ),
              low: nWComma(toFixed(spotMark.data.low || 0, 2)),
              Volume: nWComma(toFixed(spotMark.data.secondVolume || 0)),
            };
          }
          return item;
        });
      });
    } else if (type === 'future') {
      socketContext.perpSocket.on("usdtPerMarketPrice", (result: any) => {
        setFavPair((prev: any) => prev.map((item: any) => item._id === result.pairId ? updateFavPairWithSocketData(item, result.data) : item));
      });
    } else if (type === 'inverse') {
      socketContext.inverSocket.on("usdtPerMarketPrice", (result: any) => {
        setFavPair((prev: any) => prev.map((item: any) => item._id === result.pairId ? updateFavPairWithSocketData(item, result.data) : item));
      });
    }
    return () => {
      socketContext.perpSocket.off("usdtPerMarketPrice");
      socketContext.inverSocket.off("usdtPerMarketPrice");
    };
  }, [type, spotMark, priceConversion]);

  const handleNavigate = (type: any) => {
    router.push({
      pathname: '/market',
      query: { type },
    });
  };
  return (
    <section >
      <Container>

        <div className=" innertab pb-2 my-4 w-100">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="spot-tab"
                data-bs-toggle="tab"
                data-bs-target="#spot"
                type="button"
                role="tab"
                aria-controls="spot"
                aria-selected="true"
                onClick={() => handleClick("spot")}
              >
                Spot({spotCount})
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="futures-tab"
                data-bs-toggle="tab"
                data-bs-target="#futures"
                type="button"
                role="tab"
                aria-controls="futures"
                aria-selected="false"
                onClick={() => handleClick("future")}
              >
                Futures({futureCount})
              </button>
            </li>
            {config.MODE !== "prod" &&
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="inverse-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#inverse"
                  type="button"
                  role="tab"
                  aria-controls="inverse"
                  aria-selected="false"
                  onClick={() => handleClick("inverse")}
                >
                  Inverse({inverseCount})
                </button>
              </li>
            }
          </ul>
          <div className="tab-content" id="myTabContent">
            <div
              className="tab-pane fade show active"
              id="spot"
              role="tabpanel"
              aria-labelledby="spot-tab"
            >
              {spotCount > 0 &&
                <DataTable columns={columns} data={favPair} onRowClicked={(row) => window.open(`/spot/${row.firstCurrencySymbol}_${row.secondCurrencySymbol}`, "_blank")} />
              }
              {spotCount <= 0 &&
                <div className="text-center">
                  <Image src={require("../.././public/assets/images/nodata.png")} alt="" className="img-fluid " />
                  <p>No results. Go to spot market to add your favorite tokens.</p>
                  <button onClick={() => handleNavigate("spot")} className={styles.primary_btn_2}
                  >Add Favorites</button>
                </div>
              }
            </div>
            <div
              className="tab-pane fade"
              id="futures"
              role="tabpanel"
              aria-labelledby="futures-tab"
            >
              {futureCount > 0 &&
                <DataTable columns={columns} data={favPair} onRowClicked={(row) => window.open(`/futures/${row.baseCoinSymbol}_${row.quoteCoinSymbol}`, "_blank")} />
              }
              {futureCount <= 0 &&
                <div className="text-center">
                  <Image src={require("../.././public/assets/images/nodata.png")} alt="" className="img-fluid " />
                  <p>No results. Go to future market to add your favorite tokens.</p>
                  <button onClick={() => handleNavigate("future")} className={styles.primary_btn_2}
                  >Add Favorites</button>
                </div>
              }
            </div>
            <div
              className="tab-pane fade"
              id="inverse"
              role="tabpanel"
              aria-labelledby="inverse-tab"
            >
              {inverseCount > 0 &&
                <DataTable columns={columns} data={favPair} onRowClicked={(row) => router.push(`/inverse/${row.quoteCoinSymbol}_${row.baseCoinSymbol}`)} />
              }
              {inverseCount <= 0 &&
                <div className="text-center">
                  <Image src={require("../.././public/assets/images/nodata.png")} alt="" className="img-fluid " />
                  <p>No results. Go to inverse market to add your favorite tokens.</p>
                  <button onClick={() => handleNavigate("inverse")} className={styles.primary_btn_2}
                  >Add Favorites</button>
                </div>
              }
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
