var express = require('express');
var router = express.Router();
var collection = require('../models/signup')
var Book = require('../models/book')
var session = require('express-session')
var app = express();
var path = require('path');
const store = new session.MemoryStore()
const bcrypt = require('bcrypt');


app.use(session({
  secret: 'some secret',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAage: 60000}
}))


router.get('/signup', function(req, res) {
  res.render('signup');
})
module.exports = router;

router.post('/signup', async (req, res) => {
  const { username, password, confirmPassword } = req.body
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{6,}$/;

 if(!username || !password || !confirmPassword) {
  return res.status(400).json({ message: 'All fields are required.'})
 }

 if (!emailRegex.test(username)) {
  return res.status(400).json({message: 'Invalid email format.'})
 }

  if (!passwordRegex.test(password)) {
    return res.status(400).json({message: 'Password must have at least 6 characters, 1 number, and 1 special character.'})
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }



  try {
    const existingUser = await collection.findOne({username})
  if (existingUser) {
    return res.status(400).json({message: 'User already exists.'})
  }


    const hashPassword = await bcrypt.hash(password, 10)
    const newUser = new collection({username, password: hashPassword})
    await newUser.save()
    req.session.user = {
      id: newUser._id,
      username: newUser.username
    }
    console.log("New user created")
  } catch (error) {
    console.error('Error during registration', error)
    res.status(500).json({message: 'Server error'})
}
  
  res.redirect("/") 
})

module.exports = router;




app.get('/session', function (req, res) {
  if(req.session.user) {
    res.status(200).json({message: 'Session active', user: req.session.user})
  } else {
    res.status(401).json({message: 'No active session'})
  }
})

app.post('/logout', function (req, res) {
  req.session.destroy((error) => {
    return res.status(500).json({message: 'Error logging out.'})
  })
  res.clearCookie('connect.sid')
  res.status(200).json({message: 'Logged out successfully.'})
})

router.get('/login', function(req, res) {
  res.render('login')
})
module.exports = router;

router.post('/login', async (req, res) => {
  
    const {username, password} = req.body
    const user = await collection.findOne({username})
    if (user && await user.isAuthenticated(password)) {
      req.session.user = {id: user._id, username: username}
      return res.redirect('/home')
    }
    res.render('login', {error: 'Invalid'})
  
})
module.exports = router;

router.get('/', async (req, res) => {
  try {
    let books;
    const {type} = req.query
    const filter = {}
      if (type) {
        filter.type = type;
      }
    const types = await Book.find(filter).limit(3)
    books = await Book.find({type: 'kid books'})
    const typeFantasy = await Book.find({type: 'fantasy'})
    

    
    res.render('index', { books, types, typeFantasy }); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching books');
  }
});

// Route hiển thị chi tiết sách
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    


   
    // Tìm sách theo ID
     const book = await Book.findById(id);
    if (!book) {
      return res.status(404).send('Book not found');
    }

    res.render('details', { book }); // Render chi tiết sách
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching book details');
  }
});

module.exports = router;




