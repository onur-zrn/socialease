import * as ACTIONS from "../actions/actionTypes";
import { defaultState as ds } from "./defualtState";

const defaultState = ds.userDetailsReducer;

const userDetailsReducer = (state = { ...defaultState }, action) => {
  if (action.type === ACTIONS.CLEAR_USER_DETAILS_SUCCESS) {
    return defaultState;
  } else if (action.type === ACTIONS.GET_USER_DETAILS_SUCCESS) {
    if (action.payload.clubs === null) {
      return {
        ...action.payload,
        clubs:[],
        subclubs:[]
      };
    } else {
      return {
        ...action.payload
      };
    }
  }
  return state;
};

export default userDetailsReducer;
