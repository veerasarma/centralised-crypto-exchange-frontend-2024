import styles from '@/styles/common.module.css';
import { Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Mainnavbar from '../components/navbar';
import Footer from '../components/footer';
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import dynamic from 'next/dynamic';
//import component 
const EmailForm = dynamic(() => import('../components/ForgotPassword/EmailForm'))
const MobileForm = dynamic(() => import('../components/ForgotPassword/MobileForm'))
//import config
import config from '../config'

let captchaKey = config.RECAPTCHA_SITE_KEY ? config.RECAPTCHA_SITE_KEY : ''
export default function Forget() {
  const [activeTab, setActiveTab] = useState('tab1');

  const handleTabClick = (tabId: any) => {
    setActiveTab(tabId);
  };

  return (
    <GoogleReCaptchaProvider reCaptchaKey={captchaKey}>
      <>
        <Mainnavbar />
        <div className={styles.login}>
          <Container>
            <Row>
              <Col lg={7} xxl={5} className="m-auto">
                <div className={styles.box_flx}>
                  <div className={`login_right ${styles.right_box} mx-auto`}>
                    <h2 className={styles.h2tag} >Forgot Password</h2>
                    {/* <p className={styles.info} >Withdrawals and OTC transfers will be unavailable for the next 24 hours once password is changed.</p> */}

                    <div className={`mb-4  ${styles.login_navtab}`}>
                      <button className={`mb-2 ${styles.button} ${activeTab === 'tab1' ? styles.active : ''}`} onClick={() => handleTabClick('tab1')}>
                        Email
                      </button>
                      <button className={`mb-2 ${styles.button} ${activeTab === 'tab2' ? styles.active : ''}`} onClick={() => handleTabClick('tab2')}>
                        Phone Number
                      </button>
                    </div>
                    {
                      activeTab == 'tab1' ? <EmailForm /> : <MobileForm />
                    }

                  </div>
                </div>

              </Col>
            </Row>
          </Container>
        </div>

        <Footer />
      </>
    </GoogleReCaptchaProvider>

  )
}
