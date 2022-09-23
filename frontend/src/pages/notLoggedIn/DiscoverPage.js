import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import {styles} from '../../assets/styles/discoverPageStyles';
import { getClubs } from "../../api/ApiCalls";

export default class DiscoverPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentClub: undefined,
      clubList: [],
      error: null,
    };
    this.getClubs();
  }
  getClubs = async () => {
    try {
      const response = await getClubs();
      this.setState({ clubList: response.data });
    } catch (errorr) {
      this.setState({
        error: errorr.message,
        clubList: [],
        currentClub: undefined,
      });
    }
  };
  selectClub = (club) => {
    this.setState({ currentClub: club });
  };
  render() {
    let subclubs = <div></div>;
    if (this.state.currentClub) {
      subclubs = (
        <div>
          <h1
            style={styles.currentClubText}
          >
            {this.state.currentClub.name}
          </h1>
          <div style={styles.subClubTable}>
              {this.state.currentClub.subClubList.map((subclub)=>(
                  <div key={subclub.id} style={styles.subClubCard}>
                      {subclub.name}
                  </div>
              ))}
          </div>
        </div>
      );
    }
    return (
      <div style={{ backgroundColor: "#FAFAFA", minHeight: 750 }}>
        <Container fluid={true}>
        <Row>
          <Col xs="3">
            {this.state.clubList.map((club) => (
              <div
                style={{ display: "flex", justifyContent: "center" }}
                key={club.id}
              >
                <div
                  style={
                    this.state.currentClub &&
                    club.id === this.state.currentClub.id
                      ? styles.clubTextBold
                      : styles.clubText
                  }
                  onClick={() => this.selectClub(club)}
                >
                  {club.name}
                </div>
              </div>
            ))}
          </Col>
          <Col xs="9">{subclubs}</Col>
        </Row>
        </Container>
      </div>
    );
  }
}
