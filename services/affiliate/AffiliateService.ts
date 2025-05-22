import ApiService from "./ApiService";

export async function getStakers(type: String) {
  try {
    let respData: any = await ApiService.fetchData({
      url: "affiliate/staker",
      method: "get",
      params: { type }
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

export async function joinStakers(reqData: any) {
  try {
    let respData: any = await ApiService.fetchData({
      url: "affiliate/staker",
      method: "post",
      data: reqData
    });
    return {
      status: respData.data.success,
      message: respData.data.message,
    };
  } catch (err: any) {
    return {
      status: false,
      message: err.response.data.message,
    };
  }
}

export async function getStakersHistory(reqData: any) {
  try {
    let respData: any = await ApiService.fetchData({
      url: "affiliate/stakerHistory",
      method: "get",
      params: reqData
    });
    return {
      status: true,
      result: respData.data.result
    };
  } catch (err: any) {
    return {
      status: false,
      message: err.response.data.message,
    };
  }
}

export async function getPlans() {
  try {
    let respData: any = await ApiService.fetchData({
      url: "affiliate/stakerPlans",
      method: "get",
    });
    return {
      status: true,
      result: respData.data.result
    };
  } catch (err: any) {
    return {
      status: false,
      message: err.response.data.message,
    };
  }
}

export async function getPlan() {
  try {
    let respData: any = await ApiService.fetchData({
      url: "affiliate/get-stakers",
      method: "get",
    });
    return {
      status: true,
      result: respData.data.result
    };
  } catch (err: any) {
    return {
      status: false,
      message: err.response.data.message,
    };
  }
}
export async function getTotalCounts() {
  try {
    let respData: any = await ApiService.fetchData({
      url: "affiliate/totalCounts",
      method: "get",
    });
    return {
      status: true,
      result: respData.data.result
    };
  } catch (err: any) {
    return {
      status: false,
      message: err.response.data.message,
    };
  }
}

export async function affiliateWalletTransfer(data: any) {
  return await ApiService.fetchData({
    url: "affiliate/transfer",
    method: "post",
    data
  });
}




