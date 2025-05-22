import { useEffect, useContext } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
//import component
const HomePage = dynamic(() => import("../../components/Inverse/HomePage"));
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
} from "../../store/inverse/dataSlice";
import { useSelector, useDispatch } from "../../store";
//import config
import config from "../../config";
//import service
import { getPairList, getBalance } from "../../services/inverse/InverseService";
//improt context
import SocketContext from "../../components/Context/SocketContext";
import { getMode } from "@/store/UserSetting/dataSlice";
export default function Spot() {
  let tikerRoot = "";
  const dispatch = useDispatch();
  const history = useRouter();
  const { asPath, isReady } = useRouter();
  const socketContext = useContext<any>(SocketContext);
  const isLogin = useSelector((state: any) => state.auth.session.signedIn);
  const { marketData } = useSelector((state: any) => state.inverse);

  const fetchAsset = async () => {
    let URLPair = asPath.split("/")[2];
    let { status, result } = await getBalance({ coin: URLPair.split("_")[0] });
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
      console.log(URLPair, '-----52')
      if (!isEmpty(URLPair)) {
        const currency = URLPair.split("_");
        let pairDetail = await pairList.find(
          (el: any) =>
            el.baseCoinSymbol == currency[0] &&
            el.quoteCoinSymbol == currency[1]
        );
        if (pairDetail && !isEmpty(pairDetail)) {
          dispatch(setPairList(pairList));
          dispatch(setTradePair(pairDetail));
          dispatch(setMarkData(pairDetail));
          tikerRoot = currency[0] + currency[1];
          socketContext.inverSocket.emit("subscribe", tikerRoot + "inv");
          socketContext.inverSocket.emit("subscribe", "inverse");
          if (isLogin) {
            fetchAsset();
            dispatch(getMode({ inverseId: pairDetail._id }));
          }
        } else {
          if (!isEmpty(pairList)) {
            dispatch(setPairList(pairList));
            dispatch(setTradePair(pairList[0]));
            dispatch(setMarkData(pairList[0]));
            let pair = `${pairList[0].baseCoinSymbol}_${pairList[0].quoteCoinSymbol}`;
            history.replace({ pathname: "/inverse/" + pair }, undefined, {
              shallow: true,
            });
            tikerRoot =
              pairList[0].baseCoinSymbol + pairList[0].quoteCoinSymbol;
            socketContext.inverSocket.emit("subscribe", tikerRoot + "inv");
            socketContext.inverSocket.emit("subscribe", "inverse");
            if (isLogin) {
              fetchAsset();
              dispatch(getMode({ inverseId: pairList[0]._id }));
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
    socketContext.inverSocket.on("inversePnlasset", (result: any) => {
      dispatch(setTotalPnl(result.totalPnL));
      dispatch(setWalletBal(result.data));
    });
    socketContext.inverSocket.on("inverseAsset", (result: any) => {
      dispatch(setWalletBal(result));
      dispatch(setPnL([]));
      dispatch(setTotalPnl("0"));
    });
  }, []);

  useEffect(() => {
    return () => {
      socketContext.inverSocket.emit("unSubscribe", tikerRoot + "inv");
      socketContext.inverSocket.emit("unSubscribe", "inverse");
      socketContext.inverSocket.off("inversePnlasset");
      socketContext.inverSocket.off("inverseAsset");
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
