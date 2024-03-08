const mongoose = require('mongoose')

const GeneralFestsSchema  = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    initialDate: {
        type: Date
    },
    image: {
        type: String
    },
    contentType: {
        type: String
    },
    isTicketMaster: {
        type: Boolean
    },
    country: {
        type: String
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

module.exports = mongoose.model('GeneralFest', GeneralFestsSchema)