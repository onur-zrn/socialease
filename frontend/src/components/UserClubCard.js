import React, { Component } from "react";
import {styles} from '../assets/styles/clubCardStyles';

class UserClubCard extends Component {
  render() {
    let buttonStyle=styles.userClubCard;
    if(this.props.isActive) {
        buttonStyle={...buttonStyle, fontWeight:"bold"}
    }
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={buttonStyle}
          onClick={this.props.openClubFunc}
        >
          {this.props.name}
        </div>
      </div>
    );
  }
}

export default UserClubCard;
