const mongoose = require('mongoose')

const itinerarySchema = mongoose.Schema({
    title: {type:String, required:true},
    autor: {fullName:{type:String, required:true},profilePhoto:{type:String, requied:true}},
    price: {type:Number, required:true, max:5, min:1},
    duration: {type:Number, required:true, max: 9, min:1},
    like: [{type:mongoose.Types.ObjectId, required:true, ref:'user'}],
    hashTags: [{type:String, required:true}],
    comments: [{comment:{type:String, required:true}, user:{type:mongoose.Types.ObjectId, required:true, ref:'user'}}],
    cityRelated: {type:mongoose.Types.ObjectId, required:true, ref:'city'}
})


const Itinerary = mongoose.model('itinerary',itinerarySchema)

module.exports = Itinerary 