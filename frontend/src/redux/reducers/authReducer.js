import * as ACTIONS from '../actions/actionTypes';
import {defaultState as ds} from './defualtState';

const defaultState = ds.authReducer;

const authReducer = (state = { ...defaultState }, action) => {
  if (action.type === ACTIONS.LOGOUT_SUCCESS) {
    return defaultState;
  }
  else if (action.type === ACTIONS.LOGIN_SUCCESS){
    return{
      ...action.payload,
      isLoggedIn:true
    }
  }
  else if (action.type === ACTIONS.ANSWER_SURVEY_SUCCESS){
    return{
      ...action.payload,
      isSurveyAnswered:true
    }
  }
  else if(action.type === ACTIONS.USER_UPDATE_SUCCESS){
    return{
      ...action.payload
    }
  }
  return state;
};

export default authReducer;
