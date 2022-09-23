import React, { Component } from "react";
import { Navbar, NavbarBrand } from "reactstrap";
import logo from "../assets/images/logo.png";
import { styles as naviStyles } from "../assets/styles/naviStyles";
class NaviForAdmin extends Component {
  render() {
    return (
      <div>
        <Navbar style={naviStyles.navBarForAdmin} light expand="md">
          <img src={logo} width="56" alt="Socialease Logo"></img>
          <NavbarBrand href="/" style={naviStyles.naviText1}>
            Socialease
          </NavbarBrand>
        </Navbar>
      </div>
    );
  }
}

export default NaviForAdmin;
