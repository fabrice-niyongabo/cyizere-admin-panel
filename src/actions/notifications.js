import axios from "axios";
import { BACKEND_URL } from "../constants";
import { errorHandler, setHeaders } from "../helpers";

export const SET_NOTIFICATIONS = "SET_NOTIFICATIONS";
export const SET_ADD_OR_UPDATE_NOTIFICATION = "SET_ADD_OR_UPDATE_NOTIFICATION";
export const SET_DELETE_NOTIFICATION = "SET_DELETE_NOTIFICATION";
export const SET_IS_LOADING_NOTIFICATIONS = "SET_IS_LOADING_NOTIFICATIONS";
export const SET_LOADING_NOTIFICATIONS_ERROR =
  "SET_LOADING_NOTIFICATIONS_ERROR";
export const SET_IS_HARD_RELOADING_NOTIFICATIONS =
  "SET_IS_HARD_RELOADING_NOTIFICATIONS";
export const SET_SHOW_CLEAR_ALL_NOTIFICATIONS_CONFIRMATION =
  "SET_SHOW_CLEAR_ALL_NOTIFICATIONS_CONFIRMATION";
export const RESET_NOTIFICATIONS = "RESET_NOTIFICATIONS";

export const setNotifications = (orders) => ({
  type: SET_NOTIFICATIONS,
  payload: orders,
});
export const setAddOrUpdateNotification = (notification) => ({
  type: SET_ADD_OR_UPDATE_NOTIFICATION,
  payload: notification,
});
export const setDeleteNotification = (notification) => ({
  type: SET_DELETE_NOTIFICATION,
  payload: notification,
});
export const setIsLoadingNotifications = (value) => ({
  type: SET_IS_LOADING_NOTIFICATIONS,
  payload: value,
});
export const setShowClearAllNotificatonsConfirmation = (value) => ({
  type: SET_SHOW_CLEAR_ALL_NOTIFICATIONS_CONFIRMATION,
  payload: value,
});

export const setIsHardReloadingNotifications = (value) => ({
  type: SET_IS_HARD_RELOADING_NOTIFICATIONS,
  payload: value,
});

export const setLoadingNotificationsError = (value) => ({
  type: SET_LOADING_NOTIFICATIONS_ERROR,
  payload: value,
});

export const resetNotifications = () => ({ type: RESET_NOTIFICATIONS });

export const fetchNotifications = () => (dispatch, getState) => {
  dispatch(setIsLoadingNotifications(true));
  dispatch(setLoadingNotificationsError(""));
  const { user } = getState();
  axios
    .get(BACKEND_URL + "/notifications/admin/", setHeaders(user.token))
    .then((res) => {
      dispatch(setIsLoadingNotifications(false));
      dispatch(setIsHardReloadingNotifications(false));
      dispatch(setNotifications(res.data.notifications));
    })
    .catch((error) => {
      errorHandler(error);
      dispatch(setIsLoadingNotifications(false));
      dispatch(setIsHardReloadingNotifications(false));
    });
};

export const fetchNotifications2 = () => (dispatch, getState) => {
  dispatch(setIsLoadingNotifications(true));
  dispatch(setLoadingNotificationsError(""));
  const { user } = getState();
  axios
    .get(BACKEND_URL + "/notifications/read/", setHeaders(user.token))
    .then((r) => {
      axios
        .get(BACKEND_URL + "/notifications/admin/", setHeaders(user.token))
        .then((res) => {
          dispatch(setIsLoadingNotifications(false));
          dispatch(setIsHardReloadingNotifications(false));
          dispatch(setNotifications(res.data.notifications));
        })
        .catch((error) => {
          errorHandler(error);
          dispatch(setIsLoadingNotifications(false));
          dispatch(setIsHardReloadingNotifications(false));
        });
    })
    .catch((error) => {
      errorHandler(error);
      dispatch(setIsLoadingNotifications(false));
      dispatch(setIsHardReloadingNotifications(false));
    });
};
