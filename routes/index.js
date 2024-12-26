var express = require('express');
var router = express.Router();
var collection = require('../models/signup')
var Book = require('../models/book')
var session = require('express-session')
var app = express();
var path = require('path');
const MongoStore = require('connect-mongo')
const bcrypt = require('bcrypt');
app.use('/public', express.static('public'));
const multer = require('multer');
const fs = require('fs')
const methodOverride = require('method-override');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'image') {
      cb(null, path.join(__dirname, '../public/images'))
    } else if (file.fieldname === 'file') {
      cb(null, path.join(__dirname, '../public/filePDF'))
    } else {
      cb(new Error('Invalid file name'), null)
    }
  }, 
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({storage})



app.get('/favicon.ico', (req, res) => res.status(204).end());

app.use(session({
  secret: 'some secret',
  resave: false,
  saveUninitialized: false,
  cookie: {maxAage: 1000 * 60 * 60 * 24, httpOnly: true},
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://24560002:Info123@csbu103.q3boj.mongodb.net/?retryWrites=true&w=majority&appName=CSBU103'
  })

}))

// router.get('/books', async (req, res) => {
//   try {
//     let books;

//     books = await Book.find({});
//     res.render('books/books', {books})
//   } catch (err) {
//     console.log(err)
//     res.status(500).send('Error')
//   }
// })
// module.exports = router;

router.get('/library', async (req, res) => {
  res.render('books/library')
})
module.exports = router;




router.post('/admin/create', upload.fields([{ name: 'image' }, { name: 'file' }]), async (req, res) => {
  try {
    const { name, type, description, status } = req.body;
    const imagePath = req.files.image ? `/images/${req.files.image[0].filename}` : null;
    const filePath = req.files.file ? `/filePDF/${req.files.file[0].filename}` : null;

    const newBook = new Book({
      name,
      type,
      description,
      status,
      image: imagePath,
      file: filePath
    });

    await newBook.save();
    res.redirect('/booklist'); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating book');
  }
});
module.exports = router;


router.get('/admin', async (req, res) => {

  try {
   
    const books = await Book.find();
    res.render('admin', { books }); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching books');
  }
});
module.exports = router;

router.get('/admin/update/:id', async (req, res) => {
  try {

    const book = await Book.findById(req.params.id);
    res.render('update', {book})
  } catch(error) {
    console.error(error);
    res.status(500).send('Error updating book');
  }
})
module.exports = router;
router.post('/admin/update/:id', upload.fields([{name: 'image'}, {name: 'file'}]), async (req, res) => {
  try {
    const {id} = req.params;
    const {name, type, description, status} = req.body;
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).send('Book not found');
    }

    book.name = name 
    book.type = type
    book.description = description 
    book.status = status

      if (req.files.image) {
        book.image = `/images/${req.files.image[0].filename}`;
      }

    
    if (req.files.file) {
      book.file = `/filePDF/${req.files.file[0].filename}`;
    }


    await book.save();
    res.redirect('/booklist')
  } catch(error) {
    console.error(error);
    res.status(500).send('Error updating book')
  }
})
module.exports = router;


router.get('/admin/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const book = await Book.findById(id);

    if (book.image) {
      fs.unlinkSync(path.join(__dirname, `../public/${book.image}`));
    }
    if (book.file) {
      fs.unlinkSync(path.join(__dirname, `../public/${book.file}`));
    }

    await Book.findByIdAndDelete(id);
    res.redirect('/booklist')
  } catch(error) {
    console.error(error);
    res.status(500).send('Error deleting book')
  }
})
module.exports = router;




router.post('/admin/update-status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // const { status } = req.body;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).send('Book not found');
    }

    book.status = req.body.status;
    
    await book.save();

    res.redirect('/booklist');
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).send('Error updating status');
  }
});


router.get('/booklist', async (req, res) => {
  const books = await Book.find();
  res.render('booklist', {books});
})
module.exports = router;



router.post('/:id/comments', async (req, res) => {
  try {


    // if (!req.user || !req.user._id) {
    //   return res.status(401).send('You must be logged in to comment');
    // }



    const {content} = req.body;
    const book = await Book.findById(req.params.id);
    
    const newComment = {
      user: req.session.user.id, //req.session.user.id, // ID nguoi dung tu session
      content: content,
      date: new Date()
    }
    book.comments.push(newComment);// Them comment
    await book.save();
    res.redirect(`/${book._id}`); 
  } catch(error) {
    console.error(error);
    res.status(500).send('Error adding comment');
  }
})

