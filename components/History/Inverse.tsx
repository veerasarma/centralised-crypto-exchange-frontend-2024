import styles from "@/styles/common.module.css";
import { Container } from "react-bootstrap";
import { useState } from "react";
import dynamic from "next/dynamic";
//import component
const TradeHistory = dynamic(() => import("./InverseTradeHist"));

export default function History() {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabClick = (index: number) => {
        setActiveTab(index);
    };

    return (
        <>
            <section className={`${styles.peer} ${styles.myorder}`}>
                <div className={styles.tabbox}>
                    <div
                        className={`${activeTab === 0 ? styles.active : ""}`}
                        onClick={() => handleTabClick(0)}
                    >
                        Trade History{" "}
                    </div>
                </div>
                {activeTab === 0 && <TradeHistory />}
            </section>
        </>
    );
}
