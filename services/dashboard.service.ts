import UserApi from "./User/ApiService";
import WalletApi from "./Wallet/ApiService";
import SpotApi from "./Spot/ApiService";

export async function apiGetTotalBalance() {
    return WalletApi.fetchData({
        url: "dashboard/Totalbalance",
        method: "get"
    });
}

export async function apiGetProfitLoss() {
    return WalletApi.fetchData({
        url: "dashboard/profitLoss",
        method: "get"
    });
}

export async function apiGetGainerLooser() {
    return SpotApi.fetchData({
        url: "dashboard/gainerLooser",
        method: "get"
    });
}

export async function apiGetLifeTimeReward() {
    return UserApi.fetchData({
        url: "dashboard/lifeTimeReward",
        method: "get"
    });
}

export async function apiGetAssetsAllocation() {
    return WalletApi.fetchData({
        url: "dashboard/AssetsAllocation",
        method: "get"
    });
}

export async function apiTotalBalanceChart() {
    return WalletApi.fetchData({
        url: "dashboard/totalBalanceChart",
        method: "get"
    });
}