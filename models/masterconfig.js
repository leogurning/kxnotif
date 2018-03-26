const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MsconfigSchema = new Schema({
    code: {type:String, required: true},
    value: {type:String, required: true},
    group: {type:String, required: true},
    desc: {type:String},
    filepath: {type:String},
    filename: {type:String},
    status: {type:String, required: true},
    createddt:{type:Date},
    lastupdate: {type:Date},
    updateby: {type:String, required: true},
    objupdateby: { type:mongoose.Schema.ObjectId, required: true},
});

module.exports = mongoose.model('msconfig', MsconfigSchema, 'msconfig');