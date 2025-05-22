// import React, { useEffect } from "react";
// import PropTypes from "prop-types";
// import { useSelector } from "../../store";
// import { useRouter } from "next/router";
// import spot from "@/styles/Spot.module.css";
// // import lib
// import config from "../../config";
// import { widget } from "./ChartLib/charting_library/charting_library.min";
// import isEmpty from "../../lib/isEmpty";
// const chartUrl = config.INVERSE_API;

// const Chart = (props) => {
//   // state
//   const { isReady } = useRouter();
//   let tvWidget = null;

//   // redux state
//   const { tradePair } = useSelector((state) => state.inverse);
//   // const tradeThemeData = useSelector((state) => state.tradeTheme);

//   const themeDataStore = useSelector(
//     (state) => state.UserSetting.data.defaultTheme
//   );

//   // function
//   const getLanguageFromURL = () => {
//     const regex = new RegExp("[\\?&]lang=([^&#]*)");
//     const results = regex.exec(window.location.search);
//     return results === null
//       ? null
//       : decodeURIComponent(results[1].replace(/\+/g, " "));
//   };

//   const buildchart = (theme, pair) => {
//     var widgetOptions = {
//       symbol: pair,
//       // BEWARE: no trailing slash is expected in feed URL
//       datafeed: new window.Datafeeds.UDFCompatibleDatafeed(
//         props.datafeedUrl + "/" + tradePair._id
//       ),
//       interval: props.interval,
//       container_id: props.containerId,
//       library_path: props.libraryPath,

//       locale: getLanguageFromURL() || "en",
//       disabled_features: ["use_localstorage_for_settings"],
//       enabled_features: ["study_templates"],
//       charts_storage_url: props.chartsStorageUrl,
//       charts_storage_api_version: props.chartsStorageApiVersion,
//       client_id: props.clientId,
//       user_id: props.userId,
//       fullscreen: props.fullscreen,
//       autosize: props.autosize,
//       studies_overrides: props.studiesOverrides,
//       loading_screen: { backgroundColor: "#000000" },
//       theme: theme,
//       toolbar_bg: "#000000",
//       overrides: {
//         "paneProperties.background": "#000000",
//         "paneProperties.vertGridProperties.color": "transparent",
//         "paneProperties.horzGridProperties.color": "transparent",
//       },
//     };

//     const tvWidget = new widget(widgetOptions);

//     tvWidget.onChartReady(() => {
//       tvWidget.headerReady().then(() => {
//         const button = tvWidget.createButton();
//         button.setAttribute("title", "Click to show a notification popup");
//         button.classList.add("apply-common-tooltip");
//         button.addEventListener("click", () =>
//           tvWidget.showNoticeDialog({
//             title: "Notification",
//             body: "TradingView Charting Library API works correctly",
//             callback: () => {},
//           })
//         );

//         // button.innerHTML = 'Check API';
//       });
//     });
//   };

//   useEffect(() => {
//     if (
//       !isEmpty(tradePair) &&
//       !isEmpty(tradePair._id) &&
//       !isEmpty(themeDataStore)
//     ) {
//       if (tvWidget !== null) {
//         tvWidget.remove();
//         tvWidget = null;
//       }
//     }
//   }, [tradePair, isReady, themeDataStore]);

//   useEffect(() => {
//     if (!isReady) return;
//     if (typeof window !== "undefined") {
//       if (!isEmpty(tradePair) && !isEmpty(tradePair._id)) {
//         let symbol = tradePair.baseCoinSymbol + tradePair.quoteCoinSymbol;
//         // let themeValue = "White";
//         // if (themeDataStore == "light") {
//         //     themeValue = "White";
//         // } else if (themeDataStore == "dark") {
//         //     themeValue = "Dark";
//         // }
//         setTimeout(() => {
//           buildchart("Dark", symbol);
//         }, 1000);
//       }
//     }
//   }, [tradePair, themeDataStore]);

//   return <div id={props.containerId} className={spot.chart_inner_div} />;
// };

// Chart.propTypes = {
//   symbol: PropTypes.string.isRequired,
//   interval: PropTypes.string.isRequired,
//   containerId: PropTypes.string.isRequired,
//   datafeedUrl: PropTypes.string.isRequired,
//   libraryPath: PropTypes.string.isRequired,
//   chartsStorageUrl: PropTypes.string.isRequired,
//   chartsStorageApiVersion: PropTypes.string.isRequired,
//   clientId: PropTypes.string.isRequired,
//   userId: PropTypes.string.isRequired,
//   fullscreen: PropTypes.string.isRequired,
//   autosize: PropTypes.string.isRequired,
//   studiesOverrides: PropTypes.string.isRequired,
//   theme: PropTypes.string.isRequired,
//   pair: PropTypes.string.isRequired,
// };

// Chart.defaultProps = {
//   symbol: "BTCUSD",
//   interval: "1",
//   containerId: "tv_chart_container",
//   datafeedUrl: chartUrl + "/api/inverse/chart",
//   libraryPath: "/charting_library/",
//   chartsStorageUrl: "",
//   chartsStorageApiVersion: "1.1",
//   clientId: "tradingview.com",
//   userId: "public_user_id",
//   fullscreen: false,
//   autosize: true,
//   studiesOverrides: {},
// };

// export default Chart;

import React, { useEffect, useState } from "react";
import { useSelector } from "../../store";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";
import { useCookies } from "react-cookie";
import isEmpty from "@/lib/isEmpty";

const Chart = () => {
  const [cookies, setCookie] = useCookies(["theme"]);
  const [chartTheme, setChartTheme] = useState(cookies.theme || "light"); // Default to 'light' theme if not set
  const [renderTrigger, setRenderTrigger] = useState(0); // Dummy state to force re-render

  // redux state
  const { tradePair } = useSelector((state) => state.inverse);

  const themeDataStore = useSelector(
    (state) => state.UserSetting.data.defaultTheme
  );

  useEffect(() => {
    setChartTheme(cookies.theme || "light"); // Update chart theme when cookie changes
    console.log("Current Theme:", chartTheme); // Log theme for debugging
    setRenderTrigger((prev) => prev + 1); // Force re-render
  }, [tradePair, cookies.theme]);

  useEffect(() => {
    console.log(tradePair, "-----------173");
    if (!isEmpty(tradePair) && !isEmpty(tradePair._id)) {
      console.log(themeDataStore, "---------175");
      if (themeDataStore === "light") {
        setCookie("theme", "dark", { path: "/" });
      } else if (themeDataStore === "dark") {
        setCookie("theme", "light", { path: "/" });
      }
    }
  }, [tradePair, themeDataStore]);
  useEffect(() => {}, [tradePair]);

  useEffect(() => {
    setChartTheme(themeDataStore || "light"); // Update chartTheme when themeDataStore changes
  }, [themeDataStore]);
  return (
    <AdvancedRealTimeChart
      key={renderTrigger} // Use renderTrigger as key to force re-render
      interval={"1"}
      symbol={tradePair.baseCoinSymbol + tradePair.quoteCoinSymbol}
      width="100%"
      height="400px"
      theme={chartTheme}
      style="1" // Ensure this is set to the candlestick chart style
      locale="en"
      toolbar_bg="#18a594"
      container_id="tradingview_15c7d"
      enable_publishing={false}
      hide_legend={true}
      allow_symbol_change={false}
      autosize
    />
  );
};

export default Chart;
