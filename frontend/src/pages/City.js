import { faHome, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Loader from "react-loader";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import citiesActions from "../redux/actions/citiesActions";
import itinerariesActions from "../redux/actions/ItinerariesActions";
import Itinerary from "../components/Itinerary";

class City extends React.Component {

  idABuscar = this.props.router.match.params.id
  state = {
    loaded: false,
    city:{},
    parametro:"state",
    itineraries:[]
  };
  

  componentDidMount() {
    window.scroll({
      top: 0,
      left: 0,
    });

    if(this.props.citiesReference.length !== 0){
        this.setState({city: this.props.citiesReference.find((city) => city._id === this.idABuscar)});
    }else{
        this.props.findCity(this.idABuscar)
        if(this.props.city){
            this.setState({parametro:"props"});
        }
    }
    this.props.findItineraries(this.idABuscar)
  }
  
  static getDerivedStateFromProps(props,state){
 
    if(!state.loaded && props.itineraries[0]){
      return({loaded:true})
    }
    return null
  }

  componentWillUnmount(){
    this.props.resetItineraries()
  }

  render() {

  if (this.props.error) {
    return (
      <div className="contenedor">
        <section
          className="hero-cities"
          style={{ backgroundImage: "url('/assets/landscape.jpg')" }}
        ></section>
        <section className="main-section-cities"></section>
        <div
          className="errorInPromise"
          style={{ backgroundImage: "url('/assets/Oops.jpg')" }}
        >
          <h2>
            A server error has occurred, and the content cannot be displayed.
            Refresh the page or open a new browser window
          </h2>
        </div>
        <div className="botones">
          <Link to="/" className="boton-home">
            Go Home <FontAwesomeIcon icon={faHome} className="btnIcon" />
          </Link>
          <Link to="/cities" className="boton-cities">
            Go Back to Cities
            <FontAwesomeIcon icon={faPaperPlane} className="btnIcon" />
          </Link>
        </div>
      </div>
    );
  }
  if(!this.state.loaded){
    return (
      <div className="contenedor" style={{flexDirection:"column-reverse",paddingTop:"10vh"}}>
        <Loader
          loaded={this.state.loaded}
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
        <p className="loading-itineraries"> Loading Itineraries...</p>
      </div>
    );
  }
    return (
      <div className="contenedor">
        <div className="city-banner" style={{ backgroundImage: `url(${this[this.state.parametro].city.image})` }}>
          <h2> {this[this.state.parametro].city.city} awaits you!! </h2>
          <p>
            For more information about the itineraries of this city. Scroll a
            little further down to see all the info.
          </p>
        </div>
        <div className="contenedor-itineraries">          
        { 
        this.props.itineraries[0] === "NoItineraries" 
        ?
          <div className="itinerary-container">
            <div className="title">
              <h2 style={{color:"white"}}> Itineraries not found for this city. Be the first one!</h2>
            </div>
            <div className="info-container" style={{backgroundImage:"url('/assets/Oops.jpg')", height:"100%", borderRadius:"10px",padding:"12vh 0"}}>
            <div className="name-image" style={{width:"100%", color:"white", textShadow:" 1px 1px 2px white", backgroundColor:"rgba(0,0,0,0.8)"}}>
                <h3>We don't have any itineraries yet for this city </h3>
              </div>
            </div>
          </div>
        :
        this.props.itineraries.map(itinerary => <Itinerary key={itinerary._id} itinerary={itinerary} socket={this.props.socket}/>)
      }
        </div>

        <div className="botones">
          <Link to="/" className="boton-home">
            Go Home <FontAwesomeIcon icon={faHome} className="btnIcon" />
          </Link>
          <Link to="/cities" className="boton-cities">
            Go Back to Cities
            <FontAwesomeIcon icon={faPaperPlane} className="btnIcon" />
          </Link>
        </div>
      </div>
    );
  }
}



const mapStateToProps = (state) => {
  return {
    citiesReference: state.citiesReducer.citiesReference,
    cities: state.citiesReducer.cities,
    city: state.citiesReducer.city,
    itineraries: state.itinerariesReducer.itineraries,
    error: state.citiesReducer.error
  };
};
const mapDispatchToProps = {

    getAllCitiesReference:citiesActions.getAllCities,
    findCity: citiesActions.findCity,
    findItineraries: itinerariesActions.findItineraries,
    resetItineraries: itinerariesActions.resetItineraries

};

export default connect(mapStateToProps, mapDispatchToProps)(City);
