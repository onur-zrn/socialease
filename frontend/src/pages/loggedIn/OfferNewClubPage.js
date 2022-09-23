import React, { Component } from "react";
import { styles as buttonStyles } from "../../assets/styles/common/buttonStyles";
import { sendClubRequest } from "../../api/ApiCalls";
import { connect } from "react-redux";
import alertify from "alertifyjs";

class OfferNewClubPage extends Component {
  state = {
    nameError: null,
    contentError: null,
    clubName: "",
    content: "",
  };
  handleChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
    if (e.target.name === "clubName") {
      this.setState({ nameError: null });
    }
    if (e.target.name === "content") {
      this.setState({ contentError: null });
    }
  };
  sendRequest = async () => {
    const data = {
      userid: this.props.userid,
      name: this.state.clubName,
      content: this.state.content,
    };

    try {
      const response = await sendClubRequest(data);
      if (response.data.message.includes("invalid")) {
        if (
          response.data.message.includes("invalid-name") &&
          response.data.message.includes("invalid-content")
        ) {
          this.setState({
            nameError: "Name cannot be null",
            contentError: "Content cannot be null",
          });
        } else if (response.data.message.includes("invalid-name")) {
          this.setState({
            nameError: "Name cannot be null",
            contentError: null,
          });
        } else if (response.data.message.includes("invalid-content")) {
          this.setState({
            nameError: null,
            contentError: "Content cannot be null",
          });
        }
      } else {
        alertify.success(response.data.message);
        this.setState({ clubName: "", content: "" });
      }
    } catch (e) {
      alertify.error("Ops! There is a problem!");
    }
  };
  render() {
    return (
      <div
        style={{
          backgroundColor: "#FAFAFA",
          minHeight: 750,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          fontFamily: "Poppins",
        }}
      >
        <h1 style={{ color: "#F43E3E", fontWeight: "bold", margin: 20 }}>
          Offer New Club
        </h1>
        <div style={{ width: "50%", height: 400 }}>
          <form>
            <div className="form-group">
              <label style={{ marginTop: 10 }}>Club Name</label>
              <input
                type="text"
                className={
                  this.state.nameError
                    ? "form-control is-invalid"
                    : "form-control"
                }
                id="clubName"
                name="clubName"
                maxLength="25"
                value={this.state.clubName}
                placeholder="Club Name"
                onChange={(e) => this.handleChange(e)}
              />
              <div className="invalid-feedback">{this.state.nameError}</div>
              <div className="form-group">
                <label style={{ marginTop: 10 }}>Description About Club</label>
                <textarea
                  className={
                    this.state.contentError
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  value={this.state.content}
                  id="content"
                  name="content"
                  rows="6"
                  style={{resize:"none"}}
                  maxLength="250"
                  placeholder="Please enter something about this club."
                  onChange={(e) => this.handleChange(e)}
                />
                <div className="invalid-feedback">
                  {this.state.contentError}
                </div>
              </div>
            </div>
          </form>
          <div
            style={{
              ...buttonStyles.defaultRedButton,
              width: "100%",
              cursor: "pointer",
            }}
            onClick={() => this.sendRequest()}
          >
            Send Club Request
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    userid: store.userDetailsReducer.userId,
  };
};

export default connect(mapStateToProps)(OfferNewClubPage);
