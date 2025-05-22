import styles from '@/styles/common.module.css';
import Mainnavbar from '../components/navbar';
import Footer from '../components/footer';
import dynamic from 'next/dynamic';
//import component
const WalletList = dynamic(() => import('@/components/Wallet/WalletList'))
export default function Assets() {


  return (
    <>
      <Mainnavbar />
      <div className={styles.page_box}>
        <div className={styles.asset}>
          <WalletList />
        </div>
      </div>
      <Footer />
    </>
  )
}
