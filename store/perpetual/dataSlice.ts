import { tradePairModel } from "../../models/tradePair";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
//import service
import { getFav } from "../../services/Spot/SpotService";

const initialTradePairState: tradePairModel = {
  _id: "",
  botstatus: "",
  change: 0,
  changePrice: 0,
  firstCurrencyId: "",
  firstCurrencySymbol: "",
  firstFloatDigit: 0,
  firstVolume: 0,
  high: 0,
  last: 0,
  low: 0,
  markPrice: 0,
  secondCurrencyId: "",
  secondCurrencySymbol: "",
  secondFloatDigit: 0,
  secondVolume: 0,
};
const initialWallData = {
  free: "0",
  locked: "0",
  available: "0",
  userId: "",
  PnL: [],
};
export const getSpotfav: any = createAsyncThunk("trade/fav", async () => {
  const response: any = await getFav();
  return response.data.result;
});
const dataSlice: any = createSlice({
  name: "trade/data",
  initialState: {
    loading: true,
    pairList: [],
    firstCurrency: {},
    secondCurrency: {},
    marketData: initialTradePairState,
    allMarketData: [],
    tradePair: initialTradePairState,
    usdValue: 0,
    favPair: [],
    orderBookPrice: {},
    walletBal: initialWallData,
    PnL: [],
    totalPnL: "0",
  },
  reducers: {
    setPairList: (state: any, action: any) => {
      state.pairList = action.payload;
    },
    setTotalPnl: (state: any, action: any) => {
      state.totalPnL = action.payload;
    },
    setPnL: (state: any, action: any) => {
      state.PnL = action.payload;
    },
    setFirstCurrency: (state: any, action: any) => {
      state.firstCurrency = action.payload;
    },
    setSecondCurrency: (state: any, action: any) => {
      state.secondCurrency = action.payload;
    },
    setMarkData: (state: any, action: any) => {
      state.marketData = action.payload;
    },
    setAllMarkData: (state: any, action: any) => {
      state.allMarketData = action.payload;
    },
    setTradePair: (state: any, action: any) => {
      state.tradePair = action.payload;
    },
    setFavPair: (state: any, action: any) => {
      state.favPair = action.payload;
    },
    setOrderBookPrice: (state: any, action: any) => {
      state.orderBookPrice = action.payload;
    },
    setUpdateMarkData: (state: any, action: any) => {
      state.marketData.markPrice = action.payload.markPrice;
      state.marketData.high = action.payload.high;
      state.marketData.last = action.payload.last;
      state.marketData.low = action.payload.low;
      state.marketData.change = action.payload.change;
      state.marketData.changePrice = action.payload.changePrice;
      state.marketData.secondVolume = action.payload.secondVolume;
      state.marketData.firstVolume = action.payload.firstVolume;
      state.marketData.indexPrice = action.payload.indexPrice;
      state.marketData.fundingRate = action.payload.fundingRate;
    },
    // setUpdateTradePair: (state, action) => {
    //     state.tradePair.last:22751.56
    //     state.tradePair.low:22292.37
    //     state.tradePair.high:23078.71
    //     state.tradePair.firstVolume:246858.91988
    //     state.tradePair.secondVolume:5616972681.011094
    //     state.tradePair.changePrice-182.39
    //     state.tradePair.change:-0.795
    // },
    setusdValue: (state: any, action: any) => {
      state.usdValue = action.payload;
    },
    setFavepair: (state: any, action: any) => {
      state.usdValue = action.payload;
    },
    setWalletBal: (state: any, action: any) => {
      state.walletBal = action.payload;
    },
  },
  extraReducers: {
    [getSpotfav.fulfilled]: (state: any, action: any) => {
      state.favPair = action.payload;
    },
  },
});

export const {
  setPairList,
  setFirstCurrency,
  setSecondCurrency,
  setMarkData,
  setTradePair,
  setusdValue,
  setUpdateMarkData,
  setFavPair,
  setOrderBookPrice,
  setWalletBal,
  setAllMarkData,
  setPnL,
  setTotalPnl,
} = dataSlice.actions;

export default dataSlice.reducer;
