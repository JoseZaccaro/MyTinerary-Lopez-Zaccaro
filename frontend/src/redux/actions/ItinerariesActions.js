import axios from "axios"

const itinerariesActions = {

    findItineraries: (id)=>{
        return (dispatch, getState)=>{
            axios.get(`http://localhost:4000/api/itineraries/${id}`)
            .then(res => dispatch({type: 'FIND_ITINERARIES', payload: {itineraries:res.data.response}}))
            .catch(error =>   dispatch({type:'FIND_ITINERARIES', payload:{error:true}}))
        }
    },
    resetItineraries: ()=>{
        return (dispatch, getState)=>{
            dispatch({type:'FIND_ITINERARIES', payload: {itineraries:[]}})
        }
    },
    getActivitiesAndComments: (id)=>{
        return async(dispatch,getState)=>{
            const activities = await axios.get("http://localhost:4000/api/activity/"+id)
            const comments = await axios.get("http://localhost:4000/api/comments/"+id)
            if(activities.data.success){
               return {comments:comments.data.response, activities:activities.data.response.activities}
            }else{
                return {comments:comments.data.response, activities:[]}
            }
        }
    },
    sendComment: (comment,itineraryId)=>{
        return async(dispatch, getState)=>{
            let user = localStorage.getItem("token")
            if(comment.trim() !== "" && user){
                const commentToPost = await axios.post("http://localhost:4000/api/comments/"+itineraryId,{comment},{
                headers:{
                'Authorization':'Bearer '+ user
            }})
            return commentToPost.data.response
            }
        }
    },
    deleteComment: (commentId, itineraryId)=>{
        return async(dispatch, getState)=>{
            let user = localStorage.getItem("token")
            const comments = await axios.put("http://localhost:4000/api/comments/"+itineraryId,{commentId,delete:true},{
                headers:{
                'Authorization':'Bearer '+ user
            }})
            if(comments.data.success){
                return comments.data.response
            }
        }
    },
    modifyComment: (comment, commentId, itineraryId)=>{
        return async(dispatch, getState)=>{
            let user = localStorage.getItem("token")
            const comments = await axios.put("http://localhost:4000/api/comments/"+itineraryId,{comment, commentId, delete:false},{
                headers:{
                'Authorization':'Bearer '+ user
            }})
            if(comments.data.success){
                return comments.data.response
            }
        }
    },
    likeOrDislike: (data)=>{
        return async (dispatch, getState)=>{
            const likes = await axios.put("http://localhost:4000/api/like/"+data.itineraryId,{userId:data.userId,like:data.like})
            if(likes.data.success){
                return likes.data.response
            }else{

            }
        }
    }
    
}

export default itinerariesActions