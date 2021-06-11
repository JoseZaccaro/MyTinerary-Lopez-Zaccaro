
const initialState = {
    user: null,
    token: null,
    error:null,
    errores:null,
    toastShowed:false
}

const authReducer = (state = initialState, action)=>{

    // console.log('ACTION ----->',action)
    // console.log('STATE ----->',state)
    switch(action.type){
        case 'SIGN_IN':
            if(action.payload.success){
                    if(action.payload.response.token){
                        localStorage.setItem("token",action.payload.response.token)
                    }
                }
                return{
                    ...state,
                    ...action.payload.response
                }
            
        case 'SIGN_OUT':
            localStorage.clear()
            return{
                ...state,
                token:null,
                errores:null,
                toastShowed:false,
                ...action.payload
            }
        case 'TOAST_SHOWED':
            return{
                ...state,
                toastShowed:true
            }

        default:
            return state
    }
}

export default authReducer