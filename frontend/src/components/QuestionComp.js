import React, { Component } from "react";
import { styles as questionCompStyles } from "../assets/styles/questionCompStyles";
export default class QuestionComp extends Component {
  state = {
    coefficient: "0",
    tempQuestion: "",
    whichSubclub: "General",
  };
  onChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  onChangeSelect = (event) => {
    this.setState({ whichSubclub: event.target.value, error: null });
  };
  addQuestion = () => {
    this.props.addQ(
      this.state.tempQuestion,
      this.state.whichSubclub,
      this.state.coefficient
    );
    this.setState({
      coefficient: "0",
      whichSubclub: "General",
      tempQuestion: "",
    });
  };

  render() {
    return (
      <div style={{ marginTop: 70 }}>
        <h5
          style={{
            fontFamily: "Poppins",
            fontSize: 26,
            height: 30,
          }}
        >
          Questions
        </h5>
        <div style={questionCompStyles.boxStyle}>
          <div style={{ display: "flex", marginTop: 10 }}>
            <h5 style={questionCompStyles.hFive}>Question:</h5>
            <div className="form-group" style={{ width: "100%" }}>
              <input
                className="form-control form-control-sm"
                style={{ width: "90%", fontFamily: "Poppins" }}
                name="tempQuestion"
                onChange={this.onChange}
                value={this.state.tempQuestion}
              />
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <h5 style={questionCompStyles.hFive}>to:</h5>
            <div className="form-group" style={{ width: "30%" }}>
              <select
                className="form-control"
                style={{ width: "100%" }}
                onChange={this.onChangeSelect}
                value={this.state.whichSubclub}
              >
                <option value="General">General</option>
                {this.props.subClubs.map((subclub) => (
                  <option key={subclub.id} value={subclub.name}>
                    {subclub.name}
                  </option>
                ))}
              </select>
            </div>
            <h5 style={questionCompStyles.hFive}>coefficient:</h5>
            <div className="form-group" style={{ width: "20%" }}>
              <input
                className="form-control"
                style={{ width: "100%", fontFamily: "Poppins" }}
                name="coefficient"
                onChange={this.onChange}
                type="number"
                value={this.state.coefficient}
              />
            </div>
            <button
              style={questionCompStyles.addQuestionButtonStyle}
              onClick={this.addQuestion}
            >
              Add
            </button>
          </div>
          {this.props.qList.map((question) => (
            <div style={{ display: "flex" }} key={question.id}>
              <h5
                style={{
                  fontFamily: "Poppins",
                  fontSize: 16,
                  marginLeft: 8,
                }}
              >
                {question.question +
                  " to " +
                  question.subClubName +
                  " - " +
                  question.coefficient}
              </h5>
              <h5
                style={questionCompStyles.hFiveTwo}
                onClick={() => this.props.delQ(question.id)}
              >
                Delete
              </h5>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
