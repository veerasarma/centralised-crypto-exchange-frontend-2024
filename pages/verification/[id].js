import React, { useEffect, useState } from "react";

import { useRouter } from "next/router";
import { toastAlert } from "../../lib/toastAlert";

import {
  resetPasswordVerification,
  userEmailActivation,
} from "../../services/User/AuthService";
import { apiCoinRequestVerify, fiatRequestVerify } from '../../services/Wallet/WalletService'

export default function EmailVerification() {
  const history = useRouter();
  const { id, auth } = history.query;

  // state
  const [page, setPage] = useState("loading");

  // function
  const emailActivation = async () => {
    try {
      const response = await userEmailActivation({
        userId: auth,
      });
      if (response.data.success) {
        history.push("/login");
        toastAlert("success", response.data.message, "emailActivation");
      } else if (response.data.status == "failed") {
        toastAlert("error", response.data.message, "emailActivation");
        setPage("error");
        history.push("/login");
      }
    } catch (errors) {
      toastAlert("error", errors?.response?.data?.message);
      history.push("/login");
    }
  };



  const ResetPassword = async () => {
    try {
      const response = await resetPasswordVerification({
        authToken: auth,
      });
      history.push("/reset-password/" + auth);
      toastAlert("success", response.data.message, "resetPassword");
    } catch (error) {
      toastAlert("error", error.response.data.message, "resetPassword");
      setPage("error");
      history.push("/");
    }
  };
  const coinWithdraw = async () => {
    try {
      const response = await apiCoinRequestVerify({
        token: auth,
      });
      history.push("/wallet");
      toastAlert("success", response.data.message, "withdrawRequest");
    } catch (error) {
      toastAlert("error", error.response.data.message, "withdrawRequest");
      setPage("error");
      history.push("/wallet");
    }
  };
  const fiaWithdraw = async () => {
    try {
      const response = await fiatRequestVerify({
        token: auth,
      });
      history.push("/wallet");
      toastAlert("success", response.data.message, "withdrawRequest");
    } catch (error) {
      toastAlert("error", error.response.data.message, "withdrawRequest");
      setPage("error");
      history.push("/wallet");
    }
  };



  useEffect(() => {
    if (id == "forgotPassword") {
      ResetPassword();
    } else if (id == "register") {
      emailActivation();
    } else if (id == "coinwithdraw") {
      coinWithdraw();
    } else if (id == "fiatWithdraw") {
      fiaWithdraw();
    }
  }, [id]);

  return (
    <>
      {page == "loading" && <p>Loading</p>}
      {page == "error" && <p>Invalid Url</p>}
    </>
  );
}
