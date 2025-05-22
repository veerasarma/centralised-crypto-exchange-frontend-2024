import ApiService from "./ApiService";

export async function apiSignIn(data) {
  return ApiService.fetchData({
    url: "auth/login",
    method: "post",
    data,
  });
}
export async function verifyOtp(data) {
  return ApiService.fetchData({
    url: "auth/verifyOtp",
    method: "post",
    data,
  });
}
export async function apiSignUp(data) {
  return ApiService.fetchData({
    url: "auth/register",
    method: "post",
    data,
  });
}
export async function apiMailResend(data) {
  return ApiService.fetchData({
    url: "auth/resend-mail",
    method: "post",
    data,
  });
}

export async function apiSignOut(data) {
  return ApiService.fetchData({
    url: "auth/sign-out",
    method: "post",
    data,
  });
}

export async function apiForgotPassword(data) {
  return ApiService.fetchData({
    url: "auth/forgotPassword",
    method: "post",
    data,
  });
}

export async function apiResetPassword(data) {
  return ApiService.fetchData({
    url: "auth/resetPassword",
    method: "post",
    data,
  });
}

export async function userEmailActivation(data) {
  return ApiService.fetchData({
    url: "auth/confirm-mail",
    method: "post",
    data,
  });
}

export async function resetPasswordVerification(data) {

  return ApiService.fetchData({
    url: "auth/resetconfirmMail",
    method: "post",
    data,
  });
}

export async function fiatRequestVerify(data) {
  return ApiService.fetchData({
    url: "auth/fiatWithdraw",
    method: "patch",
    data,
  });
}
export async function coinRequestVerify(data) {
  return ApiService.fetchData({
    url: "auth/coinWithdraw",
    method: "patch",
    data: data,
  });
}

export async function apiCheckUserName(data) {
  return ApiService.fetchData({
    url: "auth/checkUserName",
    method: "post",
    data,
  });
}

export async function resendOtp(data) {
  return ApiService.fetchData({
    url: "auth/resend-otp",
    method: "post",
    data,
  });
}

export async function getCMS(data) {
  return ApiService.fetchData({
    url: "auth/cms",
    method: "get",
    data

  });
}

