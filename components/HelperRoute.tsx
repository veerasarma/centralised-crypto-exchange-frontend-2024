import { useEffect } from "react";
//improt store
import { useSelector, useDispatch, injectReducer } from "../store";
import {
  getAssetData,
  getCurrency,
  getPriceConversion,
} from "../store/Wallet/dataSlice";
import { getUserDetails } from "../store/auth/userSlice";

import { getFavourite, getMode, getsiteSetting } from "../store/UserSetting/dataSlice";
import { getSpotfav, getSpotpairList, setPairList as setSpotPairs } from "../store/trade/dataSlice";
import { setPairList } from "../store/perpetual/dataSlice";
import { setPairList as setInvPair } from "../store/inverse/dataSlice";
import WalletSlice from "../store/Wallet/dataSlice";
import spotSlice from "../store/trade/dataSlice";
import p2pStore from "../store/p2p/dataSlice";
import perpStore from "../store/perpetual/dataSlice";
import inverStore from "../store/inverse/dataSlice";
import PaymentSlice from "../store/PaymentMethods/bankSlice";
import { set2pPair } from "../store/p2p/dataSlice";
import { getBankDetails } from "../store/PaymentMethods/bankSlice";
//import lib
import isEmpty from "../lib/isEmpty";
// impoet services
import { getPairList } from "@/services/P2P/P2pService";
import { getPairList as getSpotPairList } from "@/services/Spot/SpotService";
import { apiGetPairList } from "@/services/perpetual/PerpetualService";
import { apiGetPairList as apiInversePair } from "@/services/inverse/InverseService"
injectReducer("wallet", WalletSlice);
injectReducer("spot", spotSlice);
injectReducer("p2p", p2pStore);
injectReducer("paymentmethods", PaymentSlice);
injectReducer("perpetual", perpStore);
injectReducer("inverse", inverStore);

export default function HelperRoute() {
  const isLogin = useSelector((state: any) => state.auth.session.signedIn);
  const { currency } = useSelector((state: any) => state.wallet);
  const { pairList } = useSelector((state: any) => state.spot);
  const perp = useSelector((state: any) => state.perpetual);
  const inv = useSelector((state: any) => state.inverse);
  const { p2pPair } = useSelector((state: any) => state.p2p);
  const dispatch = useDispatch();
  const fetchPair = async () => {
    try {
      const { status, result } = await getPairList();
      if (status == "success") {
        dispatch(set2pPair(result));
      }
    } catch (err) { }
  };

  const fetchSpotPair = async () => {
    try {
      const { status, result } = await getSpotPairList();
      if (status) {
        dispatch(setSpotPairs(result));
      }
    } catch (err) { }
  };

  const fetchPerpPair = async () => {
    try {
      const { status, result } = await apiGetPairList();
      if (status) {
        dispatch(setPairList(result));
      }
    } catch (err) { }
  };
  
  const fetchInvPair = async () => {
    try {
      const { status, result } = await apiInversePair();
      if (status) {
        dispatch(setInvPair(result));
      }
    } catch (err) { }
  };

  useEffect(() => {
    if (isEmpty(pairList)) {
      fetchSpotPair()
    }
    if (isEmpty(perp?.pairList)) {
      fetchPerpPair();
    }
    if (isEmpty(inv?.pairList)) {
      fetchInvPair();
    }
    if (isEmpty(currency)) {
      dispatch(getCurrency());
    }
    // if (isEmpty(p2pPair)) {
    //   fetchPair();
    // }
    dispatch(getFavourite())
    dispatch(getsiteSetting());
    dispatch(getPriceConversion());
    if (isLogin) {
      dispatch(getMode());
      dispatch(getAssetData());
      // dispatch(getSpotfav());
      dispatch(getUserDetails());
      dispatch(getBankDetails());
    }
  }, []);
  return <></>;
}
