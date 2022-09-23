import React, { Component } from "react";
import {styles} from '../assets/styles/clubCardStyles';

export default class ClubCard extends Component {
  render() {
    let style1 = styles.defaultInactiveCard;
    let style2 = styles.defaultActiveCard;
    if (this.props.type === "subclub") {
      style1 = styles.subClubCard;
    }
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={this.props.active ? style2 : style1}
          onClick={this.props.onClickFunc}
        >
          {this.props.name}
        </div>
      </div>
    );
  }
}
