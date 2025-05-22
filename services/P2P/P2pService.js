import ApiService from "./ApiService";

export async function getPairList(data) {
  try {

    let respData = await ApiService.fetchData({
      url: "p2p/pair",
      method: "get",
      data,
    })

    return {
      status: "success",
      loading: false,
      message: respData.data.message,
      result: respData.data.result
    }
  }
  catch (err) {

    return {
      status: "failed",
      loading: false,
    }
  }
}
export async function orderPlace(data) {
  try {

    let respData = await ApiService.fetchData({
      'url': `/p2p/orderPlace`,
      'method': 'post',
      'data': data
    })

    return {
      status: "success",
      loading: false,
      message: respData.data.message,
      result: respData.data.result
    }
  }
  catch (err) {

    return {
      status: "failed",
      loading: false,
      message: err.response.data.message,
      error: err.response.data.errors
    }
  }
}

export async function postOrder(data) {
  try {

    let respData = await ApiService.fetchData({
      url: "p2p/postOrder",
      method: "post",
      data,
    })

    return {
      status: "success",
      loading: false,
      message: respData.data.message,
      result: respData.data.result
    }
  }
  catch (err) {
    return {
      status: "failed",
      loading: false,
      message: err.response.data.message,
      error: err.response.data.errors
    }
  }
}

export async function postReview(data) {
  try {
    
    let respData = await ApiService.fetchData({
      url: "p2p/review",
      method: "post",
      data,
    })

    return {
      status: "success",
      loading: false,
      message: respData.data.message
    }

  } catch (err) {
    return {
      status: "failed",
      loading: false,
      message: err.response.data.message,
      errors: err.response.data.errors
    }
  }
}

export async function getReviews (reqData) {
  try {
    
    let respData = await ApiService.fetchData({
      url: "p2p/review",
      method: "get",
      params: reqData
    })

    return {
      success: respData.data.success,
      result: respData.data.result
    }

  } catch (error) {
    return {
      success: false,
      result: {
        myReview: [],
        reviews: []
      }
    }
  }
}

export async function advertiserDetails (id) {
  try {
    
    let respData = await ApiService.fetchData({
      url: `p2p/advertiser-detail/${id}`,
      method: "get"
    })

    return {
      success: respData.data.success,
      result: respData.data.result
    }

  } catch (error) {
    return {success: false}
  }
}

export async function advertiserReviews (id, data) {
  try {
    
    let respData = await ApiService.fetchData({
      url: `p2p/advertiser-reviews/${id}`,
      method: "get",
      params: data
    })

    return {
      success: respData.data.success,
      result: respData.data.result
    }

  } catch (error) {
    return {success: false}
  }
}

export async function postBlockPeer(data) {
  try {
    let respData = await ApiService.fetchData({
      url: `p2p/advertiser-block`,
      method: "post",
      data
    })
  
    return {
      success: respData.data.success,
      message: respData.data.message
    }
  } catch (error) {
    return {
      success: error.response.data.success,
      message: error.response.data.message
    }
  }
}

export async function deleteBlockPeer(id) {
  try {

    let respData = await ApiService.fetchData({
      url: `p2p/advertiser-block`,
      method: "delete",
      params: { peerId: id }
    })

    return {
      success: respData.data.success,
      message: respData.data.message
    }
  } catch (error) {
    return {
      success: error.response.data.success,
      message: error.response.data.message
    }
  }
}

export async function postPeerReport (formData) {
  try {
    let respData = await ApiService.fetchData({
      url: `p2p/add-peer-report`,
      headers: { 'Content-Type': 'multipart/form-data' },
      data: formData,
      method: 'post'
    })
  
    return {
      success: respData.data.success,
      message: respData.data.message
    }
    
  } catch (error) {
    return {
      success: error.response.data.success,
      message: error.response.data.message,
      errors: error.response.data.errors
    } 
  }  
}

export async function apiGetP2PUserOrder(data) {
  return ApiService.fetchData({
    url: "p2p/getUserOpenOrder",
    method: "get",
    'params': data
  });
}
export async function apiGetP2POpenOrder(data) {
  return ApiService.fetchData({
    url: "p2p/allPostAd",
    method: "get",
    'params': data
  });
}
export async function apiGetP2POrderDetail(orderId) {
  return ApiService.fetchData({
    url: `p2p/orderDetail/${orderId}`,
    method: "get",
  });
}
export async function apiGetP2POrderHistory(data) {
  return ApiService.fetchData({
    url: `p2p/orderHistory`,
    method: "get",
    'params': data
  });
}
export async function apiGetP2PAdsHistory(data) {
  return ApiService.fetchData({
    url: `p2p/postOrderList`,
    method: "get",
    'params': data
  });
}
export async function usrConversation(data) {
  return ApiService.fetchData({
    url: `p2p/conversation`,
    method: "post",
    'data': data
  });
}

export async function cancelOrder(orderId) {
  return ApiService.fetchData({
    url: `p2p/cancelOrder/${orderId}`,
    method: "delete",
  });
}

export async function transferPayment(orderId) {
  return ApiService.fetchData({
    url: `p2p/transferPayment/${orderId}`,
    method: "post",
  });
}

export async function disputeOrder(orderId) {
  return ApiService.fetchData({
    url: `p2p/disputeOrder/${orderId}`,
    method: "post",
  });
}
export async function releaseAsset(data) {
  return ApiService.fetchData({
    url: `p2p/releaseAsset`,
    method: "post",
    'data': data
  });
}
export async function cancelPost(data) {
  return ApiService.fetchData({
    url: `p2p/postOrder`,
    method: "patch",
    'data': data
  });
}
export async function editPost(data) {
  return ApiService.fetchData({
    url: `p2p/postOrder`,
    method: "put",
    'data': data
  });
}
export async function getP2PStatistics() {
  return ApiService.fetchData({
    url: `p2p/get-statistics`,
    method: "get",
  });
}
export async function apiGetP2PUserDetails(data) {
  return ApiService.fetchData({
    url: `p2p/getUserDetails`,
    method: "post",
    data: data
  });
}