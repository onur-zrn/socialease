import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import {
  answerSubClubAdminRequest,
  getSubClubAdminRequests,
} from "../../api/ApiCalls";
import AdminSidebar from "../../components/AdminSidebar";
import { styles } from "../../assets/styles/newClubReqPageStyle";

export default class SubClubAdminReqPage extends Component {
  state = {
    requests: [],
    error: null,
  };
  componentDidMount = () => {
    this.getRequests();
  };

  getRequests = async () => {
    try {
      const response = await getSubClubAdminRequests();
      console.log(response);
      this.setState({ requests: response.data });
    } catch (e) {}
  };

  answerRequest = async (i, m) => {
    const params = { id: i, mode: m };
    try {
      await answerSubClubAdminRequest(params);
      this.getRequests();
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <div style={{ backgroundColor: "#FAFAFA", minHeight: 750 }}>
        <Container fluid={true}>
          <Row>
            <Col xs="3">
              <AdminSidebar />
            </Col>
            <Col xs="9">
              <h2 style={styles.title}>Sub Club Admin Requests</h2>
              <div style={styles.container}>
                {this.state.requests.map((r) => (
                  <div key={r.subClubAdminRequestid} style={styles.card}>
                    <div style={styles.name}>{r.subClubName}</div>
                    <div style={{ ...styles.uname, color: "black" }}>
                      {r.currentAdmin === ""
                        ? "Current Admin: NOBODY"
                        : "Current Admin: @" + r.currentAdmin}
                    </div>
                    <div style={{ ...styles.uname, color: "black" }}>
                      {"Requester: @" + r.username}
                    </div>
                    <div
                      style={{ ...styles.button1, color: "green" }}
                      onClick={() =>
                        this.answerRequest(r.subClubAdminRequestid, 1)
                      }
                    >
                      Assign As Admin
                    </div>
                    <div
                      style={styles.button1}
                      onClick={() =>
                        this.answerRequest(r.subClubAdminRequestid, 0)
                      }
                    >
                      Delete
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
