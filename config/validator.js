const joi = require('joi')
const passwordComplexity = require("joi-password-complexity");
const complexityOptions = {
    min: 5,
    max: 30,
    lowerCase: 3,
    upperCase: 1,
    numeric: 1,
    symbol: 0,
    requirementCount: 2,
  };

const validator = (req, res, next)=>{

    
    const namesRegExp = `[A-Za-z]{3,}`

    const schema = joi.object({
        firstName:joi.string().required().trim().min(3).max(12).pattern(new RegExp(namesRegExp)).messages({
            'string.min':'First name field must contain at least 3 characters',
            'string.max':'First name field must contain 12 characters or less',
            'string.empty':'This field cannot be empty, it is required',
            'string.pattern.base':'First name field must only contain letters, no numbers, spaces or special characters are allowed'
        }),
        lastName:joi.string().required().trim().min(3).max(12).pattern(new RegExp(namesRegExp)).messages({
            'string.min':'Last name field must contain at least 3 characters',
            'string.max':'Last name field must contain 12 characters or less',
            'string.empty':'This field cannot be empty, it is required',
            'string.pattern.base':'Last name field must only contain letters, no numbers, spaces or special characters are allowed'
        }),
        email:joi.string().required().trim().email().messages({
            'string.email':'You must enter a valid email',
            'string.empty':'This field cannot be empty, it is required'
        }),
        imageUrl:joi.required(),
        image:joi.optional(),
        password:joi.string().required().trim().min(5).max(30).messages({
            'string.min':'The password field must have 5 characters includin letters and numbers.',
            'string.max':'The password field must contain 30 characters or less',
            'string.empty':'This field cannot be empty, it is required',
            'string.pattern.base':'The password must have at least one or more letters and one or more numbers.',
        }),
        country:joi.string().required().messages({
            'string.empty':'This field cannot be empty, it is required',
        }),
        googleUser:joi.boolean().default(false)
    })

    const validation = schema.validate(req.body, {abortEarly: false})
    let passwordValidation
    !req.body.googleUser ? 
    passwordValidation = passwordComplexity(complexityOptions).messages({
        "passwordComplexity.uppercase":"Password must contain at least 1 uppercase letter",
        "passwordComplexity.numeric":"Password must contain at least 1 number",
        "passwordComplexity.requirementCount":"The password must meet at least 2 of the above requirements",
        "passwordComplexity.lowercase":"Password must contain at least 1 lowercase letter"
    }).validate(req.body.password,{abortEarly:false})
    :null
    
    if(validation.error){
        return res.json({success:false, errores: validation.error.details})   
    }else if(passwordValidation){
        if(passwordValidation.error){
            let messages = passwordValidation.error.details.map(detail => detail.message)
            return res.json({success:false, errores:messages})
        }
    }

    next()
}

module.exports = validator