import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  getNameOfTheSubClub,
  getNameOfTheClub,
  getUserWithMode,
} from "../../api/ApiCalls";
export default class MemberListPage extends Component {
  state = {
    memberList: [],
    clubName: undefined,
    subClubName: undefined,
  };
  componentDidMount = async () => {
    try {
      let clubId = this.props.location.values.clubId;
      let subClubId = this.props.location.values.subClubId;
      if (subClubId === null || subClubId === undefined) {
        //CLUB MEMBER LIST
        const response1 = await getNameOfTheClub(clubId);
        this.setState({ clubName: response1.data.nameOfClub });
        const response2 = await getUserWithMode(1, clubId);
        this.setState({ memberList: response2.data });
      } else {
        //SUBCLUB MEMBER LIST
        const response1 = await getNameOfTheClub(clubId);
        const response2 = await getNameOfTheSubClub(subClubId);
        this.setState({
          clubName: response1.data.nameOfClub,
          subClubName: response2.data.nameOfSubClub,
        });
        const response3 = await getUserWithMode(2, subClubId);
        this.setState({ memberList: response3.data });
      }
    } catch (e) {
      console.log(e);
    }
  };
  render() {
    let titleStyle = {
      fontFamily: "Poppins",
      color: "#F43E3E",
      fontWeight: "bold",
      fontSize: 45,
    };
    return (
      <div
        style={{
          backgroundColor: "#FAFAFA",
          minHeight: 750,
          paddingLeft: 50,
          paddingTop: 50,
        }}
      >
        {this.state.subClubName === null ||
        this.state.subClubName === undefined ? (
          <h5 style={titleStyle}>{this.state.clubName}</h5>
        ) : (
          <>
            <h5 style={titleStyle}>{this.state.clubName}</h5>
            <h5 style={{ ...titleStyle, fontSize: 28 }}>
              {this.state.subClubName}
            </h5>
          </>
        )}
        <h5 style={{ ...titleStyle, fontSize: 28 }}>Member List</h5>
        <div>
          {this.state.memberList.map((u) => (
            <Link
              key={u.id}
              to={"/user/profile/" + u.username}
              style={{ textDecorationColor: "black" }}
            >
              <div
                style={{
                  fontFamily: "Poppins",
                  fontWeight: "bold",
                  color: "black",
                  cursor: "pointer",
                }}
              >
                {"@" + u.username}
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }
}
