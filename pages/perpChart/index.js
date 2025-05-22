import dynamic from "next/dynamic";
import { useRouter } from "next/router";


const Chart = dynamic(
    () => import("../../components/Futures/ChartMob"),
    {
        ssr: false,
    }
);

export default function SpotHome() {
    const { query } = useRouter();
    return (
        <Chart
            tradePair={query.pair}
            theme={query.theme}
            time={query.interval}
            pairId={query.pairId}
            screen={query.screen}
        />
    );
}
