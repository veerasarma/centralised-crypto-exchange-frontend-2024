import styles from '@/styles/common.module.css';
import Mainnavbar from '../components/navbar';
import Footer from '../components/footer';
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import dynamic from 'next/dynamic';
//import config
import config from '../config'
import { handleAuthSSR } from "../utils/auth";
//import component
const RegisterForm = dynamic(() => import('@/components/Register/Form'))
let captchaKey = config.RECAPTCHA_SITE_KEY ? config.RECAPTCHA_SITE_KEY : ''
export default function Register() {

  return (
    <>
      <Mainnavbar />
      <div className={styles.login}>
        <GoogleReCaptchaProvider reCaptchaKey={captchaKey}>
          <RegisterForm />
        </GoogleReCaptchaProvider>
      </div>
      <Footer />
    </>
  )
}
