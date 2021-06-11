import Input from './Input'
import { useState } from "react";
import { connect } from "react-redux";

const Comment = (props) => {
  const { comment,  editOrDelete} = props
  const [editing, setEditing] = useState(false)
  const [commentToEdit, setCommentToEdit] = useState(comment.comment.text)
  let estadoInicial = comment.comment.text
  const edit = (e)=>{
    setEditing(!editing)
  }
  const resetearEstado = (e)=>{
    setCommentToEdit(estadoInicial)
    setEditing(!editing)
  }
  const input = (e) =>{
    const inputValue = e.target.value
    setCommentToEdit(inputValue)
  }

  const evaluador = props.user &&(props.user.userId === comment.user.userId || !comment.user.userId) 
  const evalComment = editing && (commentToEdit.trim() !== "" && commentToEdit.trim() !== estadoInicial) 
  const keyEvaluator = (e)=>{
    return e.key === "Enter"
  }
    return (
    <div className={editing ? "comment-editing": "comment"}>
      <div className="comment-info-user">
        <div className="user-comment-image" style={{backgroundImage:`url(${comment.user.image})`}}></div>
      </div>

      <div className="message-comment-container">
        <p className="user-comment-name">{comment.user.firstName}:</p>
        { 
        editing ? 
          <Input inputType={"text"} onKeyPress={(e) => {evalComment &&  keyEvaluator(e) && (editOrDelete(e,commentToEdit) && edit(e))}} inputClassNames={"editing-comment"} commentId={comment.comment._id} inputDefaultValue={commentToEdit} inputName={"comment"}  autoFocus={editing} onChangeFunction={input} inputAutoComplete={"off"} />
        : 
          <p className="user-comment"> {comment.comment.text}</p>
        }
      </div>
        {
        evaluador &&
        <div className="btns-edit-delete">  
        <div className="btn-edit" style={editing ? {backgroundImage:"url('/icons/edited.png')"} : {backgroundImage:"url('/icons/edit.png')"} } onClick={evalComment ?  (e)=> {editOrDelete(e,commentToEdit) && edit(e)} : edit } data-commentid={comment.comment._id} data-btn="edit"  ></div>
        {
        editing ? <div className="btn-delete" style={{backgroundImage:"url('/icons/cancel.png')"}} onClick={resetearEstado} data-btn="delete" data-commentid={comment.comment._id} ></div> 
        :
        <div className="btn-delete" style={{backgroundImage:"url('/icons/remove.png')"}} onClick={editOrDelete} data-btn="delete" data-commentid={comment.comment._id} ></div>}
      </div>
      }
    </div>
  );
};
const mapStateToProps = state =>{
  return {
    user: state.authReducer.user
  }
}

export default connect(mapStateToProps)(Comment);
