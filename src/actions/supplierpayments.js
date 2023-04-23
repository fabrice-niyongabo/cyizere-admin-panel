import { errorHandler, setHeaders } from "../helpers";
import axios from "axios";
import { BACKEND_URL } from "../constants";

export const SET_PAYMENT_LIST = "SET_PAYMENT_LIST";
export const SET_ADD_PAYMENT_LIST = "SET_ADD_PAYMENT_LIST";
export const SET_DELETE_PAYMENT_LIST = "SET_DELETE_PAYMENT_LIST";
export const SET_IS_LOADING_PAYMENT_LIST = "SET_IS_LOADING_PAYMENT_LIST";
export const RESET_PAYMENT_LIST = "RESET_PAYMENT_LIST";

export const setPaymentList = (payments) => (dispatch) => {
  dispatch({
    type: SET_PAYMENT_LIST,
    payload: payments,
  });
};

export const addPaymentList = (payment) => (dispatch) => {
  dispatch({
    type: SET_ADD_PAYMENT_LIST,
    payload: payment,
  });
};

export const deletePaymentList = (payment) => (dispatch) => {
  dispatch({
    type: SET_DELETE_PAYMENT_LIST,
    payload: payment,
  });
};

export const setIsLoadingPaymentList = (trueOrFalse) => (dispatch) => {
  dispatch({
    type: SET_IS_LOADING_PAYMENT_LIST,
    payload: trueOrFalse,
  });
};

export const resetPaymentList = () => ({ type: RESET_PAYMENT_LIST });

export const fetchPaymentList = () => (dispatch, getState) => {
  dispatch(setIsLoadingPaymentList(true));
  const { user } = getState();
  axios
    .get(BACKEND_URL + "/suppliers/all", setHeaders(user.token))
    .then((res) => {
      dispatch(setIsLoadingPaymentList(false));
      dispatch(setPaymentList(res.data.paymentDetails));
    })
    .catch((error) => {
      dispatch(setIsLoadingPaymentList(false));
      errorHandler(error);
    });
};
