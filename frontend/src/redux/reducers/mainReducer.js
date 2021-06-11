import {combineReducers} from 'redux'
import authReducer from './authReducer'
import citiesReducer from './citiesReducer'
import itinerariesReducer from './itinerariesReducer'


const mainReducer = combineReducers({
    citiesReducer,
    itinerariesReducer,
    authReducer
    
    
})

export default mainReducer