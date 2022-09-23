import React, { Component } from "react";
import { connect } from "react-redux";
import { Col, Container, Row } from "reactstrap";
import { forgotPass } from "../../api/ApiCalls";
import alertify from "alertifyjs";
import { withApiProgress } from "../../api/ApiProgress";
import mainPageBg from "../../assets/images/main_page_bg.png";
import ButtonWithProgress from "../../components/ButtonWithProgress";

class ForgotPasswordPage extends Component {
  state = {
    email:null,
    success:null
  };

  onChange = (event) => {
    const { name, value } = event.target;
    this.setState({
        [name]: value,
      });
  };

  onClickForgot = async (event) => {
    event.preventDefault();

    const m = {
      email:this.state.email
    };
    try {
      const response = await forgotPass(m);
      if(!response.data.message.includes("Error:")){
        this.setState({success:"Please check your email"});
      }
      else{
        alertify.error("Ops! There is a problem!");
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const buttonEnabled = this.state.email;
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
                <h1 style={{ marginLeft: 36 }}>Forgot Password</h1>
                <h5 style={{ marginLeft: 40 }}>We will send a link to your email.</h5>
                <div className="form-group">
                  <input
                    className="form-control"
                    name="email"
                    placeholder="Email"
                    onChange={this.onChange}
                    style={{ width: 400 }}
                  />
                </div>
                {this.state.success && (
                  <div className="alert alert-success" style={{ width: 400 }}>
                    {this.state.success}
                  </div>
                )}
                <div style={{ marginLeft: 145, cursor: "pointer" }}>
                  <ButtonWithProgress
                    onClick={this.onClickForgot}
                    disabled={!buttonEnabled || this.props.pendingApiCall}
                    pendingApiCall={this.props.pendingApiCall}
                    text="Send"
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

export default connect()(withApiProgress(ForgotPasswordPage, "/forgot"));
