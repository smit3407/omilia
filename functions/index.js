const functions = require('firebase-functions');

const app = require('express')();
//const FBAuth = require('./util/fbAuth');

const cors = require('cors');
app.use(cors());

const { db } = require('./util/admin');
db.settings({ ignoreUndefinedProperties: true })

const {
  getAllPosts,
  createPost,
  deletePost,
  editPost,
} = require('./handlers/posts');
const {
  signup,
  login,
  phoneLogin,
  logout,
  deleteAccount,
  changeEmail,
  changePassword,
  confirmEmail
} = require('./handlers/users');
const { default: EditPost } = require('../client/src/views/EditPost');

// Post routes
app.get('/posts', getAllPosts);
//app.post('/post', FBAuth, createPost);
app.post('/post', createPost);
app.delete('/deletePost/:postID', deletePost);
app.post('/editPost', editPost);

// users routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/phoneLogin', phoneLogin);
app.post('/logout', logout);
app.post('/deleteAccount', deleteAccount);
app.post('/changeEmail', changeEmail);
app.post('/changePassword', changePassword);
app.get('/confirmEmail/:username', confirmEmail)


exports.api = functions.https.onRequest(app);