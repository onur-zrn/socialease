import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { styles } from "../assets/styles/userPCStyles";
import defaultPP from "../assets/images/default_profile_photo.png";
class UserProfileCard extends Component {
  render() {
    let image=defaultPP;
    if(!(this.props.image===null || this.props.image===undefined)){
      image=this.props.image
    }
    return (
      <div style={styles.cardStyle}>
        <div style={{width:"auto"}}>
        <img
          alt={this.props.username}
          src={image}
          className="rounded-circle shadow"
          width="300"
          height="300"
        />
        </div>
        <div style={{ width: "97%", marginLeft: "3%" }}>
          <h5 style={styles.displayNameStyle}>{this.props.displayName}</h5>
          <h5 style={styles.usernameStyle}>{"@" + this.props.username}</h5>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              width: "100%",
            }}
          >
            <div style={{ ...styles.countStyle, width: "33%" }}>
              {this.props.clubCount + " Clubs"}
            </div>
            <div style={{ backgroundColor: "#F43E3E", width: "1%" }} />
            <div style={{ ...styles.countStyle, width: "32%" }}>
              {this.props.subClubCount + " Sub-clubs"}
            </div>
            <div style={{ backgroundColor: "#F43E3E", width: "1%" }} />
            <div style={{ ...styles.countStyle, width: "33%" }}>
              {this.props.postCount + " Sharings"}
            </div>
          </div>
          <div>
            <h5 style={styles.displayNameStyle}>About Me</h5>
            <div style={styles.biographyStyle}>{this.props.biographi}</div>
            <div style={{ display: "flex" }}>
              {this.props.username === this.props.loggedInUsername ? (
                <Link to="/user/settings">
                  <h5 style={styles.editButtonStyle}>Edit Profile</h5>
                </Link>
              ) : (
                <></>
              )}
              {this.props.username !== this.props.loggedInUsername? (
                <Link to={{pathname:"/user/report-user", uname:{username:this.props.username}}} style={{marginLeft:3}}>
                  <h5 style={styles.editButtonStyle}>Report User</h5>
                </Link>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    loggedInUsername: store.authReducer.username,
  };
};

export default connect(mapStateToProps)(UserProfileCard);
