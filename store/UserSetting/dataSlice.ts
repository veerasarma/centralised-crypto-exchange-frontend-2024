import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiGetAccountSettingData,
  apiGetUserProfile,
  apiUpdateUserSetting,
  apiGetUserSetting,
  apigetSiteSetting,
  apiSiteSettings,
} from "../../services/User/UserServices";
import { userSettingsModel } from "../../models/userSettings";
export const getUserSetting: any = createAsyncThunk(
  "user/data/profile",
  async (data) => {
    const response = await apiGetUserSetting(data);
    return response.data.result;
  }
);

export const updateuserSetting: any = createAsyncThunk(
  "user/data/profile",
  async (data) => {
    const response = await apiUpdateUserSetting(data);
    return response.data.result;
  }
);
export const getFavourite: any = createAsyncThunk(
  "user/data/favourite",
  async () => {
    let data = {
      spotCount: JSON.parse(localStorage.getItem("spotFav") || "[]"),
      futureCount: JSON.parse(localStorage.getItem("futureFav") || "[]"),
      inverseCount: JSON.parse(localStorage.getItem("inverseFav") || "[]")
    }
    return data
  }
);
export const getsiteSetting: any = createAsyncThunk(
  "user/data/siteSetting",
  async (data) => {
    const response = await apigetSiteSetting(data);
    return response.data.result;
  }
);
export const getMode: any = createAsyncThunk("user/data/mode", async (data) => {
  console.log(data, '------45')
  const response = await apiSiteSettings(data);
  return response.data.result;
});

const initialState: userSettingsModel = {
  theme: "",
  loading: true,
  _id: "",
  twoFA: "",
  passwordChange: "",
  siteNotification: "",
  userId: "",
  languageId: "",
  createdAt: "",
  updatedAt: "",
  currencySymbol: "",
  LatestEvent: false,
  announcement: false,
  tradingviewAlert: false,
  tradeOrderPlaceAlertMobile: false,
  tradeOrderPlaceAlertWeb: false,
  defaultWallet: "spotBal",
  loginNotification: false,
  country: "",
};

const dataSlice: any = createSlice({
  name: "user/data",
  initialState: {
    defaultTheme: "dark",
    userSetting: initialState,
    siteSetting: {},
    referralSetting: {},
    mode: {},
    favourite: {},
  },

  reducers: {
    setUserSetting: (state, action) => {
      console.log(action, "--------65");
      state.defaultTheme = action.payload.defaultTheme;
      state.userSetting = action.payload;
    },
    setsiteSetting: (state, action) => {
      state.siteSetting = action.payload;
    },
    setTheme: (state, action) => {
      state.defaultTheme = action.payload;
      state.userSetting.theme = action.payload;
    },
    setLeverage: (state, action) => {
      console.log(action.payload, '---------96', state.mode)
      state.mode = action.payload;
    },
    setDefaultTheme: (state, action) => {
      state.defaultTheme = action.payload;
    },
    setCurrency: (state, action) => {
      state.userSetting.currencySymbol = action.payload;
    },
    setNotificationLatestEvent: (state, action) => {
      state.userSetting.LatestEvent = action.payload;
    },
    setNotificationAnonement: (state, action) => {
      state.userSetting.announcement = action.payload;
    },
    setNotificationTradingViewAlert: (state, action) => {
      state.userSetting.tradingviewAlert = action.payload;
    },
    setLanugae: (state, action) => {
      state.userSetting.languageId = action.payload;
    },
    setTradeOrderPlaceAletWindows: (state, action) => {
      state.userSetting.tradeOrderPlaceAlertWeb = action.payload;
    },
    setTradeOrderPlaceAletMobile: (state, action) => {
      state.userSetting.tradeOrderPlaceAlertMobile = action.payload;
    },
    setDefaultWallet: (state, action) => {
      state.userSetting.defaultWallet = action.payload;
    },
    set2FANotifiacation: (state, action) => {
      state.userSetting.twoFA = action.payload;
    },
    setloginNotification: (state, action) => {
      state.userSetting.loginNotification = action.payload;
    },
    setpasswordChange: (state, action) => {
      state.userSetting.passwordChange = action.payload;
    },
    setReferralSetting: (state, action) => {
      state.referralSetting = action.payload;
    },
    setFavourite: (state, action) => {
      state.favourite = action.payload;
    },
  },
  extraReducers: {
    [getUserSetting.fulfilled]: (state, action) => {
      state.userSetting.loading = false;
      state.userSetting = action.payload;
    },
    [getUserSetting.pending]: (state) => {
      state.userSetting.loading = true;
    },

    [updateuserSetting.fulfilled]: (state, action) => {
      state.userSetting.loading = false;
      state.userSetting = action.payload;
    },
    [updateuserSetting.pending]: (state) => {
      state.userSetting.loading = true;
    },
    [getsiteSetting.fulfilled]: (state, action) => {
      state.siteSetting = action.payload;
    },
    [getMode.fulfilled]: (state, action) => {
      console.log(action.payload, '-------162')
      state.mode = action.payload;
    },
    [getFavourite.fulfilled]: (state, action) => {
      state.favourite = action.payload;
    },
  },
});

export const {
  setNotificationAnonement,
  setNotificationLatestEvent,
  setTradeOrderPlaceAletWindows,
  setDefaultTheme,
  setCurrency,
  setUserSetting,
  setTheme,
  setLeverage,
  setDefaultWallet,
  setTradeOrderPlaceAletMobile,
  setLanugae,
  setNotificationTradingViewAlert,
  set2FANotifiacation,
  setloginNotification,
  setpasswordChange,
  setsiteSetting,
  setReferralSetting,
  setFavourite,
} = dataSlice.actions;

export default dataSlice.reducer;
