import { combineReducers } from "redux";
import user from "./user";
import app from "./app";
import supplierpayments from "./supplierpayments";
import orders from "./orders";
import notifications from "./notifications";

const rootReducer = combineReducers({
  user,
  app,
  supplierpayments,
  notifications,
  orders,
});

export default rootReducer;
