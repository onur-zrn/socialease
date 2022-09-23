import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { confirmAccount } from "../../api/ApiCalls";

class ConfirmPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "Please wait..."
    };
    this.sendToken();
  }

  sendToken = async () => {
    try {
      const urlString = window.location.href.toString();
      const path = urlString.split("/#")[1];
      const response = await confirmAccount(path);
      this.setState({ message: response.data.message });
    } catch (error) {
      this.setState({ message: error.response.data.message });
    }
  };
  render() {
    return (
      <h1 style={{ textAlign: "center", marginTop: 50, fontFamily: "Poppins" }}>
        {this.state.message}
      </h1>
    );
  }
}

export default connect()(withRouter(ConfirmPage));
