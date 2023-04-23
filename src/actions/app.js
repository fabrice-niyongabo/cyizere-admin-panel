export const SET_ACTIVE_ITEM = "SET_ACTIVE_ITEM";
export const SET_ACTIVE_COMPONENT = "SET_ACTIVE_COMPONENT";
export const SET_OPEN_DRAWER = "SET_OPEN_DRAWER";
export const SET_OPEN_DRAWER_COMPONENT = "SET_OPEN_DRAWER_COMPONENT";
export const SET_RESET_APP = "SET_RESET_APP";

export const setActiveItem = (item) => (dispatch) => {
  dispatch({
    type: SET_ACTIVE_ITEM,
    payload: item,
  });
};

export const setActiveComponent = (component) => (dispatch) => {
  dispatch({
    type: SET_ACTIVE_COMPONENT,
    payload: component,
  });
};

export const setOpenDrawer = (trueOrFalse) => (dispatch) => {
  dispatch({
    type: SET_OPEN_DRAWER,
    payload: trueOrFalse,
  });
};

export const setOpenComponentDrawer = (component) => (dispatch) => {
  dispatch({
    type: SET_OPEN_DRAWER_COMPONENT,
    payload: component,
  });
};

export const resetApp = () => (dispatch) => {
  dispatch({
    type: SET_RESET_APP,
  });
};
