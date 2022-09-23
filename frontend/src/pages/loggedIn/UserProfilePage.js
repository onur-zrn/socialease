import React, { Component } from "react";
import { getUserDetails } from "../../api/ApiCalls";
import alertify from "alertifyjs";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { Col, Container, Row } from "reactstrap";
import UserClubCard from "../../components/UserClubCard";
import { Link } from "react-router-dom";
import UserProfileCard from "../../components/UserProfileCard";
import { userDetailsHandler } from "../../redux/actions/userDetailsActions";
import Posts from "../../components/Posts";
import UserEvents from "../../components/UserEvents";
class UserPage extends Component {
  state = {
    currentUsername: undefined,
    userId: undefined,
    username: undefined,
    displayName: undefined,
    email: undefined,
    clubLength: 0,
    subclubLength: 0,
    isSCAdmin: undefined,
    error: "NO",
    biographi:undefined,
    image:undefined,
    postCount:0
  };

  componentDidMount = () => {
    this.getUserDetails();
  };

  getUserDetails = async () => {
    const url = window.location.href.toString();
    const list = url.split("/user/profile/");
    const usernameFromURL = list[1];
    this.setState({ currentUsername: usernameFromURL });
    try {
      await this.props.dispatch(
        userDetailsHandler(this.props.loggedInUsername)
      );
      if (usernameFromURL === this.props.loggedInUsername) {
        this.setState({
          userId: this.props.userDetails.userId,
          username: this.props.userDetails.username,
          displayName: this.props.userDetails.displayName,
          email: this.props.userDetails.email,
          clubLength: this.props.userDetails.clubs.length,
          subclubLength: this.props.userDetails.subclubs.length,
          isSCAdmin: this.props.userDetails.isSCAdmin,
          error: this.props.userDetails.error,
          biographi:this.props.userDetails.biographi,
          image:this.props.userDetails.image,
          postCount:this.props.userDetails.postCount
        });
      } else {
        const response = await getUserDetails(usernameFromURL);
        this.setState({
          userId: response.data.userId,
          username: response.data.username,
          displayName: response.data.displayName,
          email: response.data.email,
          clubLength: response.data.clubs.length,
          subclubLength: response.data.subclubs.length,
          isSCAdmin: response.data.isSCAdmin,
          error: response.data.error,
          biographi:response.data.biographi,
          image:response.data.image,
          postCount:response.data.postCount
        });
      }
      if (this.state.error.includes("Error:")) {
        alertify.error(this.state.error);
      }
    } catch (e) {
      console.log(e);
      alertify.error("Oops! There is a problem.");
      this.props.history.push("/home");
    }
  };
  goMyProfile = (x) => {
    this.props.history.push(x);
    this.getUserDetails();
  };
  render() {
    
    return (
      <div style={{ backgroundColor: "#FAFAFA", minHeight: 750 }}>
        <Container fluid={true}>
          <Row>
            <Col xs="3">
              {this.state.currentUsername === this.props.loggedInUsername ? (
                <UserClubCard name="My Profile" isActive={true} />
              ) : (
                <div
                  onClick={() =>
                    this.goMyProfile(
                      "/user/profile/" + this.props.loggedInUsername
                    )
                  }
                >
                  <UserClubCard name="My Profile" isActive={false} />
                </div>
              )}

              <Link
                to={{ pathname: "/home", comeFromWhere: { val: null } }}
                style={{ textDecoration: "none" }}
              >
                <UserClubCard name="Home Page" isActive={false} />
              </Link>
              {this.props.userDetails.clubs.map((club) => (
                <Link
                  key={club.clubId}
                  to={{
                    pathname: "/home",
                    comeFromWhere: { val: club.clubName, val2: club.clubId },
                  }}
                  style={{ textDecoration: "none" }}
                >
                  <UserClubCard name={club.clubName} />
                </Link>
              ))}
              <Link
                to={{ pathname: "/user/offer-new-club" }}
                style={{ textDecoration: "none" }}
              >
                <UserClubCard name="Offer New Club" isActive={false} />
              </Link>
            </Col>
            <Col xs="6">
              {this.state.currentUsername !== this.props.loggedInUsername ? (
                <div style={{ height: 100 }}></div>
              ) : (
                <div style={{ height: 10 }}></div>
              )}
              <UserProfileCard
                username={this.state.username}
                displayName={this.state.displayName}
                image={this.state.image}
                clubCount={this.state.clubLength}
                subClubCount={this.state.subclubLength}
                isAdmin={this.state.isSCAdmin}
                postCount={this.state.postCount}
                biographi={this.state.biographi}
              />
              {this.state.currentUsername === this.props.loggedInUsername ? (
                <Posts/>
              ) : (
                <></>
              )}
            </Col>
            <Col xs="3">
            {this.state.currentUsername === this.props.loggedInUsername ? (
                <UserEvents/>
              ) : (
                <></>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    loggedInUsername: store.authReducer.username,
    userDetails: store.userDetailsReducer,
  };
};

export default withRouter(connect(mapStateToProps)(UserPage));
