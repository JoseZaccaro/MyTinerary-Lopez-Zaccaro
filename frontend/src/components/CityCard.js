
import {  faArrowAltCircleRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {Link} from 'react-router-dom'
const CityCard = ({city})=>{

    return(<>
    <div className="card-container">
        <Link to={`/city/${city._id}`} className="city-card" style={{backgroundImage:`url("${city.image}")`}}>
            <h2>{city.city}</h2>
            <p>{city.country}</p>
        </Link>
        <div className="city-info-card" >
            <h2>{city.city}</h2>
            <p><FontAwesomeIcon icon={faArrowAltCircleRight}/> {city.description}</p>
        </div>
    </div>
    </>)
    
}
export default CityCard