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
    let chartInstance = null; // Use a more descriptive variable name
    let tvWidget = null;
    // redux state
    const tradePair = props.tradePair;
    // const tradeThemeData = useSelector((state) => state.tradeTheme);

    const themeDataStore = props.theme;
    const screen = props.screen


    // function
    const getLanguageFromURL = () => {
        const regex = new RegExp("[\\?&]lang=([^&#]*)");
        const results = regex.exec(window.location.search);
        return results === null
            ? null
            : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    const buildchart = (theme, pair, disableFeat) => {
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
            // disabled_features: ["use_localstorage_for_settings"],
            disabled_features: disableFeat,
            enabled_features: [
                "volume_force_overlay" // Ensures that the volume indicator remains visible as a separate study
            ],
            charts_storage_url: props.chartsStorageUrl,
            charts_storage_api_version: props.chartsStorageApiVersion,
            client_id: props.clientId,
            user_id: props.userId,
            fullscreen: props.fullscreen,
            autosize: props.autosize,
            studies_overrides: props.studiesOverrides,
            loading_screen: { backgroundColor: "#000000" },
            theme: theme === "White" ? "Light" : "Dark", // Set theme to Light or Dark
            toolbar_bg: theme === "White" ? "#FFFFFF" : "#000000", // Set toolbar color based on theme
            overrides: {
                "paneProperties.background": theme === "White" ? "#FFFFFF" : "#000000", // Background based on theme
                "paneProperties.vertGridProperties.color": theme === "White" ? "#E0E0E0" : "transparent", // Grid color
                "paneProperties.horzGridProperties.color": theme === "White" ? "#E0E0E0" : "transparent",
                "scalesProperties.textColor": theme === "White" ? "#000000" : "#FFFFFF" // Text color based on theme
            }
        };

        const tvWidget = new widget(widgetOptions);

        tvWidget.onChartReady(() => {
            tvWidget.headerReady().then(() => {
                const chart = tvWidget.activeChart();
                let movAvg = [{ color: '#FF69B4', val: 14 }, { color: '#89CFF0', val: 20 }, { color: '#E1C16E', val: 50 }]
                for (let item of movAvg) {
                    chart.createStudy('Moving Average', false, false, [item.val], {
                        'Plot.color': item.color,
                        'Plot.linewidth': 5,
                        'Plot.linestyle': 0,
                    });
                }
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
                let disableFeat = []
                if (themeDataStore == "light") {
                    themeValue = "White";
                } else if (themeDataStore == "dark") {
                    themeValue = "Dark";
                }
                if (screen == "small") {
                    disableFeat = [
                        "header_symbol_search",
                        "header_symbol_search",
                        "header_compare",
                        "header_saveload",
                        "header_indicators",
                        "header_settings",
                        "header_chart_type",
                        "header_undo_redo",
                        "control_bar",
                        "timeframes_toolbar",
                        "left_toolbar",
                        "edit_buttons_in_legend",
                        "context_menus",
                        "display_market_status",
                        "legend_context_menu", // Disables the legend (including moving average label)
                        "remove_library_container_border", // Removes the border around the chart
                        "show_hide_button_in_legend", // Hides the show/hide button in legend
                        "context_menu", // Removes the right-click context menu options
                        "camera_icon_in_toolbar", // Disables the camera icon (snapshot feature)
                        "zoom_buttons" // Removes zoom in/out buttons
                    ]
                }
                setTimeout(() => {
                    buildchart(themeValue, symbol, disableFeat)
                }, 1000);

            }
        }
    }, [tradePair, themeDataStore, screen]);

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
