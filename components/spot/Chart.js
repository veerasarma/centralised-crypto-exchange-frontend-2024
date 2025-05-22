import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "../../store";
import { useRouter } from "next/router";
import spot from "@/styles/Spot.module.css";
// import lib
import config from "../../config";
import { widget } from "@/public/static/charting_library/charting_library.min";
import isEmpty from "../../lib/isEmpty";
const chartUrl = config.SPOT_API;

const getNetworkStatus = () => (typeof window !== "undefined" ? navigator.onLine : true);

const Chart = (props) => {
  // state
  const { asPath, isReady } = useRouter();
  const [isClinet, setIsClient] = useState(false);
  let tvWidget = null;
  const [networkStatus, setNetworkStatus] = useState(getNetworkStatus());

  // redux state
  const tradePair = useSelector((state) => state.spot.tradePair);
  // const tradeThemeData = useSelector((state) => state.tradeTheme);

  const themeDataStore = useSelector(
    (state) => state.UserSetting.data.defaultTheme
  );
  //   const themeDataStore =
  //     localStorage.getItem("theme") == "Dark" ? "dark" : "light";

  // function
  const getLanguageFromURL = () => {
    const regex = new RegExp("[\\?&]lang=([^&#]*)");
    const results = regex.exec(window.location.search);
    return results === null
      ? null
      : decodeURIComponent(results[1].replace(/\+/g, " "));
  };

  const buildchart = (theme, pair) => {
    var widgetOptions = {
      symbol: pair,
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: new window.Datafeeds.UDFCompatibleDatafeed(props.datafeedUrl),
      interval: props.interval,
      container_id: props.containerId,
      library_path: props.libraryPath,

      locale: getLanguageFromURL() || "en",
      disabled_features: ["use_localstorage_for_settings"],
      enabled_features: ["study_templates"],
      charts_storage_url: props.chartsStorageUrl,
      charts_storage_api_version: props.chartsStorageApiVersion,
      client_id: props.clientId,
      user_id: props.userId,
      fullscreen: props.fullscreen,
      autosize: props.autosize,
      studies_overrides: props.studiesOverrides,
      loading_screen: { backgroundColor: "#000000" },
      theme: theme,
      toolbar_bg: "#000000",
      overrides: {
        "paneProperties.background": "#000000",
        "paneProperties.vertGridProperties.color": "transparent",
        "paneProperties.horzGridProperties.color": "transparent",
      },
    };
    if (theme == "White") {
      delete widgetOptions.toolbar_bg;
      delete widgetOptions.overrides;
    }

    const tvWidget = new widget(widgetOptions);

    tvWidget.onChartReady(() => {
      tvWidget.headerReady().then(() => {
        const button = tvWidget.createButton();
        button.setAttribute("title", "Click to show a notification popup");
        button.classList.add("apply-common-tooltip");
        button.addEventListener("click", () =>
          tvWidget.showNoticeDialog({
            title: "Notification",
            body: "TradingView Charting Library API works correctly",
            callback: () => {},
          })
        );

        // button.innerHTML = 'Check API';
      });
    });
  };

  useEffect(() => {
    if (
      !isEmpty(tradePair) &&
      !isEmpty(tradePair._id) &&
      !isEmpty(themeDataStore)
    ) {
      if (tvWidget !== null) {
        tvWidget.remove();
        tvWidget = null;
      }
    }
  }, [tradePair, isReady, themeDataStore]);

  useEffect(() => {
    if (!isReady) return;
    if (typeof window !== "undefined") {
      if (!isEmpty(tradePair) && !isEmpty(tradePair._id) && networkStatus) {
        let symbol =
          tradePair.firstCurrencySymbol + tradePair.secondCurrencySymbol;
        let themeValue = "White";
        // console.log(themeDataStore, "themeDataStorethemeDataStore");
        if (themeDataStore == "light") {
          themeValue = "Dark";
        } else if (themeDataStore == "dark") {
          themeValue = "White";
        }

        setTimeout(() => {
          buildchart(themeValue, symbol);
        }, 1000);
      }
    }
  }, [tradePair, themeDataStore, networkStatus]);

  useEffect(() => {
		const updateStatus = () => setNetworkStatus(navigator.onLine);

		window.addEventListener("online", updateStatus);
		window.addEventListener("offline", updateStatus);

		return () => {
			window.removeEventListener("online", updateStatus);
			window.removeEventListener("offline", updateStatus);
		};
	}, []);

  return <div id={props.containerId} className={spot.chart_inner_div} />;
};

Chart.propTypes = {
  symbol: PropTypes.string.isRequired,
  interval: PropTypes.string.isRequired,
  containerId: PropTypes.string.isRequired,
  datafeedUrl: PropTypes.string.isRequired,
  libraryPath: PropTypes.string.isRequired,
  chartsStorageUrl: PropTypes.string.isRequired,
  chartsStorageApiVersion: PropTypes.string.isRequired,
  clientId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  fullscreen: PropTypes.string.isRequired,
  autosize: PropTypes.string.isRequired,
  studiesOverrides: PropTypes.string.isRequired,
  theme: PropTypes.string.isRequired,
  pair: PropTypes.string.isRequired,
};

Chart.defaultProps = {
  symbol: "BTCUSD",
  interval: "1",
  containerId: "tv_chart_container",
  datafeedUrl: chartUrl + "/api/spot/chart",
  // datafeedUrl: "https://api.coindcx.com/api/v1/chart/history_v3?symbol=BTCINR&resolution=1&from=1637539200&to=1637648173",
  libraryPath: "/charting_library/", //live
  chartsStorageUrl: "",
  chartsStorageApiVersion: "1.1",
  clientId: "tradingview.com",
  userId: "public_user_id",
  fullscreen: false,
  autosize: true,
  studiesOverrides: {},
};

export default Chart;
