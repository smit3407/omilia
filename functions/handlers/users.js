const { db } = require('../util/admin');

const config = require('../util/config');

const firebase = require('firebase');
firebase.initializeApp(config)

const { validateSignupData, validateLoginData, validateChangeEmail } = require('../util/validation');

//Change Email
exports.changeEmail = (req, res) => {
  const user = {
    username: req.body.username,
    currentEmail: req.body.currentEmail,
    newEmail: req.body.newEmail,
    currentPassword: req.body.currentPassword
  };

  const { valid, errors } = validateChangeEmail(user);

  if(!valid) return res.status(400).json(errors);
  
  db.doc(`/users/${user.username}`).get()
      .then(doc => {
        if (doc.exists) {
          firebase
          .auth()
          .signInWithEmailAndPassword(user.currentEmail, user.currentPassword)
          .then(function (userCredential) {
               var curUser = userCredential.user;
               return curUser.updateEmail(data.Email);
          })
          .then(function () {
               return db.doc(`/users/${user.username}`).update({ email: user.newEmail});
          })
          .catch(function (error) {
               console.log("Login Failed!", error);
          });
        } else {
          return res.status(1).json({ general: 'Something went wrong, please try again' });
        }
      })
      .then(data => {
        userId = data.user.uid;
        return data.user.getIdToken();
      })
      .then(() => {
        return res.status(201).json({ token });
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ general: 'Something went wrong, please try again' });
      })
}

//Create User
exports.signup = (req, res) => {
    const newUser = {
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      username: req.body.username,
    };

    const { valid, errors } = validateSignupData(newUser);

    if(!valid) return res.status(400).json(errors);
  
    let token, userId;
  
    db.doc(`/users/${newUser.username}`).get()
      .then(doc => {
        if (doc.exists) {
          return res.status(400).json({ username: 'this username is already taken'})
        } else {
          return firebase
            .auth()
            .createUserWithEmailAndPassword(newUser.email, newUser.password);
        }
      })
      .then(data => {
        userId = data.user.uid;
        return data.user.getIdToken();
      })
      .then(idToken => {
        token = idToken;
        const userCredentials = {
          username: newUser.username,
          email: newUser.email,
          createdAt: new Date().toISOString(),
          userId
        };
        db.doc(`/users/${newUser.username}`).set(userCredentials);
      })
      .then(() => {
        return res.status(201).json({ token });
      })
      .catch(err => {
        console.error(err);
        if (err.code === "auth/email-already-in-use") {
          return res.status(400).json({ email: 'email is already in use' })
        } else {
          return res.status(500).json({ general: 'Something went wrong, please try again' });
        }
      })
  }

//Log User In
exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  const { valid, errors } = validateLoginData(user);

  if(!valid) return res.status(400).json(errors);

  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return res.json({token});
    })
    .catch(err => {
      console.error(err);
      // auth/wrong-password
      // auth/user-not-found
      return res.status(403).json({ general: 'Wrong credentials, please try again' });
    })
}

exports.logout = (req, res) => {
  firebase.auth().signOut();
}