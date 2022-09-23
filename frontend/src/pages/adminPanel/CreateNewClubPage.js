import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import AddUpdateClub from "../../components/AddUpdateClub";
import AdminSidebar from "../../components/AdminSidebar";
import QuestionComp from "../../components/QuestionComp";
import {sendClub} from '../../api/ApiCalls';
import alertify from 'alertifyjs';

export default class CreateNewClubPage extends Component {
  state = {
    name: undefined,
    subClubList: [],
    questionList: [],
    error:null
  };

  changeName = (n) => {
    this.setState({ name: n });
  };
  addSubClub = (n) => {
    let tempSubClubList = this.state.subClubList;
    let tempId = this.state.subClubList.length;
    if (tempId !== 0) {
      this.state.subClubList.map((subclub) => {
        if (subclub.id > tempId) {
          tempId = subclub.id;
        }
      });
      tempId = tempId + 1;
    }
    tempSubClubList.push({ name: n, id: tempId, admin:null });
    this.setState({ subClubList: tempSubClubList });
  };

  deleteSubClub = (id) => {
    let tempSubClubList = this.state.subClubList;
    tempSubClubList = tempSubClubList.filter((subclub) => subclub.id !== id);
    this.setState({ subClubList: tempSubClubList });
  };

  addQuestion = (q, ws, c) => {
    let tempQuestionList = this.state.questionList;
    let tempId = this.state.questionList.length;
    if (tempId !== 0) {
      this.state.questionList.map((q) => {
        if (q.id > tempId) {
          tempId = q.id;
        }
      });
      tempId = tempId + 1;
    }
    tempQuestionList.push({
      question: q,
      subClubName: ws,
      coefficient: c,
      id: tempId,
    });
    this.setState({
      questionList: tempQuestionList,
    });
  };

  deleteQuestion = (id) => {
    let tempQuestionList = this.state.questionList;
    tempQuestionList = tempQuestionList.filter((q) => q.id !== id);
    this.setState({ questionList: tempQuestionList });
  };

  onClickCreate = async (event) => {
    event.preventDefault();

    const clubInfo = {
      name: this.state.name,
      subClubList: this.state.subClubList,
      questionList: this.state.questionList
    };
    this.setState({ error: null });
    try {
      const response = await sendClub(clubInfo);
      if(response.data.message.includes("Error:")){
        alertify.error(response.data.message);
      }
      else{
        alertify.success(response.data.message);
      }
      this.props.history.push("/mergen/admin/home");
    }catch (e) {
        alertify.error("Error: Something is wrong!");
        this.props.history.push("/mergen/admin/home");
    }

  };
  render() {
    return (
      <div style={{ backgroundColor: "#FAFAFA", minHeight: 750 }}>
        <Container fluid={true}>
        <Row>
          <Col xs="3">
            <AdminSidebar />
          </Col>
          <Col xs="3">
            <AddUpdateClub
              title="Create New Club"
              buttonText="Create Club"
              nameVar={this.state.name}
              changeName={this.changeName}
              sCList={this.state.subClubList}
              addSC={this.addSubClub}
              delSC={this.deleteSubClub}
              createClub={this.onClickCreate}
            />
          </Col>
          <Col xs="6">
            <QuestionComp
              qList={this.state.questionList}
              addQ={this.addQuestion}
              delQ={this.deleteQuestion}
              subClubs={this.state.subClubList}
            />
          </Col>
        </Row>
        </Container>
      </div>
    );
  }
}
