import React from "react";
import CityCard from "../components/CityCard";
import Loader from "react-loader";
import Search from "../components/Search";
import { connect } from "react-redux";
import citiesActions from "../redux/actions/citiesActions";

class Cities extends React.Component {
  state = {
    parametro: "state",
    loaded: false
  };

  componentDidMount() {
    window.scroll({
      top: 0,
      left: 0,
    });

    // this.setState({loaded:true})

    if (this.props.citiesReference.length === 0) {
      this.props.getAllCitiesReference();
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.citiesReference.length !== 0) {
      return { loaded: true };
    }
    return null;
  }

  render() {
    if (!this.state.loaded) {
      return (
        <div className="contenedor">
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
        </div>
      );
    } else if (this.props.error) {
      return (
        <div className="contenedor">
          <section
            className="hero-cities"
            style={{ backgroundImage: "url('/assets/landscape.jpg')" }}
          ></section>
          <section className="main-section-cities">
            <div
              className="errorInPromise"
              style={{ backgroundImage: "url('/assets/Oops.jpg')" }}
            >
              {" "}
              <h2>
                A server error has occurred, and the content cannot be
                displayed. Refresh the page or open a new browser window
              </h2>
            </div>
          </section>
        </div>
      );
    } else if (this.props.cities.length === 0) {
      return (
        <div className="contenedor">
          <Search find={this.state.find} finding={this.state.finding} />
          <section className="main-section-cities">
            <div
              className="errorNoCity"
              style={{ backgroundImage: "url('/assets/Oops.jpg')" }}
            >
              <h2> Oops!</h2>
              <h3>
                We don't have any city or country that matches your search!
              </h3>
              <p>Try another one! </p>
            </div>
          </section>
        </div>
      );
    }

    return (
      <div className="contenedor">
        <Search find={this.state.find} finding={this.state.finding} />
        <section className="main-section-cities">
          {this.props.cities.map((city) => (
            <CityCard key={city._id} city={city} />
          ))}
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    citiesReference: state.citiesReducer.citiesReference,
    cities: state.citiesReducer.cities,
    error: state.citiesReducer.error,
  };
};

const mapDispatchToProps = {
  getAllCitiesReference: citiesActions.getAllCities,
};
export default connect(mapStateToProps, mapDispatchToProps)(Cities);
