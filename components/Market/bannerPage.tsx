// import { useEffect, useContext, useState } from "react";
// import { Container, Table } from "react-bootstrap";
// import styles from "@/styles/common.module.css";
// import Image from "next/image";
// //import lib
// import isEmpty from "@/lib/isEmpty";
// import { toFixed } from "@/lib/roundOf";
// //improt context
// import SocketContext from "../Context/SocketContext";
// import { useRouter } from "next/router";
// import { apigetPairList } from "@/services/Spot/SpotService";
// import { nWComma } from "@/lib/calculation";

// import Slider from "react-slick";


// export default function MarketPageTable({ pairList }: any) {
//     const settings = {
//         dots: false,
//         infinite: true, // Ensures it loops
//         speed: 500, // Speed of the transition (in ms)
//         slidesToShow: 5, // Number of items to show in the viewport
//         slidesToScroll: 1, // How many items to scroll per swipe
//         autoplay: true, // Enable auto-moving
//         autoplaySpeed: 3000, // Time between scrolls (3 seconds)
//         arrows: false, // Disable the next/prev arrows
//     };

//     const router = useRouter();
//     const socketContext = useContext<any>(SocketContext);
//     const [data, setData] = useState<any>([]);

//     // useEffect(() => {
//     //     if (isEmpty(data)) {
//     //         setData(pairList)
//     //     }
//     // }, [data])

//     useEffect(() => {
//         fetchPairList();
//     }, []);
//     const fetchPairList = async () => {
//         if (isEmpty(data)) {
//             const data: any = await apigetPairList();
//             let pList = data?.data?.result
//             const result = pList
//                 .filter((item: any) => item.botstatus === 'off')
//                 .sort((a: any, b: any) => b.secondVolume - a.secondVolume);
//             setData(result);
//         }
//     };

//     useEffect(() => {
//         // socket
//         socketContext.spotSocket.on("marketPrice", (result: any) => {
//             console.log(result, "-------result");
//             let tempPairList = [...data];
//             let pairIndex =
//                 tempPairList &&
//                 tempPairList.findIndex((el: any) => {
//                     return el._id == result.pairId;
//                 });
//             if (pairIndex >= 0 && !isEmpty(pairIndex)) {
//                 tempPairList[pairIndex] = {
//                     ...tempPairList[pairIndex],
//                     ...{
//                         markPrice: result.data.markPrice,
//                         change: result.data.change,
//                         last: result.data.last,
//                     },
//                 };
//                 setData(tempPairList);
//             }
//         });
//         // return () => {
//         //     socketContext.spotSocket.off("marketPrice");
//         // }
//     }, [data]);
//     console.log(data, '------87')
//     useEffect(() => {
//         socketContext.spotSocket.emit("subscribe", "spot");
//         return () => {
//             socketContext.spotSocket.off("marketPrice");
//             socketContext.spotSocket.emit("unSubscribe", "spot");
//         };
//     }, []);
//     return (
//         <Container>
//             <div className='slider' >
//                 <Slider {...settings}>
//                     {data.map((item: any, index: any) => (
//                         <div key={index} className={styles.crypto_item}>
//                             <div className={styles.crypto_pair}>
//                                 <Image src={item.firstCurrencyImage} alt={item.tikerRoot} width={30} height={30} />
//                                 <span>{item.tikerRoot}</span>
//                             </div>
//                             <div className={`${styles.crypto_price} green`}>
//                                 {`Price: ${toFixed(item.markPrice, item.secondFloatDigit)}`}
//                             </div>
//                             <div className={`${styles.crypto_price} green`}>
//                                 {`Change: ${toFixed(item.change, item.secondFloatDigit)}`}
//                             </div>
//                         </div>
//                     ))}
//                 </Slider>
//             </div>
//         </Container>
//     );
// }







import isEmpty from '@/lib/isEmpty';
import { apigetPairList } from '@/services/Spot/SpotService';
import React, { useEffect, useState } from 'react';

// Define the type for the symbols prop
type Symbol = {
    proName: string;
};


export default function MarketPageTable({ }) {
    const [symbols, setSymbols] = useState([])
    let theme: any = localStorage.getItem("theme");
    theme = theme.split('_')[0];

    useEffect(() => {
        fetchPairList();
    }, []);
    const fetchPairList = async () => {
        const data: any = await apigetPairList();
        let pList = data?.data?.result;
        let symbol: any = [];
        for (let item of pList) {
            if (item.botstatus == "off") {
                symbol.push({ proName: "BINANCE:" + item.firstCurrencySymbol + item.secondCurrencySymbol })
            }
        }
        setSymbols(symbol)
    };
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            symbols: symbols,
            showSymbolLogo: true,
            isTransparent: true,
            displayMode: 'compact',
            colorTheme: theme,
            locale: 'en',
        });

        const widgetContainer = document.getElementById('tradingview-widget-container');
        if (widgetContainer) {
            widgetContainer.appendChild(script);
        }

        // Cleanup function to remove the script on component unmount
        return () => {
            const widgetContainer = document.getElementById('tradingview-widget-container');
            if (widgetContainer) {
                widgetContainer.innerHTML = '';
            }
        };
    }, [symbols, theme]);

    return (
        <div className="tradingview-widget-container" id="tradingview-widget-container">
            <div className="tradingview-widget-container__widget"></div>
            <div className="tradingview-widget-copyright">
                <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
                    {/* <span className="blue-text">Track all markets on TradingView</span> */}
                </a>
            </div>
        </div>
    );
};