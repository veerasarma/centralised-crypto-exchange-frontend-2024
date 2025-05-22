import { useEffect, useContext, useState } from "react";
import { Container, Table } from "react-bootstrap";
import styles from "@/styles/common.module.css";
import DataTable from "react-data-table-component";
import Image from "next/image";
import isEmpty from "@/lib/isEmpty";
import SocketContext from "../Context/SocketContext";
import Link from "next/link";
import { useDispatch, useSelector } from "@/store";
import { nWComma } from "@/lib/calculation";
import { toFixed } from "@/lib/roundOf";
import { getFavourite } from "@/store/UserSetting/dataSlice";
import { useRouter } from "next/router";

export default function FuturesTable({ futurePair }: any) {

  // redux
  const { favourite } = useSelector((state: any) => state.UserSetting.data)
  const { priceConversion } = useSelector((state: any) => state.wallet);
  const dispatch = useDispatch()
  const router = useRouter()
  const socketContext = useContext<any>(SocketContext);
  // state
  const [data, setData] = useState<any>([]);

  const columns = [
    {
      name: "Name",
      selector: (row: any) => row.Name,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row: any) => row.Price,
      sortable: true,
    },

    {
      name: "Change",
      selector: (row: any) => row.Change,
      sortable: true,
    },
    {
      name: "24h high / 24h low",
      selector: (row: any) => row.low,
      sortable: true,
    },
    {
      name: "24h Volume",
      selector: (row: any) => row.Volume,
      sortable: true,
    },
    // {
    //   name: "Market Cap",
    //   selector: (row:any) => row.Market,
    //   sortable: true,
    // },
    {
      name: "Actions",
      selector: (row: any) => row.Actions,
      sortable: true,
    },
  ];

  useEffect(() => {
    if (isEmpty(data)) {
      getPairData(futurePair);
    }
  }, [data]);

  // Retrieve favorites from localStorage
  const getFavorites = (): string[] => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('futureFav') || '[]');
    }
    return [];
  };

  // Toggle favorite status for an item
  const toggleFavorite = (id: string) => {
    const currentFavorites = getFavorites();
    let updatedFavorites;
    if (currentFavorites.includes(id)) {
      updatedFavorites = currentFavorites.filter(fav => fav !== id);
    } else {
      updatedFavorites = [...currentFavorites, id];
    }
    localStorage.setItem('futureFav', JSON.stringify(updatedFavorites));
    dispatch(getFavourite())
    getPairData(futurePair)
  };
  const getPairData = (pairList: any) => {
    let newArr: any = []
    pairList?.length > 0 && pairList.map((item: any) => {
      let usdtValue;
      if (item.quoteCoinSymbol == "USDT") {
        usdtValue = item.markPrice;
      } else {
        let MarkValue = priceConversion.find(
          (elem: any) =>
            elem.baseSymbol == item.quoteCoinSymbol &&
            elem.convertSymbol == "USDT"
        );
        if (MarkValue) {
          usdtValue = item.markPrice * MarkValue.convertPrice;
        } else {
          usdtValue = item.markPrice;
        }
      }
      let favorites = getFavorites() // favourite?.futureCount ? favourite.futureCount : []
      let favSel = favorites.includes(item._id) ? "yellow" : ""
      let checkData = {
        Name: (
          <div className="d-flex align-items-center">
            {/* <Image
              src={require("../../public/assets/images/star.png")}
              alt="Icon"
              width={20}
              height={20}
              className="me-1"
            /> */}
            <i className="bi bi-star-fill" style={{ color: favSel, marginRight: '8px' }} onClick={() => toggleFavorite(item._id)}></i>
            <span>{item.tikerRoot}</span>
          </div>
        ),
        Price: (`${nWComma(toFixed(
          isEmpty(usdtValue)
            ? item.markPrice
            : usdtValue,
          2
        ))}`),
        Change: (
          <div className={toFixed(item.change, 2) > 0 ? styles.green_text : styles.red_text}>
            {toFixed(item.change, 2)} %
          </div >
        ),
        low: (
          !isEmpty(item?.low) ? nWComma(toFixed(item.low, 2)) : 0
        ),
        Volume: (
          !isEmpty(item?.secondVolume)
            ? nWComma(toFixed(item.secondVolume, 2))
            : 0
        ),
        Market: "$99,989.99B",
        Actions: (
          <div className="d-flex align-items-center">
            <Link
              target="_blank"
              href={`/futures/${item.baseCoinSymbol}_${item.quoteCoinSymbol}`}
            >
              <Image
                src={require("../../public/assets/images/trade_icon.png")}
                alt="Icon"
                width={24}
                height={24}
                className={`me-1 ${styles.img_trade}`}
              />
            </Link>
          </div >
        )
      };
      newArr.push({ ...item, ...checkData })
    })
    setData(newArr)
  };
  useEffect(() => {
    // socket
    socketContext.perpSocket.on("usdtPerMarketPrice", (result: any) => {
      setData((el: any) => {
        let sockList: any = [];
        el &&
          el.map((item: any) => {
            if (item._id == result.pairId) {
              let usdtValue;
              if (item.secondCurrencySymbol == "USDT") {
                usdtValue = result.data.markPrice;
              } else {
                let MarkValue = priceConversion.find(
                  (item: any) =>
                    item.baseSymbol == item.secondCurrencySymbol &&
                    item.convertSymbol == "USDT"
                );
                if (MarkValue) {
                  usdtValue = result.data.markPrice * MarkValue.convertPrice;
                } else {
                  usdtValue = result.data.markPrice;
                }
              }
              sockList.push({
                ...item,
                Price: (`${nWComma(toFixed(
                  isEmpty(usdtValue)
                    ? result.data.markPrice
                    : usdtValue,
                  2
                ))}`
                ),
                markPrice: result.data.markPrice,
                Change: (
                  <div className={toFixed(result.data.change, 2) > 0 ? styles.green_text : styles.red_text}>
                    {toFixed(result.data.change, 2)} %
                  </div >
                ),
                low: (
                  !isEmpty(result.data?.low) ? nWComma(toFixed(result.data.low, 2)) : 0
                ),
                Volume: (
                  !isEmpty(result.data?.secondVolume)
                    ? nWComma(toFixed(result.data.secondVolume, 2))
                    : 0
                ),
              });
            } else {
              sockList.push(item);
            }
          });
        return sockList;
      });
    });
  }, [data]);
  useEffect(() => {
    socketContext.perpSocket.emit("subscribe", "perpetual");
    return () => {
      socketContext.perpSocket.off("usdtPerMarketPrice");
      socketContext.perpSocket.emit("unSubscribe", "spot");
    };
  }, []);
  return (
    <section >
      <Container>
        <div className=" innertab pb-2 my-4 w-100">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="USDT-tab"
                data-bs-toggle="tab"
                data-bs-target="#USDT"
                type="button"
                role="tab"
                aria-controls="USDT"
                aria-selected="true"
              >
                USDⓈ-M Futures
              </button>
            </li>
          </ul>
          <div className="tab-content" id="myTabContent">
            <div
              className="tab-pane fade show active"
              id="USDT"
              role="tabpanel"
              aria-labelledby="USDT-tab"
            >
              <DataTable columns={columns} data={data} onRowClicked={(row) => window.open(`/futures/${row.baseCoinSymbol}_${row.quoteCoinSymbol}`, "_blank")} />
              {/* <div className="text-center">
                <Image src={require("../.././public/assets/images/nodata.png")} alt="" className="img-fluid " />
                <p>No results. Go to USDT market to add your favorite tokens.</p>
                <button className={styles.primary_btn_2}>Add Favorites</button>
              </div> */}
            </div>


          </div>
        </div>
      </Container>
    </section>
  );
}
