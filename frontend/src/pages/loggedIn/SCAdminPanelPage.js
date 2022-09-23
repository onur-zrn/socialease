import React, { Component } from "react";
import { connect } from "react-redux";
import alertify from "alertifyjs";
import { userDetailsHandler } from "../../redux/actions/userDetailsActions";
import { styles } from "../../assets/styles/clubCardStyles";
import { styles as buttonStyles } from "../../assets/styles/common/buttonStyles";
import { sendAdminRequest } from "../../api/ApiCalls";
import { Col, Container, Row } from "reactstrap";
import SubClubAdminSidebar from "../../components/SubClubAdminSidebar";
import SCMemberList from "../../components/SCMemberList";

class SCAdminPanelPage extends Component {
  state = {
    currentSubClub: null,
    currentSubClubId: null,
    subClubs: [],
  };

  componentDidMount = () => {
    this.getUserDetails();
  };

  getUserDetails = async () => {
    try {
      await this.props.dispatch(
        userDetailsHandler(this.props.loggedInUsername)
      );
      if (this.props.userDetails.error.includes("Error:")) {
        alertify.error(this.state.error);
        //this.props.history.push("/404");
      }
    } catch (e) {
      alertify.error("Oops! There is a problem.");
      //this.props.history.push("/404");
    }
    this.setState({ subClubs: this.props.userDetails.subclubs });
  };

  selectSubClub = (sc) => {
    this.setState({
      currentSubClub: sc.subClubName,
      currentSubClubId: sc.subClubid,
    });
  };

  sendAdminRequest = async () => {
    const req = {
      subClubid: this.state.currentSubClubId,
      userid: this.props.userDetails.userId,
    };
    try {
      const response = await sendAdminRequest(req);
      if (response.data.message.includes("Error:")) {
        alertify.error(response.data.message);
      } else {
        alertify.success(response.data.message);
        await this.props.dispatch(
          userDetailsHandler(this.props.loggedInUsername)
        );
      }
    } catch (e) {
      alertify.error("Ops! There is a problem!");
    }
  };
  render() {
    let page = (
      <div
        style={{
          width: "100%",
          textAlign: "center",
          fontFamily: "Poppins",
          fontWeight: "bold",
          fontSize: 20,
          color: "#F43E3E",
        }}
      >
        You are not a subclub admin. You can request to become a subclub admin.
        Choose a subclub!
        <div
          style={{
            width: "100%",
            minHeight: 200,
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {this.state.subClubs.map((sc) => (
            <div
              key={sc.subClubid}
              style={
                this.state.currentSubClub === sc.subClubName
                  ? styles.activeCard2
                  : styles.inactiveCard2
              }
              onClick={() => this.selectSubClub(sc)}
            >
              {sc.subClubName}
            </div>
          ))}
        </div>
        <div
          style={{
            ...buttonStyles.defaultRedButton,
            width: 300,
            marginLeft: "1%",
            cursor: "pointer",
          }}
          onClick={() => this.sendAdminRequest()}
        >
          Send Request
        </div>
      </div>
    );
    if (this.props.userDetails.isSCAdmin !== -1) {
      if (this.props.userDetails.isSCAdmin === -2) {
        page = (
          <div
            style={{
              width: "100%",
              textAlign: "center",
              fontFamily: "Poppins",
              fontWeight: "bold",
              fontSize: 20,
              color: "#F43E3E",
              marginTop: 100,
            }}
          >
            You are waiting for a subclub admin request. Be patient!
          </div>
        );
      }
      else if(this.props.userDetails.isSCAdmin === -3){
        page = (
          <div
            style={{
              width: "100%",
              textAlign: "center",
              fontFamily: "Poppins",
              fontWeight: "bold",
              fontSize: 20,
              color: "#F43E3E",
              marginTop: 100,
            }}
          >
            You are banned, you cannot be a sub-club admin!
          </div>
        );
      }
      else {
        page = (
          <div>
            <Container fluid={true}>
              <Row>
                <Col xs="4">
                  <SubClubAdminSidebar />
                </Col>
                <Col xs="8">
                  <SCMemberList uDetail={this.props.userDetails}/>
                </Col>
              </Row>
            </Container>
          </div>
        );
      }
    }
    return (
      <div
        style={{ backgroundColor: "#FAFAFA", minHeight: 750, paddingTop: 10 }}
      >
        {page}
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    userDetails: store.userDetailsReducer,
    loggedInUsername: store.authReducer.username,
  };
};

export default connect(mapStateToProps)(SCAdminPanelPage);
