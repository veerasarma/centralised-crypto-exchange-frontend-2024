import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiBankDetil } from "../../services/User/UserServices";

export const getBankDetails: any = createAsyncThunk(
  "user/paymentmethods/bankdetail",
  async () => {
    const response: any = await apiBankDetil();
    return response.data.result;
  }
);

const initialbankDetailState: any = {
  formType: "",
  formDisable: true,
  editRecord: {},
  result: [],
};

const dataSlice: any = createSlice({
  name: "user/paymentmethods/bankdetail",
  initialState: {
    bankDetail: initialbankDetailState,
    toastAlertStatus: false,
    upiDetail: initialbankDetailState,
    qrDetails: initialbankDetailState,
    loading: false,
  },
  reducers: {
    updateBankDetail: (state, action) => {
      state.bankDetail = action.payload;
    },
    updateBankForm: (state, action) => {
      state.bankDetail.formType = action.payload.formType;
      state.bankDetail.formDisable = action.payload.formDisable;
      state.bankDetail.editRecord = action.payload.editRecord;
    },
    clearBankForm: (state, action) => {
      state.bankDetail = initialbankDetailState;
    },
    updateUPIForm: (state, action) => {
      state.upiDetail.formType = action.payload.formType;
      state.upiDetail.formDisable = action.payload.formDisable;
      state.upiDetail.editRecord = action.payload.editRecord;
    },
    clearUPIForm: (state, action) => {
      state.upiDetail = initialbankDetailState;
    },
    updateGpayForm: (state, action) => {
      state.qrDetails.formType = action.payload.formType;
      state.qrDetails.formDisable = action.payload.formDisable;
      state.qrDetails.editRecord = action.payload.editRecord;
    },
    clearGpayForm: (state, action) => {
      state.qrDetails = initialbankDetailState;
    },
  },
  extraReducers: {
    [getBankDetails.fulfilled]: (state, action) => {
      state.loading = false;
      state.bankDetail.result = action.payload.bankDetails;
      state.upiDetail.result = action.payload.upiDetails;
      state.qrDetails.result = action.payload.qrDetails;
    },
    [getBankDetails.pending]: (state) => {
      state.loading = true;
    },
  },
});

export const {
  updateAssetData,
  updateBankForm,
  updateUPIForm,
  updateGpayForm,
  clearGpayForm,
  clearUPIForm,
  clearBankForm,
} = dataSlice.actions;

export default dataSlice.reducer;
