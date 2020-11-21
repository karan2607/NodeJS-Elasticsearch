const mongoose = require('mongoose')
const NoteSchema = mongoose.Schema({
    PId: Number,
    PTitle: String,
    PName: String,  
},{
    timestamps: true
})

module.exports = mongoose.model('Note',NoteSchema)