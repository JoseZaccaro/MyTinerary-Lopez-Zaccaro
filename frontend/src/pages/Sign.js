import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import authActions from "../redux/actions/authActions";
import { GoogleLogin } from 'react-google-login';
import { toast, Bounce } from 'react-toastify'
import Input from "../components/Input";

class Sign extends React.Component {

    state = {
        registerForm: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            image: "",
            country: ""
        },
        logInForm: {
            email: "",
            password: ""
        },
        countries: [],
        show: false,
        required: false,
        loaded: false,
        file: null
    }
    form = ""
    page = ""


    input = e => {
        const field = e.target.name
        const inputValue = e.target.value
        const form = e.target.dataset.form
        this.setState({
            ...this.state,
            [form]: { ...this.state[form], [field]: inputValue }
        })
    }

    inputImage = (e) => {

        this.setState({
            ...this.state,
            file: e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : null,
            registerForm: {
                ...this.state.registerForm,
                image: e.target.files[0] ? e.target.files[0] : null
            }
        })
    }



    errorToast = (message, position, timer = 3000, toastId) => {
        return toast.error(message, {
            position: position,
            autoClose: timer,
            closeOnClick: true,
            draggable: true,
            transition: Bounce,
            toastId: toastId
        });
    }


    submit = async (e) => {
        // console.log(e)
        e && e.preventDefault()
        let errores = null
        if (this.page === "In") {
            // ERRORES EN COMPARACION DE DATOS DE SIGN IN 
            errores = { ...await this.props.signIn(this.state[this.form]) }
        }
        else {
            // ERRORES DE VALIDACION EN SIGN UP
            const formData = new FormData()
            formData.append('firstName', this.state[this.form].firstName)
            formData.append('lastName', this.state[this.form].lastName)
            formData.append('email', this.state[this.form].email)
            formData.append('password', this.state[this.form].password)
            formData.append('country', this.state[this.form].country)
            formData.append('image', this.state.registerForm.image)
            formData.append('imageUrl', 'null')
            this.setState({ required: true })
            if (this.state.registerForm.image !== '') {
                errores = { ...await this.props.signUp(formData) }
            } else {
                this.errorToast("Upload an image", "bottom-left", 3000, 'uploadImage')
                errores = {}
            }
        }
        console.log(errores)
        if (errores.errores) {
            errores.errores.map((error, index) => this.errorToast(error.message ? error.message + " 📢at field: " + (error.context.label) : error, "bottom-left", 3500, index))
        }
    }

    responseGoogle = async (response) => {
        // ERRORES EN INICIO O REGISTRO CON GOOGLE
        if (response.error) {
            if (response.error === "popup_closed_by_user") {
                response.error = `Google Sing ${this.page} tab closed, please try again`
                this.errorToast(response.error, "bottom-left", 3000, response.error)
            }
        } else {
            const { givenName, familyName, googleId, imageUrl, email } = response.profileObj
            let errores = null
            if (this.page === "Up") {
                const newGoogleUser = { firstName: givenName, lastName: familyName, password: googleId, image: 'null', email, country: "GoogleUser", googleUser: true, imageUrl }
                errores = await this.props.signUp(newGoogleUser)
            } else {
                const googleUserToLogg = { email, password: googleId, googleUser: true }
                errores = await this.props.signIn(googleUserToLogg)
            }
            if (errores) {
                errores.errores.map((error, index) => this.errorToast(error, "bottom-left", 5500, index))
            }
        }
    }

    divSvgOnClick = () => {
        this.setState({ show: !this.state.show })
    }


    patterns = {
        name: '[a-zA-Z]+',
        url: '[!-~]{8,}',
        // eslint-disable-next-line
        email: '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+$',
        // eslint-disable-next-line
        password: '^[0-9]*[A-Za-z0-9]+[0-9]+$'
    }

    render() {

        this.page = this.props.match.params.inUp;
        let key
        let style
        let show
        let showEye
        if (this.state.show) {
            showEye = { WebkitMask: "url('/assets/showText.svg') no-repeat 100% 100%", backgroundColor: "white" }
            show = "text"
        } else {
            showEye = { WebkitMask: "url('/assets/noShowText.svg') no-repeat 100% 100%", backgroundColor: "lightgray" }
            show = "password"
        }
        let evaluate = this.page === "In"
        this.form = evaluate ? "logInForm" : "registerForm"
        let title = evaluate ? "Welcome!" : "Register"
        let submitButton = evaluate ? "Log In" : "Sign Up"
        let googleSign = evaluate ? "Sign In whit google" : "Sign Up with Google"
        let formToRender = evaluate ? Object.keys(this.state.logInForm) : Object.keys(this.state.registerForm)

        if (this.state.countries.length === 0 && !evaluate) {
            this.props.fetchCountries()
                .then(res => this.setState({ countries: res.response }))
                .catch(res => this.setState({ countries: res.response }))
        }
        return (
            <>
                <div className="contenedor">
                    <div className="sign">
                        <div className="form-container">
                            <div className="form-image" style={{ backgroundImage: "url('/assets/form-image.jpg')" }}>
                                <div className="have-create-acc">
                                    {<>
                                        <p>
                                            {this.page === "In" ? "Don't have an account?" : "Already have an account?"}
                                        </p>
                                        <button className="btn btn-primary">
                                            <Link to={this.page === "In" ? "/SignUp" : "/SignIn"}>
                                                {this.page === "In" ? "Sign Up!" : "Sign In!"}
                                            </Link>
                                        </button>
                                    </>}

                                </div>
                                <div className="google-acc">

                                    <GoogleLogin
                                        className="google-btn"
                                        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                                        buttonText={googleSign}
                                        onSuccess={this.responseGoogle}
                                        onFailure={this.responseGoogle}
                                        cookiePolicy={'single_host_origin'}
                                    />
                                </div>
                            </div>
                            <form className="form">
                                <h3 className="title-form">{title}</h3>
                                {
                                    formToRender.map((field, index) => {
                                        evaluate ? key = field + "In" : key = field + "Up"
                                        evaluate ? style = "text-input-noReq" : style = "text-input"
                                        // eslint-disable-next-line
                                        return (
                                            <div key={key} className="div-password">
                                                {field === 'image' ?
                                                    <div className="fileinputs" style={{ cursor: 'pointer' }}>
                                                        <input className='registerInput file' type='file' name={field} onChange={this.inputImage}></input>
                                                        <div className="fakefile">
                                                            <div className='renderAvatar' style={!this.state.registerForm.image ? { display: 'none' } : { backgroundImage: `url(${this.state.file})` }} />
                                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                <p>{!this.state.file ? 'Select Avatar' : `${this.state.registerForm.image.name.slice(0, 18)}${this.state.registerForm.image.name.length > 17 ? '...' : ''}`}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    : field === "password"
                                                        ?
                                                        <Input form={this.form} inputType={show} inputDefaultValue={this.state[field]}
                                                            inputPattern={this.patterns.password} inputId={index}
                                                            inputClassNames={style} inputPlaceholder={"Please, enter your " + field} inputName={field}
                                                            onChangeFunction={this.input} inputAutoComplete={"off"} optionalDivSvg={true}
                                                            divSvgClassNames={"show-password"} divSvgInLineStyles={showEye} divSvgOnClick={this.divSvgOnClick} required={this.state.required} />

                                                        : field !== "country" &&
                                                        <div className="div-password">
                                                            <Input form={this.form} inputType={field !== "email" ? "text" : "email"} inputDefaultValue={this.state[field]}
                                                                inputPattern={field !== "email" ? this.patterns.name : this.patterns.email} inputId={index}
                                                                inputClassNames={style} inputPlaceholder={"Please, enter your " + field} inputName={field} required={this.state.required}
                                                                onChangeFunction={this.input} inputAutoComplet={"off"} optionalDivSvg={false} />
                                                        </div>
                                                }
                                            </div>
                                        )
                                    }
                                    )
                                }
                                {
                                    this.page === "Up" &&
                                    <select className="select-input" name="country" value={this.state.registerForm.country} onChange={this.input} data-form={this.form}>
                                        <option value="" disabled>Chose your country</option>
                                        {this.state.countries.map(country => <option key={country.latlng[0] + "" + country.latlng[1]} value={country.name.official}>{country.name.common}</option>)}
                                    </select>
                                }

                                <button className="submit-btn" type='button' onClick={() => this.submit()}> {submitButton}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
const mapStateToProps = state => {
    return {
        user: state.authReducer.user
    }
}
const mapDispatchToProps = {
    signUp: authActions.signUp,
    signIn: authActions.signIn,
    fetchCountries: authActions.fetchCountries
}

export default connect(mapStateToProps, mapDispatchToProps)(Sign);
