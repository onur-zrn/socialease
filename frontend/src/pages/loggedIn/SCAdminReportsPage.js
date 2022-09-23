import React, { Component } from "react";
import { connect } from "react-redux";
import { Col, Container, Row } from "reactstrap";
import { evaluateReport, getReports } from "../../api/ApiCalls";
import SubClubAdminSidebar from "../../components/SubClubAdminSidebar";
import { userDetailsHandler } from "../../redux/actions/userDetailsActions";
import { styles } from "../../assets/styles/newClubReqPageStyle";
import { Link } from "react-router-dom";

class SCAdminReportsPage extends Component {
  state = {
    reports: [],
  };
  componentDidMount = async () => {
    try {
      await this.props.dispatch(
        userDetailsHandler(this.props.loggedInUsername)
      );
      const response = await getReports();
      console.log(response);
      this.setState({ reports: response.data });
    } catch (e) {
      console.log(e);
    }
  };

  evaluate = async (r, b) => {
    const req = {
      reportid: r,
      ban: b,
    };
    try {
      await evaluateReport(req);
      const response = await getReports();
      console.log(response);
      this.setState({ reports: response.data });
    } catch (e) {
      console.log(e);
    }
  };
  render() {
    return (
      <div
        style={{ backgroundColor: "#FAFAFA", minHeight: 750, paddingTop: 10 }}
      >
        <div>
          <Container fluid={true}>
            <Row>
              <Col xs="4">
                <SubClubAdminSidebar />
              </Col>
              <Col xs="8">
                <div
                  style={{
                    width: "90%",
                    marginRight: "10%",
                    height: 100,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {" "}
                  <div style={{ ...styles.title, fontSize: 30 }}>
                    Reports Page
                  </div>
                  {this.state.reports.map((r) => (
                    <div
                      style={{
                        backgroundColor: "#FAFAFA",
                        borderRadius: 10,
                        boxShadow: "1px 1px 1px #9E9E9E",
                        border: "1px solid #9E9E9E",
                        fontFamily: "Poppins",
                        width: "70%",
                        minHeight: 200,
                        marginTop: 20,
                        marginBottom: 20,
                        wordBreak: "break-word",
                      }}
                      key={r.reported + r.reporter + r.explanation}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", fontWeight: "bold" }}>
                            {"Reporter User: "}
                            <h5
                              style={{
                                fontFamily: "Poppins",
                                fontWeight: "bold",
                                color: "#F43E3E",
                              }}
                            >
                              <Link
                                to={"/user/profile/" + r.reporter}
                                style={{
                                  color: "#F43E3E",
                                  textDecoration: "none",
                                }}
                              >
                                {" @" + r.reporter}
                              </Link>
                            </h5>
                          </div>
                          <div style={{ display: "flex", fontWeight: "bold" }}>
                            {"Reported User: "}
                            <h5
                              style={{
                                fontFamily: "Poppins",
                                fontWeight: "bold",
                                color: "#F43E3E",
                              }}
                            >
                              <Link
                                to={"/user/profile/" + r.reported}
                                style={{
                                  color: "#F43E3E",
                                  textDecoration: "none",
                                }}
                              >
                                {" @" + r.reported}
                              </Link>
                            </h5>
                          </div>
                        </div>
                        <div style={{ marginRight: 10 }}>
                          <h5
                            style={{
                              fontSize: 12,
                              textDecoration: "underline",
                              fontWeight: "bold",
                              color: "#F43E3E",
                              cursor:"pointer"
                            }}
                            onClick={() => this.evaluate(r.reportid, true)}
                          >
                            Ban this user
                          </h5>
                          <h5
                            style={{
                              fontSize: 12,
                              textDecoration: "underline",
                              fontWeight: "bold",
                              color: "gray",
                              cursor:"pointer"
                            }}
                            onClick={() => this.evaluate(r.reportid, false)}
                          >
                            Ignore this report
                          </h5>
                        </div>
                      </div>
                      {r.explanation}
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </Container>
        </div>
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

export default connect(mapStateToProps)(SCAdminReportsPage);
