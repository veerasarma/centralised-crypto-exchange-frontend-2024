import styles from '@/styles/common.module.css';
import { Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import Mainnavbar from '../components/navbar';
import Footer from '../components/footer';
import dynamic from 'next/dynamic';
//import component 
const EmailForm = dynamic(() => import('../components/Deactive/EmailForm'))
const MobileForm = dynamic(() => import('../components/Deactive/MobileForm'))

export default function Forget() {
    const [activeTab, setActiveTab] = useState('tab1');

    const handleTabClick = (tabId: any) => {
        setActiveTab(tabId);
    };

    return (
        <>
            <Mainnavbar />
            <div className={styles.login}>
                <Container>
                    <Row>
                        <Col lg={11} xxl={9} className='mx-auto'>
                            <div className={styles.box_flx}>
                                <div className={`login_right ${styles.right_box} mx-auto`}>
                                    <h2 className={styles.h2tag} >Account Deactivation</h2>

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

    )
}
