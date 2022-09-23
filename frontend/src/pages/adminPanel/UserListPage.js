import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import { getClubs, getClubsAdmin, getUserWithModeAdmin } from "../../api/ApiCalls";
import AdminSidebar from "../../components/AdminSidebar";
import { styles } from "../../assets/styles/discoverPageStyles";

export default class UserListPage extends Component {
  state = {
    currentClub: undefined,
    currentSubClub: undefined,
    clubList: [],
    error: null,
    userList: [],
  };
  componentDidMount = () => {
    this.getClubs();
  };
  getClubs = async () => {
    try {
      const response = await getClubsAdmin();
      this.setState({ clubList: response.data });
    } catch (errorr) {
      this.setState({
        error: errorr.message,
        clubList: [],
        currentClub: undefined,
      });
    }
  };
  selectClub = async (club) => {
    this.setState({ currentClub: club, currentSubClub: undefined });
    try{
        const response = await getUserWithModeAdmin(1,club.id);
        this.setState({userList:response.data});
    }catch(e){
        this.setState({userList:[]});
        console.log(e);
    }
  };
  selectSubClub = async (subclub) => {
    this.setState({ currentSubClub: subclub });
    try{
        const response = await getUserWithModeAdmin(2,subclub.id);
        this.setState({userList:response.data});
    }catch(e){
        this.setState({userList:[]});
        console.log(e);
    }
  };
  render() {
    let subclubs = <div></div>;
    if (this.state.currentClub) {
      subclubs = (
        <div>
          <h1 style={styles.currentClubText}>{this.state.currentClub.name}</h1>
          <div style={styles.subClubTable}>
            {this.state.currentClub.subClubList.map((subclub) => (
              <div
                key={subclub.id}
                style={
                  this.state.currentSubClub &&
                  subclub.id === this.state.currentSubClub.id
                    ? { ...styles.subClubCard, border: "4px solid #F43E3E" }
                    : styles.subClubCard
                }
                onClick={() => this.selectSubClub(subclub)}
              >
                {subclub.name}
              </div>
            ))}
          </div>
        </div>
      );
    }
    let userlist = (
      <div
        style={{
          width: "98%",
          marginLeft: "2%",
        }}
      >
        <h5 style={{ ...styles.clubTextBold, color: "black", marginTop:10 }}>
          Please Choose Club/Sub-club
        </h5>
      </div>
    );
    let userListLength = this.state.userList.length;
    if (userListLength > 0) {
      userlist = (
        <div
          style={{
            width: "98%",
            marginLeft: "2%",
          }}
        >
          <h5 style={{ ...styles.clubTextBold, color: "black", marginTop:10 }}>User List</h5>
          {this.state.userList.map((u)=>(
              <div key={u.id} style={{fontFamily:"Poppins", color:"#F43E3E", marginLeft:"2%"}}>{"@"+u.username}</div>
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
              {userlist}
            </Col>
            <Col xs="6">{subclubs}</Col>
          </Row>
        </Container>
      </div>
    );
  }
}
