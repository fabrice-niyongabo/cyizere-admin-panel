import {
  SET_ORDERS,
  SET_IS_LOADING_ORDERS,
  RESET_ORDERS,
  SET_ADD_OR_UPDATE_ORDER,
  SET_DELETE_ORDER,
} from "../actions/orders";

const initialState = {
  orders: [],
  isLoading: false,
};

const ordersReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ORDERS:
      return { ...state, orders: action.payload };
    case SET_ADD_OR_UPDATE_ORDER: {
      const newState = state.orders;
      const index = newState.findIndex((item) => item.id == action.payload.id);
      if (index >= 0) {
        newState[index] = action.payload;
        return { ...state, orders: newState };
      } else {
        return { ...state, orders: [action.payload, ...newState] };
      }
    }
    case SET_DELETE_ORDER: {
      const newState = state.orders.filter(
        (item) => item.id != action.payload.id
      );
      return { ...state, orders: newState };
    }
    case SET_IS_LOADING_ORDERS:
      return { ...state, isLoading: action.payload };
    case RESET_ORDERS:
      return initialState;
    default:
      return state;
  }
};

export default ordersReducer;
