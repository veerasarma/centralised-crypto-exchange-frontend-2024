import ApiService from "./ApiService";

export async function getPairList() {
  try {
    let respData: any = await ApiService.fetchData({
      url: "spot/tradePair",
      method: "get",
    });
    return {
      status: true,
      result: respData.data.result,
      message: respData.data.message,
    };
  } catch (err: any) {
    return {
      status: false,
      message: err.response.data.message,
    };
  }
}

export async function getRecentTrade(pairId: string) {
  try {
    let respData: any = await ApiService.fetchData({
      url: `spot/recentTrade/${pairId}`,
      method: "get",
    });
    return {
      status: true,
      result: respData.data.result,
      message: respData.data.message,
    };
  } catch (err: any) {
    return {
      status: false,
      message: err.response.data.message,
    };
  }
}

export async function getOrderBook(pairId: string) {
  try {
    let respData: any = await ApiService.fetchData({
      url: `spot/ordeBook/${pairId}`,
      method: "get",
    });
    return {
      status: "success",
      loading: false,
      result: respData.data.result,
    };
  } catch (err: any) {
    return {
      status: "failed",
      loading: false,
    };
  }
}
export async function apiOrderPlace(data: any) {
  return ApiService.fetchData({
    url: "spot/orderPlace",
    method: "post",
    data,
  });
}

export async function getOpenOrder(data: any, pairId: string) {
  try {
    let respData: any = await ApiService.fetchData({
      url: `spot/openOrder/${pairId}`,
      method: "get",
      params: data,
    });
    return {
      status: "success",
      loading: false,
      result: respData.data.result,
    };
  } catch (err: any) {
    return {
      status: "failed",
      loading: false,
    };
  }
}

export async function getOrderHistory(data: any, pairId: string) {
  try {
    let respData: any = await ApiService.fetchData({
      url: `spot/orderHistory/${pairId}`,
      method: "get",
      params: data,
    });
    return {
      status: "success",
      loading: false,
      result: respData.data.result,
    };
  } catch (err: any) {
    return {
      status: "failed",
      loading: false,
    };
  }
}

export async function getTradeHistory(data: any, pairId: string) {
  try {
    let respData: any = await ApiService.fetchData({
      url: `spot/tradeHistory/${pairId}`,
      method: "get",
      params: data,
    });
    return {
      status: "success",
      loading: false,
      result: respData.data.result,
    };
  } catch (err: any) {
    return {
      status: "failed",
      loading: false,
    };
  }
}
export async function cancelOrder(orderInfo: string) {
  try {
    let respData: any = await ApiService.fetchData({
      url: 'spot/cancelOrder',
      method: "post",
      data: { id: orderInfo }
    });
    return {
      status: "success",
      loading: false,
      message: respData.data.message,
    };
  } catch (err: any) {
    return {
      status: "failed",
      loading: false,
      message: err.response.data.message,
    };
  }
}

export async function getFav() {
  return ApiService.fetchData({
    url: "dashboard/spotFavPair",
    method: "get",
  });
}
export async function addFav(data:any) {
  return ApiService.fetchData({
    url: "dashboard/spotFavPair",
    method: "post",
    data,
  });
}
export async function apigetPairList() {
  return ApiService.fetchData({
    url: "spot/tradePair",
    method: "get",
  });
}
export async function getDepthChart(pairId: string) {
  try {
    let respData: any = await ApiService.fetchData({
      url: 'spot/depth-chart',
      method: "post",
      data: { id: pairId }
    });
    return {
      status: "success",
      loading: false,
      message: respData.data.message,
    };
  } catch (err: any) {
    return {
      status: "failed",
      loading: false,
      message: err.response.data.message,
    };
  }
}

