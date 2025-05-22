import WalletService from "./Wallet/ApiService";
import UserApi from "./User/ApiService";
export async function apiGetCurrency() {
  return WalletService.fetchData({
    url: "currency/getCurrency",
    method: "get",
  });
}

export async function apiGetPriceConversion() {
  return WalletService.fetchData({
    url: "common/priceConversion",
    method: "get",
  });
}
export async function getAllFaq() {
  return UserApi.fetchData({
    url: "user/faq",
    method: "get",
    
  });
}
export async function getCMSPage(identifier: any) {
  return UserApi.fetchData({
    url: `/user/cms/${identifier}`,
    method: "get",
    
  });
}
export async function getHomeContent(identifier: any) {
  return UserApi.fetchData({
    url: `/user/home-cms/${identifier}`,
    method: "get",
    
  });
}
export async function getCMSPageConent(identifier: any) {
  return UserApi.fetchData({
    url: `/user/cmcContent/${identifier}`,
    method: "get",
    
  });
}

export async function subscribe(reqData:any) {
  return UserApi.fetchData({
    url: "/user/newsLetter/subscribe",
    method: "post",
    'data': reqData
  });
}

export async function getSliderContent() {
  return UserApi.fetchData({
    url: '/user/slider',
    method: "get",
  });
}

export async function getSitesetting() {
  return UserApi.fetchData({
    url: '/user/siteSetting',
    method: "get",
  });
}