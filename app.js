const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const mongoDbUri = 'mongodb+srv://Aslam12:Aslam@nodeapp.cytkfbd.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();
const store = new mongoDBStore({ 
  uri:mongoDbUri,
  collection : 'session'
});
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth'); 

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'mySecret',
  resave:false,
  saveUninitialized:false, 
  store : store
}));

app.use((req, res, next) => {
  if(!req.session.user){
    return next();
  }

  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(
   mongoDbUri,  { 
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true 
  }
   )
  .then(result => {
    
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
