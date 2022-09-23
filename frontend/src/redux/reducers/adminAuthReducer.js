import * as ACTIONS from '../actions/actionTypes';
import {defaultState as ds} from './defualtState';

const defaultState = ds.adminAuthReducer;

const adminAuthReducer = (state = { ...defaultState }, action) => {
  if (action.type === ACTIONS.ADMIN_LOGOUT_SUCCESS) {
    return defaultState;
  }
  else if (action.type === ACTIONS.ADMIN_LOGIN_SUCCESS){
    return{
      ...action.payload,
      adminIsLoggedIn:true
    }
  }
  return state;
};

export default adminAuthReducer;
