import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import { getClubRequests, deleteClubRequest } from "../../api/ApiCalls";
import AdminSidebar from "../../components/AdminSidebar";
import { styles } from "../../assets/styles/newClubReqPageStyle";
export default class NewClubReqPage extends Component {
  state = {
    requests: [],
    error: null,
  };
  componentDidMount = () => {
    this.getRequests();
  };

  getRequests = async () => {
    try {
      const response = await getClubRequests();
      console.log(response);
      this.setState({ requests: response.data });
    } catch (e) {}
  };

  deleteRequest = async (i) => {
    const id = { id: i };
    try {
      await deleteClubRequest(id);
      this.getRequests();
    } catch (e) {}
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
              <h2 style={styles.title}>Club Requests</h2>
              <div style={styles.container}>
                {this.state.requests.map((r) => (
                  <div key={r.clubRequestid} style={styles.card}>
                    <div style={styles.header}>
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <div style={styles.name}>{r.name}</div>
                        <div style={styles.uname}>{"@" + r.username}</div>
                      </div>
                      <div
                        style={styles.button1}
                        onClick={() => this.deleteRequest(r.clubRequestid)}
                      >
                        Delete
                      </div>
                    </div>
                    <div style={styles.content}>{r.content}</div>
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
