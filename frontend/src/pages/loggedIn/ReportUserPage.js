import React, { Component } from "react";
import alertify from "alertifyjs";
import { styles as buttonStyles } from "../../assets/styles/common/buttonStyles";
import { connect } from "react-redux";
import { userDetailsHandler } from "../../redux/actions/userDetailsActions";
import { sendReport } from "../../api/ApiCalls";
import { withRouter } from "react-router";

class ReportUserPage extends Component {
  state = {
    reportedUsername: undefined,
    content: "",
    contentError: null,
    subclubs: [],
    subClubId: undefined,
  };

  onValueChange = (event, scId) => {
    this.setState({ subClubId: scId });
  };

  handleChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
    this.setState({ contentError: null });
  };

  sendReport = async () => {
    const req = {
      reported: this.state.reportedUsername,
      reporter: this.props.userDetails.username,
      subClubid: this.state.subClubId,
      reportType: 1,
      explanation: this.state.content,
    };
    try {
      const response = await sendReport(req);
      if (response.data.message.includes("Error:")) {
        if (response.data.message.includes("invalid-explanation")) {
          this.setState({ contentError: "You must write something" });
        }
        else if(response.data.message.includes("This user is not member of")){
            alertify.error("Error: This user is not member of this subclub!");
        }
        else {
          alertify.error("Ops! There is a problem!");
          this.props.history.push("/home");
        }
      } else {
        alertify.success("Report is sent!");
        this.props.history.push("/home");
      }
    } catch (e) {
      console.log(e);
    }
  };
  componentDidMount = async () => {
    try {
      await this.props.dispatch(
        userDetailsHandler(this.props.loggedInUsername)
      );
      this.setState({
        reportedUsername: this.props.location.uname.username,
        subclubs: this.props.userDetails.subclubs,
      });
    } catch (e) {
      alertify.error("Ops! There is a problem!");
      this.props.history.push("/home");
    }
  };
  render() {
    console.log(this.state.subClubId);
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
          Report User
        </h1>
        <div style={{ width: "50%", height: 400 }}>
          <div
            style={{
              fontWeight: "bold",
              color: "red",
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            {"You are reporting the @" + this.state.reportedUsername}
          </div>
          <div>
            <h5 style={{ fontWeight: "bold" }}>
              Which sub-club do you know this user from?
            </h5>
            {this.state.subclubs.map((sc) => (
              <div key={sc.subClubid} style={{ display: "flex" }}>
                <div style={{ minWidth: 60 }}>{sc.subClubName + " "}</div>
                <input
                  type="radio"
                  value={sc.subClubid}
                  name="point"
                  onChange={(e) => this.onValueChange(e, sc.subClubid)}
                />
              </div>
            ))}
          </div>
          <form>
            <div className="form-group">
              <div className="form-group">
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
                  style={{ resize: "none" }}
                  maxLength="250"
                  placeholder="Why are you reporting this user? Please write something."
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
            onClick={() => this.sendReport()}
          >
            Send Report
          </div>
        </div>
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

export default withRouter(connect(mapStateToProps)(ReportUserPage));
