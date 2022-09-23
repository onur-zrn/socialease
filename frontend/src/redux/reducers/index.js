import {combineReducers} from "redux"
import authReducer from "./authReducer";
import adminAuthReducer from "./adminAuthReducer";
import userDetailsReducer from "./userDetailsReducer";

const rootReducer = combineReducers({
    authReducer,
    adminAuthReducer,
    userDetailsReducer
})

export default rootReducer;