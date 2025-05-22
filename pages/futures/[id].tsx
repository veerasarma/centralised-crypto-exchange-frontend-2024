import { useEffect, useContext } from "react";
import { useRouter } from "next/router";

import dynamic from "next/dynamic";
//import component
const HomePage = dynamic(() => import("../../components/Futures/HomePage"));
const Meta = dynamic(() => import("../../components/Meta"), { ssr: false });
//improt lib
import isEmpty from "../../lib/isEmpty";
//improt store
import {
  setPairList,
  setMarkData,
  setTradePair,
  setWalletBal,
  setPnL,
  setTotalPnl,
} from "../../store/perpetual/dataSlice";
import { useSelector, useDispatch } from "../../store";
//import config
import config from "../../config";
//import service
import {
  getPairList,
  getBalance,
} from "../../services/perpetual/PerpetualService";
//improt context
import SocketContext from "../../components/Context/SocketContext";
import { getAssetData } from "@/store/Wallet/dataSlice";
import { getMode } from "@/store/UserSetting/dataSlice";
import { setCookie } from "@/utils/cookie";
export default function Spot() {
  let tikerRoot = "";
  const dispatch = useDispatch();
  const history = useRouter();
  const { asPath, isReady } = useRouter();
  const socketContext = useContext<any>(SocketContext);
  const isLogin = useSelector((state: any) => state.auth.session.signedIn);
  const { marketData, PnL, walletBal } = useSelector(
    (state: any) => state.perpetual
  );

  const fetchAsset = async () => {
    let { status, result } = await getBalance();
    if (status == "success") {
      dispatch(setWalletBal(result));
    }
  };
  const fetchData = async () => {
    let resp: any = await getPairList();
    if (!isEmpty(resp.result)) {
      findPair(resp.result);
    }
  };

  const findPair = async (pairList: any) => {
    try {
      const URLPair = asPath.split("/")[2];
      if (!isEmpty(URLPair)) {
        const currency = URLPair.split("_");
        console.log(currency, "--------57");
        let pairDetail = await pairList.find(
          (el: any) =>
            el.baseCoinSymbol == currency[0] &&
            el.quoteCoinSymbol == currency[1]
        );
        if (pairDetail && !isEmpty(pairDetail)) {
          dispatch(setPairList(pairList));
          dispatch(setTradePair(pairDetail));
          dispatch(setMarkData(pairDetail));
          setCookie("futurespair", URLPair);
          tikerRoot = currency[0] + currency[1];
          socketContext.perpSocket.emit("subscribe", tikerRoot + "perp");
          socketContext.perpSocket.emit("subscribe", "perpetual");
          if (isLogin) {
            fetchAsset();
            dispatch(getMode({ id: pairDetail._id }));
          }
        } else {
          if (!isEmpty(pairList)) {
            console.log(pairList, "-------75");
            dispatch(setPairList(pairList));
            dispatch(setTradePair(pairList[0]));
            dispatch(setMarkData(pairList[0]));
            let pair = `${pairList[0].baseCoinSymbol}_${pairList[0].quoteCoinSymbol}`;
            setCookie("futurespair", pair);
            history.replace({ pathname: "/futures/" + pair }, undefined, {
              shallow: true,
            });
            tikerRoot =
              pairList[0].baseCoinSymbol + pairList[0].quoteCoinSymbol;
            socketContext.perpSocket.emit("subscribe", tikerRoot + "perp");
            socketContext.perpSocket.emit("subscribe", "perpetual");
            if (isLogin) {
              fetchAsset();
              dispatch(getMode({ id: pairList[0]._id }));
            }
          }
        }
      }
    } catch (err) {
      console.log("err: ", err);
    }
  };

  useEffect(() => {
    if (isReady) {
      fetchData();
    }
  }, [isReady]);

  useEffect(() => {
    socketContext.perpSocket.on("perpetualPnlasset", (result: any) => {
      dispatch(setTotalPnl(result.totalPnL));
      dispatch(setWalletBal(result.data));
    });
    socketContext.perpSocket.on("perpetualAsset", (result: any) => {
      dispatch(setWalletBal(result));
      dispatch(getAssetData());
      dispatch(setPnL([]));
      dispatch(setTotalPnl("0"));
    });
  }, []);

  useEffect(() => {
    return () => {
      socketContext.perpSocket.emit("unSubscribe", tikerRoot + "perp");
      socketContext.perpSocket.emit("unSubscribe", "perpetual");
      socketContext.perpSocket.off("perpetualPnlasset");
      socketContext.perpSocket.off("perpetualAsset");
      socketContext.perpSocket.off("usdtPerMarketPrice");
    };
  }, []);

  return (
    <>
      <Meta
        keyWords="keyWords"
        tittle={`${marketData && marketData.markPrice} | ${marketData && marketData.baseCoinSymbol
          }${marketData && marketData.quoteCoinSymbol} | ${config.SITE_NAME}`}
        description="DEV"
      />
      <HomePage />
    </>
  );
}
