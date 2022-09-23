import React, { Component } from "react";
import { connect } from "react-redux";
import { Col, Container, Row } from "reactstrap";
import SubClubAdminSidebar from "../../components/SubClubAdminSidebar";
import { styles as buttonStyles } from "../../assets/styles/common/buttonStyles";
import { userDetailsHandler } from "../../redux/actions/userDetailsActions";

import {
  createEventtt,
  deleteEvent,
  getSubClubEvents,
} from "../../api/ApiCalls";

class SCAdminEventsPage extends Component {
  state = {
    eventTitle: "",
    eventContent: "",
    eventList: [],
  };

  componentDidMount = async () => {
    try {
      await this.props.dispatch(
        userDetailsHandler(this.props.loggedInUsername)
      );
      let req = { subclubid: this.props.userDetails.isSCAdmin };
      const response = await getSubClubEvents(req);
      this.setState({ eventList: response.data });
    } catch (e) {}
  };
  handleChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  createEvent = async () => {
    const req = {
      subClubid: this.props.userDetails.isSCAdmin,
      title: this.state.eventTitle,
      content: this.state.eventContent,
    };
    try {
      const response = await createEventtt(req);
      if (!response.data.message.includes("Error:")) {
        let req2 = { subclubid: this.props.userDetails.isSCAdmin };
        const response2 = await getSubClubEvents(req2);
        this.setState({ eventList: response2.data });
      }
    } catch (e) {
      console.log(e);
    }
  };

  deleteEvent = async (id) => {
    let req = { eventid: id };
    try {
      const response = await deleteEvent(req);
      if (response.data.message.includes("successfully")) {
        let req2 = { subclubid: this.props.userDetails.isSCAdmin };
        const response2 = await getSubClubEvents(req2);
        this.setState({ eventList: response2.data });
      }
    } catch (e) {
      console.log(e);
    }
  };
  render() {
    return (
      <div
        style={{ backgroundColor: "#FAFAFA", minHeight: 750, paddingTop: 10 }}
      >
        <Container fluid={true}>
          <Row>
            <Col xs="4">
              <SubClubAdminSidebar />
            </Col>
            <Col xs="8">
              <form>
                <div className="form-group">
                  <label style={{ marginTop: 10 }}>Event Title</label>
                  <input
                    type="text"
                    className={"form-control"}
                    id="eventTitle"
                    name="eventTitle"
                    maxLength="25"
                    value={this.state.eventTitle}
                    onChange={(e) => this.handleChange(e)}
                  />
                  <div className="form-group">
                    <label style={{ marginTop: 10 }}>
                      Description About Event
                    </label>
                    <input
                      type="text"
                      className={"form-control"}
                      id="eventContent"
                      name="eventContent"
                      maxLength="100"
                      value={this.state.eventContent}
                      onChange={(e) => this.handleChange(e)}
                    />
                  </div>
                </div>
              </form>
              <div
                style={{
                  ...buttonStyles.defaultRedButton,
                  width: "100%",
                  cursor: "pointer",
                }}
                onClick={() => this.createEvent()}
              >
                Create Event
              </div>
              <div>
                {this.state.eventList.map((o) => (
                  <div
                    key={o.eventid}
                    style={{
                      width: "100%",
                      backgroundColor: "white",
                      borderRadius: 10,
                      marginTop: 10,
                      marginBottom: 10,
                      boxShadow: "1px 1px 1px #9E9E9E",
                      border: "1px solid #9E9E9E",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "Poppins",
                        fontSize: 45,
                        fontWeight: "bold",
                        color: "#F43E3E",
                        marginLeft: 10,
                        marginTop: 10,
                      }}
                    >
                      {o.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "Poppins",
                        fontSize: 24,
                        color: "#F43E3E",
                        marginLeft: 10,
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                      onClick={() => this.deleteEvent(o.eventid)}
                    >
                      Delete Event
                    </div>
                    <div
                      style={{
                        fontFamily: "Poppins",
                        fontSize: 30,
                        fontWeight: "bold",
                        color: "black",
                        marginLeft: 10,
                        marginTop: 10,
                        wordBreak: "break-word",
                      }}
                    >
                      {o.content}
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
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

export default connect(mapStateToProps)(SCAdminEventsPage);
