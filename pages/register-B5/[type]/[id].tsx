import { useEffect, useContext, useState } from "react";
import { useRouter } from "next/router";
import styles from '@/styles/common.module.css';
import dynamic from "next/dynamic";
import Mainnavbar from "@/components/navbar";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import RegisterForm from "@/components/Register/Form";
import Footer from "@/components/footer";
import config from '../../../config'
let captchaKey = config.RECAPTCHA_SITE_KEY ? config.RECAPTCHA_SITE_KEY : ''
export default function Spot() {
    const { asPath, isReady } = useRouter();

    // state
    const [userId, setUserId] = useState()

    useEffect(() => {
        const urlId: any = asPath.split("/");
        console.log(asPath, '--------15', urlId[3])
        setUserId(urlId[3])
    }, [asPath])
    return (
        <>
            <Mainnavbar />
            <div className={styles.login}>
                <GoogleReCaptchaProvider reCaptchaKey={captchaKey}>
                    <RegisterForm refId={userId} />
                </GoogleReCaptchaProvider>
            </div>
            <Footer />
        </>
    );
}
