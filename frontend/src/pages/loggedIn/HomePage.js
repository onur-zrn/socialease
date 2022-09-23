import React, { Component } from "react";
import alertify from "alertifyjs";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import { Col, Container, Row } from "reactstrap";
import UserClubCard from "../../components/UserClubCard";
import { Link } from "react-router-dom";
import { userDetailsHandler } from "../../redux/actions/userDetailsActions";
import { getSpecClub } from "../../api/ApiCalls";
import PostsWithInfo from "../../components/PostsWithInfo";
import PostsForHomePage from "../../components/PostsForHomePage";
class HomePage extends Component {
  state = {
    currentClub: null,
    currentClubIDForMemberList: null,
    club: {},
  };
  componentDidMount = async () => {
    try {
      this.setState({
        currentClub: this.props.location.comeFromWhere.val,
        currentClubIDForMemberList: this.props.location.comeFromWhere.val2,
      });
      const req = { id: this.props.location.comeFromWhere.val2 + "" };
      if (req.id !== undefined && req.id !== "undefined") {
        try {
          const response = await getSpecClub(req);
          this.setState({ club: response.data });
        } catch (e) {
          console.log(e);
        }
      }
    } catch (e) {
      this.setState({ currentClub: null, club: {} });
    }
    this.getUserDetails();
  };

  selectClub = async (c, b) => {
    if (b) {
      const req = { id: c.clubId + "" };
      try {
        const response = await getSpecClub(req);
        this.setState({ club: response.data });
      } catch (e) {
        console.log(e);
      }
      this.setState({ currentClub: c.clubName, currentClubIDForMemberList:c.clubId });
    } else {
      this.setState({ currentClub: null, club: null });
    }
  };

  getUserDetails = async () => {
    try {
      await this.props.dispatch(
        userDetailsHandler(this.props.loggedInUsername)
      );
      try {
        if (this.props.userDetails.error.includes("Error:")) {
          alertify.error(this.state.error);
          //this.props.history.push("/404");
        }
      } catch (e) {
        console.log(e);
      }
    } catch (e) {
      alertify.error("Oops! There is a problem.");
      //this.props.history.push("/404");
    }
  };
  render() {
    return (
      <div style={{ backgroundColor: "#FAFAFA", minHeight: 750 }}>
        <Container fluid={true}>
          <Row>
            <Col xs="3">
              <Link
                to={`/user/profile/${this.props.userDetails.username}`}
                style={{ textDecoration: "none" }}
              >
                <UserClubCard name="My Profile" isActive={false} />
              </Link>
              <UserClubCard
                name="Home Page"
                isActive={this.state.currentClub ? false : true}
                openClubFunc={() => this.selectClub(null, false)}
              />
              {this.props.userDetails.clubs.map((club) => (
                <UserClubCard
                  key={club.clubId}
                  name={club.clubName}
                  isActive={
                    this.state.currentClub === club.clubName ? true : false
                  }
                  openClubFunc={() => this.selectClub(club, true)}
                />
              ))}
              <Link
                to={{ pathname: "/user/offer-new-club" }}
                style={{ textDecoration: "none" }}
              >
                <UserClubCard name="Offer New Club" isActive={false} />
              </Link>
            </Col>
            {this.state.currentClub === null ? (
              <PostsForHomePage />
            ) : (
              <PostsWithInfo
                currentClub={this.state.currentClub}
                userDetails={this.props.userDetails}
                clubId={this.state.club.id}
                currentClubIDForMemberList={this.state.currentClubIDForMemberList}
              />
            )}
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

export default withRouter(connect(mapStateToProps)(HomePage));
