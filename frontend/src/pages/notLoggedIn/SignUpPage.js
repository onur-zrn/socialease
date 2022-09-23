import React, { Component } from "react";
import { connect } from "react-redux";

import { withApiProgress } from "../../api/ApiProgress";
import mainPageBg from "../../assets/images/main_page_bg.png";
import InputField from "../../components/InputField";
import ButtonWithProgress from "../../components/ButtonWithProgress";
import { signUpHandler } from "../../redux/actions/authActions";
import { Col, Container, Row } from "reactstrap";

class SignUpPage extends Component {
  state = {
    username: null,
    displayName: null,
    email: null,
    password: null,
    passwordRepeat: null,
    errors: {},
    successfulResponse: undefined,
  };

  onChange = (event) => {
    const { name, value } = event.target;
    const errors = { ...this.state.errors };
    errors[name] = undefined;
    if (name === "password" || name === "passwordRepeat") {
      if (name === "password" && value !== this.state.passwordRepeat) {
        errors.passwordRepeat = "Password mismatch";
      } else if (name === "passwordRepeat" && value !== this.state.password) {
        errors.passwordRepeat = "Password mismatch";
      } else {
        errors.passwordRepeat = undefined;
      }
    }
    this.setState({
      [name]: value,
      errors,
    });
    this.setState({ successfulResponse: undefined });
  };

  onClickSignUp = async (event) => {
    event.preventDefault();

    const body = {
      username: this.state.username,
      email: this.state.email,
      displayName: this.state.displayName,
      password: this.state.password,
    };

    try {
      await this.props.dispatch(signUpHandler(body));
      this.setState({
        successfulResponse:
          "You have successfully registered. We have sent you an e-mail to activate your account. Check your inbox!",
      });
    } catch (error) {
      if (error.response.data.validationErrors) {
        this.setState({ successfulResponse: undefined });
        this.setState({ errors: error.response.data.validationErrors });
      }
    }
  };

  render() {
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
              <h1 style={{ marginLeft: 120 }}>Sign Up</h1>
              <InputField
                name="displayName"
                placeholder="Display Name"
                error={this.state.errors.displayName}
                onChange={this.onChange}
              />
              <InputField
                name="username"
                placeholder="Username"
                error={this.state.errors.username}
                onChange={this.onChange}
              />
              <InputField
                name="email"
                placeholder="Email"
                error={this.state.errors.email}
                onChange={this.onChange}
              />
              <InputField
                name="password"
                placeholder="Password"
                error={this.state.errors.password}
                onChange={this.onChange}
                type="password"
              />
              <InputField
                name="passwordRepeat"
                placeholder="Password Repeat"
                error={this.state.errors.passwordRepeat}
                onChange={this.onChange}
                type="password"
              />
              {this.state.successfulResponse && (
                <div className="alert alert-success" style={{ width: 400 }}>
                  {this.state.successfulResponse}
                </div>
              )}

              <div style={{ marginLeft: 145 }}>
                <ButtonWithProgress
                  onClick={this.onClickSignUp}
                  disabled={
                    this.props.pendingApiCall ||
                    this.state.errors.passwordRepeat !== undefined
                  }
                  pendingApiCall={this.props.pendingApiCall}
                  text="Sign Up"
                />
              </div>
            </div>
          </Col>
        </Row>
        </Container>
      </div>
    );
  }
}

const SignUpWithApiProgress = withApiProgress(SignUpPage, "/register");
export default connect()(SignUpWithApiProgress);
