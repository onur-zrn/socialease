import * as ACTIONS from "../actions/actionTypes";
import { login, signUp } from "../../api/ApiCalls";

export const logoutSuccess = () => {
  return {
    type: ACTIONS.LOGOUT_SUCCESS,
  };
};

export const surveyAnswered = (authState) => {
  return{
    type:ACTIONS.ANSWER_SURVEY_SUCCESS,
    payload:authState,
  };
}

export const userUpdatedSuccess = (authState) => {
  return{
    type:ACTIONS.USER_UPDATE_SUCCESS,
    payload:authState
  };
}

export const loginSuccess = (authState) => {
  return {
    type: ACTIONS.LOGIN_SUCCESS,
    payload: authState,
  };
};

export const loginHandler = (creds) => {
  return async function (dispatch) {
    const response = await login(creds);
    const authState = {
      id:response.data.userid,
      username: response.data.username,
      password: creds.password,
      isRegistered: response.data.isRegistered,
      isSurveyAnswered: response.data.isSurveyAnswered
    };

    dispatch(loginSuccess(authState));
    return response;
  };
};

export const signUpHandler = (user) => {
    return async function(dispatch){
        const response = await signUp(user);
        return response;
    }
}
