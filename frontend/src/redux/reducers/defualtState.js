export const defaultState = {
  authReducer: {
    id: undefined,
    isLoggedIn: false,
    isRegistered: false,
    isSurveyAnswered: false,
    username: undefined,
    password: undefined,
  },
  adminAuthReducer: {
    adminIsLoggedIn: false,
    username: undefined,
    password: undefined,
  },
  userDetailsReducer: {
    userId: undefined,
    username: undefined,
    displayName: undefined,
    email: undefined,
    clubs: [],
    subclubs: [],
    isSCAdmin: -1,
    error: "NO",
    isThereNewClub:false,
    biographi:undefined,
    image:undefined,
    postCount:0
  },
};
