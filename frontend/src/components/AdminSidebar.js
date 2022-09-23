import React, { Component } from "react";
import { connect } from "react-redux";
import { adminLogoutSuccess } from "../redux/actions/adminAuthActions";
import { Link } from "react-router-dom";

class AdminSidebar extends Component {
  onClickAdminLogout = () => {
    this.props.dispatch(adminLogoutSuccess());
  };
  render() {
    const button1 = {
      fontFamily: "Poppins",
      fontWeight: "bold",
      color: "#F43E3E",
      textAlign: "start",
      width: "100%",
      textDecoration: "none",
      cursor: "pointer",
      paddingLeft:5
    };
    return (
      <div>
        <div>
          <Link to="/mergen/admin/user-list" style={button1}>
            User List
          </Link>
        </div>
        <div>
          <Link to="/mergen/admin/home" style={button1}>
            Club List
          </Link>
        </div>
        <div>
          <Link to="/mergen/admin/create-new-club" style={button1}>
            Create New Club
          </Link>
        </div>
        <div>
          <Link to="/mergen/admin/new-club-requests" style={button1}>
            New Club Requests
          </Link>
        </div>
        <div>
          <Link to="/mergen/admin/sub-club-admin-list" style={button1}>
            Sub-club Admin List
          </Link>
        </div>
        <div>
          <Link to="/mergen/admin/sub-club-admin-requests" style={button1}>
            Sub Club Admin Requests
          </Link>
        </div>
        <div style={button1} onClick={this.onClickAdminLogout}>
          Logout
        </div>
      </div>
    );
  }
}

export default connect()(AdminSidebar);
