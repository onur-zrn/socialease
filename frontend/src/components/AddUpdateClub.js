import React, { Component } from "react";
import {styles as buttonStyles} from '../assets/styles/common/buttonStyles';

export default class AddUpdateClub extends Component {
  state = {
    tempSubClub: "",
    name: undefined,
    disableButton: false,
    isNameChanged: false
  };
  onChange = (event) => {
    if (this.props.title === "Edit Club") {
      const { name, value } = event.target;
      if (name === "tempSubClub") {
        this.setState({ tempSubClub: value });
      }
      if (name === "name") {
        this.setState({ name: value, isNameChanged: true});
      }
    } else {
      const { name, value } = event.target;
      this.setState({
        [name]: value,
      });
      this.props.changeName(this.state.name);
    }
  };

  addSubClubButton = () => {
    this.props.addSC(this.state.tempSubClub);
    this.setState({ tempSubClub: "" });
  };

  createClubFunc = (e) => {
    this.setState({disableButton:true})
    if(this.state.isNameChanged){
      this.props.changeName(this.state.name);
    }
    setTimeout(()=>{
      this.props.createClub(e);
  }, 1000)
  }

  render() {
    return (
      <div>
        <h2
          style={{
            fontFamily: "Poppins",
            fontWeight: "bold",
            color: "#F43E3E",
            marginBottom: 40,
            height: 60,
          }}
        >
          {this.props.title}
        </h2>
        <div>
          <div className="form-group">
            <input
              className="form-control"
              style={{ width: 300, fontFamily: "Poppins" }}
              placeholder="Club Name"
              name="name"
              onChange={this.onChange}
            />
          </div>
          <h4
            style={{
              fontFamily: "Poppins",
            }}
          >
            Sub-club List
          </h4>
          <div className="form-group">
            <input
              className="form-control"
              style={{ width: 300, fontFamily: "Poppins" }}
              placeholder="Sub-club Name"
              name="tempSubClub"
              onChange={this.onChange}
              value={this.state.tempSubClub}
            />
          </div>
          <div>
            <button
              onClick={this.addSubClubButton}
              style={buttonStyles.addSubClubButtonStyle}
            >
              Add Sub-Club
            </button>
          </div>
          {this.props.sCList.map((subclub) => (
            <div style={{ display: "flex" }} key={subclub.id}>
              <h5
                style={{
                  color: "#F43E3E",
                  fontFamily: "Poppins",
                  fontWeight: "bold",
                  fontSize: 16,
                }}
              >
                {subclub.name}
              </h5>
              <h5
                style={{
                  marginLeft: 20,
                  textDecoration: "underline",
                  color: "#F43E3E",
                  fontFamily: "Poppins",
                  fontSize: 16,
                  cursor: "pointer",
                }}
                onClick={() => this.props.delSC(subclub.id)}
              >
                Delete
              </h5>
            </div>
          ))}
          <div>
            {this.props.title === "Edit Club" ? (
              <button
                disabled={this.state.disableButton}
                style={buttonStyles.createClubButtonStyle}
                onClick={(e)=>this.createClubFunc(e)}
              >
                {this.props.buttonText}
              </button>
            ) : (
              <button
                style={buttonStyles.createClubButtonStyle}
                onClick={this.props.createClub}
              >
                {this.props.buttonText}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
}
