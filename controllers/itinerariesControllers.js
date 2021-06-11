const { findOneAndUpdate } = require('../models/Itinerary')
const Itinerary = require('../models/Itinerary') 

const itinerariesControllers = {

    allItineraries: async (req,res)=>{
        try{
            const allItineraries = await Itinerary.find()
            res.json({success:true, response:allItineraries })
        }catch(error){
            res.json({success:false, response:"Error it was not possible to obtain the itineraries."})
        }
    },
    findItinerary: async (req,res)=>{
        const id = req.params.id    

        try{
            const findedItinerary = await Itinerary.findById(id).populate('cityRelated') 
            res.json({success:true, response:findedItinerary})
        }catch(error){
            res.json({success:false, response:"Error '_id' of itinerary not valid."})
        }
    },

    postItinerary: async (req,res)=>{
        try{
            const itineraryToPost = await new Itinerary(req.body).save()
            res.json({success:true, response:itineraryToPost })
        }catch(error){
            res.json({success:false, response:"Error, it was not possible to save this itinerary."})
        }
    },
    modifyItinerary: async (req, res)=> {
        const ItineraryToModify = req.params.id
        const propsToModify = req.body
        try{
            const modifiedItinerary = await Itinerary.findOneAndUpdate({_id: ItineraryToModify},{...propsToModify},{new:true})
            res.json({success:true, response:modifiedItinerary})

        }catch(error){
            res.json({success:false,response:"Error when modifiying itinerary."})
        }
    },
    deleteItinerary: async (req,res)=>{

        const ItineraryToDelete = req.params.id
        try{
            await Itinerary.findOneAndDelete({_id:ItineraryToDelete})
            const allItineraries = await Itinerary.find()
            res.json({success:true, response:allItineraries})
        }catch(error){
            res.json({success:false, response:"Error deleting itinerary."})
        }
    },
    findItinerariesByCities: async (req, res)=>{
        try{
            const itinerariesRelatedWithCity = await Itinerary.find({cityRelated: req.params.idCity})
            if(itinerariesRelatedWithCity.length !== 0){
                res.json({success:true, response: itinerariesRelatedWithCity})
            }else{
                res.json({success:true, response: ["NoItineraries"]})
            }

        }catch(error){
            res.json({succes:false, response:"Error '_id' of city not valid."})
        }
        
    },
    getComments: async(req, res)=>{

        try{
            const itineraryId = req.params.id
            let itinerary = await Itinerary.findOne({_id:itineraryId}).populate("comments.user")
            const comments = itinerary.comments.map(comment => ({comment:{text:comment.comment, _id:comment._id}, user:{firstName:comment.user.firstName, image:comment.user.image, lastName: comment.user.lastName, userId:comment.user._id}}))
            res.json({success:true, response:comments})
        }catch(error){
            res.json({success:false, response:[{comment:"Error"}]})
        }
    },
    postComment: async(req, res)=>{
        try{
            const itineraryId = req.params.id
            const comment = req.body.comment
            const user = req.user._id
            const itineraryComment = await Itinerary.findOneAndUpdate({_id:itineraryId},{$push:{comments:{comment,user}}},{new:true}).populate("comments.user")
            let comments = itineraryComment.comments.map(comment => {return {comment:{text:comment.comment, _id:comment._id}, user:{firstName:comment.user.firstName, image:comment.user.image, lastName:comment.user.lastName,  userId:comment.user._id}}})

            res.json({success:true, response:comments})

        }catch(error){
            console.log(error)
            res.json({success:false, response:[{comment:"Error"}]})
        }
    },
    editOrDeleteComment: async(req, res)=>{
        let query
        const commentId = req.body.commentId
        const itineraryId = req.params.id
        const newComment = req.body.comment
        if(req.user){    
            try{
                if(req.body.delete){
                    query = {"comments._id":commentId}
                    update = {$pull:{comments:{_id:commentId}}}
                }else{
                    query = {_id:itineraryId, "comments._id":commentId}
                    update = {"comments.$.comment":newComment}
                }
                
                const itineraryComment = await Itinerary.findOneAndUpdate(query, update,{new:true}).populate("comments.user")
                let commentsResults = await itineraryComment.comments.map(comment => {return {comment:{text:comment.comment, _id:comment._id}, user:{firstName:comment.user.firstName, image:comment.user.image, lastName:comment.user.lastName, userId:comment.user._id}}})
                res.json({success:true, response:commentsResults})
            }catch(error){
                console.log(error)
                res.json({success:false, response:[{comment:"Error"}]})
            }
        }
    },
    likeOrDislike: async(req, res)=>{
        const itineraryId = req.params.id
        const userId = req.body.userId 
        let update;
        try{
            if(req.body.like){
                update = {$push:{like:userId}}
            }else{
                update = {$pull:{like:userId}}
            }
            const itinerary = await Itinerary.findOneAndUpdate({_id:itineraryId},update,{new:true})
            res.json({success:true, response: itinerary.like})
        }catch(error){
            console.log(error)
            res.json({success:false, response: []})
        }
    }
}

module.exports = itinerariesControllers