import * as ACTIONS from "../actions/actionTypes";
import { adminLogin } from "../../api/ApiCalls";

export const adminLogoutSuccess = () => {
  return {
    type: ACTIONS.ADMIN_LOGOUT_SUCCESS,
  };
};

export const adminLoginSuccess = (authState) => {
  return {
    type: ACTIONS.ADMIN_LOGIN_SUCCESS,
    payload: authState,
  };
};

export const adminLoginHandler = (creds) => {
  return async function (dispatch) {
    const response = await adminLogin(creds);
    const authState = {
      username: response.data.username,
      password: creds.password
    };

    dispatch(adminLoginSuccess(authState));
    return response;
  };
};
