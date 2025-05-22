import ApiService from "./ApiService";

export async function getPairList() {
  try {
    let respData: any = await ApiService.fetchData({
      url: "perpetual/getPairs",
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
      message: err?.response?.data?.message,
    };
  }
}

export async function apiGetPairList() {
  try {
    let respData: any = await ApiService.fetchData({
      url: "perpetual/getPairs",
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
      message: err?.response?.data?.message,
    };
  }
}


export async function getOrderBook(pairId: string) {
  try {
    let respData: any = await ApiService.fetchData({
      url: `perpetual/orderBook/${pairId}`,
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

export const changeOrder = async (data: any) => {
  try {
    let respData: any = await ApiService.fetchData({
      url: `perpetual/changeTpSl`,
      method: "post",
      data
    });

    return {
      status: "success",
      loading: false,
      result: respData.data.result,
      message: respData.data.message
    };
  } catch (err: any) {
    return {
      status: "failed",
      loading: false,
      message: err.response.data.message
    };
  }
}

export async function getRecentTrade(pairId: string) {
  try {
    let respData: any = await ApiService.fetchData({
      url: `perpetual/recentTrade/${pairId}`,
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
  try {
    let respData: any = await ApiService.fetchData({
      url: "perpetual/orderPlace",
      method: "post",
      data,
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
export async function apiOrderClose(data: any) {
  try {
    let respData: any = await ApiService.fetchData({
      url: "perpetual/orderPlace-close",
      method: "post",
      data,
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
export async function closeAllPos() {
  try {
    let respData: any = await ApiService.fetchData({
      url: "perpetual/close-all-pos",
      method: "post",
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
export async function cancellAllOpen(data: any) {
  try {
    let respData: any = await ApiService.fetchData({
      url: "perpetual/cancelAllOpen",
      method: "post",
      data
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

export async function getOpenOrder(data: any, pairId: string) {
  try {
    let respData: any = await ApiService.fetchData({
      url: `perpetual/openOrder/${pairId}`,
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
export async function PerpetualClosedPNl(data: any) {
  try {
    let respData: any = await ApiService.fetchData({
      url: `perpetual/perpetual-closedPnl`,
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
export async function PerpetualTradeHistory(data: any) {
  try {
    let respData: any = await ApiService.fetchData({
      url: `perpetual/perpetual-tradeHistory`,
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
      url: `perpetual/closedPnL/${pairId}`,
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
      url: `perpetual/tradeHistory/${pairId}`,
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
      url: "perpetual/cancelOrder",
      method: "delete",
      data: { id: orderInfo },
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
export async function getBalance() {
  try {
    let respData: any = await ApiService.fetchData({
      url: "perpetual/bal",
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
      message: err?.response?.data?.message,
    };
  }
}
export const getPositionOrder = async (data: any) => {
  try {
    let respData: any = await ApiService.fetchData({
      method: "get",
      url: `/perpetual/positionOrder`,
      params: data,
    });
    return {
      status: "success",
      loading: false,
      result: respData.data.result,
    };
  } catch (err) {
    return {
      status: "failed",
      loading: false,
    };
  }
};
export const changeTpSl = async (data: any) => {
  try {
    let respData: any = await ApiService.fetchData({
      method: "post",
      url: `/perpetual/changeTpSl`,
      data,
    });
    return {
      status: "success",
      loading: false,
      result: respData.data.message,
    };
  } catch (err: any) {
    return {
      status: "failed",
      loading: false,
      message: err.response.data.message,
    };
  }
};
export const apiChangeMode = async (data: any) => {
  try {
    let respData: any = await ApiService.fetchData({
      method: "post",
      url: `/perpetual/changeDerivateMode`,
      data,
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
};
export const apiChangePair = async (data: any) => {
  try {
    let respData: any = await ApiService.fetchData({
      method: "post",
      url: `/perpetual/changePair`,
      data,
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
};
export const apiChangeLeverage = async (data: any) => {
  try {
    let respData: any = await ApiService.fetchData({
      method: "post",
      url: `/perpetual/changeLeverage`,
      data,
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
};
