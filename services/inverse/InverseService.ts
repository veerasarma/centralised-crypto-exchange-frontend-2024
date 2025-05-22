import ApiService from "./ApiService";

export async function getPairList() {
  try {
    let respData: any = await ApiService.fetchData({
      url: "inverse/getPairs",
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
      url: "inverse/getPairs",
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
      url: `inverse/orderBook/${pairId}`,
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
      url: `inverse/changeTpSl`,
      method: "post",
      data,
    });

    return {
      status: "success",
      loading: false,
      result: respData.data.result,
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

export async function getRecentTrade(pairId: string) {
  try {
    let respData: any = await ApiService.fetchData({
      url: `inverse/recentTrade/${pairId}`,
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
      url: "inverse/orderPlace",
      method: "post",
      data,
    });
    return {
      status: "success",
      loading: false,
      message: respData.data.message,
      pairData: respData.data.pairData,
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
      url: "inverse/close-all-pos",
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
      url: "inverse/cancelAllOpen",
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
      url: `inverse/openOrder/${pairId}`,
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
      url: `inverse/inverse-closedPnl`,
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
      url: `inverse/inverse-tradeHistory`,
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
      url: `inverse/closedPnL/${pairId}`,
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
      url: `inverse/tradeHistory/${pairId}`,
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
      url: "inverse/cancelOrder",
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
export async function getBalance(data: any) {
  try {
    let respData: any = await ApiService.fetchData({
      url: "inverse/bal",
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
      message: err?.response?.data?.message,
    };
  }
}
export const getPositionOrder = async (data: any) => {
  try {
    let respData: any = await ApiService.fetchData({
      method: "get",
      url: `/inverse/positionOrder`,
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
      url: `/inverse/changeTpSl`,
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
      url: `/inverse/changeInverseMode`,
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
      url: `/inverse/changeLeverage`,
      data,
    });
    return {
      status: "success",
      loading: false,
      message: respData.data.message,
      pairData: respData.data.pairData,
    };
  } catch (err: any) {
    return {
      status: "failed",
      loading: false,
      message: err.response.data.message,
    };
  }
};
