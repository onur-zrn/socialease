import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class SubClubAdminSidebar extends Component {
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
          <Link to="/user/subclub-admin-panel" style={button1}>
            Home Page
          </Link>
        </div>
        <div>
          <Link to="/user/subclub-admin-panel/events" style={button1}>
            Events
          </Link>
        </div>
        <div>
          <Link to="/user/subclub-admin-panel/reports" style={button1}>
            Reports
          </Link>
        </div>
        <div style={{...button1,color:"red", fontWeight:"bolder"}}>
          Drop Sub-club Administration
        </div>
      </div>
    );
  }
}

export default connect()(SubClubAdminSidebar);

