import * as ACTIONS from "../actions/actionTypes";
import { getUserDetails } from "../../api/ApiCalls";

export const clearUserDetails = () => {
    return {
      type: ACTIONS.CLEAR_USER_DETAILS_SUCCESS
    };
  };

export const getUserDetailsSuccess = (userDetailsState) => {
    return {
        type:ACTIONS.GET_USER_DETAILS_SUCCESS,
        payload:userDetailsState
    }
}

export const userDetailsHandler = (u) => {
    return async function (dispatch) {
      const response = await getUserDetails(u);
      const userDetailsState = {
        userId: response.data.userId,
        username: response.data.username,
        displayName: response.data.displayName,
        email: response.data.email,
        clubs: response.data.clubs,
        subclubs: response.data.subclubs,
        isSCAdmin: response.data.isSCAdmin,
        error: response.data.error,
        isThereNewClub:response.data.isThereNewClub,
        biographi:response.data.biographi,
        image:response.data.image,
        postCount:response.data.postCount
      };
  
      dispatch(getUserDetailsSuccess(userDetailsState));
      return response;
    };
  };