import { useEffect, useContext, useState } from "react";
import { Container, Table } from "react-bootstrap";
import styles from "@/styles/common.module.css";
import DataTable from "react-data-table-component";
import Image from "next/image";
const columns = [
  {
    name: "Name",
    selector: (row) => row.Name,
    sortable: true,
  },
  {
    name: "Price",
    selector: (row) => row.Price,
    sortable: true,
  },

  {
    name: "Change",
    selector: (row) => row.Change,
    sortable: true,
  },
  {
    name: "24h high / 24h low",
    selector: (row) => row.low,
    sortable: true,
  },
  {
    name: "24h Volume",
    selector: (row) => row.Volume,
    sortable: true,
  },
  {
    name: "Market Cap",
    selector: (row) => row.Market,
    sortable: true,
  },
  {
    name: "Actions",
    selector: (row) => row.Actions,
    sortable: true,
  },
];
const data = [
  {
    Name: (
      <div className="d-flex align-items-center">
        <Image
          src={require("../../public/assets/images/cryptoicons/btc.png")}
          alt="Icon"
          width={24}
          height={24}
          className="me-1"
        />
        <span>BTC Bitcoin</span>
      </div>
    ),
    Price: "$99,989.99",
    Change:  (
      <div className={styles.red_text}>
      -9.87%
      </div>),
    Volume: "$99,989.99B",
    Market: "$99,989.99B",
    Actions:(<div className="d-flex align-items-center">

    <a href="#">
    <Image
      src={require("../../public/assets/images/trade_icon.png")}
      alt="Icon"
      width={24}
      height={24}
      className={`me-1 ${styles.img_trade}`}
    />
    </a>
  </div>),
    
  },
  {
    Name: (
      <div className="d-flex align-items-center">
        <Image
          src={require("../../public/assets/images/cryptoicons/btc.png")}
          alt="Icon"
          width={24}
          height={24}
          className="me-1"
        />
        <span>BTC Bitcoin</span>
      </div>
    ),
    Price: "$99,989.99",
    Change:  (
      <div className={styles.red_text}>
      -9.87%
      </div>),
    Volume: "$99,989.99B",
    Market: "$99,989.99B",
    Actions:(<div className="d-flex align-items-center">
 
    <a href="#">
    <Image
      src={require("../../public/assets/images/trade_icon.png")}
      alt="Icon"
      width={24}
      height={24}
      className={`me-1 ${styles.img_trade}`}
    />
    </a>
  </div>),
    
  },
];
export default function CryptoTable({ pairList }: any) {
  return (
    <section >
      <Container>
      
      
      <DataTable columns={columns} data={data} />
              {/* <div className="text-center">
              <Image src={require("../.././public/assets/images/nodata.png")} alt="" className="img-fluid "   />
                <p>No results. Go to spot market to add your favorite tokens.</p>
                <button className={styles.primary_btn_2}>Add Favorites</button>
              </div> */}
      </Container>
    </section>
  );
}
