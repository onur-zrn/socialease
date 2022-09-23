import React, { Component } from "react";
import { getClubs, sendAnswers } from "../../api/ApiCalls";
import { styles } from "../../assets/styles/clubCardStyles";
import { styles as buttonStyles } from "../../assets/styles/common/buttonStyles";
import { styles as surveyStyles } from "../../assets/styles/surveyStyles";
import alertify from "alertifyjs";
import { connect } from "react-redux";
import { surveyAnswered } from "../../redux/actions/authActions";

class SurveyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clubList: [],
      selectedClubs: [],
      error: null,
      isSelected: false,
    };
    this.getClubs();
  }
  getClubs = async () => {
    try {
      const response = await getClubs();
      this.setState({ clubList: response.data });
    } catch (errorr) {
      this.setState({ error: errorr.message, clubList: [] });
    }
  };
  selectDeselectClub = (club) => {
    let tempSelected = this.state.selectedClubs;
    if (tempSelected.length === 0) {
      tempSelected.push(club);
      this.setState({ selectedClubs: tempSelected });
    } else {
      if (tempSelected.includes(club)) {
        tempSelected = tempSelected.filter((c) => c.id !== club.id);
        this.setState({ selectedClubs: tempSelected });
      } else {
        tempSelected.push(club);
        this.setState({ selectedClubs: tempSelected });
      }
    }
  };

  onValueChange = (event, cId, qId) => {
    const tempSelectedClubs = this.state.selectedClubs.map((c) => {
      if (c.id === cId) {
        const tempQuestionList = c.questionList.map((q) => {
          if (q.id === qId) {
            const updatedQuestion = {
              ...q,
              answer: parseInt(event.target.value),
            };
            return updatedQuestion;
          }
          return q;
        });
        const updatedClub = {
          ...c,
          questionList: tempQuestionList,
        };
        return updatedClub;
      }
      return c;
    });
    this.setState({ selectedClubs: tempSelectedClubs });
  };

  sendAnswers = async (event) => {
    event.preventDefault();
    let request = this.state.selectedClubs.map((c) => {
      const questionList = c.questionList.map((q) => {
        const updatedQ = {
          id: q.id,
          answer: q.answer,
        };
        return updatedQ;
      });
      const updatedC = {
        id: c.id,
        questionList: questionList,
      };
      return updatedC;
    });
    let request2 = {
      userId: this.props.userid,
      surveyAnswer: request,
    };
    try {
      const response = await sendAnswers(request2);
      if (response.data.message.includes("Warning:")) {
        alertify.warning(response.data.message);
      } else {
        alertify.success(response.data.message);
        const authStateForSurvey = {
          id: this.props.userid,
          isLoggedIn: this.props.isLoggedIn,
          isRegistered: this.props.isRegistered,
          isSurveyAnswered: this.props.isSurveyAnswered,
          username: this.props.username,
          password: this.props.password
        };
        this.props.dispatch(surveyAnswered(authStateForSurvey));
        this.props.history.push("/home");
      }
    } catch (e) {
      alertify.error("Error: Something is wrong, please try again!");
      this.props.history.push("/survey");
    }
  };

  openSurveys = () => {
    if (this.state.selectedClubs.length < 3) {
      alertify.error("Please select at least 3 club!");
    } else {
      this.setState({ isSelected: true });
    }
  };
  render() {
    let page = (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <h5
          style={{
            width: "90%",
            fontFamily: "Poppins",
            fontWeight: "bold",
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          Please select the clubs you want to join. You will answer questions
          about the clubs of your choice and their subclubs. After the
          evaluation, you will be added to the clubs you are interested in.
        </h5>
        <div
          style={{
            width: "90%",
            minHeight: 200,
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {this.state.clubList.map((club) => (
            <div
              key={club.id}
              style={
                this.state.selectedClubs.includes(club)
                  ? styles.activeCard2
                  : styles.inactiveCard2
              }
              onClick={() => this.selectDeselectClub(club)}
            >
              {club.name}
            </div>
          ))}
        </div>
        <div
          style={{
            alignSelf: "flex-end",
            marginRight: "9.5%",
            marginBottom: 100,
          }}
        >
          <button
            style={buttonStyles.createClubButtonStyle}
            onClick={this.openSurveys}
          >
            Continue
          </button>
        </div>
      </div>
    );

    if (this.state.isSelected) {
      page = (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <h5
            style={{
              width: "90%",
              fontFamily: "Poppins",
              fontWeight: "bold",
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            Please fill in the questions below according to your interests. So
            you can join the sub-clubs you are interested in and meet people
            with the same interests! (1 means I am not interested, no, never
            etc. 5 means I am interested, yes, always etc. As you go from 1 to
            5, the level of interest increases. Questions that you do not answer
            will be evaluated as 1.)
          </h5>
          {this.state.selectedClubs.map((c) => (
            <div style={surveyStyles.questions} key={c.id}>
              <h5 style={{ fontFamily: "Poppins", fontWeight: "bold" }}>
                {c.name}
              </h5>
              {c.questionList.map((q) => (
                <div key={q.id}>
                  <div style={{ fontFamily: "Poppins" }}>{q.question}</div>
                  <div style={{ fontFamily: "Poppins" }}>
                    1{" "}
                    <input
                      type="radio"
                      value="1"
                      name={"point-" + q.id}
                      onChange={(e) => this.onValueChange(e, c.id, q.id)}
                    />
                    2{" "}
                    <input
                      type="radio"
                      value="2"
                      name={"point-" + q.id}
                      onChange={(e) => this.onValueChange(e, c.id, q.id)}
                    />
                    3{" "}
                    <input
                      type="radio"
                      value="3"
                      name={"point-" + q.id}
                      onChange={(e) => this.onValueChange(e, c.id, q.id)}
                    />
                    4{" "}
                    <input
                      type="radio"
                      value="4"
                      name={"point-" + q.id}
                      onChange={(e) => this.onValueChange(e, c.id, q.id)}
                    />
                    5{" "}
                    <input
                      type="radio"
                      value="5"
                      name={"point-" + q.id}
                      onChange={(e) => this.onValueChange(e, c.id, q.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}

          <div
            style={{
              alignSelf: "flex-end",
              marginRight: "5%",
              marginTop: 30,
              marginBottom: 100,
            }}
          >
            <button
              style={buttonStyles.createClubButtonStyle}
              onClick={(e) => this.sendAnswers(e)}
            >
              Continue
            </button>
          </div>
        </div>
      );
    }
    return (
      <div
        style={{
          backgroundColor: "#FAFAFA",
          minHeight: 750,
        }}
      >
        {page}
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    userid: store.authReducer.id,
    isLoggedIn: store.authReducer.isLoggedIn,
    isRegistered: store.authReducer.isRegistered,
    isSurveyAnswered: store.authReducer.isSurveyAnswered,
    username: store.authReducer.username,
    password: store.authReducer.password,
  };
};

export default connect(mapStateToProps)(SurveyPage);
