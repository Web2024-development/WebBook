const store = multer.diskStorage({
    destination: function(req, file, cb) {
        fs.mkdir(path, {recursive: true}, function(err) {
            if (err) return cb(err);
            cb(null, "public/images")
        })
    },
    filename: function(req, file, cb) {
        const name = file.originalName.toLowerCase().split(" ").join("_");
        cb(null, name + "-" + Date.now());
    }
})
const upload = multer({storage: store}).single('file')