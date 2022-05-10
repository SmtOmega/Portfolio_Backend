const jwt = require('jsonwebtoken')
const User = require('../models/user')


const auth = async(req, res, next) => {

    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id: decoded._id})

        if(!user){
            throw new Error("Invalid authentication")
        }

        req.user = user

        next()
    } catch (error) {
        res.status(401).send({'error': 'You are not authorized to view this page'})
    }

}


module.exports = auth