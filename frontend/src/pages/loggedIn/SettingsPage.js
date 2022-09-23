import React, { Component } from "react";
import { connect } from "react-redux";
import defaultPP from "../../assets/images/default_profile_photo.png";
import { styles as buttonStyles } from "../../assets/styles/common/buttonStyles";
import alertify from "alertifyjs";
import { userDetailsHandler } from "../../redux/actions/userDetailsActions";
import { sendImage, deleteImage, updateUser } from "../../api/ApiCalls";
import { withRouter } from "react-router-dom";
import { userUpdatedSuccess } from "../../redux/actions/authActions";

class SettingsPage extends Component {
  state = {
    isPPBClicked: false,
    imageState: null,
    displayName: "",
    biographi: "",
    username: "",
    password: "",
  };

  componentDidMount = async () => {
    await this.props.dispatch(userDetailsHandler(this.props.loggedInUsername));
    this.setState({
      imageState: this.props.userDetails.image,
      displayName: this.props.userDetails.displayName,
      username: this.props.userDetails.username,
      biographi: this.props.userDetails.biographi,
    });
  };

  openPP = () => {
    this.setState({ isPPBClicked: true });
  };

  closePP = () => {
    this.setState({
      isPPBClicked: false,
      imageState: this.props.userDetails.image,
    });
  };
  deletePP = async () => {
    try {
      const response = await deleteImage();
      if (!response.data.message.includes("Warning:")) {
        await this.props.dispatch(
          userDetailsHandler(this.props.loggedInUsername)
        );
        this.setState({ imageState: this.props.userDetails.image });
        alertify.success("Profile picture is deleted!");
      }
    } catch (e) {
      console.log(e);
    }
  };
  sendImage = async () => {
    if (
      this.state.imageState === null ||
      this.state.imageState === undefined ||
      this.state.imageState === this.props.userDetails.image
    ) {
      alertify.warning("No change!");
      this.setState({
        isPPBClicked: false,
      });
    } else {
      try {
        const req = {
          file: this.state.imageState,
          id: this.props.userDetails.userId,
        };
        const response = await sendImage(req);
        if (response.data.message.includes("Error: ")) {
          alertify.error(response.data.message);
        } else {
          await this.props.dispatch(
            userDetailsHandler(this.props.loggedInUsername)
          );
          this.setState({ imageState: this.props.userDetails.image });
          alertify.success("Profile picture is updated!");
        }
      } catch (e) {
        console.log(e);
      }

      this.setState({
        isPPBClicked: false,
        imageState: this.props.userDetails.image,
      });
    }
  };

