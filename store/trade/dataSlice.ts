import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { tradePairModel } from "../../models/tradePair";
import {
    getFav, apigetPairList
} from "../../services/Spot/SpotService";

export const getSpotfav: any = createAsyncThunk(
    "trade/fav",
    async () => {
        const response: any = await getFav();
        return response.data.result;
    }
);
export const getSpotpairList: any = createAsyncThunk(
    "trade/data",
    async () => {
        const response: any = await apigetPairList();
        return response.data.result;
    }
);


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


const dataSlice: any = createSlice({
    name: "trade/data",
    initialState: {
        loading: true,
        pairList: [],
        firstCurrency: {},
        secondCurrency: {},
        marketData: initialTradePairState,
        tradePair: initialTradePairState,
        usdValue: 0,
        favPair: [],
        allMarketData: [],
        orderBookPrice: {},
        openOrders: []
    },
    reducers: {
        setPairList: (state, action) => {
            state.pairList = action.payload;
        },
        setFirstCurrency: (state, action) => {
            state.firstCurrency = action.payload;
        },
        setSecondCurrency: (state, action) => {
            state.secondCurrency = action.payload;
        },
        setMarkData: (state, action) => {
            state.marketData = action.payload;
        },
        setTradePair: (state, action) => {
            state.tradePair = action.payload;
        },
        setFavPair: (state, action) => {
            state.favPair = action.payload;
        },
        setOrderBookPrice: (state, action) => {
            state.orderBookPrice = action.payload;
        },
        setUpdateAllMarkData: (state, action) => {
            state.allMarketData = action.payload;
        },
        setOpenOrders: (state, action) => {
            state.openOrders = action.payload;
        },
        setUpdateMarkData: (state, action) => {
            state.marketData.markPrice = action.payload.markPrice;
            state.marketData.high = action.payload.high;
            state.marketData.last = action.payload.last;
            state.marketData.low = action.payload.low;
            state.marketData.change = action.payload.change;
            state.marketData.changePrice = action.payload.changePrice;
            state.marketData.secondVolume = action.payload.secondVolume;
            state.marketData.firstVolume = action.payload.firstVolume;
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
        setusdValue: (state, action) => {
            state.usdValue = action.payload;
        },
        setFavepair: (state, action) => {
            state.usdValue = action.payload;
        },
    },
    extraReducers: {
        [getSpotfav.fulfilled]: (state, action) => {
            state.favPair = action.payload;
        },
        [getSpotpairList.pending]: (state, action) => {
            state.loading = true;
            state.pairList = action.payload;
            state.allMarketData = action.payload
        },
        [getSpotpairList.fulfilled]: (state, action) => {
            state.loading = false;
            state.pairList = action.payload;
            state.allMarketData = action.payload
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
    setUpdateAllMarkData,
    setOpenOrders
} = dataSlice.actions;

export default dataSlice.reducer;
