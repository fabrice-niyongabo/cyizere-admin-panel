import {
  SET_NOTIFICATIONS,
  SET_IS_LOADING_NOTIFICATIONS,
  SET_LOADING_NOTIFICATIONS_ERROR,
  RESET_NOTIFICATIONS,
  SET_IS_HARD_RELOADING_NOTIFICATIONS,
  SET_SHOW_CLEAR_ALL_NOTIFICATIONS_CONFIRMATION,
  SET_DELETE_NOTIFICATION,
  SET_ADD_OR_UPDATE_NOTIFICATION,
} from "../actions/notifications";

const initialState = {
  notifications: [],
  isLoading: false,
  hardReloading: false,
  showConfirmation: false,
  loadingError: "",
};

const notificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_NOTIFICATIONS:
      return { ...state, notifications: action.payload };
    case SET_ADD_OR_UPDATE_NOTIFICATION: {
      const newState = state.notifications;
      const index = newState.findIndex((item) => item.id == action.payload.id);
      if (index >= 0) {
        newState[index] = action.payload;
        return {
          ...state,
          notifications: newState,
        };
      } else {
        return {
          ...state,
          notifications: [action.payload, ...newState],
        };
      }
    }
    case SET_DELETE_NOTIFICATION: {
      const newState = state.notifications.filter(
        (item) => item.id != action.payload.id
      );
      return {
        ...state,
        notifications: newState,
      };
    }
    case SET_IS_LOADING_NOTIFICATIONS:
      return { ...state, isLoading: action.payload };
    case SET_SHOW_CLEAR_ALL_NOTIFICATIONS_CONFIRMATION:
      return { ...state, showConfirmation: action.payload };
    case SET_IS_HARD_RELOADING_NOTIFICATIONS:
      return { ...state, hardReloading: action.payload };
    case SET_LOADING_NOTIFICATIONS_ERROR:
      return { ...state, loadingError: action.payload };
    case RESET_NOTIFICATIONS:
      return initialState;
    default:
      return state;
  }
};

export default notificationsReducer;
