import { getCookie } from "@/utils/cookie";
import { useEffect } from "react"

export default function spot() {
    useEffect(() => {
        function getPrevPair() {
            try {
                const prevPair = getCookie("spotpair");
                if (prevPair && prevPair.trim() !== "") {
                    window.location.href = `/spot/${prevPair}`;
                } else {
                    window.location.href = "/spot/BTC_USDT";
                }
            } catch (e) {
                window.location.href = "/spot/BTC_USDT";
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