router.post('/:id/comments/:commentId/delete', async (req, res) => {
  try {
    const {commentId} = req.params
    const book = await Book.findById(req.params.id);
    
    const comment = book.comments.id(commentId);

    if(comment.user.toString() !== req.session.user.id.toString()) {           //req.session.user.id
      return res.status(403).send('You can only delete your own comments')
    }

    book.comments.pull(commentId);// Xoa comment
    await book.save() // Luu sach
    res.redirect(`/${book._id}`)

  } catch(error) {
    console.error(error);
    res.status(500).send('Error deleting comment');
  }
})





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
  
  res.redirect("/login") 
})

module.exports = router;






app.get('/session', function (req, res) {
  if(req.session.user) {
    res.status(200).json({message: 'Session active', user: req.session.user})
  } else {
    res.status(401).json({message: 'No active session'})
  }
})

router.get('/', async (req, res) => {
  // if (req.session.user) {

    try {
      
      let books, typeList;
      const {type} = req.query
      const filter = {}
      const uniqueType = await Book.distinct('type')
        if (type) {
          filter.type = type;
          typeList = await Book.find({type: type})
        } else {
          typeList = await Book.find()
        }
        
      const types = await Book.find(filter).limit(3)
      let gallery = await Book.find().limit(5)
      typeList = await Book.find(filter)
      books = await Book.find({type: 'kid books'})
      const typeFantasy = await Book.find({type: 'fantasy'})
      let searchQuery = req.query.query
      if (typeof searchQuery !== 'string') {
        searchQuery = String(searchQuery || '');
      }
      
        const Books = await Book.find({
          $or: [
            {name: {$regex: searchQuery, $options: 'i'}},
            {description: {$regex: searchQuery, $options: 'i'}},
            {type: {$regex: searchQuery, $options: 'i'}}
          ]
        })
  
      res.render('index', {books, types, typeFantasy, Books, searchQuery, user: req.session.user, typeList, uniqueType, gallery }); 
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching books');
    }
 

});
module.exports = router;




router.get('/login', function(req, res) {
  res.render('login')
})
module.exports = router;

router.post('/login', async (req, res) => {
    const {username, password} = req.body
    try {
      const user = await collection.findOne({username})
      if (user && (await bcrypt.compare(password, user.password))) {
        req.session.user = {username: user.username, id: user._id};
        return res.redirect('/')
      } 
      else {
        res.status(401).send('Invalid credentials')
      }
    } catch (error) {
      console.log(error)
      res.status(500).send('Error during login')
    }

})
module.exports = router;

router.post('')



router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.redirect('/');
    }
    res.clearCookie('connect.sid'); 
    res.redirect('/'); 
  });
});

module.exports = router;


router.get('/gallery', (req, res) => {
  res.render('gallery')
})
module.exports = router;

router.post('/views/:id', async (req, res) => {
  try {
    const bookId = req.params.id;

    // Tìm sách và tăng số lượt xem
    const book = await Book.findByIdAndUpdate(
      bookId,
      { $inc: { views: 1 } }, // Tăng 1 lượt xem
      { new: true } // Trả về tài liệu đã cập nhật
    );

    if (!book) {
      return res.status(404).send('Book not found');
    }

    // Gửi phản hồi thành công hoặc chuyển hướng
    res.redirect(book.file);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error increasing views');
  }
});




// Route hiển thị chi tiết sách
router.get('/:id', async (req, res) => {
  // if (req.session.user) {
    
    try {
      const { id } = req.params;
      
  
      // Tìm sách theo ID
      const book = await Book.findById(id).populate('comments.user');
      
      if (!book) {
        return res.status(404).send('Book not found');
      }
  
      res.render('details', { book, user: req.session.user  }); // Render chi tiết sách
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching book details');
    }
  // }

  
  
});

module.exports = router;



router.get('/:file', async (req, res) => {
  const {id} = req.params
  const books = await Book.findByIdAndUpdate(id,
    {$inc: {views: 1}}
  )
  const fileName = req.params.file
  const book = await Book.findOne({file: fileName})
  res.render('read', {file: book})
})
module.exports = router;













