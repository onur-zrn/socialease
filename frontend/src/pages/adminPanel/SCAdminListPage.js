import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import { banSubClubAdmin, getSubClubAdminList } from "../../api/ApiCalls";
import AdminSidebar from "../../components/AdminSidebar";
import { styles } from "../../assets/styles/common/buttonStyles";
import alertify from "alertifyjs";

export default class SCAdminListPage extends Component {
  state = {
    subClubAdmins: [],
  };

  componentDidMount = async () => {
    try {
      const response = await getSubClubAdminList();
      this.setState({ subClubAdmins: response.data });
    } catch (e) {
      console.log(e);
    }
  };

  banUser = async (userid, bantype) => {
    const req = {
      userid: userid,
      banType: bantype,
    };
    try {
      const response = await banSubClubAdmin(req);
      if (response.data.message.includes("Successful")) {
        alertify.success("Sub-club admin is banned!");
        const response2 = await getSubClubAdminList();
        this.setState({ subClubAdmins: response2.data });
      }
      else{
          console.log(response);
          alertify.error("Ops! There is a problem!");
      }
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
              <div
                style={{
                  width: "100%",
                }}
              >
                <h5
                  style={{
                    fontFamily: "Poppins",
                    color: "#F43E3E",
                    fontSize: 30,
                    fontWeight: "bold",
                    marginTop: 10,
                  }}
                >
                  Sub-Club Admin List
                </h5>
                {this.state.subClubAdmins.map((sca) => (
                  <div
                    style={{ display: "flex" }}
                    key={sca.subclubName + sca.id}
                  >
                    <h5
                      style={{
                        fontFamily: "Poppins",
                        color: "#F43E3E",
                        fontSize: 25,
                        fontWeight: "bold",
                        padding: 7,
                      }}
                    >
                      {sca.subclubName}
                    </h5>
                    <h5
                      style={{
                        fontFamily: "Poppins",
                        fontSize: 25,
                        fontWeight: "bold",
                        padding: 7,
                      }}
                    >
                      {"@" + sca.username}
                    </h5>
                    <h5
                      style={styles.defaultRedButton}
                      onClick={() => this.banUser(sca.id, -1)}
                    >
                      Dismiss
                    </h5>
                    <h5
                      style={{
                        ...styles.defaultRedButton,
                        width: "auto",
                        marginLeft: 20,
                        backgroundColor: "red",
                      }}
                      onClick={() => this.banUser(sca.id, -3)}
                    >
                      Dismiss (This user will never be a sub-club admin)
                    </h5>
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
