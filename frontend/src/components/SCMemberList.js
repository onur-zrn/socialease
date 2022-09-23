import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getNameOfTheSubClub, getUserWithMode } from "../api/ApiCalls";

export default class SCMemberList extends Component {
  state = {
    nameOfTheSubClub: undefined,
    userList: [],
    userCount: 0,
  };
  componentDidMount = () => {
    this.getInitialValues();
  };
  getInitialValues = async () => {
    try {
      const response = await getNameOfTheSubClub(this.props.uDetail.isSCAdmin);
      this.setState({ nameOfTheSubClub: response.data.nameOfSubClub });
      const response2 = await getUserWithMode(2, this.props.uDetail.isSCAdmin);
      this.setState({
        userList: response2.data,
        userCount: response2.data.length,
      });
      console.log(response2);
    } catch (e) {
      console.log(e);
    }
  };
  render() {
    return (
      <div>
        <h5
          style={{
            fontFamily: "Poppins",
            color: "#F43E3E",
            fontSize: 65,
            fontWeight: "bold",
          }}
        >
          {this.state.nameOfTheSubClub}
        </h5>
        <h5
          style={{
            fontFamily: "Poppins",
            color: "#F43E3E",
            fontSize: 18,
          }}
        >
          {this.state.userCount === 1 || this.state.userCount === 0
            ? this.state.userCount + " Member"
            : this.state.userCount + " Members"}
        </h5>
        <div>
          <h5
            style={{
              fontFamily: "Poppins",
              color: "#F43E3E",
              fontSize: 30,
              fontWeight: "bold",
            }}
          >
            User List
          </h5>
          {this.state.userList.map((u) => (
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
