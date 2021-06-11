import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React,{ useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';
import {faCogs, faSignInAlt, faSignOutAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import authActions from '../redux/actions/authActions';
import {ToastContainer, toast, Bounce} from 'react-toastify'


 

const Header = (props) => {
  const toTopSmooth = ()=>{window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth'
  })}

  useEffect(() => {
    if(!props.toastShowed && props.user){
      toast.success("Logged Successfully" , {
        position: "top-center",
        autoClose: 1500,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        transition:Bounce,
      });
      props.toastShowedFunction()
    }
  }, [props])

  const signOut = ()=>{
    props.signOut()
  }
  
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggle = () => setDropdownOpen(prevState => !prevState);
    
    return (
        
        <header>
          <ToastContainer 
              hideProgressBar={true}
              newestOnTop={true}
              rtl={true}
              draggable
              pauseOnHover
              limit={3}/>

            <Link  to="/"  onClick={toTopSmooth} >

            <div className="logo" style={{backgroundImage:'url("/assets/logo.png")'}}>
                
            </div>

            </Link>

            <nav className="nav-header" >

            <Link  to="/" onClick={toTopSmooth} > 
               Home
            </Link>
            
            <Link to="/cities" onClick={toTopSmooth} > 
             Cities
            </Link>

                  {/* {console.log(props.user)} */}
            
      <Dropdown size="sm" direction="left" isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle caret
          tag="div"
          data-toggle="dropdown"
          aria-expanded={dropdownOpen}
        >
           {props.user ? 
            <img src={props.user.imageUrl === 'null' ?  props.user.image : props.user.imageUrl} alt="user-img" className="user"></img>
           :
            <img src="/icons/user.png" alt="user-img" className="user"></img>
           }

        </DropdownToggle>

        <DropdownMenu className="acc-dropdown">
      {!props.user ? <>
          <Link to="/SignIn" className="userLink">  <FontAwesomeIcon icon={faSignInAlt} />Log In</Link>
          <Link to="/SignUp" className="userLink">  <FontAwesomeIcon icon={faUserPlus} />Sign Up</Link>
      </>:<>
        <Link to="/config" className="userLink"><FontAwesomeIcon icon={faCogs}/>Configs</Link>
        <p onClick={signOut} className="userLink"><FontAwesomeIcon icon={faSignOutAlt}/>Log Out</p>
      </>}

        </DropdownMenu>
      </Dropdown>

            </nav>


        </header>

    )
}

const mapStateToProps = state =>{
  return{
    user: state.authReducer.user,
    toastShowed: state.authReducer.toastShowed

  }
}

const mapDispatchToProps = {

  signOut: authActions.signOut,
  toastShowedFunction: authActions.toastShowedFunction

}

export default connect(mapStateToProps, mapDispatchToProps)(Header)



