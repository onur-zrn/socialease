import React, { Component } from "react";
import { Col, Container, Row } from "reactstrap";
import AddUpdateClub from "../../components/AddUpdateClub";
import AdminSidebar from "../../components/AdminSidebar";
import QuestionComp from "../../components/QuestionComp";
import { getSpecClubAdmin, updateClub } from "../../api/ApiCalls";
import alertify from "alertifyjs";
import { withRouter } from "react-router";

class UpdateClubPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: undefined,
      subClubList: [],
      questionList: [],
      error: null,
      deletedQuestions: [],
      addedQuestions: [],
      deletedSubclubs: [],
      addedSubClubs: [],
    };
  }

  componentDidMount = () => {
    this.getSpecClub();
  }
  getSpecClub = async () => {
    const url = window.location.href.toString();
    const list = url.split("/update-club/");
    const tempId = list[1];
    const temp = { id: tempId };
    try {
      const response = await getSpecClubAdmin(temp);
      this.setState({
        name: response.data.name,
        subClubList: response.data.subClubList,
        questionList: response.data.questionList,
        error: null,
      });
    } catch (e) {
      alertify.error("Oops! There is a problem.");
      this.props.history.push("/mergen/admin/home");
    }
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
    let tempASC = this.state.addedSubClubs;
    tempASC.push({ name: n, id: tempId, admin: null, isNew:true });
    tempSubClubList.push({ name: n, id: tempId, admin: null, isNew:true });
    this.setState({ subClubList: tempSubClubList, addedSubClubs: tempASC });
  };

  deleteSubClub = (id) => {
    let tempSubClubList = this.state.subClubList;
    tempSubClubList = tempSubClubList.filter((subclub) => subclub.id !== id);
    let tempDSC1 = this.state.subClubList.filter(
      (subclub) => subclub.id === id
    );
    if(tempDSC1[0].isNew){
      console.log("X");
      let tempASC = this.state.addedSubClubs;
      tempASC = tempASC.filter((subclub) => subclub.id !== id);
      this.setState({ subClubList: tempSubClubList, addedSubClubs: tempASC });
    }
    else{
      let tempDSC2 = this.state.deletedSubclubs;
      tempDSC2.push(tempDSC1[0]);
      this.setState({ subClubList: tempSubClubList, deletedSubclubs: tempDSC2 });
    }
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
    let tempAQ = this.state.addedQuestions;
    tempAQ.push({
      question: q,
      subClubName: ws,
      coefficient: c,
      id: tempId,
      isNew:true
    });
    tempQuestionList.push({
      question: q,
      subClubName: ws,
      coefficient: c,
      id: tempId,
      isNew:true
    });
    this.setState({
      questionList: tempQuestionList,
      addedQuestions: tempAQ,
    });
  };

  deleteQuestion = (id) => {
    let tempQuestionList = this.state.questionList;
    tempQuestionList = tempQuestionList.filter((q) => q.id !== id);
    let tempDQ1 = this.state.questionList.filter((Q) => Q.id === id);

    if(tempDQ1[0].isNew){
      console.log("X");
      let tempAQ = this.state.addedQuestions;
      tempAQ = tempAQ.filter((q) => q.id !== id);
      this.setState({ questionList:tempQuestionList, addedQuestions:tempAQ });
    }
    else{
      let tempDQ2 = this.state.deletedQuestions;
      tempDQ2.push(tempDQ1[0]);
      this.setState({
        questionList: tempQuestionList,
        deletedQuestions: tempDQ2,
      });
    }
  };

  onClickUpdate = async (event) => {
    event.preventDefault();
    const url = window.location.href.toString();
    const list = url.split("/update-club/");
    const tempId = list[1];
    const clubInfo = {
      id: tempId,
      name: this.state.name,
      delQ: this.state.deletedQuestions,
      delSC: this.state.deletedSubclubs,
      addQ: this.state.addedQuestions,
      addSC: this.state.addedSubClubs,
    };
    this.setState({ error: null });
    try {
      const response = await updateClub(clubInfo);
      if (response.data.message.includes("Error:")) {
        alertify.error(response.data.message);
      }
      else if(response.data.message.includes("Warning:")){
        alertify.warning(response.data.message);
      }
      else {
        alertify.success(response.data.message);
      }
      this.props.history.push("/mergen/admin/home");
    } catch (e) {
      console.log("X");
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
              title="Edit Club"
              buttonText="Update Club"
              changeName={this.changeName}
              sCList={this.state.subClubList}
              addSC={this.addSubClub}
              delSC={this.deleteSubClub}
              createClub={this.onClickUpdate}
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

export default withRouter(UpdateClubPage);
