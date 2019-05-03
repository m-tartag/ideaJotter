const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();


// Connect to Mongoose - Mongoose Documentation

mongoose.connect('mongodb://localhost/wordBank-dev', {
  useNewUrlParser: true
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(`Whoops! ${err}`));

// Load Idea Model -- good practice to captialize model names

require('./models/Idea');
const Idea = mongoose.model('ideas');


// Handlebars Middlware -------------------

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser Middleware - BP Documentation

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())


// My Routes ------------------------------

// [Index route]

app.get('/', (req, res) => {
  const myTitle = "Search a Word or Words..";
  res.render('index', {
    title: myTitle
  });
});

  // Can ALSO pass dynamic data into your VIEW with:
  // const title = "dsdsdasd"
  // res.render('index', {
  //   title: title
  // });


// [About route]

app.get('/about', (req, res) => {
  res.render('about');
  console.log('Somebody in about..')
})

// [Ideas Index Route]

app.get('/ideas', (req, res) => {
  Idea.find({})
    .sort({date:'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas:ideas
      });
    });
});

// [Add Ideas Route]

app.get('/ideas/add', (req, res) => {
  res.render('ideas/add');
})

// Process Form

app.post('/ideas', (req, res) => {
  
  console.log(req.body);
  const newUser = {
    title: req.body.title,
    details: req.body.details
  }
  new Idea(newUser)
    .save()
    .then(idea => {
      res.redirect('/ideas');
    })
})





const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

