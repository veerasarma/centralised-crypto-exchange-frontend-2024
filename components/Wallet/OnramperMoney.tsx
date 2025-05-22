import { useState, useEffect } from 'react';
import styles from '@/styles/common.module.css';
import { Row, Col, Dropdown, Modal } from 'react-bootstrap';
import { OnrampWebSDK } from '@onramp.money/onramp-web-sdk';
//import store
import { useSelector } from '@/store'
//import lib
import isEmpty from '@/lib/isEmpty'
import { toastAlert } from '@/lib/toastAlert'
import { capitalize } from '../../lib/stringCase';
//improt service
import { getOnrampCurr, checkOnrampNetwork, createOnrampTrans } from '@/services/Wallet/WalletService';
//config
import config from '../../config/index'


const restrictCrr = ['bnb', 'eth', 'trx']

export default function InternalTranf({ showOnramp, closeOnramp }: any) {

    const [usrAst, setUrAst] = useState<any>()
    const { assets } = useSelector((state: any) => state.wallet);
    const [loader, setLoader] = useState<boolean>(false)
    const [isCrypto, setIsCrypto] = useState<boolean>(true)
    const [walAdrs, setWalAdrs] = useState('')
    const [curr, setCurr] = useState('')
    const [tokenType, setTokenType] = useState<any>([])
    const [network, setNetwork] = useState('')

    const fetchCurrency = async () => {
        setLoader(true)
        let resp: any = await getOnrampCurr()
        if (resp.data.success && !isEmpty(assets)) {
            let fltrAst = assets?.filter((item: any) => {
                if (resp?.data?.data?.includes(item.coin.toLowerCase()) && !restrictCrr.includes(item.coin.toLowerCase())) {
                    return item
                }
            })
            setUrAst(fltrAst)
        }
        setLoader(false)
    }


    const handleToken = (value: any) => {
        let findToken = tokenType?.find((item: any) => item.currencyId == value)
        if (!isEmpty(findToken)) {
            setNetwork(findToken.tokenType)
            setWalAdrs(findToken.address)
        } else {
            return toastAlert('error', 'Network not found')
        }
    }

    const handleCoin = async (value: any) => {
        let useAsset = assets && assets.length > 0 && assets.find((el: any) => el._id == value);
        if (!isEmpty(useAsset?.address)) {
            setCurr(useAsset.coin)
            setWalAdrs(useAsset.address)
            setIsCrypto(true)
        } else if (useAsset?.tokenAddressArray?.length > 0) {
            let reqData = {
                fiatType: '1',
                coinCode: useAsset.coin.toLowerCase()
            }
            setIsCrypto(false)
            setCurr(useAsset.coin)
            let resp: any = await checkOnrampNetwork(reqData)
            let filterArr = useAsset.tokenAddressArray?.filter((item: any) => {
                if (resp?.data?.data?.includes(item.tokenType.toLowerCase())) {
                    return item
                }
            })
            setTokenType(filterArr)
        }
    };

    const onrampInstance = new OnrampWebSDK(
        {
            appId: config.ONRAMP_APP_ID,
            walletAddress: walAdrs,
            flowType: 1,
            fiatType: 1,
            coinCode: curr.toLowerCase(),
            network: isCrypto ? curr.toLowerCase() : network
        }
    );

    onrampInstance.on('TX_EVENTS', (e: any) => {
        if (e.type == 'ONRAMP_WIDGET_TX_COMPLETED') {
            createOnrampTrans(e.data)
            resetForm()
            onrampInstance.close()
        }
    });


    onrampInstance.on('WIDGET_EVENTS', (e: any) => {
        if (e.type == 'ONRAMP_WIDGET_CLOSE_REQUEST_CONFIRMED') {
            resetForm()
        }
    });
    const resetForm = () => {
        setIsCrypto(true)
        setWalAdrs('')
        setTokenType([])
        setNetwork('')
        setCurr('')
    }
    const handleSubmit = async () => {
        try {
            if (!isCrypto && isEmpty(network)) {
                return toastAlert('error', 'Network is required')
            }
            if (isEmpty(curr)) {
                return toastAlert('error', 'Currency is required')
            }
            if (isEmpty(walAdrs)) {
                return toastAlert('error', 'Address is required')
            }
            closeOnramp()
            onrampInstance.show();
        } catch (err: any) { }
    }

    const handleClose = () => {
        resetForm()
        closeOnramp()
    }

    useEffect(() => {
        if (isEmpty(usrAst)) {
            fetchCurrency()
        }
    }, [assets])
    return (
        <Modal show={showOnramp} onHide={handleClose} centered className={`${styles.custom_modal} ${styles.post_order}`} size="lg"  >
            <Modal.Header closeButton className={`${styles.modal_head} px-0`}>
                <Modal.Title className={styles.title} >Buy Crypto</Modal.Title>
            </Modal.Header>
            <Modal.Body className='pb-4 px-0' >
                {
                    loader ? <i className="fa fa-spinner fa-spin" ></i> :
                        <Row>

                            <Col lg={12} >
                                <label>Currency</label>
                                <Dropdown className={`${styles.drp_down} mb-4`} onSelect={handleCoin}>
                                    <Dropdown.Toggle variant="primary"  >
                                        {isEmpty(curr) ? 'Select Currency' : curr}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {
                                            usrAst?.length > 0 && usrAst.map((item: any, index: number) => {
                                                return (
                                                    <Dropdown.Item eventKey={item._id} key={index}>
                                                        {item.coin}
                                                    </Dropdown.Item>
                                                )
                                            })
                                        }
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                            {
                                !isCrypto &&
                                <Col lg={12} >
                                    <label>Network</label>
                                    <Dropdown className={`${styles.drp_down} mb-4`} onSelect={handleToken}>
                                        <Dropdown.Toggle variant="primary"  >
                                            {isEmpty(network) ? 'Select Network' : capitalize(network)}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {
                                                tokenType?.length > 0 && tokenType.map((item: any, index: number) => {
                                                    if (!isEmpty(item.address)) {
                                                        return (
                                                            <Dropdown.Item eventKey={item.currencyId} key={index}>
                                                                {capitalize(item.tokenType)}
                                                            </Dropdown.Item>
                                                        )
                                                    }
                                                })
                                            }
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col>
                            }

                            <Col lg={12}>
                                <button className={styles.primary_btn} onClick={handleSubmit} disabled={loader}>{loader ? <i className="fa fa-spinner fa-spin" ></i> : 'Confirm'}</button>
                            </Col>
                        </Row>
                }

            </Modal.Body>
        </Modal>
    )
}