import ApiService from "./ApiService";

export async function apiGetAccountSettingData() {
  return ApiService.fetchData({
    url: "user/userProfile",
    method: "get",
  });
}

export async function apiGetAccountSettingIntegrationData() {
  return ApiService.fetchData({
    url: "/account/setting/integration",
    method: "get",
  });
}

export async function apiGetAccountSettingBillingData(data) {
  return ApiService.fetchData({
    url: `/user/fiat-trans`,
    method: "get",
    params: data,
  });
}

export async function apiGetAccountInvoiceData(params) {
  return ApiService.fetchData({
    url: "/account/invoice",
    method: "get",
    params,
  });
}

export async function apiGetAccountLogData(data) {
  return ApiService.fetchData({
    url: "/notificationHistoryall",
    method: "post",
    data,
  });
}

export async function apiGetAccountFormData() {
  return ApiService.fetchData({
    url: "/account/form",
    method: "get",
  });
}

export async function apiGetUserProfile() {
  return ApiService.fetchData({
    url: "user/profile",
    method: "get",
  });
}

export async function apiGetKyc() {
  return ApiService.fetchData({
    url: "user/kycdetail",
    method: "get",
  });
}

export async function apiUpdateProfile(data) {
  return ApiService.fetchData({
    url: "user/userProfile",
    method: "put",
    data,
  });
}

export async function apiUpdateProfileImage(data) {
  return ApiService.fetchData({
    url: "user/updateProfileImage",
    method: "put",
    data,
  });
}

export async function apiPasswordChange(data) {
  return ApiService.fetchData({
    url: "user/changePassword",
    method: "post",
    data,
  });
}

export async function apiget2Fa(data) {
  return ApiService.fetchData({
    url: "user/2fa",
    method: "get",
    data,
  });
}

export async function apiUpdate2FA(data) {
  return ApiService.fetchData({
    url: "user/2fa",
    method: "put",
    data,
  });
}
export async function apidisable2FA(data) {
  return ApiService.fetchData({
    url: "user/2fa",
    method: "patch",
    data,
  });
}

export async function apiUplaodIdprrof(data) {
  return ApiService.fetchData({
    url: "user/kyc/idproof",
    method: "put",
    data,
  });
}
export async function apiUploadAddresProof(data) {
  return ApiService.fetchData({
    url: "user/kyc/addressproof",
    method: "put",
    data,
  });
}

// payment methods
export async function apiBankDetil(data) {
  return ApiService.fetchData({
    url: "user/bankdetail",
    method: "get",
  });
}

export async function apiBankUpdate(data) {
  return ApiService.fetchData({
    url: "user/bankdetail",
    method: "post",
    data,
  });
}
export async function updateUPIDetail(data) {
  return ApiService.fetchData({
    url: "user/upidetail",
    method: "post",
    data,
  });
}
export async function deleteUPIDetail(data) {
  return ApiService.fetchData({
    url: "user/upidetail",
    method: "put",
    data,
  });
}
export async function setPrimaryUPI(data) {
  return ApiService.fetchData({
    url: "user/primaryupi",
    method: "post",
    data,
  });
}
export async function deleteBankDetail(data) {
  return ApiService.fetchData({
    url: "user/bankdetail",
    method: "put",
    data,
  });
}

export async function apiSetPrimaryBank(data) {
  return ApiService.fetchData({
    url: "user/bankdetail",
    method: "patch",
    data,
  });
}

export async function apiEnableCoin(data) {
  return ApiService.fetchData({
    url: "user/enableCoin",
    method: "post",
    data,
  });
}

export async function updateQRDetail(data) {
  return ApiService.fetchData({
    url: "user/qrdetail",
    method: "post",
    data,
  });
}
export async function deleteQRDetail(data) {
  return ApiService.fetchData({
    url: "user/qrdetail",
    method: "put",
    data,
  });
}
export async function setPrimaryQR(data) {
  return ApiService.fetchData({
    url: "user/primaryqr",
    method: "post",
    data,
  });
}

export async function apiGetUserSetting(data) {
  return ApiService.fetchData({
    url: "user/userSetting",
    method: "get",
    data,
  });
}

export async function apiUpdateUserSetting(data) {
  return ApiService.fetchData({
    url: "user/userSetting",
    method: "put",
    data,
  });
}

