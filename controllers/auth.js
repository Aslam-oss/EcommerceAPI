const User = require("../models/user");
const bc = require('bcryptjs');

exports.getLogin = (req, res, next) => {
  console.log(req.session);
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false
  });
};

exports.postLogin  = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email: email})
  .then(user => {
    if(!user){
      return res.redirect('/login');
    }
    bc.compare(password, user.password)
    .then(doMatch => {
      if(doMatch){
      req.session.isLoggedIn = true;
      req.session.user  = user;
      return req.session.save(err => {
        console.log(err);
        return  res.redirect('/');
      })
      }
      res.redirect('/login');
    })
    .catch(err => {
      console.log(err);
    });
  })
  .catch(err => {
    console.log(err);
  });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err =>{
      console.log(err);
      res.redirect('/login');
    })
  }; 

  exports.getSignUp = (req, res, next) => {
    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'signup',
      isAuthenticated: false
    });
  };

  exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email : email})
    .then(userDoc =>{
      if(userDoc){
       return  res.redirect('/signup');
      }
     return   bc.hash(password, 12);
    })
    .then(hashedpass => {
      const user  = new User({
        email : email,
        password : hashedpass,
        cart : {items : []}
      });
      return user.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err =>{
      console.log(err);
    });
  };
  