import {
  SET_ADD_PAYMENT_LIST,
  SET_PAYMENT_LIST,
  SET_IS_LOADING_PAYMENT_LIST,
  RESET_PAYMENT_LIST,
  SET_DELETE_PAYMENT_LIST,
} from "../actions/supplierpayments";

const initialState = {
  isLoading: false,
  payments: [],
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case SET_PAYMENT_LIST:
      return { ...state, payments: action.payload };
    case SET_ADD_PAYMENT_LIST:
      return { ...state, payments: [action.payload, ...state.payments] };
    case SET_DELETE_PAYMENT_LIST:
      return {
        ...state,
        payments: state.payments.filter((item) => item.id != action.payload.id),
      };
    case SET_IS_LOADING_PAYMENT_LIST:
      return { ...state, isLoading: action.payload };
    case RESET_PAYMENT_LIST:
      return initialState;
    default:
      return state;
  }
};

export default user;
