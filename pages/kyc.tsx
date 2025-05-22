import styles from "@/styles/common.module.css";
import Mainnavbar from "../components/navbar";
import Footer from "../components/footer";
import dynamic from "next/dynamic";
//import component
const KycForm = dynamic(() => import("../components/kyc/Form"));
export default function Kyc() {
  return (
    <>
      <Mainnavbar />
      <div className={styles.page_box}>
        <div className={styles.verification}>{/* <KycForm /> */}</div>
      </div>

      <Footer />
    </>
  );
}
