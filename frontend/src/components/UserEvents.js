import React, { Component } from "react";
import { connect } from "react-redux";
import { getUserEvents } from "../api/ApiCalls";
import { userDetailsHandler } from "../redux/actions/userDetailsActions";
class UserEvents extends Component {
  state = {
    eventList: [],
  };
  componentDidMount = async () => {
    try {
      await this.props.dispatch(
        userDetailsHandler(this.props.loggedInUsername)
      );
      const req = { userid: this.props.userDetails.userId };
      console.log(req);
      const response = await getUserEvents(req);
      this.setState({ eventList: response.data });
    } catch (e) {}
  };
  render() {
    return (
      <div width="100%">
        <div
          style={{
            width: "50%",
            marginLeft: "25%",
            textAlign: "center",
            fontFamily: "Poppins",
            fontSize: 30,
            fontWeight: "bold",
            color: "#F43E3E",
          }}
        >
          Event List
        </div>
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
                fontSize: 25,
                fontWeight: "bold",
                color: "#F43E3E",
                marginLeft: 10,
                marginTop: 10,
                wordBreak: "break-word",
              }}
            >
              {o.title}
            </div>
            <div
              style={{
                fontFamily: "Poppins",
                fontSize: 16,
                fontWeight: "bold",
                color: "black",
                marginLeft: 10,
                wordBreak: "break-word",
              }}
            >
              {o.content}
            </div>
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    userDetails: store.userDetailsReducer,
    loggedInUsername: store.authReducer.username,
    loggedInID: store.authReducer.id,
  };
};

export default connect(mapStateToProps)(UserEvents);
