import React from 'react'
import { connect } from 'react-redux'
import authActions from '../redux/actions/authActions'
import { toast, Bounce } from 'react-toastify'
import Loader from "react-loader";
import Input from '../components/Input'

class Config extends React.Component {
    imageRef = React.createRef()
    state = {
        user: null,
        fields: {
            firstName: "",
            lastName: "",
            image: "",
            country: ""
        },
        countries: null
    }


    componentDidMount() {
        window.scroll({
            top: 0,
            left: 0,
        })
        this.props.getUser(this.props.user.email)
            .then(data => this.setState({ user: data.data.response }))
        this.props.fetchCountries()
            .then(res => this.setState({ countries: res.response }))
            .catch(res => this.setState({ countries: res.response }))
    }


    toastS = (toastType, message, position, timer = 3000, toastId) => {
        return toast[toastType](message, {
            position: position,
            autoClose: timer,
            closeOnClick: true,
            draggable: true,
            transition: Bounce,
            toastId: toastId
        });
    }

    patterns = {
        firstName: '^([A-Za-z]{3,})+$',
        lastName: '^([A-Za-z]{3,})+$',
        image: '[!-~]{8,}',
    }
    input = e => {
        const field = e.target.name
        const inputValue = e.target.value
        this.setState({
            ...this.state,
            fields: { ...this.state.fields, [field]: inputValue }
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

    inputImage = (e) => {
        this.setState({
            ...this.state,
            fields: {
                ...this.state.fields,
                image: e.target.files[0]
            }
        })
    }

    submit = async (event) => {
        event.preventDefault()
        let firstName = this.state.fields.firstName === "" ? this.props.user.firstName : this.state.fields.firstName
        let lastName = this.state.fields.lastName === "" ? this.props.user.lastName : this.state.fields.lastName
        let image = this.state.fields.image === "" ? this.props.user.image : this.state.fields.image
        console.log(this.state.fields.image);
        let country = this.state.fields.country === "" ? this.props.user.country : this.state.fields.country
        const formData = new FormData()
        formData.append('firstName', firstName)
        formData.append('lastName', lastName)
        formData.append('email', this.state.user.email)
        formData.append('country', country)
        formData.append('image', image)
        // formData.append('imageUrl', 'null') 

        if (firstName !== this.props.user.firstName || lastName !== this.props.user.lastName || image !== this.props.user.image || country !== this.props.user.country) {
            this.props.updateUser(formData)
                .then(errores => {
                    if (errores && errores.errores) {
                        errores.errores.map((error, index) => this.errorToast(error.message ? error.message + " 📢at field: " + (error.context.label) : error, "bottom-left", 3500, index))
                    } else if (errores.success) {
                        this.toastS("success", "Saving changes", "bottom-center", 3500, "saved")
                    }
                })
                .catch(error => console.log(error))
        } else {
            this.toastS("warning", "No changes to save", "bottom-center", 3500, "noChanges")
        }
    }
    scrollToChangeImage = () => {
        this.imageRef.current.scrollIntoView({ behavior: 'smooth' })
        setTimeout(() => {
            this.imageRef.current.focus()
        }, 500)
    }
    render() {

        let fields = Object.keys(this.state.fields)
        if (!this.state.user) {
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
        let editUser = { WebkitMask: "url('/assets/editUser.svg') no-repeat 100% 100%", backgroundColor: "beige" }
        return (
            <div className="contenedor">
                <div className="personal-info-container">
                    <h2 className="title-config-form">Your personal information</h2>
                    <div className="info-divs-container">
                        <div className="info-left">
                            <p>Profile Image</p>
                            <div className="config-image-user-container">
                                <div className="config-image-user" style={{ backgroundImage: `url(${this.props.user.imageUrl === 'null' ? this.props.user.image : this.props.user.imageUrl})` }} onClick={this.scrollToChangeImage} htmlFor={"image"}></div>
                            </div>
                        </div>
                        <div className="info-right">
                            <div><p>Name: {this.props.user.firstName + " " + this.props.user.lastName}</p></div>
                            <div><p>Country: {this.props.user.country === "GoogleUser" ? "Select one below" : this.props.user.country}</p></div>
                        </div>
                    </div>
                </div>
                <div className="config-container">
                    <h3 className="title-config-form">Below, you can add or edit the information to your account.</h3>
                    <div className="div-inputs-container">
                        <div className="div-inputs-left">
                            {
                                fields.map((field, index) => {
                                    return (field === "image" ? <div key={index}>
                                        <label htmlFor={field} ref={field === "image" && this.imageRef} className="config-label">Here enter your new {field === "firstName" ? "First Name" : field === "lastName" ? "last Name" : field} <div className="edit-user" style={editUser} ></div></label>

                                        <div className="fileinputs" style={{ cursor: 'pointer' }}>
                                            <input className='registerInput file' type='file' name={field} onChange={this.inputImage} accept='.jpg,.gif,.png'></input>

                                            <div className="fakefile">
                                                <div className='renderAvatar' style={!this.state.registerForm?.image ? { display: 'none' } : { backgroundImage: `url(${this.state.file})` }} />
                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <p>{!this.state.file ? 'Select Avatar' : `${this.state.registerForm.image.name.slice(0, 18)}${this.state.registerForm.image.name.length > 17 ? '...' : ''}`}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                        : field !== "country" && <div key={index}>
                                            <label htmlFor={field} ref={field === "image" && this.imageRef} className="config-label">Here enter your new {field === "firstName" ? "First Name" : field === "lastName" ? "last Name" : field} <div className="edit-user" style={editUser} ></div></label>

                                            <div className="fileinputs" style={{ cursor: 'pointer' }}>
                                                <Input inputType='text' inputPattern={this.patterns[field]} inputPlaceholder={field}
                                                    inputName={field} onChangeFunction={this.input} textLabel={field} />
                                            </div>
                                        </div>
                                    )
                                }
                                )
                            }
                            <select id="country" className="select-input-config" name="country" defaultValue={this.state.fields.country} onChange={this.input} >
                                <option value="">Select your country</option>
                                {this.state.countries.map(country => <option key={country.latlng[0] + "" + country.latlng[1]} value={country.name.official}>{country.name.common}</option>)}
                            </select>
                        </div>
                        <div className="div-inputs-right" style={{ backgroundImage: "url('/assets/writing.jpg')" }}></div>
                    </div>
                    <div className="config-btn-container">
                        <button className="submit-btn" onClick={this.submit}>Save changes</button>
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        user: state.authReducer.user
    }
}
const mapDispatchToProps = {
    fetchCountries: authActions.fetchCountries,
    updateUser: authActions.updateUser,
    getUser: authActions.getUser
}

export default connect(mapStateToProps, mapDispatchToProps)(Config)