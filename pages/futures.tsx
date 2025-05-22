import { getCookie } from "@/utils/cookie";
import { useEffect } from "react"

export default function spot() {
    useEffect(() => {
        function getPrevPair() {
            try {
                const prevPair = getCookie("futurespair");
                if (prevPair && prevPair.trim() !== "") {
                    window.location.href = `/futures/${prevPair}`;
                } else {
                    window.location.href = "/futures/BTC_USDT";
                }
            } catch (e) {
                window.location.href = "/futures/BTC_USDT";
            }
        }
        getPrevPair();
    }, []);
    
    return (
        <div className="loading-screen middle">
            <div className="bar bar1"></div>
            <div className="bar bar2"></div>
            <div className="bar bar3"></div>
            <div className="bar bar4"></div>
        </div>
    )
}