  uploadImage = (event) => {
    if (event.target.files.length >= 1) {
      const file = event.target.files[0];
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        this.setState({ imageState: fileReader.result });
      };
      fileReader.readAsDataURL(file);
    }
  };

  onChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  updateUser = async () => {
    const req={
      username:this.state.username,
      displayname:this.state.displayName,
      biographi:this.state.biographi,
      password:this.state.password
    }

    try{
      const response = await updateUser(this.props.loggedInUsername,req);
      if(response.data.message.includes("Success")){
        alertify.success("Profile is updated!");
        let usernameChange=0;
        let passwordChange=0;
        if(this.state.username!==this.props.auuuuth.username){
          usernameChange=1;
        }
        if(this.state.password!==this.props.auuuuth.password){
          if(!(this.state.password==="" || this.state.password===null)){
            passwordChange=1;
          }
        }
        if(usernameChange===1 && passwordChange ===1){
            const aState = {
              id:this.props.auuuuth.id,
              username:this.state.username,
              password:this.state.password,
              isRegistered:this.props.auuuuth.isRegistered,
              isSurveyAnswered:this.props.auuuuth.isSurveyAnswered,
              isLoggedIn:this.props.auuuuth.isLoggedIn
            }
            const uState={
              ...this.props.userDetails,
              username:this.state.username
            }
            this.props.dispatch(userUpdatedSuccess(aState));
        }
        else if(usernameChange===1 && passwordChange ===0){
          const aState = {
            id:this.props.auuuuth.id,
            username:this.state.username,
            password:this.props.auuuuth.password,
            isRegistered:this.props.auuuuth.isRegistered,
            isSurveyAnswered:this.props.auuuuth.isSurveyAnswered,
            isLoggedIn:this.props.auuuuth.isLoggedIn
          }
          const uState={
            ...this.props.userDetails,
            username:this.state.username
          }
          this.props.dispatch(userUpdatedSuccess(aState));
        }
        else if(usernameChange===0 && passwordChange ===1){
          const aState = {
            id:this.props.auuuuth.id,
            username:this.props.auuuuth.username,
            password:this.state.password,
            isRegistered:this.props.auuuuth.isRegistered,
            isSurveyAnswered:this.props.auuuuth.isSurveyAnswered,
            isLoggedIn:this.props.auuuuth.isLoggedIn
          }
          this.props.dispatch(userUpdatedSuccess(aState));
        }
        this.props.history.push("/home");
      }
      else{
        alertify.error("Profile cannot updated!");
        this.props.history.push("/home");
      }
    }catch(e){
      console.log(e);
    }
  }

  render() {
    let customButton = {
      ...buttonStyles.defaultRedButton,
      width: "auto",
      height: "auto",
      padding: 5,
      marginTop: 5,
      cursor: "pointer",
    };
    let ppimage = this.state.imageState;
    let buttons = (
      <>
        <div style={customButton} onClick={() => this.openPP()}>
          Change/Add Profile Photo
        </div>
      </>
    );
    if (this.state.imageState === null || this.state.imageState === undefined) {
      ppimage = defaultPP;
    } else {
      buttons = (
        <>
          <div style={customButton} onClick={() => this.openPP()}>
            Change/Add Profile Photo
          </div>
          <div
            style={{ ...customButton, backgroundColor: "red" }}
            onClick={() => this.deletePP()}
          >
            Delete Photo
          </div>
        </>
      );
    }
    return (
      
      <div
        style={{
          backgroundColor: "#FAFAFA",
          width: "100%",
          minHeight: 750,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          fontFamily: "Poppins",
        }}
      >
        <h1 style={{ color: "#F43E3E", fontWeight: "bold", margin: 20 }}>
          Edit Profile
        </h1>
        <img
          alt={this.props.userDetails.username}
          src={ppimage}
          className="rounded-circle shadow"
          width="300"
          height="300"
        />
        {this.state.isPPBClicked ? (
          <div>
            <input type="file" onChange={(e) => this.uploadImage(e)} />
            <div
              style={{ ...customButton, backgroundColor: "green" }}
              onClick={() => this.sendImage()}
            >
              Save
            </div>
            <div style={customButton} onClick={() => this.closePP()}>
              Cancel
            </div>
          </div>
        ) : (
          buttons
        )}
        <div style={{marginTop:10}}>Username</div>
        <div className="form-group">
          <input
            className="form-control"
            name="username"
            placeholder="Username"
            value={this.state.username}
            onChange={(e) => this.onChange(e)}
            style={{ width: 400 }}
          />
        </div>
        <div style={{marginTop:10}}>Display Name</div>
        <div className="form-group">
          <input
            className="form-control"
            name="displayName"
            placeholder="Display Name"
            value={this.state.displayName}
            onChange={(e) => this.onChange(e)}
            style={{ width: 400 }}
          />
        </div>
        <div style={{marginTop:10}}>Biographi</div>
        <div className="form-group">
          <input
            className="form-control"
            name="biographi"
            placeholder="Biographi"
            value={this.state.biographi}
            onChange={(e) => this.onChange(e)}
            style={{ width: 400 }}
          />
        </div>
        <div style={{marginTop:10}}>Password</div>
        <div className="form-group">
          <input
            className="form-control"
            name="password"
            onChange={(e) => this.onChange(e)}
            placeholder="Password"
            type="password"
            style={{ width: 400 }}
          />
        </div>
        <div style={buttonStyles.defaultRedButton} onClick={()=>this.updateUser()}>Send</div>
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    loggedInUsername: store.authReducer.username,
    userDetails: store.userDetailsReducer,
    auuuuth:store.authReducer
  };
};

export default connect(mapStateToProps)(withRouter(SettingsPage));
