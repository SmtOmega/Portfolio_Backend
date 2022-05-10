const mongoose = require('mongoose')
const validator = require('validator')


const projectSchema = mongoose.Schema({
    title:{
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
        required: true,
    },
    imageUrl: {
        type: String,
        trim: true,
        required: true,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error('Invalid url entered')
            }
        }
    },
    appUrl: {
        type: String,
        trim: true
    },
    githubUrl: {
        type: String,
        trim: true,
        default: 'https://github.com/SmtOmega?tab=repositories'
    },
    projectOwner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }

}, {timestamps: true})

const Projects = mongoose.model('Projects', projectSchema)

module.exports = Projects