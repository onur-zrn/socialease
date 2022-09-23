import React, { Component } from "react";
import { connect } from "react-redux";
import { Col, Container, Row } from "reactstrap";
import { deleteClub, getClubsAdmin } from "../../api/ApiCalls";
import AdminSidebar from "../../components/AdminSidebar";
import ClubCard from "../../components/ClubCard";
import alertify from "alertifyjs";
import { Link } from "react-router-dom";

class AdminHomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentClub: undefined,
      clubList: [],
      error: null,
    };
  }
  componentDidMount = () => {
    this.getClubs();
  }
  getClubs = async () => {
    try {
      const response = await getClubsAdmin();
      this.setState({ clubList: response.data });
    } catch (errorr) {
      this.setState({ error: errorr.message, clubList: [] });
    }
  };
  selectClub = (club) => {
    this.setState({ currentClub: club });
  };

  deleteAClub = async (clubName) => {
    try {
      let temp = { name: clubName };
      if (this.state.clubList.length === 1) {
        const response = await deleteClub(temp);
        if (response.data.message.includes("Error:")) {
          throw Error;
        }
        alertify.success(clubName + " is deleted!");
        this.setState({ clubList: [], currentClub: undefined });
      } else {
        const response = await deleteClub(temp);
        if (response.data.message.includes("Error:")) {
          throw Error;
        }
        alertify.success(clubName + " is deleted!");
        this.setState({ currentClub: undefined });
        await this.getClubs();
      }
    } catch (e) {
      alertify.error(clubName + " cannot be deleted!");
    }
  };
  render() {
    let subClubListComp = (
      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h5
            style={{
              fontFamily: "Poppins",
              fontWeight: "bold",
              color: "#F43E3E",
              marginTop: 20,
            }}
          >
            Please choose a club
          </h5>
        </div>
      </div>
    );
    if (this.state.clubList.length === 0) {
      subClubListComp = (
        <div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h5
              style={{
                fontFamily: "Poppins",
                fontWeight: "bold",
                color: "#F43E3E",
                marginTop: 20,
              }}
            >
              There is no club!
            </h5>
          </div>
        </div>
      );
    }
    if (this.state.currentClub) {
      subClubListComp = (
        <div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h4
              style={{
                fontFamily: "Poppins",
                fontWeight: "bold",
                color: "#F43E3E",
                marginTop: 20,
              }}
            >
              {this.state.currentClub.name}
            </h4>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div
              style={{
                fontFamily: "Poppins",
                color: "#F43E3E",
                textDecoration: "underline",
                cursor: "pointer",
              }}
              onClick={() => this.deleteAClub(this.state.currentClub.name)}
            >
              Delete Club
            </div>
            <div
              style={{
                fontFamily: "Poppins",
                color: "#F43E3E",
                marginLeft: 5,
                textDecoration: "underline",
              }}
            >
              <Link
                style={{ color: "#F43E3E" }}
                to={`/mergen/admin/update-club/${this.state.currentClub.id}`}
              >
                Edit Club
              </Link>
            </div>
          </div>
          {this.state.currentClub.subClubList.map((subclub) => (
            <ClubCard
              key={subclub.id}
              active={false}
              type="subclub"
              name={subclub.name}
            />
          ))}
        </div>
      );
    }
    return (
      <div style={{ backgroundColor: "#FAFAFA", minHeight: 750 }}>
        <Container fluid={true}>
        <Row>
          <Col xs="3">
            <AdminSidebar />
          </Col>
          <Col xs="6">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <h1
                style={{
                  fontFamily: "Poppins",
                  fontWeight: "bold",
                  color: "#F43E3E",
                }}
              >
                Club List
              </h1>
            </div>
            {this.state.clubList.map((club) => (
              <ClubCard
                key={club.id}
                active={
                  this.state.currentClub &&
                  club.id === this.state.currentClub.id
                }
                name={club.name}
                onClickFunc={() => this.selectClub(club)}
              />
            ))}
          </Col>
          <Col xs="3">{subClubListComp}</Col>
        </Row>
        </Container>
      </div>
    );
  }
}

export default connect()(AdminHomePage);
