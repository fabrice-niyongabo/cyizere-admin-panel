import axios from "axios";
import { errorHandler, setHeaders } from "../helpers";
import { BACKEND_URL } from "../constants";

export const SET_ORDERS = "SET_ORDERS";
export const SET_ADD_OR_UPDATE_ORDER = "SET_ADD_OR_UPDATE_ORDER";
export const SET_DELETE_ORDER = "SET_DELETE_ORDER";
export const SET_IS_LOADING_ORDERS = "SET_IS_LOADING_ORDERS";
export const RESET_ORDERS = "RESET_ORDERS";

export const setOrders = (orders) => ({
  type: SET_ORDERS,
  payload: orders,
});
export const setAddOrUpdateOrder = (order) => ({
  type: SET_ADD_OR_UPDATE_ORDER,
  payload: order,
});
export const setDeleteOrder = (order) => ({
  type: SET_DELETE_ORDER,
  payload: order,
});
export const setIsLoadingOrders = (value) => ({
  type: SET_IS_LOADING_ORDERS,
  payload: value,
});

export const resetOrders = () => ({ type: RESET_ORDERS });

export const fetchOrders = () => (dispatch, getState) => {
  dispatch(setIsLoadingOrders(true));
  const { user } = getState();
  axios
    .get(BACKEND_URL + "/orders/admin", setHeaders(user.token))
    .then((res) => {
      dispatch(setIsLoadingOrders(false));
      dispatch({
        type: SET_ORDERS,
        payload: res.data.orders,
      });
    })
    .catch((error) => {
      dispatch(setIsLoadingOrders(false));
      errorHandler(error);
    });
};
