// router.get('/', function(req, res) {
//   let books = new book(
//     {name: 'The Star Lit Chronciles', type: 'fantasy', description: 'Good!', image: '/images/17thestarlitchronicles.png'},
  

//   )
//   books.save().then(() => {
//   console.log("New book is created")
// }).catch(err => console.log(err))
// })
// module.exports = router; 



// router.get('/library', async(req, res) => {
//   // const imgList = await book.find({});
//   // res.render('library', {'img': imgList})
//   // const pdfList = await book.find({});
//   // res.render('homePage', {pdf: pdfList})
//   try {
//     const {type} = req.query
//     const filter = {}
//     if (type) {
//       filter.type = type;
//     }
//     const typeList = await book.find(filter)
//     res.render('library', {typeList})

//   } catch (error) {

//   }
// })
// module.exports = router;

// router.get('/', function(req, res) {
//   res.render('homePage')
// })
// module.exports = router;

// router.get('/download', async(req, res) =>{
//   const pdfList = await book.find({});
//   const downloadList = {pdf: pdfList}
//   // for (let i = 0; i < pdfList.length; i++) {
//     // console.log(pdfList[i].file)
//     res.download('./public/filePDF/book.pdf')
//   // }
// })
// module.exports = router;

// router.get('/', function(req, res) {

//   res.render('index')
// })
// module.exports = router;

// router.get('/download', function(req, res) {
//   res.render('download')
// })
// module.exports = router;

// router.get('/home', async(req, res) => {
//   res.render('home')
// })
// module.exports = router;







router.get('/display/display', async (req, res) => {
    const imgList = await book.find({});
    res.render('display/display', {'img': imgList})
  })
  module.exports = router;
  
  router.get('/library', async(req, res) => {
    // const imgList = await book.find({});
    // res.render('library', {'img': imgList})
    // const pdfList = await book.find({});
    // res.render('homePage', {pdf: pdfList})
    try {
      const {type} = req.query
      const filter = {}
      if (type) {
        filter.type = type;
      }
      const typeList = await book.find(filter)
      res.render('library', {typeList})
  
    } catch (error) {
  
    }
  })
  module.exports = router;
  
  router.get('/details', function (req, res) {
    res.render('details')
  })
  module.exports = router




  // router.get('/', async (req, res) => {
  
//   const page = parseInt(req.query.page) || 1;
//   const limit = 3
//   const skip = (page - 1) * limit;
//   // const imgList = await book.find({}).limit(3);
//   const imgList = await book.find({}).skip(skip).limit(limit)
//   const totalBooks = await book.countDocuments();
//   const totalPages = Math.ceil(totalBooks / limit)
//   const typeKidBooks = await book.find({type: 'kid books'})
//   const typeFantasy = await book.find({type: 'fantasy'})
  

//   res.render('index', {imgList, page, totalPages, typeKidBooks, typeFantasy})
// })

// module.exports = router

// router.get('/:id', async (req, res) => {
//   try {
//     const book = await book.findById(req.params.id) 
//     if (!book) {
//       return res.status(404).send('Book not found')
//     }
//     res.render('index', {book})
//   } catch (error) {
//     console.error(error)
//     res.status(500).send('Error fetching book details')
//   }
// })







router.get('/home', async(req, res) =>{
    const filePath = path.join(__dirname, './files/merged1.pdf')
    const pdfList = await book.find({});
    const downloadList = {pdf: pdfList}
    for (let i = 0; i < pdfList.length; i++) {
      // console.log(pdfList[i].file)
      // res.download(String(pdfList[i].file))
      // res.setHeader('Content-Type', 'application/pdf')
      // res.setHeader('Content-Disposition', 'inline; filename"' + '/merged1' + '.pdf"')
      // res.sendFile(filePath)
      // res.download('./routes/files/merged1.pdf')
      res.render('home')
    }
  })
  module.exports = router;
  
  router.post('/home', async(req, res) => {
    let playload = req.body.playload.trim();
    console.log(playload);
    let search = await book.find({name: {$regex: new RegExp('^' + playload + '.*', 'i')}}).exec();
    search = search.slice(0, search.length)
    res.send({playload: search})
    let searchs = ''
    if (req.query.search) {
      searchs = playload
    }
  })
  
  
  
  // router.get('/library', async(req, res) => {
  //   try {
  //     const {type} = req.query
  //     const filter = {}
  //     if (type) {
  //       filter.type = type;
  //     }
  //     const typeList = await book.find(filter)
  //     res.render('library', {typeList})
  
  //   } catch (error) {
  
  //   }
  
  // })
  // module.exports = router
  
  // const password = '123'
  // const hash = await bcrypt.hash(password, 10)
  // console.log(hash)
  