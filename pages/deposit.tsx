import styles from '@/styles/common.module.css';
import Mainnavbar from '../components/navbar';
import Footer from '../components/footer';
import dynamic from 'next/dynamic';
//import component
const DepositForm = dynamic(() => import('../components/Wallet/DepositForm'))


export default function DepositPage() {
  return (

    <>
      <Mainnavbar />
      <div className={styles.page_box}>
        <div className={styles.deposit}>
          <DepositForm />
        </div>
      </div>

      <Footer />
    </>
  )
}