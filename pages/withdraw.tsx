
import styles from '@/styles/common.module.css';
import Mainnavbar from '../components/navbar';
import Footer from '../components/footer';
import dynamic from 'next/dynamic';
//import Component
const WithdrawForm = dynamic(() => import('@/components/Wallet/WithdrawForm'))
export default function WithdrawPage() {
  return (

    <>
      <Mainnavbar />
      <div className={styles.page_box}>
        <div className={styles.deposit}>
          <WithdrawForm />
        </div>
      </div>

      <Footer />
    </>
  )
}
