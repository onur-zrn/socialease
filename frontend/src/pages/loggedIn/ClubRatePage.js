import React, { Component } from "react";
import {
  checkMyReview,
  getNameOfTheClub,
  getReviews,
  sendReview,
} from "../../api/ApiCalls";
import { connect } from "react-redux";
import { styles as buttonStyles } from "../../assets/styles/common/buttonStyles";
import alertify from "alertifyjs";

class ClubRatePage extends Component {
  state = {
    reviewList: [],
    clubName: undefined,
    amIsendReview: true,
    CID: undefined,
    rating: 0,
    rate: 1,
    content: "",
  };
  componentDidMount = async () => {
    try {
      let clubId = this.props.location.values.clubId;
      const response1 = await getNameOfTheClub(clubId);
      this.setState({ clubName: response1.data.nameOfClub, CID: clubId });
      const response2 = await getReviews(clubId);
      this.setState({ reviewList: response2.data });
      let totalrate = 0;
      let count = 0;
      response2.data.forEach(function (x) {
        totalrate = totalrate + x.rating;
        count = count + 1;
      });
      totalrate = totalrate / count;
      if(totalrate<=5){
        this.setState({ rating: totalrate });
      }else{
        this.setState({ rating: 0 });
      }
      const response3 = await checkMyReview(this.props.loggedInUsername);
      if (response3.data.message.includes("YOK")) {
        this.setState({ amIsendReview: false });
      }
    } catch (e) {
      console.log(e);
    }
  };

  onValueChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  sendReview = async () => {
    const r = {
      clubid: this.state.CID,
      comment: this.state.content,
      rating: this.state.rate,
      userName: this.props.loggedInUsername,
    };
    try {
      const response = await sendReview(r);
      if (response.data.message.includes("Error:")) {
        alertify.error(response.data.message);
      } else {
        this.setState({ amIsendReview: true });
        const response2 = await getReviews(this.state.CID);
        let totalrate = 0;
        let count = 0;
        response2.data.forEach(function (x) {
          totalrate = totalrate + x.rating;
          count = count + 1;
        });
        totalrate = totalrate / count;
        if(totalrate<=5){
            this.setState({ rating: totalrate });
          }else{
            this.setState({ rating: 0 });
          }
        this.setState({ reviewList: response2.data });
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
    let textStyle = {
      fontFamily: "Poppins",
      color: "#F43E3E",
      fontSize: 19,
    };
    let cardStyle = {
      width: 600,
      minHeight: 80,
      backgroundColor: "#FAFAFA",
      boxShadow: "1px 1px 1px #9E9E9E",
      border: "1px solid #9E9E9E",
      borderRadius: 10,
      wordBreak: "break-word",
      margin:10,
    };
    console.log(this.state.content + "/" + this.state.rate);
    return (
      <div
        style={{
          backgroundColor: "#FAFAFA",
          minHeight: 750,
          paddingLeft: 50,
          paddingTop: 50,
        }}
      >
        <h5 style={titleStyle}>{this.state.clubName + " / Review"}</h5>
        <h5 style={{ ...titleStyle, fontSize: 28 }}>
          {"Rating: " + this.state.rating + "/5"}
        </h5>
        {this.state.amIsendReview ? (
          <div style={{ display: "flex" }}>
            <h5 style={{ ...titleStyle, marginRight: 10, fontSize: 16 }}>
              You have already sent a review!
            </h5>
          </div>
        ) : (
          <div>
            <div style={{ fontFamily: "Poppins" }}>
              1{" "}
              <input
                type="radio"
                value="1"
                name="rate"
                onChange={(e) => this.onValueChange(e)}
              />
              2{" "}
              <input
                type="radio"
                value="2"
                name="rate"
                onChange={(e) => this.onValueChange(e)}
              />
              3{" "}
              <input
                type="radio"
                value="3"
                name="rate"
                onChange={(e) => this.onValueChange(e)}
              />
              4{" "}
              <input
                type="radio"
                value="4"
                name="rate"
                onChange={(e) => this.onValueChange(e)}
              />
              5{" "}
              <input
                type="radio"
                value="5"
                name="rate"
                onChange={(e) => this.onValueChange(e)}
              />
              <textarea
                className={"form-control"}
                value={this.state.content}
                id="content"
                name="content"
                rows="6"
                style={{ resize: "none", width: 600 }}
                maxLength="250"
                placeholder="Write comment (Optional)"
                onChange={(e) => this.onValueChange(e)}
              />
              <div
                style={{
                  ...buttonStyles.defaultRedButton,
                  width: 600,
                  marginTop: 10,
                  marginBottom: 10,
                  cursor: "pointer",
                }}
                onClick={() => this.sendReview()}
              >
                Send Review
              </div>
            </div>
          </div>
        )}
        <div
          style={{
            width: "90%",
            minHeight: 400,
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {this.state.reviewList.map((r) => (
            <div
              key={r.userName}
              style={cardStyle}
            >
              <h5 style={{ ...textStyle, fontWeight: "bold" }}>
                {"@" + r.userName}
              </h5>
              <h5 style={{ ...textStyle, fontWeight: "bold", color: "gray" }}>
                {"Rate: " + r.rating}
              </h5>
              <h5 style={{ ...textStyle, color: "black" }}>{r.comment}</h5>
            </div>
          ))}
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

export default connect(mapStateToProps)(ClubRatePage);
