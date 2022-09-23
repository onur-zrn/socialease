import React, { Component } from "react";
import { connect } from "react-redux";
import alertify from "alertifyjs";
import { getNewClubs, sendAnswersNewSurveys } from "../../api/ApiCalls";
import { styles as buttonStyles } from "../../assets/styles/common/buttonStyles";
import { styles as surveyStyles } from "../../assets/styles/surveyStyles";
import { userDetailsHandler } from "../../redux/actions/userDetailsActions";

class NewClubSurveyPage extends Component {
  state = {
    clubList: [],
  };

  componentDidMount = async () => {
    try {
      const response = await getNewClubs();
      this.setState({ clubList: response.data });
      console.log(response);
    } catch (e) {
      this.setState({ clubList: [] });
      alertify.error("Ops!There is a problem!");
    }
  };

  onValueChange = (event, cId, qId) => {
    const tempSelectedClubs = this.state.clubList.map((c) => {
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
    console.log(tempSelectedClubs);
    this.setState({ clubList: tempSelectedClubs });
  };

  sendAnswers = async (event) => {
    event.preventDefault();
    let request = this.state.clubList.map((c) => {
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
      const response = await sendAnswersNewSurveys(request2);
      if (response.data.message.includes("Warning:")) {
        alertify.warning(response.data.message);
      } else {
        alertify.success(response.data.message);
        await this.props.dispatch(userDetailsHandler(this.props.loggedInUsername));
        this.props.history.push("/home");
      }
    } catch (e) {
      alertify.error("Error: Something is wrong, please try again!");
    }
  };

  render() {
    return (
      <div
        style={{
          backgroundColor: "#FAFAFA",
          minHeight: 750,
        }}
      >
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
          {this.state.clubList.map((c) => (
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
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    userid: store.userDetailsReducer.userId,
    loggedInUsername: store.authReducer.username
  };
};

export default connect(mapStateToProps)(NewClubSurveyPage);
