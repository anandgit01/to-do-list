const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');
const bcrypt = require('bcrypt');
const flash = require('express-flash');
const app = express();
const PORT = process.env.PORT || 3000;

// Set up a connection to the MySQL server
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'todolist',
});

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log('Connected to MySQL server');
  }
});

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}));
app.use(flash());
app.set('view engine', 'ejs');

// Define middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Define routes for user authentication
app.get('/login', (req, res) => {
    const message = req.flash('error')[0];
    res.render('login.ejs', { message });
  });
  

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const sql = 'SELECT * FROM users WHERE username = ?';

  connection.query(sql, [username], (err, results) => {
    if (err) {
      console.log(err);
    } else {
      if (results) {
        const user = results[0];
        bcrypt.compare(password, user.password, (err, result) => {
            if (result === 0) { // incorrect comparison
              res.render('login.ejs', { message: 'Invalid username or password' });
            } else {
              req.session.user = user;
              res.redirect('/');
            }
          });
          
      } else {
        res.render('login.ejs', { message: 'Invalid username or password' });
      }
    }
  });
});

app.get('/register', (req, res) => {
    res.render('register.ejs', { message: req.flash('error') });
  });

app.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.log(err);
    } else {
      connection.query(sql, [username, hash], (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect('/login');
        }
      });
    }
  });
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Define routes for todo items
app.get('/', isLoggedIn, (req, res) => {
    const userId = req.session.user.id;
    const showCompleted = req.query.completed === 'true';
    const sortBy = req.query.sortBy || 'id';
    const sql = `SELECT * FROM todos WHERE user_id = ${userId} ${showCompleted ? 'AND completed = 1' : ''} ORDER BY ${sortBy}`;
  
    connection.query(sql, (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.render('index.ejs', { todos: results, showCompleted, sortBy });
      }
    });
  });
  
  app.post('/addTodo', isLoggedIn, (req, res) => {
    const description = req.body.description;
    const userId = req.session.user.id;
    const sql = 'INSERT INTO todos (description, completed, user_id) VALUES (?, ?, ?)';
  
    connection.query(sql, [description, false, userId], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/');
      }
    });
  });
  
  app.post('/editTodo/:id', isLoggedIn, (req, res) => {
    const id = req.params.id;
    const description = req.body.description;
    const sql = 'UPDATE todos SET description = ? WHERE id = ?';
  
    connection.query(sql, [description, id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/');
      }
    });
  });
  
  app.post('/deleteTodo/:id', isLoggedIn, (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM todos WHERE id = ?';
  
    connection.query(sql, [id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/');
      }
    });
  });
  
  app.post('/toggleTodo/:id', isLoggedIn, (req, res) => {
    const id = req.params.id;
    const sql = 'UPDATE todos SET completed = NOT completed WHERE id = ?';
  
    connection.query(sql, [id], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect('/');
      }
    });
  });
  
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
  