import axios from "axios";
// import appConfig from "configs/app.config";
// import { TOKEN_TYPE, REQUEST_HEADER_AUTH_KEY } from "constants/api.constant";
// import { PERSIST_STORE_NAME } from "constants/app.constant";
import deepParseJson from "../../lib/deepParseJson";
import store from "../../store";
import { Cookies } from "react-cookie";
import nextCookie from "next-cookies";
import Router from "next/router";
import { onSignOutSuccess } from "../../store/auth/sessionSlice";
import { setUser, initialState } from "../../store/auth/userSlice";
const cookies = new Cookies();
// const Config: any = require('../../config/indexs')
import Config from '../../config/index'
import isEmpty from "@/lib/isEmpty";

const unauthorizedCode = [401];

const BaseService = axios.create({
  timeout: 60000,
  baseURL: `${Config.WALLET_API}/api`,
});

BaseService.interceptors.request.use(
  async (config: any) => {
    if (typeof window !== "undefined") {
    const rawPersistData = await localStorage.getItem("user");
    const persistData = deepParseJson(rawPersistData);

    const accessToken =
      persistData &&
      persistData.auth &&
      persistData.auth.session &&
      persistData.auth.session.token;
    if (accessToken && accessToken) {
      config.headers["Authorization"] = `${accessToken}`;
    }
  }
    config.headers['timezone'] = Number(new Date().getTimezoneOffset())
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

BaseService.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response && unauthorizedCode.includes(response.status)) {
      document.cookie = 'loggedin' + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      store.dispatch(onSignOutSuccess());
      store.dispatch(setUser(initialState));
      Router.push("/login");
    }

    return Promise.reject(error);
  }
);

export default BaseService;
