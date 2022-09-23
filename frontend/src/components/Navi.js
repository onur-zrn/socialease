import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { logoutSuccess } from "../redux/actions/authActions";
import { styles as buttonStyles } from "../assets/styles/common/buttonStyles";
import { styles as naviStyles } from "../assets/styles/naviStyles";
import defaultPP from "../assets/images/default_profile_photo.png";
import notifyEmpty from "../assets/images/notify1.png";
import notifyNotEmpty from "../assets/images/notify2.png";
import {
  userDetailsHandler,
  clearUserDetails,
} from "../redux/actions/userDetailsActions";

class Navi extends Component {
  state = {
    isOpen: false
  };

  componentDidMount = async () => {
    if(this.props.isLoggedIn){
      await this.props.dispatch(userDetailsHandler(this.props.loggedInUsername));
    }
  }
  logout = () => {
    this.props.dispatch(clearUserDetails());
    this.props.dispatch(logoutSuccess());
  };

  render() {
    const toggle = () => {
      let newState = !this.state.isOpen;
      this.setState({ isOpen: newState });
    };
    let PPimage=defaultPP;
    if(!(this.props.userDetails.image===null || this.props.userDetails.image===undefined)){
      PPimage=this.props.userDetails.image;
    }
    let buttons = (
      <Nav
        className="ml-auto"
        navbar
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Link to="/login" style={buttonStyles.defaultWhiteButton}>
          Login
        </Link>
        <Link to="/signup" style={buttonStyles.defaultWhiteButton}>
          Sign Up
        </Link>
      </Nav>
    );

    if (this.props.isLoggedIn) {
      buttons = (
        <Nav
          className="ml-auto"
          navbar
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret={false} style={naviStyles.naviButton1}>
                {
                  this.props.userDetails.isThereNewClub ?
                  <img
                  alt={this.props.userDetails.username}
                  src={notifyNotEmpty}
                  width="30"
                  height="30"
                  style={{ marginRight: 10 }}
                />
                :
                <img
                  alt={this.props.userDetails.username}
                  src={notifyEmpty}
                  width="30"
                  height="30"
                  style={{ marginRight: 10 }}
                />
                }
              </DropdownToggle>
              <DropdownMenu right>
                {this.props.userDetails.isThereNewClub ? (
                  <DropdownItem style={naviStyles.naviDropDownItem}>
                    <Link
                      to={"/user/new-club-surveys"}
                      style={{ ...naviStyles.naviButton2, fontWeight: "bold" }}
                    >
                      There are new clubs/subclubs. Join!
                    </Link>
                  </DropdownItem>
                ) : (
                  <DropdownItem style={naviStyles.naviDropDownItem}>
                    <div
                      style={{
                        ...naviStyles.naviButton2,
                        fontWeight: "bold",
                        color: "gray",
                        cursor: "default",
                      }}
                    >
                      There is no notification!
                    </div>
                  </DropdownItem>
                )}
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
          <div>
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret style={naviStyles.naviButton1}>
                <img
                  alt={this.props.userDetails.username}
                  src={PPimage}
                  className="rounded-circle shadow"
                  width="30"
                  height="30"
                  style={{ marginRight: 10 }}
                />
                {this.props.userDetails.username}
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem style={naviStyles.naviDropDownItem}>
                  <Link
                    to={`/user/profile/${this.props.userDetails.username}`}
                    style={naviStyles.naviButton2}
                  >
                    My Profile
                  </Link>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem style={naviStyles.naviDropDownItem}>
                  <Link
                    to="/user/subclub-admin-panel"
                    style={naviStyles.naviButton2}
                  >
                    Sub-club Admin Panel
                  </Link>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem style={naviStyles.naviDropDownItem}>
                  <Link
                    to="/user/show-all-clubs"
                    style={naviStyles.naviButton2}
                  >
                    Show All Clubs/Sub-clubs
                  </Link>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem style={naviStyles.naviDropDownItem}>
                  <Link to="/user/settings" style={naviStyles.naviButton2}>
                    Settings
                  </Link>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem style={naviStyles.naviDropDownItem}>
                  <div
                    style={naviStyles.naviButton3}
                    onClick={() => this.logout()}
                  >
                    Logout
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </Nav>
      );
    }

    return (
      <div>
        <Navbar style={{ backgroundColor: "#F43E3E" }} light expand="md">
          <img src={logo} width="56" alt="Socialease Logo"></img>
          <NavbarBrand href="/" style={naviStyles.naviText1}>
            Socialease
          </NavbarBrand>

          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            {buttons}
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    isLoggedIn: store.authReducer.isLoggedIn,
    loggedInUsername: store.authReducer.username,
    userDetails: store.userDetailsReducer,
  };
};

export default connect(mapStateToProps)(Navi);
