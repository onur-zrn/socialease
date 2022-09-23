import React, { Component } from "react";
import { styles as HPStyles } from "../assets/styles/homePageStyles";
import { styles as CCStyles } from "../assets/styles/clubCardStyles";
import {
  createPost,
  deleteComment,
  deletePost,
  getPost,
  getSubClubPosts,
  likePost,
  makeComment,
} from "../api/ApiCalls";
import { Col } from "reactstrap";
import defaultPP from "../assets/images/default_profile_photo.png";
import white from "../assets/images/white.png";
import likeEmpty from "../assets/images/like.png";
import like from "../assets/images/like2.png";
import comment from "../assets/images/comment.png";
import { styles as buttonStyles } from "../assets/styles/common/buttonStyles";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class PostsWithInfo extends Component {
  state = {
    currentSubClub: null,
    currentSCID: null,
    posts: [],
    comments: [],
    commentText: "",
    openPost: false,
    postText: "",
    postImage: null,
  };
  selectSubClub = async (sc) => {
    this.setState({
      currentSubClub: sc.subClubName,
      openPost: false,
      currentSCID: sc.subClubid,
    });
    try {
      const response = await getSubClubPosts(sc.subClubid);
      let deneme = response.data;
      deneme = deneme.map((d) => {
        const d2 = {
          ...d,
          isCommentsOpen: false,
        };
        return d2;
      });
      deneme=deneme.reverse();
      this.setState({ posts: deneme });
    } catch (e) {
      console.log(e);
    }
  };
  deletePost = async (p) => {
    const req = { postid: p.postid };
    try {
      const response = await deletePost(req);
      if (!response.data.message.includes("Error:")) {
        let tempPosts = this.state.posts.filter((po) => po.postid !== p.postid);
        this.setState({ posts: tempPosts });
      }
    } catch (e) {
      console.log(e);
    }
  };
  handleChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };
  deleteComment = async (c) => {
    const req = { cid: c.commentid };
    try {
      const response = await deleteComment(req);
      if (!response.data.message.includes("Error:")) {
        let tempComs = this.state.comments.filter(
          (coo) => coo.commentid !== c.commentid
        );
        this.setState({ comments: tempComs });
      }
    } catch (e) {
      console.log(e);
    }
  };
  sendComment = async (userId, postId, p) => {
    const str = new Date();
    const req = {
      content: this.state.commentText,
      userid: userId,
      postid: postId,
      timestamp: str.toString(),
    };
    try {
      console.log(req);
      const response = await makeComment(req);
      console.log(response);
      this.closeComment(p);
    } catch (e) {
      console.log(e);
    }
  };
  closeComment = (p) => {
    const list = this.state.posts.map((x) => {
      if (x.postid === p.postid) {
        const x2 = {
          ...x,
          isCommentsOpen: false,
        };
        return x2;
      }
      return x;
    });
    this.setState({ posts: list, comments: [], commentText: "" });
  };
  openComment = async (p) => {
    if (p.isCommentsOpen) {
      this.closeComment(p);
    } else {
      try {
        const response = await getPost(p.postid);
        let comments = response.data.commentList;
        console.log(comments);
        if (comments !== null) {
          comments=comments.reverse();
          this.setState({ comments: comments });
        }
        const list = this.state.posts.map((x) => {
          if (x.postid === p.postid) {
            const x2 = {
              ...x,
              isCommentsOpen: true,
            };
            return x2;
          } else {
            const x2 = {
              ...x,
              isCommentsOpen: false,
            };
            return x2;
          }
        });
        this.setState({ posts: list });
      } catch (e) {
        console.log(e);
      }
    }
  };
  likePost = async (p) => {
    const req = { postid: p.postid };
    try {
      const response = await likePost(req);
      if (!response.data.message.includes("Error:")) {
        if (p.isLikedByUser) {
          let tempPosts = this.state.posts.map((post) => {
            if (post.postid === p.postid) {
              const tempPost = {
                ...post,
                isLikedByUser: false,
                likeCount: post.likeCount - 1,
              };
              return tempPost;
            }
            return post;
          });
          this.setState({ posts: tempPosts });
        } else {
          let tempPosts = this.state.posts.map((post) => {
            if (post.postid === p.postid) {
              const tempPost = {
                ...post,
                isLikedByUser: true,
                likeCount: post.likeCount + 1,
              };
              return tempPost;
            }
            return post;
          });

          this.setState({ posts: tempPosts });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  uploadImage = (event) => {
    if (event.target.files.length >= 1) {
      const file = event.target.files[0];
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        this.setState({ postImage: fileReader.result });
      };
      fileReader.readAsDataURL(file);
    }
  };
  sendPost = async () => {
    const str = new Date();
    const req = {
      userid: this.props.userDetails.userId,
      subclubid: this.state.currentSCID,
      content: this.state.postText,
      image: this.state.postImage,
      timestamp: str.toString(),
    };
    try {
      await createPost(req);
      this.setState({
        openPost: false,
        postText: "",
        postImage: null,
      });
      const response = await getSubClubPosts(this.state.currentSCID);
      let deneme = response.data;
      deneme = deneme.map((d) => {
        const d2 = {
          ...d,
          isCommentsOpen: false,
        };
        return d2;
      });
      deneme=deneme.reverse();
      console.log(deneme);
      this.setState({ posts: deneme });
    } catch (e) {
      this.setState({
        openPost: false,
        postText: "",
        postImage: null,
      });
      console.log(e);
    }
  };
  render() {
    const inactive = { ...CCStyles.inactiveCard2, width: "100%" };
    const active = { ...CCStyles.activeCard2, width: "100%" };
    return (
      <>
        <Col xs="3">
          <div style={{ marginTop: 20 }}>
            <h5 style={HPStyles.clubName}>{this.props.currentClub}</h5>
            <Link
              to={{
                pathname: "/member-list",
                values: { clubId: this.props.currentClubIDForMemberList, subClubId:this.state.currentSCID },
              }}
            >
              <h5 style={HPStyles.link}>Member List</h5>
            </Link>
            <Link
              to={{
                pathname: "/club-rate-page",
                values: { clubId: this.props.currentClubIDForMemberList },
              }}
            >
            <h5 style={HPStyles.link}>Rating/Comments</h5>
            </Link>
          </div>
          <div>
            {this.props.userDetails.subclubs
              .filter((s) => s.clubId === this.props.clubId)
              .map((sc) => (
                <div
                  key={sc.subClubName}
                  style={
                    this.state.currentSubClub === sc.subClubName
                      ? active
                      : inactive
                  }
                  onClick={() => this.selectSubClub(sc)}
                >
                  {sc.subClubName}
                </div>
              ))}
          </div>
        </Col>
        <Col xs="6">
          {this.state.openPost && this.state.currentSubClub !== null ? (
            <div style={HPStyles.postDiv}>
              <div style={{ fontFamily: "Poppins" }}>
                {"You will post to " + this.state.currentSubClub}
              </div>
              <form>
                <textarea
                  className={"form-control"}
                  value={this.state.postText}
                  id="postText"
                  name="postText"
                  style={{
                    resize: "none",
                    width: "%65",
                    marginRight: "5%",
                  }}
                  maxLength="250"
                  onChange={(e) => this.handleChange(e)}
                />
                <img
                  alt={"post"}
                  src={this.state.postImage || white}
                  width="300"
                  style={{
                    marginLeft: "15%",
                    marginRight: "15%",
                    width: "70%",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 10,
                    marginBottom: 10,
                    fontFamily: "Poppins",
                  }}
                >
                  <input type="file" onChange={(e) => this.uploadImage(e)} />
                  <div
                    style={{
                      ...buttonStyles.defaultRedButton,
                      width: "25%",
                      marginRight: "5%",
                      cursor: "pointer",
                      backgroundColor: "blue",
                    }}
                    onClick={() => this.sendPost()}
                  >
                    Post
                  </div>
                  <div
                    style={{
                      ...buttonStyles.defaultRedButton,
                      width: "25%",
                      marginRight: "5%",
                      cursor: "pointer",
                      backgroundColor: "red",
                    }}
                    onClick={() => {
                      this.setState({
                        openPost: false,
                        postText: "",
                        postImage: null,
                      });
                    }}
                  >
                    Cancel
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <div
              style={{
                ...HPStyles.postDiv,
                width: "30%",
                marginLeft: "35%",
                marginRight: "35%",
                textAlign: "center",
                fontFamily: "Poppins",
                paddingTop: 0,
                paddingLeft: 0,
                backgroundColor: "#F43E3E",
                color: "white",
              }}
              onClick={() => {
                this.setState({ openPost: true });
              }}
            >
              Post Something
            </div>
          )}

          {this.state.posts.map((p) => (
            <div key={p.postid} style={HPStyles.postDiv}>
              <div style={{ display: "flex" }}>
                {p.userImage === null || p.userImage === undefined ? (
                  <img
                    alt={p.username}
                    src={defaultPP}
                    className="rounded-circle shadow"
                    width="60"
                    height="60"
                    style={{ marginRight: 10 }}
                  />
                ) : (
                  <img
                    alt={p.username}
                    src={p.userImage}
                    className="rounded-circle shadow"
                    width="60"
                    height="60"
                    style={{ marginRight: 10 }}
                  />
                )}

                <div>
                  <div style={{ display: "flex" }}>
                    <h5 style={HPStyles.displayNameStyle}>{p.displayName}</h5>
                    <Link
                      to={"/user/profile/" + p.username}
                      style={{ textDecoration: "none" }}
                    >
                      <h5 style={HPStyles.usernameStyle}>{"@" + p.username}</h5>
                    </Link>
                  </div>
                  <h5 style={HPStyles.timeStampStyle}>
                    {p.timestamp === null ? "time" : p.timestamp}
                  </h5>
                </div>
              </div>
              <div style={HPStyles.contentDiv}>{p.content}</div>
              {p.image === null || p.image === undefined ? (
                <></>
              ) : (
                <img
                  alt={"post"}
                  src={p.image}
                  width="300"
                  style={{
                    marginLeft: "15%",
                    marginRight: "15%",
                    width: "70%",
                  }}
                />
              )}
              <div style={{ ...HPStyles.threeDot, color: "gray", margin: 5 }}>
                {p.likeCount + " Likes"}
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 10,
                  marginBottom: 10,
                  marginLeft: 5,
                }}
              >
                <div
                  style={{ display: "flex", cursor: "pointer" }}
                  onClick={() => this.likePost(p)}
                >
                  <img
                    alt={p.postid + "like"}
                    src={p.isLikedByUser ? like : likeEmpty}
                    width="30"
                    height="30"
                    style={{ marginRight: 10 }}
                  />
                  <div style={HPStyles.threeDot}>Like</div>
                </div>
                <div
                  style={{ display: "flex", cursor: "pointer" }}
                  onClick={() => this.openComment(p)}
                >
                  <img
                    alt={p.postid + "like"}
                    src={comment}
                    width="30"
                    height="30"
                    style={{ marginRight: 10 }}
                  />
                  <div style={HPStyles.threeDot}>Comment</div>
                </div>
                {this.props.userDetails.username === p.username ? (
                  <div
                    style={{
                      ...HPStyles.threeDot,
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                    onClick={() => this.deletePost(p)}
                  >
                    Delete Post
                  </div>
                ) : (
                  <></>
                )}
              </div>
              {p.isCommentsOpen ? (
                <div>
                  <form
                    style={{
                      width: "90%",
                      height: 100,
                      display: "flex",
                      marginLeft: "5%",
                      marginRight: "5%",
                      marginBottom: 10,
                    }}
                  >
                    <textarea
                      className={"form-control"}
                      value={this.state.commentText}
                      id="commmentText"
                      name="commentText"
                      style={{
                        resize: "none",
                        width: "%65",
                        marginRight: "5%",
                      }}
                      maxLength="100"
                      onChange={(e) => this.handleChange(e)}
                    />
                    <div
                      style={{
                        ...buttonStyles.defaultRedButton,
                        width: "30%",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        this.sendComment(this.props.loggedIn.id, p.postid, p)
                      }
                    >
                      Send
                    </div>
                  </form>
                  {this.state.comments.map((com) => (
                    <div
                      key={com.commentid}
                      style={{ marginTop: 10, marginBottom: 10 }}
                    >
                      <div style={{ display: "flex" }}>
                        {com.image === null || com.image === undefined ? (
                          <img
                            alt={com.username}
                            src={defaultPP}
                            className="rounded-circle shadow"
                            width="30"
                            height="30"
                            style={{ marginRight: 10 }}
                          />
                        ) : (
                          <img
                            alt={com.username}
                            src={com.image}
                            className="rounded-circle shadow"
                            width="30"
                            height="30"
                            style={{ marginRight: 10 }}
                          />
                        )}

                        <div style={{ display: "flex" }}>
                          <Link
                            to={"/user/profile/" + com.username}
                            style={{ textDecoration: "none" }}
                          >
                            <h5 style={{ ...HPStyles.usernameStyle }}>
                              {"@" + com.username}
                            </h5>
                          </Link>
                          <h5
                            style={{
                              ...HPStyles.usernameStyle,
                              marginLeft: 5,
                              color: "gray",
                            }}
                          >
                            {com.timeStamp === null ? "time" : com.timeStamp}
                          </h5>
                          {this.props.userDetails.username === com.username ? (
                            <h5
                              style={{
                                ...HPStyles.usernameStyle,
                                marginLeft: 5,
                                color: "red",
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                              onClick={() => this.deleteComment(com)}
                            >
                              Delete
                            </h5>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                      <div style={HPStyles.contentDiv}>{com.content}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <></>
              )}
            </div>
          ))}
        </Col>
      </>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    loggedIn: store.authReducer,
  };
};

export default connect(mapStateToProps)(PostsWithInfo);
