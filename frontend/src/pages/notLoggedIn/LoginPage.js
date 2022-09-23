import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

import { withApiProgress } from "../../api/ApiProgress";
import mainPageBg from "../../assets/images/main_page_bg.png";
import ButtonWithProgress from "../../components/ButtonWithProgress";
import { loginHandler } from "../../redux/actions/authActions";

class LoginPage extends Component {
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
      await this.props.dispatch(loginHandler(creds));
      this.props.history.push("/");
    } catch (errorr) {
      this.setState({ error: errorr.response.data.message });
    }
  };

  render() {
    const buttonEnabled = this.state.username && this.state.password;
    return (
      <div style={{ backgroundColor: "#FAFAFA" }}>
        <Container fluid={true}>
          <Row>
            <Col xs="7" style={{ padding: 0 }}>
              <img
                src={mainPageBg}
                style={{ width: "100%", height: "auto" }}
                alt="bg"
              ></img>
            </Col>
            <Col xs="5">
              <div style={{ paddingTop: 150, fontFamily: "Poppins" }}>
                <h1 style={{ marginLeft: 147 }}>Login</h1>

                <div className="form-group">
                  <input
                    className="form-control"
                    name="username"
                    placeholder="Username"
                    onChange={this.onChange}
                    style={{ width: 400 }}
                  />
                </div>
                <div className="form-group">
                  <input
                    className="form-control"
                    name="password"
                    onChange={this.onChange}
                    placeholder="Password"
                    type="password"
                    style={{ width: 400 }}
                  />
                </div>
                {this.state.error && (
                  <div className="alert alert-danger" style={{ width: 400 }}>
                    {this.state.error}
                  </div>
                )}
                <div style={{ marginLeft: 145, cursor: "pointer" }}>
                  <ButtonWithProgress
                    onClick={this.onClickLogin}
                    disabled={!buttonEnabled || this.props.pendingApiCall}
                    pendingApiCall={this.props.pendingApiCall}
                    text="Login"
                  />
                </div>
                <div
                  style={{
                    marginLeft: 135,
                    width: 140,
                  }}
                >
                  <Link to={"/forgot-password"}
                    style={{ marginTop: 10, textDecorationColor: "#F43E3E" }}
                  >
                    <div style={{ color: "#F43E3E", textDecoration:"underline" }}>Forgot Password</div>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default connect()(withApiProgress(LoginPage, "/auth"));
