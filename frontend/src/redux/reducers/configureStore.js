import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./index";
//import SecureLS from "secure-ls";
import { setAuthorizationHeader } from "../../api/ApiCalls";

//const secureLs = new SecureLS();

const getStateFromStorage = () => {
  //const authData = secureLs.get("soc-auth");
  const authData = localStorage.getItem('soc-auth');
  
  let stateInLocalStorage = {
    authReducer: undefined,
    adminAuthReducer: undefined
  };

  /*if (authData) {
    stateInLocalStorage = authData;
  }*/
  if (authData) {
    try {
      stateInLocalStorage = JSON.parse(authData);
    } catch (error) {}
  }

  return stateInLocalStorage;
};

const updateStateInStorage = (newState) => {
  //secureLs.set("soc-auth", newState);
  let newStateTwo;
  if(newState.authReducer.isLoggedIn){
    newStateTwo = {
      authReducer:newState.authReducer
    }
  }
  else if(newState.adminAuthReducer.adminIsLoggedIn){
    newStateTwo = {
      adminAuthReducer:newState.adminAuthReducer
    }
  }
  localStorage.setItem('soc-auth', JSON.stringify(newStateTwo));
};

const configureStore = () => {
  const initialState = getStateFromStorage();
  if (
    initialState.adminAuthReducer === null ||
    initialState.adminAuthReducer === undefined ||
    !initialState.adminAuthReducer.adminIsLoggedIn
  ) {
    if (
      initialState.authReducer === null ||
      initialState.authReducer === undefined ||
      !initialState.authReducer.isLoggedIn
    ) {
      setAuthorizationHeader(null,null,false);
    } else {
      setAuthorizationHeader(
        initialState.authReducer.username,
        initialState.authReducer.password,
        initialState.authReducer.isLoggedIn
      );
    }
  } else {
    setAuthorizationHeader(
      initialState.adminAuthReducer.username,
      initialState.adminAuthReducer.password,
      initialState.adminAuthReducer.adminIsLoggedIn
    );
  }
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(thunk))
  );
  store.subscribe(() => {
    updateStateInStorage(store.getState());
    const storeGetState = store.getState();
    if (
      storeGetState.adminAuthReducer === null ||
      storeGetState.adminAuthReducer === undefined ||
      !storeGetState.adminAuthReducer.adminIsLoggedIn
    ) {
      if (
        storeGetState.authReducer === null ||
        storeGetState.authReducer === undefined ||
        !storeGetState.authReducer.isLoggedIn
      ) {
        setAuthorizationHeader(null,null,false);
      } else {
        setAuthorizationHeader(
          storeGetState.authReducer.username,
          storeGetState.authReducer.password,
          storeGetState.authReducer.isLoggedIn
        );
      }
    } else {
      setAuthorizationHeader(
        storeGetState.adminAuthReducer.username,
        storeGetState.adminAuthReducer.password,
        storeGetState.adminAuthReducer.adminIsLoggedIn
      );
    }
  });
  return store;
};

export default configureStore;
