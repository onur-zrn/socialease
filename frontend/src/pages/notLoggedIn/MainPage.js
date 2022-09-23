import React, { Component } from "react";
import mainPageBg from "../../assets/images/main_page_bg.png";
import { Link } from "react-router-dom";
import {styles} from "../../assets/styles/common/buttonStyles";
import { Col, Container, Row } from "reactstrap";

export default class MainPage extends Component {
  render() {
    return (
      <div style={{ backgroundColor: "#FAFAFA" }}>
        <Container fluid={true}>
        <Row>
          <Col xs="7" style={{padding:0}}>
            <img
              src={mainPageBg}
              style={{ width: "100%", height: "auto" }}
              alt="bg"
            ></img>
          </Col>
          <Col xs="5">
            <div style={{paddingTop:150}}>
              <h1 style={{ fontFamily: "Poppins" }}>
                Social-ease: socialize easily!
              </h1>
              <h5 style={{ fontFamily: "Poppins" }}>
                Sign up now and discover this brand new world!
              </h5>
              <Link to="/discover" style={{textDecoration:"none"}}>
                <div style={styles.defaultRedButton}>Discover</div>
              </Link>
            </div>
          </Col>
        </Row>
        </Container>
        {/* <div
          style={{ backgroundColor: "black", width: "100%", height: "100px" }}
        ></div> */}
      </div>
    );
  }
}
