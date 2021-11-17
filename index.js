const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const cookie = require('cookie-parser')
const { requireAuth } = require('./middleware/authMiddleware');
const { currentUser } = require('./middleware/authMiddleware');
const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookie())
// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://Sadeeq:SadeeqDB@cluster0.nzadu.mongodb.net/NextAuthDB';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) =>{ 
    console.log("server started")
  })
  .catch((err) => console.log(err));

// routes
app.get('*', currentUser)
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRoutes)

app.listen(5000)
