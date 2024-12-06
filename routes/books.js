const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
var collection = require('../models/signup')
var session = require('express-session')

const Book = require('../models/book'); // Đảm bảo đúng đường dẫn tới mô hình

// Route hiển thị danh sách sách
router.get('/', async (req, res) => {
  try {
    let books;
    
    
    
    books = await Book.find({type: 'kid books'})
    

   // books = await Book.find(); // Lấy tất cả sách
    
    res.render('index', { books }); // Render danh sách sách
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching books');
  }
});

// Route hiển thị chi tiết sách
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Kiểm tra ID hợp lệ
    // if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).send('Invalid Book ID');
    // }

   
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




router.get('/signup', function(req, res) {
  res.render('signup');
})
module.exports = router;

router.post('/signup', async (req, res) => {
  const data = {
      name: req.body.name,
      password: req.body.password
  }
  await collection.insertMany([data])
  
  res.render("signup")
})
module.exports = router;