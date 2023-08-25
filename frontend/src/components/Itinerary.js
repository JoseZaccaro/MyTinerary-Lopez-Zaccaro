import { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import ReactiveButton from "reactive-button";
import itinerariesActions from "../redux/actions/ItinerariesActions";
import Activity from './Activity'
import Comment from "./Comment";
import Input from './Input'
import { toast, Bounce} from 'react-toastify'
import Swal from "sweetalert2";  


const Itinerary = (props) => {

  const { itinerary, socket } = props;
  const [viewMore, setViewMore] = useState(false);
  const [likes, setLikes] = useState(itinerary.like);
  const [activities, setActivities] = useState({})
  const [comment, setComment] = useState("")
  const [activitiesToRender, setActivitiesToRender] = useState([])
  const [comments, setComments] = useState ([])
  const [numberOfLikes, setNumberOfLikes] = useState(itinerary.like.length)
  const [procesing, setProcesing] = useState(false)
  const [like, setLike] = useState(props.user && likes.find(userId => userId === props.user.userId));
  const sendMessage ={backgroundImage:"url('/icons/sendMini.svg')"}
  const commentBox = useRef()
  let priceDollars = [];
  let evaluarUser = props.user && props.user.userId  ? true : false
  for (let i = 0; i < itinerary.price; i++) {
    priceDollars.push( <img key={`box-${i}`} src="/assets/authors/dollars.png" alt="cash" className="cash"/> );
  }
  
  


  useEffect(()=>{  
    socket.on('reloadComments',()=>{
      console.log("relooad")
      reloadCommentsFunction()
    })
    //eslint-disable-next-line react-hooks/exhaustive-deps
  },[])


const scrollTop = ()=>{
    commentBox.current?.scrollIntoView(true)
}

  
  const sweetAlert = (title, text, icon, timer, showCancelButton, confirmButtonText, cancelButtonText)=>{
    return (Swal.fire({
      title,
      text,
      icon,
      showCancelButton,
      confirmButtonText,
      cancelButtonText,
      timer
  }))
  }
  const popUp = (type,message, position, timer, toastId)=>{
    return toast[type](message, {
        position: position,
        autoClose: timer,
        closeOnClick: true,
        draggable: true,
        transition:Bounce,
        toastId:toastId
        });
      }

  const reloadCommentsFunction = async()=>{
    const activitiesAndComments = await props.getActivitiesAndComments(itinerary._id)
      if(activitiesAndComments.activities){
        setActivities(activitiesAndComments.activities)
        setActivitiesToRender(Object.keys(activitiesAndComments.activities))
      }
      setComments(activitiesAndComments.comments)
    }
    

  const viewMoreFunction = async() => {
    setViewMore(!viewMore);
    if(activitiesToRender.length === 0){
      const activitiesAndComments = await props.getActivitiesAndComments(itinerary._id)
      if(activitiesAndComments.activities){
        setActivities(activitiesAndComments.activities)
        setActivitiesToRender(Object.keys(activitiesAndComments.activities))
      }
      setComments(activitiesAndComments.comments)
    }
    scrollTop()
  };
  const likeOrDislike = () => {
    if(props.user && props.user.userId && localStorage.getItem('token') ){
      if(!procesing){

        setProcesing(true)
        props.likeOrDislike({userId:props.user.userId, itineraryId:itinerary._id, like:!like})
        .then(response => {        
          setLikes(response)
          setLike(!like);
          setNumberOfLikes(response.length)
          setProcesing(false)
        })
        .catch(error => {
          console.log(error)
          setProcesing(false)
        })
      } 
    }else{
      popUp("warning","You must be logged to like itineraries","top-center",2800, "likeNoLogged")
    }
  };
  const input = (e) =>{
    const inputValue = e.target.value
    setComment(inputValue)
  }

  const sendComment = ()=>{
    if(props.user && props.user.userId){
      if(comment.trim() !== ""){
        props.sendComment(comment,itinerary._id)
        .then(newComment => setComments(newComment))
        .catch(error => console.log(error))
        setComments([...comments,{comment:{text:comment},user:{firstName:props.user.firstName,image:props.user.image}}])
        setComment("")
        socket.emit('reloadComments')
      }else{
        popUp("error","Empty comments cannot be submitted","bottom-center",1500,"noComment")
      }
    }else{
      popUp("warning","You must be logged to comment","top-center",3000, "commentNoLogged")
    }
  }

  const editOrDelete = async(e, comment)=>{
    const commentId = e.target.dataset.commentid
    if(e.target.dataset.btn === "delete"){
        sweetAlert('Are you sure?', 'You will not be able to recover this comment!', 'warning',120000, true, 'Yes, delete it.', 'Cancel' )
        .then((result) => {
        if (result.value) {
        props.deleteComment(commentId, itinerary._id)
        .then(commentsResult => {
          setComments(commentsResult)
          sweetAlert('Deleted!','Your comment has been deleted.','success', 2000, false,'Ok')
          socket.emit('reloadComments')
          })
        .catch( error => {
          error && sweetAlert('Oops!',"We couldn't delete your comment.", 'success',2000) 
          })

        } else if (result.dismiss === "cancel" ) {
          sweetAlert('Cancelled','Your comment is safe','info',1500, false, 'Ok')
        }
      })
      
    }else{
      props.modifyComment(comment, commentId, itinerary._id)
      .then(commentsResult => {
        setComments(commentsResult)
        popUp("success","Comment edited correctly","bottom-center",1800,"commentModified")
        socket.emit('reloadComments')
      })
      .catch(error => console.log(error))
    }
  }

  console.log("me rerendericé")

  return (
    <>
      <div key={itinerary._id} className="itinerary-container">
        <div className="title">
          <h2> {itinerary.title} </h2>
        </div>

        <div className="info-container">
          <div className=" details">
            <div className="price">
              <p>Price: </p>
              <div className="cash-container">{priceDollars}</div>
            </div>
            <div className="duration">
              <p className="duration-static"> Duration:</p> <p className="duration-dinamic">{itinerary.duration} Hours </p>
            </div>
          </div>

          <div className="name-image">
            <div
              className="user-image"
              style={{
                backgroundImage: `url(${itinerary.autor.profilePhoto})`,
              }}
            ></div>
            <h3> {itinerary.autor.fullName} </h3>
          </div>

          <div className="like">
            <div className="like-number-image">
              <p onClick={likeOrDislike} className="likes-number">
                {numberOfLikes}
              </p>
              <div
                className="like-image"
                style={
                  props.user && like
                    ? {
                        WebkitMask:
                          "url('/assets/authors/like.svg') no-repeat 100% 100%",
                        backgroundColor: "red",
                      }
                    : {
                        WebkitMask:
                          "url('/assets/authors/like.svg') no-repeat 100% 100%",
                        backgroundColor: "white",
                      }
                }
                onClick={likeOrDislike}
              ></div>
            </div>

            <div className="hashtags">
              {itinerary.hashTags.map((hashTag, i) => (
                <p key={i}>#{hashTag} </p>
              ))}
            </div>
          </div>
        </div>
        {viewMore ? (
          <>
            <div className="padding">
              <h3>Activities!</h3>
            </div>
            <div className="activities-container">
            { 
              activitiesToRender.map((activity,index) => {
                return(
                  <Activity key={index} image={activities[activity].image} title={activities[activity].title}/> 
                )})
                
            }
            </div>
            <div className="padding">
              <h3>Comments</h3>
            </div>
            <div className="comments-container" style={{backgroundImage: "url('/assets/chatBackground.jpg')"}}>
              <div className="messages-container-container">
                <div className="messages-container"  ref={commentBox} >
                  {
                    comments.map((comment,index) => {
                      return (
                        <Comment key={index} comment={comment} editOrDelete={editOrDelete} />
                        )
                    })
                  }
                </div>
              </div>
              <div className="input-msg-container">
                <Input inputType={"text"} onKeyPress={(e) => e.key === 'Enter' && sendComment()} inputClassNames={"comment-input"} disabled={!evaluarUser} inputDefaultValue={comment} inputPlaceholder={props.user? "Enter your comment..." : "You must be logged first to leave a comment..."} inputName={"comment"}  onChangeFunction={input} inputAutoComplete={"off"} optionalDivSvg={true} divSvgClassNames={evaluarUser ? "send-comment": "no-send-comment"} divSvgInLineStyles={sendMessage} divSvgOnClick={sendComment}/>
              </div>
            </div>
          </>
        ) : null}
        <div className="view-more">
          <ReactiveButton
            color={"dark"}
            idleText={viewMore ? "View Less" : "View More"}
            type={"button"}
            className={"class1 class2"}
            style={{ borderRadius: "5px" }}
            outline={false}
            shadow={true}
            rounded={true}
            size={"small"}
            block={false}
            buttonRef={null}
            width={"10vw"}
            height={"5vh"}
            onClick={viewMoreFunction}
          />
        </div>
      </div>
    </>
  );
};

const mapStateToProps = state =>{
  return{
    user: state.authReducer.user
  }
}

const mapDispatchToProps = {
  getActivitiesAndComments: itinerariesActions.getActivitiesAndComments,
  sendComment: itinerariesActions.sendComment,
  modifyComment: itinerariesActions.modifyComment,
  deleteComment: itinerariesActions.deleteComment,
  likeOrDislike: itinerariesActions.likeOrDislike
}
export default connect (mapStateToProps, mapDispatchToProps)(Itinerary);
