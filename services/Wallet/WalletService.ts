import ApiService from "./ApiService";

export async function apiGetAssetData() {
  return ApiService.fetchData({
    url: "wallet/getAssetsDetails",
    method: "get",
  });
}
export async function apiGetWithdrawLimit() {
  return ApiService.fetchData({
    url: "wallet/getWithdrawLimit",
    method: "get",
  });
}
export async function apiWalletTransfer(data: any) {
  return ApiService.fetchData({
    url: "wallet/transfer",
    method: "post",
    data
  });
}
export async function getAssetByCurrency(currencyId: string) {
  try {
    let respData: any = await ApiService.fetchData({
      url: "wallet/getAsset/" + currencyId,
      method: "get",
    });
    return {
      status: true,
      result: respData.data.result,
      message: respData.data.message
    }
  } catch (err: any) {
    return {
      status: false,
      message: err.response.data.message,
    }
  }
}

export async function apiWithdrawRequestCoin(data: any) {
  return ApiService.fetchData({
    url: "wallet/coinWithdraw",
    method: "post",
    data
  });
}

export async function apiWithdrawRequestFiat(data: any) {
  return ApiService.fetchData({
    url: "wallet/fiatWithdraw",
    method: "post",
    data
  });
}

export async function apiFiatDepositRequest(data: any) {
  return ApiService.fetchData({
    url: "wallet/fiatDeposit",
    method: "post",
    data
  });
}

export async function apiGetUserDeposit() {
  return ApiService.fetchData({
    url: "wallet/userDeposit",
    method: "get"
  });
}

export async function apiGetTrnxHistory(params: string, query: any) {
  return ApiService.fetchData({
    url: "wallet/history/transaction/" + params,
    method: "get",
    params: query
  });
}

export async function apiCoinRequestVerify(data: any) {
  return ApiService.fetchData({
    url: "wallet/coinWithdraw",
    method: "patch",
    data
  });
}

export async function fiatRequestVerify(data: any) {
  return ApiService.fetchData({
    url: "wallet/fiatWithdraw",
    method: "patch",
    data
  });
}
export async function createAdderss(data: any) {
  return ApiService.fetchData({
    url: "wallet/createAddress",
    method: "post",
    data
  });
}

export async function getOnrampCurr() {
  return ApiService.fetchData({
    url: "onramp/getCurrency",
    method: "get",
  });
}

export async function checkOnrampNetwork(data:any) {
  return ApiService.fetchData({
    url: "onramp/checkNetwork",
    method: "post",
    data
  });
}

export async function createOnrampTrans(data:any) {
  return ApiService.fetchData({
    url: "onramp/createTransaction",
    method: "post",
    data
  });
}
