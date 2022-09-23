import React, { Component } from "react";
import { styles as HPStyles } from "../assets/styles/homePageStyles";
import {
  deleteComment,
  deletePost,
  getOwnPosts,
  getPost,
  likePost,
  makeComment,
  getLikedPosts,
  getPostsToHomePage,
} from "../api/ApiCalls";
import defaultPP from "../assets/images/default_profile_photo.png";
import likeEmpty from "../assets/images/like.png";
import like from "../assets/images/like2.png";
import comment from "../assets/images/comment.png";
import { styles as buttonStyles } from "../assets/styles/common/buttonStyles";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import alertify from "alertifyjs";
import { Col } from "reactstrap";

class PostsForHomePage extends Component {
  state = {
    currentSection: null,
    posts: [],
    comments: [],
    commentText: "",
  };

  componentDidMount = () => {
      this.getPosts();
  }

  getPosts = async () => {
    try{
        const response = await getPostsToHomePage();
        this.setState({posts:response.data});
        console.log(response.data);
    }catch(e){
        console.log(e);
        alertify.error("Ops! There is a problem!");
        
    }
  }

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
      const response = await makeComment(req);
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
          comments.reverse();
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

  render() {
    return (
        <Col xs="9">
      <div style={{width:"%70",marginLeft:"%15", marginRight:"15%", marginTop:40}}>
        {this.state.posts.map((p) => (
          <div key={p.postid} style={HPStyles.postDiv}>
            <div style={{ display: "flex" }}>
              {
                (p.userImage===null || p.userImage===undefined)?
                <img
                alt={p.username}
                src={defaultPP}
                className="rounded-circle shadow"
                width="60"
                height="60"
                style={{ marginRight: 10 }}
              />:
              <img
                alt={p.username}
                src={p.userImage}
                className="rounded-circle shadow"
                width="60"
                height="60"
                style={{ marginRight: 10 }}
              />
              }
              
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
            {p.image === null || p.image===undefined? (
              <></>
            ) : (
              <img
                  alt={"post"}
                  src={p.image}
                  width="300"
                  style={{marginLeft:"15%", marginRight:"15%", width:"70%"}}
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
                    onClick={() => this.sendComment(this.props.loggedIn.id, p.postid, p)}
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
                      {(com.image===null || com.image===undefined)?
                      <img
                      alt={com.username}
                      src={defaultPP}
                      className="rounded-circle shadow"
                      width="30"
                      height="30"
                      style={{ marginRight: 10 }}
                    />:
                    <img
                      alt={com.username}
                      src={com.image}
                      className="rounded-circle shadow"
                      width="30"
                      height="30"
                      style={{ marginRight: 10 }}
                    />
                    }
                      
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
      </div>
      </Col>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    userDetails: store.userDetailsReducer,
    loggedIn:store.authReducer
  };
};

export default connect(mapStateToProps)(PostsForHomePage);
