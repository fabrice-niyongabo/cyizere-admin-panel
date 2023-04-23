import {
  SET_ACTIVE_ITEM,
  SET_ACTIVE_COMPONENT,
  SET_OPEN_DRAWER,
  SET_OPEN_DRAWER_COMPONENT,
  SET_RESET_APP,
} from "../actions/app";

const initialState = {
  openItem: ["dashboard"],
  openComponent: "buttons",
  drawerOpen: false,
  componentDrawerOpen: true,
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACTIVE_ITEM:
      console.log("payload", action.payload);
      if (action.payload.openItem) {
        return { ...state, openItem: action.payload.openItem };
      } else {
        return { ...state, openItem: action.payload };
      }
    case SET_ACTIVE_COMPONENT:
      return { ...state, openComponent: action.payload };
    case SET_OPEN_DRAWER:
      return { ...state, drawerOpen: action.payload };
    case SET_OPEN_DRAWER_COMPONENT:
      return { ...state, componentDrawerOpen: action.payload };
    case SET_RESET_APP:
      return initialState;
    default:
      return state;
  }
};

export default user;
