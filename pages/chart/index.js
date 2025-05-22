import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import spot from "@/styles/Spot.module.css";

const Chart = dynamic(() => import("../../components/spot/ChartMob"), {
  ssr: false,
});

export default function SpotHome() {
  const { query } = useRouter();
  console.log(query, "------15");
  return (
    <Chart tradePair={query.pair} theme={query.theme} time={query.interval} screen={query.screen} />
  );
}
