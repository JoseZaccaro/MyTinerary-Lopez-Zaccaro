const User = require("../models/User");
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const path = require('path')

const authControllers = {

  signUpUser: async (req, res) => {
    const {firstName, lastName, email, password, country, googleUser, imageUrl} = req.body;
    let errores;
    let response;
    let claveHasheada
    // console.log(req.body)
    // console.log(req.files)
    const {image} = req.files ? req.files : req.body
    try{
    const emailRepeat = await User.findOne({ email });
    googleUser ? claveHasheada = bcryptjs.hashSync("Thegoogle123"+password, 10) : claveHasheada = bcryptjs.hashSync(password, 10) 
      if (!emailRepeat) {

        try{
          const usuario = new User({firstName, lastName, email, image, imageUrl, password:claveHasheada, country, googleUser});
          const {_id} = usuario
          if(imageUrl === 'null'){
            const fileName = _id + ".jpg"
            const path = `${__dirname, './'}/frontend/public/assets/${fileName}`
            // const path = `${__dirname, './'}/client/build/assets/${fileName}`
            usuario.image = '/assets/' + fileName
            
            image.name && image.mv(path, error =>{                
              if (error) {
                return res.json({success: false, errores: ["failed trying to save image"]})
              }
            })

          }

          await usuario.save()
          const token = jwt.sign({...usuario},process.env.SECRET_OR_KEY)
          response = {token:token, user:{ firstName:usuario.firstName, lastName:usuario.lastName, image:usuario.image, imageUrl:usuario.imageUrl, country:usuario.country, email:usuario.email, userId:usuario._id}} 
        }
        catch(e){
          console.log(e)
          errores=["Error in communication with our servers, it was not possible to register the new user"]
        }

      }else{
        req.body.googleUser ? errores=["Error, there is already a user registered with this google email, log in with google please"] : errores=["Error, there is already a registered user with this email"]
      }
      res.json({ 
        success: !errores ? true : false,
        response: !errores ? response: null,
        errores: errores
     });
    }
      catch{
          return {success:false, errores:["Error in communication with our servers"]}
      }
  },

  signInUser: async (req, res) => {
    let errores;
    let response;
    let passwordToDefine
    let errorMatchingPassword
    const {email, password} = req.body

      function comparePasswords(passwordToCompare,user) {
        const matchPassword = bcryptjs.compareSync(passwordToCompare, user.password)
        if (matchPassword) {
              const token = jwt.sign({...user},process.env.SECRET_OR_KEY)
              return response = token
            }else{
              return errores = ["Incorrect username and / or password"]
            }
      }
      
    try{

        const emailExist = await User.findOne({email})
        if (emailExist) {          
        await emailExist.googleUser ? passwordToDefine = "Thegoogle123"+password : passwordToDefine = password

        if(req.body.googleUser){
          if (req.body.googleUser === emailExist.googleUser) {
            errorMatchingPassword = comparePasswords(passwordToDefine,emailExist)
          }else{
            errores=[ "Email in use try to log in with google"]
          }
        }else{
          errorMatchingPassword = comparePasswords(passwordToDefine,emailExist)   
        }
        errorMatchingPassword.length === 1 ? errores = errorMatchingPassword : response = errorMatchingPassword  
        }else{
            errores=["Incorrect username and / or password"]
        }

        res.json({ 
          success: !errores ? true : false,
          response: !errores ? {token:response,user:{firstName:emailExist.firstName, image:emailExist.image, imageUrl:emailExist.imageUrl, email:emailExist.email, lastName:emailExist.lastName, country:emailExist.country, userId:emailExist._id}} : null,
          errores 
         });

    }catch{
      return {success:false, errores:["SIGN IN SERVER CONNECTION ERROR"]}
    }
  },

  signInLS: (req, res)=>{
      let errores
      let response

      req.user ?
      response = {user:{firstName:req.user.firstName, image:req.user.image,imageUrl:req.user.imageUrl, email:req.user.email, lastName:req.user.lastName, country:req.user.country, userId:req.user._id}} 
      : errrores = ["SIGNIN LS SERVER ERROR"]

      res.json({
        success: !errores ? true : false,
        response: !errores ? response : null,
        errores
      })
  },

  getUser: async (req,res)=>{
    let email = req.body.email
    let errores
    let response
    try{
      const userToFind = await User.findOne({ email });
      if(userToFind){
        const {firstName, lastName, image, imageUrl, country} = userToFind
        response = {firstName,lastName,email,image,country,imageUrl}
      }else{
        response = {firstName:"Error Triying to obtain user information",lastName:null,email:null,image:null,country:null}
      }
    }catch (error){
      errores = error
      response = ["Error triying to obtain user information"]
    }
    res.json({
      success: !errores ? true: false,
      response,
      errores
    })
  },
  userUpdate: async (req, res)=>{
    let {firstName, lastName, image, email, country,imageUrl} = req.body
    let errores
    let response

    try{
      const userUpdated = await User.findOneAndUpdate({email},{firstName,lastName,image,country,imageUrl},{new:true})
      const token = jwt.sign({...userUpdated},process.env.SECRET_OR_KEY)
      response = {token,user:{ firstName:userUpdated.firstName, image:userUpdated.image,imageUrl:userUpdated.imageUrl, email, lastName:userUpdated.lastName, country:userUpdated.country, userId:userUpdated._id}}
    }catch (error){
      console.log(error)
      errores = error 
      response = {user:{firstName:"Error Triying to update profile information",lastName:null,email:null,image:null,country:null}}
    }
    res.json({
      success: !errores ? true : false,
      response,
      errores
    })
  }
};

module.exports = authControllers;
