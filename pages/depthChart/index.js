import dynamic from "next/dynamic";

const DepthChartMob = dynamic(
    () => import("../../components/spot/DepthChartMob"),
    {
        ssr: false,
    }
);

export default function SpotHome() {

    return (
        <DepthChartMob />
    );
}