export async function apiSendOTP(data) {
  return ApiService.fetchData({
    url: "user/sendOTP",
    method: "post",
    data,
  });
}

export async function apiverifyMobile(data) {
  return ApiService.fetchData({
    url: "user/phoneChange",
    method: "put",
    data,
  });
}
export async function apiAntiphisingCodeSubmit(data) {
  return ApiService.fetchData({
    url: "user/antiphishingcode",
    method: "post",
    data,
  });
}

export async function apiGetReferral(data) {
  return ApiService.fetchData({
    url: "user/getReferral",
    method: "get",
    data,
  });
}
export async function apiSiteSettingUpdate(data) {
  return ApiService.fetchData({
    url: "user/setting",
    method: "put",
    data,
  });
}
export async function apiSiteSettings(data) {
  return ApiService.fetchData({
    url: "user/setting",
    method: "get",
    params: data
  });
}

export async function apiEmailUpdate(data) {
  return ApiService.fetchData({
    url: "user/emailChange",
    method: "put",
    data,
  });
}

export async function apiLoginDetails(reqData) {
  return ApiService.fetchData({
    url: "user/loginHistory",
    method: "get",
    params: reqData,
  });
}

export async function apiNotificationHistory(reqData) {
  return ApiService.fetchData({
    url: "user/notificationHistory",
    method: "get",
    params: reqData,
  });
}
export async function apiReferalRewardHistory(reqData) {
  return ApiService.fetchData({
    url: "user/getReferralRewardHistory",
    method: "get",
    params: reqData,
  });
}
export async function apiReferalHistory(reqData) {
  return ApiService.fetchData({
    url: "user/getReferralHisotry",
    method: "get",
    params: reqData,
  });
}
export async function apiReferalCOunt(reqData) {
  return ApiService.fetchData({
    url: "user/getReferralDetails",
    method: "get",
    params: reqData,
  });
}
export async function apiSupportCategory() {
  return ApiService.fetchData({
    url: "user/getSupportCategory",
    method: "get",
  });
}
export async function apiAnnouncement() {
  return ApiService.fetchData({
    url: "user/announcement",
    method: "get",
  });
}
export async function apiSupportTickets(reqData) {
  return ApiService.fetchData({
    url: "user/support",
    method: "get",
    params: reqData,
  });
}
export async function apiCreateTicket(data) {
  return ApiService.fetchData({
    url: "user/support",
    method: "post",
    data,
  });
}
export async function apiReplyUpdate(data) {
  return ApiService.fetchData({
    url: "user/support",
    method: "put",
    data,
  });
}
export async function apiCloseTicket(data) {
  return ApiService.fetchData({
    url: "user/support",
    method: "patch",
    data,
  });
}
export async function apiTwoFAOTPRequest(data) {
  return ApiService.fetchData({
    url: "user/sendOTP",
    method: "post",
    data,
  });
}
export async function apiTwoFAOTPVerify(data) {
  return ApiService.fetchData({
    url: "user/verifyOtp",
    method: "post",
    data,
  });
}

export async function apiContactUs(data) {
  return ApiService.fetchData({
    url: "user/addContactus",
    method: "post",
    data,
  });
}

export async function apigetSiteSetting(data) {
  return ApiService.fetchData({
    url: "user/siteSetting",
    method: "get",
    data,
  });
}
export async function apiGetUserPercentage() {
  return ApiService.fetchData({
    url: "user/percentage",
    method: "get",
  });
}

export async function getNotificationHistory() {
  return ApiService.fetchData({
    url: "user/getUnreadNotification",
    method: "get",
  });
}
export async function readNotification() {
  return ApiService.fetchData({
    url: "user/readNotification",
    method: "get",
  });
}
export async function assetPassUpdate(data) {
  return ApiService.fetchData({
    url: "user/asset-password",
    method: "post",
    data,
  });
}

export async function deactiveReq(data) {
  return ApiService.fetchData({
    url: "user/deactive-req",
    method: "post",
    data,
  });
}
export async function deactiveConfirm(data) {
  return ApiService.fetchData({
    url: "user/deactive-confirm",
    method: "post",
    data,
  });
}

export async function getAccessToken(data) {
  return ApiService.fetchData({
    url: "user/accessToken",
    method: "post",
    data,
  });
}
export async function changePair(data) {
  return ApiService.fetchData({
    url: "user/change-pair",
    method: "post",
    data,
  });
}
