
import styles from '@/styles/common.module.css';
import Mainnavbar from '../components/navbar';
import Footer from '../components/footer';
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import dynamic from 'next/dynamic';
//import component 
import { handleAuthSSR } from "../utils/auth";
const LoginForm = dynamic(() => import('@/components/Login/Form'))
//import config
import config from '../config'
 
let captchaKey = config.RECAPTCHA_SITE_KEY ? config.RECAPTCHA_SITE_KEY : ''
export default function Login() {
  return (
    <>
      <Mainnavbar />
      <div className={styles.login}>
        <GoogleReCaptchaProvider reCaptchaKey={captchaKey}>
          <LoginForm />
        </GoogleReCaptchaProvider>
      </div>
      <Footer />
    </>
  )
}
