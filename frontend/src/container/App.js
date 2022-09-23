import React from "react";
import { HashRouter, Switch, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Navi from "../components/Navi";
import NaviForAdmin from "../components/NaviForAdmin";

import AdminHomePage from "../pages/adminPanel/AdminHomePage";
import CreateNewClubPage from "../pages/adminPanel/CreateNewClubPage";
import UpdateClubPage from "../pages/adminPanel/UpdateClubPage";

import HomePage from "../pages/loggedIn/HomePage";
import SurveyPage from "../pages/loggedIn/SurveyPage";
import UserProfilePage from "../pages/loggedIn/UserProfilePage";

import AdminLoginPage from "../pages/notLoggedIn/AdminLoginPage";
import ConfirmPage from "../pages/notLoggedIn/ConfirmPage";
import DiscoverPage from "../pages/notLoggedIn/DiscoverPage";
import LoginPage from "../pages/notLoggedIn/LoginPage";
import MainPage from "../pages/notLoggedIn/MainPage";
import SignUpPage from "../pages/notLoggedIn/SignUpPage";
import SCAdminPanelPage from "../pages/loggedIn/SCAdminPanelPage";
import SettingsPage from "../pages/loggedIn/SettingsPage";
import OfferNewClubPage from "../pages/loggedIn/OfferNewClubPage";
import NewClubReqPage from "../pages/adminPanel/NewClubReqPage";
import SubClubAdminReqPage from "../pages/adminPanel/SubClubAdminReqPage";
import NewClubSurveyPage from "../pages/loggedIn/NewClubSurveyPage";
import ReportUserPage from "../pages/loggedIn/ReportUserPage";
import SCAdminEventsPage from "../pages/loggedIn/SCAdminEventsPage";
import SCAdminReportsPage from "../pages/loggedIn/SCAdminReportsPage";
import SCAdminListPage from "../pages/adminPanel/SCAdminListPage";
import UserListPage from "../pages/adminPanel/UserListPage";
import MemberListPage from "../pages/loggedIn/MemberListPage";
import ClubRatePage from "../pages/loggedIn/ClubRatePage";
import ForgotPasswordPage from "../pages/notLoggedIn/ForgotPasswordPage";
import RecoverPasswordPage from "../pages/notLoggedIn/RecoverPasswordPage";

class App extends React.Component {
  render() {
    const { isLoggedIn, isSurveyAnswered, adminIsLoggedIn, isSCAdmin } = this.props;

    //USER WHO NOT LOGGED IN
    let pages = (
      <HashRouter>
        <Navi />
        <Switch>
          <Route exact path="/" component={MainPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/forgot-password" component={ForgotPasswordPage} />
          <Route exact path="/recover" component={RecoverPasswordPage} />
          <Route exact path="/signup" component={SignUpPage} />
          <Route exact path="/discover" component={DiscoverPage} />
          <Route path="/confirm" component={ConfirmPage} />
          <Route exact path="/mergen/admin/login" component={AdminLoginPage} />
          <Redirect to="/" />
        </Switch>
      </HashRouter>
    );
    if (adminIsLoggedIn) {
      pages = (
        <HashRouter>
          <NaviForAdmin />
          <Switch>
            <Route exact path="/mergen/admin/home" component={AdminHomePage} />
            <Route exact path="/mergen/admin/user-list" component={UserListPage} />
            <Route exact path="/mergen/admin/create-new-club" component={CreateNewClubPage}/>
            <Route exact path="/mergen/admin/new-club-requests" component={NewClubReqPage}/>
            <Route exact path="/mergen/admin/sub-club-admin-requests" component={SubClubAdminReqPage}/>
            <Route exact path="/mergen/admin/sub-club-admin-list" component={SCAdminListPage}/>
            <Route path="/mergen/admin/update-club/:clubId" component={UpdateClubPage}/>
            <Redirect to="/mergen/admin/home" />
          </Switch>
        </HashRouter>
      );
    } else {
      //USER WHO LOGGED IN
      if (isLoggedIn) {
        //USER WHO ANSWERED SURVEY AND NOT A SUB CLUB ADMIN
        if (isSurveyAnswered && isSCAdmin<0) {
          pages = (
            <HashRouter>
              <Navi />
              <Switch>
                <Route exact path="/home" component={HomePage} />
                <Route exact path="/member-list" component={MemberListPage}/>
                <Route exact path="/club-rate-page" component={ClubRatePage}/>
                <Route exact path="/user/subclub-admin-panel" component={SCAdminPanelPage}/>
                <Route exact path="/user/offer-new-club" component={OfferNewClubPage}/>
                <Route exact path="/user/show-all-clubs" component={DiscoverPage}/>
                <Route exact path="/user/report-user" component={ReportUserPage}/>
                <Route exact path="/user/settings" component={SettingsPage}/>
                <Route exact path="/user/new-club-surveys" component={NewClubSurveyPage}/>
                <Route path="/user/profile/:username" component={UserProfilePage} />
                <Redirect to="/home" />
              </Switch>
            </HashRouter>
          );
        }
        //USER WHO ANSWERED SURVEY AND A SUB CLUB ADMIN
        else if (isSurveyAnswered && isSCAdmin>=0) {
          pages = (
            <HashRouter>
              <Navi />
              <Switch>
                <Route exact path="/home" component={HomePage} />
                <Route exact path="/member-list" component={MemberListPage}/>
                <Route exact path="/club-rate-page" component={ClubRatePage}/>
                <Route exact path="/user/subclub-admin-panel" component={SCAdminPanelPage}/>
                <Route exact path="/user/subclub-admin-panel/events" component={SCAdminEventsPage}/>
                <Route exact path="/user/subclub-admin-panel/reports" component={SCAdminReportsPage}/>
                <Route exact path="/user/offer-new-club" component={OfferNewClubPage}/>
                <Route exact path="/user/show-all-clubs" component={DiscoverPage}/>
                <Route exact path="/user/report-user" component={ReportUserPage}/>
                <Route exact path="/user/settings" component={SettingsPage}/>
                <Route exact path="/user/new-club-surveys" component={NewClubSurveyPage}/>
                <Route path="/user/profile/:username" component={UserProfilePage} />
                <Redirect to="/home" />
              </Switch>
            </HashRouter>
          );
        }
        //USER WHO DID NOT ANSWER SURVEY
        else {
          pages = (
            <HashRouter>
              <Navi />
              <Switch>
                <Route exact path="/survey" component={SurveyPage} />
                <Redirect to="/survey" />
              </Switch>
            </HashRouter>
          );
        }
      }
    }

    return <div>{pages}</div>;
  }
}

const mapStateToProps = (store) => {
  return {
    isLoggedIn: store.authReducer.isLoggedIn,
    isSurveyAnswered: store.authReducer.isSurveyAnswered,
    adminIsLoggedIn: store.adminAuthReducer.adminIsLoggedIn,
    isSCAdmin: store.userDetailsReducer.isSCAdmin
  };
};

export default connect(mapStateToProps)(App);
