import { useEffect, useContext, useState } from 'react';
import { useRouter } from "next/router";
import dynamic from 'next/dynamic'
//import component
const HomePage = dynamic(() => import('../../components/spot/HomePage'))
const Meta = dynamic(() => import('../../components/Meta'), { ssr: false });
//improt lib
import isEmpty from '../../lib/isEmpty'
//improt store
import {
    setPairList,
    setFirstCurrency,
    setSecondCurrency,
    setMarkData,
    setTradePair,
} from "../../store/trade/dataSlice";
import { useSelector, useDispatch } from "../../store";
//import config
import config from '../../config'
//import service
import {
    apigetPairList,
} from "../../services/Spot/SpotService";
import { getAssetByCurrency } from "../../services/Wallet/WalletService";
//improt context
import SocketContext from "../../components/Context/SocketContext";
import { setCookie } from '@/utils/cookie';
export default function Spot() {
    let tikerRoot = ''
    const dispatch = useDispatch()
    const history = useRouter();
    const { asPath, isReady } = useRouter();
    const socketContext = useContext<any>(SocketContext);
    const isLogin = useSelector((state: any) => state.auth.session.signedIn);
    const [pairList, setPair] = useState();
    const { marketData } = useSelector((state: any) => state.spot);

    const fetchAssetByCurrency = async (currencyId: string, type: string) => {
        let { status, result } = await getAssetByCurrency(currencyId);
        if (status) {
            if (type == "firstCurrency") {
                dispatch(setFirstCurrency(result));
            }
            if (type == "secondCurrency") {
                dispatch(setSecondCurrency(result));
            }
        }
    };

    const fetchPair = async () => {
        let resp: any = await apigetPairList()
        if (!isEmpty(resp.data.result)) {
            // setPair(resp.data.result)
            findPair(resp.data.result)
        }
    }

    const findPair = async (pairList: any) => {
        const URLPair = asPath.split("/")[2]
        if (!isEmpty(URLPair)) {
            const currency = URLPair.split('_')
            console.log(currency, '-------60')
            let pairDetail = await pairList.find((el: any) => (el.firstCurrencySymbol == currency[0] && el.secondCurrencySymbol == currency[1]))
            console.log(pairDetail, '------62')
            if (pairDetail && !isEmpty(pairDetail)) {
                dispatch(setPairList(pairList));
                dispatch(setTradePair(pairDetail));
                dispatch(setMarkData(pairDetail));
                setCookie("spotpair", URLPair);
                tikerRoot = currency[0] + currency[1]
                socketContext.spotSocket.emit('subscribe', tikerRoot)
                socketContext.spotSocket.emit('subscribe', 'spot')
                if (isLogin) {
                    await fetchAssetByCurrency(pairDetail.firstCurrencyId, "firstCurrency");
                    await fetchAssetByCurrency(pairDetail.secondCurrencyId, "secondCurrency");
                }
            } else {
                if (!isEmpty(pairList)) {
                    dispatch(setPairList(pairList));
                    dispatch(setTradePair(pairList[0]));
                    dispatch(setMarkData(pairList[0]));
                    let pair = `${pairList[0].firstCurrencySymbol}_${pairList[0].secondCurrencySymbol}`;
                    history.replace({ pathname: '/spot/' + pair }, undefined, { shallow: true })
                    setCookie("spotpair", pair);
                    tikerRoot = pairList[0].firstCurrencySymbol + pairList[0].secondCurrencySymbol
                    socketContext.spotSocket.emit('subscribe', tikerRoot)
                    socketContext.spotSocket.emit('subscribe', 'spot')
                    if (isLogin) {
                        await fetchAssetByCurrency(pairList[0].firstCurrencyId, "firstCurrency");
                        await fetchAssetByCurrency(pairList[0].secondCurrencyId, "secondCurrency");
                    }
                }
            }
        };
    }
    useEffect(() => {
        if (isReady) {
            fetchPair();
        }
    }, [isReady]);
    useEffect(() => {
        if (!isEmpty(pairList)) {
            findPair(pairList)
        }
    }, [pairList, asPath])

    useEffect(() => {
        if (!isReady) 
            return;

        socketContext.spotSocket.on("connect", () => {
            const URLPair = asPath.split("/")[2];
            const currency = URLPair.split('_');
            tikerRoot = currency[0] + currency[1];
            socketContext.spotSocket.emit('subscribe', tikerRoot)
            socketContext.spotSocket.emit('subscribe', 'spot')
        });
        return () => {
            socketContext.spotSocket.emit('unSubscribe', tikerRoot)
            socketContext.spotSocket.emit('unSubscribe', 'spot')
        }
    }, [isReady]);

    return (
        <>
            <Meta
                keyWords="keyWords"
                tittle={`${marketData && marketData.markPrice} | ${marketData && marketData.firstCurrencySymbol}${marketData && marketData.secondCurrencySymbol} | ${config.SITE_NAME}`}
                description="DEV"
            />
            <HomePage />
        </>

    );
}
