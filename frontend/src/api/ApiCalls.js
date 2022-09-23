import axios from 'axios';

//USER CALLS
export const signUp = (body) => {
    return axios.post('/register', body);
}

export const login = (creds) => {
    return axios.post('/auth', {}, {auth:creds});
}

export const confirmAccount = (path) => {
    return axios.get(path);
}

export const getClubs = () => {
    return axios.post('/getclubs');
}

export const getSpecClub = (clubId) => {
    return axios.post('/getspecclub', clubId);
}

export const sendAnswers = (answers) => {
    return axios.post('/surveyanswers', answers);
}

export const getUserDetails = (username) => {
    const u = {username: username}
    return axios.post('/getuserdetails',u);
}

export const sendClubRequest = (req) => {
    return axios.post('/saveclubrequest',req);
}

export const sendAdminRequest = (req) => {
    return axios.post('/saveadminrequest',req);
}

export const getNewClubs = () => {
    return axios.post('/getnewclubs');
}

export const sendAnswersNewSurveys = (answers) => {
    return axios.post('/surveynewclubs', answers);
}

export const getSubClubPosts = (id) => {
    return axios.get('/'+id+'/getposts');
}

export const likePost = (id) => {
    return axios.put("/likepost", id);
}

export const deletePost = (id) => {
    return axios.put("/deletepost",id);
}

export const getPost = (id) => {
    return axios.get("/getpost/"+id);
}

export const deleteComment = (id) => {
    return axios.put("/deletecomment",id);
}

export const makeComment = (req) => {
    return axios.put("/makecomment",req);
}

export const getOwnPosts = (id) => {
    return axios.get("/"+id+"/getuserposts");
}

export const getLikedPosts = () => {
    return axios.get("/getlikedposts");
}

export const sendImage = (f) => {
    return axios.post("/saveuserimage", f);
}

export const deleteImage = () => {
    return axios.post("/deleteuserimage");
}

export const sendReport = (req) => {
    return axios.post("/report",req);
}

export const getReports = () => {
    const r = {reportType:1}
    return axios.post("/viewreport",r);
}

export const evaluateReport = (req) => {
    return axios.post("/evaluatereport",req);
}

export const createPost = (req) => {
    return axios.post("/createpost",req);
}

export const getPostsToHomePage = () => {
    return axios.get("/getpostshomepage");
}

export const getUserWithMode = (mode,id) => {
    return axios.get("/getuserwithmode?mode="+mode+"&id="+id);
}

export const getNameOfTheSubClub = (id) => {
    return axios.get("/getnameofthesubclub?id="+id);
}

export const getNameOfTheClub = (id) => {
    return axios.get("/getnameoftheclub?id="+id);
}

export const getReviews = (id) => {
    return axios.get("/viewreviews?clubid="+id);
}

export const checkMyReview = (u) => {
    return axios.get("/checkmyreview?u="+u);
}

export const sendReview = (r) => {
    return axios.post("/review",r);
}

export const forgotPass = (r) => {
    return axios.post("/forgot",r);
}
export const recoverPass = (t,r) => {
    return axios.post(t,r);
}

export const getSubClubEvents = (req) => {
    return axios.post("/getsubclubevents",req);
}

export const createEventtt = (req) => {
    return axios.post("/createevent",req);
}

export const deleteEvent = (req) => {
    return axios.post("/deleteevent",req);
}

export const getUserEvents = (req)=>{
    return axios.post("/getuserevents",req);
}

export const updateUser = (username,req) => {
    return axios.post(`/updateuser/${username}`, req);
}

//ADMIN CALLS
export const adminLogin = (creds) => {
    return axios.post('/mergen/admin/login', {}, {auth:creds});
}

export const getClubsAdmin = () => {
    return axios.post('/mergen/admin/getclubs');
}

export const getSpecClubAdmin = (clubId) => {
    return axios.post('/mergen/admin/getspecclub', clubId);
}

export const getUserWithModeAdmin = (mode,id) => {
    return axios.get("/mergen/admin/getuserwithmode?mode="+mode+"&id="+id);
}

export const sendClub = (club) => {
    return axios.post('/mergen/admin/saveclub', club);
}

export const deleteClub = (clubName) => {
    return axios.post('/mergen/admin/deleteclub', clubName);
}

export const updateClub = (club) => {
    return axios.put('/mergen/admin/updateclub', club);
}

export const getClubRequests = () => {
    return axios.get('/mergen/admin/getclubrequests');
}

export const deleteClubRequest = (id) => {
    return axios.post("/mergen/admin/deleteclubrequest",id);
}

export const getSubClubAdminRequests = () => {
    return axios.get('/mergen/admin/getadminrequests');
}

export const answerSubClubAdminRequest = (idAndMode) => {
    return axios.post('/mergen/admin/answeradminrequest', idAndMode);
}

export const getSubClubAdminList = () => {
    return axios.get("/mergen/admin/getsubclubadmins");
}

export const banSubClubAdmin = (req) => {
    return axios.post("/mergen/admin/bansubclubadmins",req);
}

export const setAuthorizationHeader = (un,ps,li) => {
    if(li){
        console.log('create');
        const authorizationHeaderValue=`Basic ${btoa(un + ':' + ps)}`;
        axios.defaults.headers['Authorization'] = authorizationHeaderValue;
    }
    else{
        console.log('delete');
        delete axios.defaults.headers['Authorization'];
    } 
}