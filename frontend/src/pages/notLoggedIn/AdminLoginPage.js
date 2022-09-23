import React, { Component } from "react";
import { connect } from "react-redux";

import { withApiProgress } from "../../api/ApiProgress";
import ButtonWithProgress from "../../components/ButtonWithProgress";
import { adminLoginHandler } from "../../redux/actions/adminAuthActions";

class AdminLoginPage extends Component {
  state = {
    username: null,
    password: null,
    error: null,
  };

  onChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      error: null,
    });
  };

  onClickLogin = async (event) => {
    event.preventDefault();

    const creds = {
      username: this.state.username,
      password: this.state.password,
    };
    this.setState({ error: null });
    try {
      await this.props.dispatch(adminLoginHandler(creds));
      this.props.history.push("/");
    } catch (errorr) {
      this.setState({ error: errorr.response.data.message });
    }
  };

  render() {
    const buttonEnabled = this.state.username && this.state.password;
    return (
      <div
        style={{
          backgroundColor: "#FAFAFA",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "25%",
            marginTop: 170,
            fontFamily: "Poppins",
            paddingBottom: 280,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1 style={{ textAlign: "center" }}>Admin Login</h1>

          <div className="form-group" style={{ width: "100%" }}>
            <input
              className="form-control"
              name="username"
              placeholder="Username"
              onChange={this.onChange}
            />
          </div>
          <div className="form-group" style={{ width: "100%" }}>
            <input
              className="form-control"
              name="password"
              onChange={this.onChange}
              placeholder="Password"
              type="password"
            />
          </div>
          {this.state.error && (
            <div className="alert alert-danger" style={{ width: "100%" }}>
              {this.state.error}
            </div>
          )}
          <div>
            <ButtonWithProgress
              onClick={this.onClickLogin}
              disabled={!buttonEnabled || this.props.pendingApiCall}
              pendingApiCall={this.props.pendingApiCall}
              text="Login"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(
  withApiProgress(AdminLoginPage, "/mergen/admin/login")
);
