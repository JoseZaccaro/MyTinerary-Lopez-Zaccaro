const initialState = {
    cities: [],
    citiesReference: [],
    city:{},
    disabled: false,
    checked: false,
    error:false,
    initialValue: "",
    itineraries: []
}

const citiesReducer = (state = initialState, action)=>{

    switch(action.type){
        
        case 'ALL_CITIES':
                return{
                    ...state,
                    ...action.payload
                } 
            
        case 'FIND_CITIES':
            return{
                ...state,
                initialValue: action.payload.initialValue,
                cities: state.citiesReference.filter(city => city[action.payload.search].toLowerCase().indexOf(action.payload.initialValue) === 0 )
            }
        case 'CHECK_STATE':
            return{
                ...state,
                disabled: !state.disabled,
                cities: state.citiesReference,
                ...action.payload
            }

        case 'FIND_CITY':
            return{
                ...state,
                ...action.payload
            }
        
        case 'FIND_ITINERARIES':
            return{
                ...state,
                ...action.payload
            }

        default:
            return state
    }
}

export default citiesReducer