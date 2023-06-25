import React from 'react'
import Home from './pages/Home'
import Cities from './pages/Cities'
import {BrowserRouter,Route,Switch,Redirect} from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import City from './pages/City'
import Sign from './pages/Sign'
import Config from './pages/Config'
import { connect } from 'react-redux'
import authActions from './redux/actions/authActions'
import Loader from "react-loader";
import io from 'socket.io-client'

 class App extends React.Component {
  state = {
    loading: true,
    socket:null
  }

  componentDidMount(){
   const socket = io('https://mytinerary-backend.onrender.com/')
    this.setState({
      ...this.state,
      socket
  })
  }

    render(){

      if (!this.props.user && localStorage.getItem('token')) {
        this.props.signInLS(localStorage.getItem('token'))
        .then(res => {
          if(res !== "noUser" || !this.props.user){
            this.setState({loading:false})
          }
        })
        
        if(this.state.loading){
          return (<div className="contenedor">
              <Loader
              lines={8}
              length={50}
              width={10}
              radius={30}
              corners={1}
              rotate={0}
              direction={1}
              color="#fff"
              speed={1}
              trail={60}
              shadow={false}
              hwaccel={false}
              className="spinner"
              zIndex={2e9}
              top="50%"
              left="50%"
              scale={1.0}
              loadedClassName="loadedContent"
            />
          </div>)
      }
      }
      return(
          <BrowserRouter >
            <Header/>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/cities" component={Cities}/>
              <Route path="/city/:id" render={(props)=><City router={{...props}} socket={this.state.socket} />}/>
              { !this.props.user || !this.props.token ? <Route path="/sign:inUp" component={Sign}/> : null }
              { this.props.user || this.props.token ? <Route path="/config" component={Config}/> : null }
              <Redirect to="/" />
            </Switch>
            <section className="footer-section">
            <Footer/>
          </section>
          </BrowserRouter>
 
    )
  }
}

const mapStateToProps = state => {
  return{
    user: state.authReducer.user,
    token: state.authReducer.token
  }
}

const mapDispatchToProps = {
  signInLS: authActions.signInLS
}

export default connect(mapStateToProps,mapDispatchToProps)(App)
