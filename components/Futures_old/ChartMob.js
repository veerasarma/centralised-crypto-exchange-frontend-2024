import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/router";
import spot from "@/styles/Spot.module.css";
// import lib
import config from "../../config";
import { widget } from "./ChartLib/charting_library/charting_library.min";
import isEmpty from "../../lib/isEmpty";
const chartUrl = config.FUTURES_API;

const Chart = (props) => {
    // state
    const { isReady } = useRouter();
    let tvWidget = null;

    // redux state
    const tradePair = props.tradePair;
    // const tradeThemeData = useSelector((state) => state.tradeTheme);

    const themeDataStore = props.theme;


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
            datafeed: new window.Datafeeds.UDFCompatibleDatafeed(
                props.datafeedUrl + "/" + props.pairId
            ),
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
                        callback: () => { },
                    })
                );

                // button.innerHTML = 'Check API';
            });
        });
    };

    useEffect(() => {
        if (!isEmpty(tradePair) && !isEmpty(themeDataStore)) {
            if (tvWidget !== null) {
                tvWidget.remove();
                tvWidget = null;
            }
        }
    }, [tradePair, isReady, themeDataStore]);

    useEffect(() => {
        if (!isReady) return;
        if (typeof window !== "undefined") {
            if (!isEmpty(tradePair)) {
                let symbol = tradePair;
                let themeValue = "White";
                if (themeDataStore == "light") {
                    themeValue = "White";
                } else if (themeDataStore == "dark") {
                    themeValue = "Dark";
                }
                setTimeout(() => {
                    buildchart(themeValue, symbol)
                }, 1000);

            }
        }
    }, [tradePair, themeDataStore]);

    return <div id={props.containerId} style={{ height: '100vh' }} />;
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
    datafeedUrl: chartUrl + "/api/perpetual/chart",
    libraryPath: "/charting_library/",
    chartsStorageUrl: "",
    chartsStorageApiVersion: "1.1",
    clientId: "tradingview.com",
    userId: "public_user_id",
    fullscreen: false,
    autosize: true,
    studiesOverrides: {},
};

export default Chart;
