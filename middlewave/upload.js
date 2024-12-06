const path = require('path')
const multer = require('multer')
const { application } = require('express')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname)
        cb(null, Date.now() + ext)
    }

})

var upload = multer ({
    storage: storage,
    fileFilter: function (req, file, callback) {
        if (file.mimetype == application/pdf) {
            callback(null, true)
        } else {
            console.log('Only pdf')
            callback(null, false)
        }
    }
})