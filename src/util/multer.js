const { diskStorage } = require('multer')
const multer = require('multer')


const upload = multer({
    storage: multer.diskStorage({}),
    limits: {
        fileSize: 5000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|PNG)$/)){
            return cb(new Error("Please provide a jpg, jpeg or png file"))
        }
        cb(undefined, true)
    }
}) 


module.exports = upload