import { CustomInput } from 'reactstrap'
import {connect} from 'react-redux'
import citiesActions from '../redux/actions/citiesActions'


const Search = (props)=>{

        const finding = "Finding by countries."

        const find = "Do you prefer find by country?"

    return(<> 
    <section className="hero-cities" style={{backgroundImage:"url('/assets/landscape.jpg')"}}><h1>Welcome to your next fantasy travel!</h1></section>
    <section className="search-cities-section">
      <div className="div-input">
          
        <label htmlFor="city" className="input-label" style={props.disabled ? {opacity:"0",transform:"translate(1000px)"} : {opacity:"1"}} >Find the city of your dreams!</label>
        
        
        <input type="text" autoComplete="off" id="city" className="input-text" placeholder="New York" style={props.disabled ? {opacity:"0",transform:"translate(1000px)"} : {opacity:"1"}} onChange={(event)=>{props.filtrar(event)}} value={props.initialValue} ></input>
    </div>
    <div className="div-input">
    
        <label htmlFor="country" className="input-label" style={props.disabled ? {opacity:"1"} : {opacity:"0",transform:"translate(-1000px)"}} >Find the country!</label>
        
        <input type="text" autoComplete="off" id="country" className="input-text" placeholder="United Kingdom" style={props.disabled ? {opacity:"1"} : {opacity:"0",transform:"translate(-1000px)"}} onChange={(event)=>{props.filtrar(event)}} value={props.initialValue}></input>
    </div>
    <div className="div-check">
        
        <CustomInput type="switch" id="check" className="check"  name="countrys" onChange={(event)=>{props.check(event)}} />
        <label htmlFor="check" className="check find"> {props.checked ? finding : find} </label> 
        
    </div>
    </section>
    </>)
}


const mapStateToProps = state =>{
return {
    checked: state.citiesReducer.checked,
    disabled: state.citiesReducer.disabled,
    initialValue: state.citiesReducer.initialValue,
    citiesReference : state.citiesReducer.citiesReference
}
}
const mapDispatchToProps = {


        filtrar: citiesActions.findCities,
        check: citiesActions.check
    

}

export default connect(mapStateToProps,mapDispatchToProps)(Search)