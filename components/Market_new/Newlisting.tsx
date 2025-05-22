import { useEffect, useContext, useState } from "react";
import { Container, Table } from "react-bootstrap";
import styles from "@/styles/common.module.css";
import DataTable from "react-data-table-component";
import Image from "next/image";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import isEmpty from "@/lib/isEmpty";
import { useDispatch, useSelector } from "@/store";
import { nWComma } from "@/lib/calculation";
import { toFixed } from "@/lib/roundOf";
import Link from "next/link";
import { momentFormat } from "@/lib/dateTimeHelper";
import { getFavourite } from "@/store/UserSetting/dataSlice";
import { useRouter } from "next/router";

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
  //   selector: (row: any) => row.Market,
  //   sortable: true,
  // },
  // {
  //   name: "Date listed",
  //   selector: (row: any) => row.Date,
  //   sortable: true,
  // },
  {
    name: "Actions",
    selector: (row: any) => row.Actions,
    sortable: true,
  },
];
export default function NewlistingTable({ pairList, spotMark }: any) {
  // redux
  const dispatch = useDispatch()
  const { priceConversion } = useSelector((state: any) => state.wallet);
  const { favourite } = useSelector((state: any) => state.UserSetting.data)
  const router = useRouter()
  // state
  const [data, setData] = useState<any>([]);
  const getPairData = (pairList: any) => {
    dataSet()
  };
  const getFavorites = (): string[] => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('spotFav') || '[]');
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
    localStorage.setItem('spotFav', JSON.stringify(updatedFavorites));
    dispatch(getFavourite())
    dataSet()
  };

  const dataSet = () => {
    let newArr: any = [];
    pairList?.length > 0 &&
      pairList.map((item: any) => {
        let usdtValue;
        if (item.secondCurrencySymbol == "USDT") {
          usdtValue = item.markPrice;
        } else {
          let MarkValue = priceConversion.find(
            (elem: any) =>
              elem.baseSymbol == item.secondCurrencySymbol &&
              elem.convertSymbol == "USDT"
          );
          if (MarkValue) {
            usdtValue = item.markPrice * MarkValue.convertPrice;
          } else {
            usdtValue = item.markPrice;
          }
        }
        let favorites = favourite?.spotCount ? favourite.spotCount : []
        let favSel = favorites.includes(item._id) ? "yellow" : ""
        let data = {
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
          ))}`
          ),
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
          Date: momentFormat(item.createdAt),
          Actions: (
            <div className="d-flex align-items-center">
              <Link
                target="_blank"
                href={`/spot/${item.firstCurrencySymbol}_${item.secondCurrencySymbol}`}
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
        newArr.push({ ...item, ...data });
      });
    setData(newArr)
  }
  useEffect(() => {
    dataSet()
  }, [favourite])
  useEffect(() => {
    if (isEmpty(data)) {
      getPairData(pairList);
    }
  }, [data]);
  useEffect(() => {
    // socket
    setData((el: any) => {
      let sockList: any = [];
      el &&
        el.map((item: any) => {
          if (item._id == spotMark.pairId) {
            let usdtValue;
            if (item.secondCurrencySymbol == "USDT") {
              usdtValue = spotMark.data.markPrice;
            } else {
              let MarkValue = priceConversion.find(
                (item: any) =>
                  item.baseSymbol == item.secondCurrencySymbol &&
                  item.convertSymbol == "USDT"
              );
              if (MarkValue) {
                usdtValue = spotMark.data.markPrice * MarkValue.convertPrice;
              } else {
                usdtValue = spotMark.data.markPrice;
              }
            }
            sockList.push({
              ...item,
              Price: (`${nWComma(toFixed(
                isEmpty(usdtValue)
                  ? spotMark.data.markPrice
                  : usdtValue,
                2
              ))}`
              ),
              markPrice: spotMark.data.markPrice,
              Change: (
                <div className={toFixed(spotMark.data.change, 2) > 0 ? styles.green_text : styles.red_text}>
                  {toFixed(spotMark.data.change, 2)} %
                </div >
              ),
              low: (
                !isEmpty(spotMark.data?.low) ? nWComma(toFixed(spotMark.data.low, 2)) : 0
              ),
              Volume: (
                !isEmpty(spotMark.data?.secondVolume)
                  ? nWComma(toFixed(spotMark.data.secondVolume, 2))
                  : 0
              ),
            });
          } else {
            sockList.push(item);
          }
        });
      return sockList;
    });
  }, [data]);
  return (
    <section >
      <Container>
        <DataTable columns={columns} data={data} onRowClicked={(row) => window.open(`/spot/${row.firstCurrencySymbol}_${row.secondCurrencySymbol}`, "_blank")} />
      </Container>
    </section>
  );
}
