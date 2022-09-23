import React, { Component } from "react";
import { connect } from "react-redux";
import { Col, Container, Row } from "reactstrap";
import { withRouter } from "react-router-dom";
import mainPageBg from "../../assets/images/main_page_bg.png";
import { recoverPass } from "../../api/ApiCalls";
import alertify from "alertifyjs";

class RecoverPasswordPage extends Component {
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

  onClickRecover = async (event) => {
    event.preventDefault();
    const urlString = window.location.href.toString();
    const token = urlString.split("/#")[1];
    const creds = {
      username: this.state.username,
      password: this.state.password,
    };
    this.setState({ error: null });
    try {
      const response = await recoverPass(token,creds);
      if(response.data.message.includes("Changed")){
        alertify.success("Password is changed");
      }
      else{
        alertify.error("Ops!There is a problem");
      }
    } catch (errorr) {
      alertify.error("Ops!There is a problem");
    }
    this.props.history.push("/");
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
                <h1 style={{ marginLeft: 40 }}>Reset Password</h1>
                <h5 style={{ marginLeft: 70 }}>Enter your new password</h5>
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
                <div style={{ marginLeft: 145 }}>
                  <div
                    onClick={this.onClickRecover}
                    style={{
                      width: 110,
                      height: 40,
                      fontFamily: "Poppins",
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor: "#F43E3E",
                      textAlign: "center",
                      textDecoration: "none",
                      borderRadius: 5,
                      paddingTop: 8,
                      cursor:"pointer"
                    }}
                  >
                    Reset
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default connect()(withRouter(RecoverPasswordPage));
