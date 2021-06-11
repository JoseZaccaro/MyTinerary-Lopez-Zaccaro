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
        firstName:joi.string().trim().min(3).max(12).pattern(new RegExp(namesRegExp)).messages({
            'string.min':'First name field must contain at least 3 characters',
            'string.max':'First name field must contain 12 characters or less',
            'string.empty':'This field cannot be empty, it is required',
            'string.pattern.base':'First name field must only contain letters, no numbers, spaces or special characters are allowed'
        }),
        lastName:joi.string().trim().min(3).max(12).pattern(new RegExp(namesRegExp)).messages({
            'string.min':'Last name field must contain at least 3 characters',
            'string.max':'Last name field must contain 12 characters or less',
            'string.empty':'This field cannot be empty, it is required',
            'string.pattern.base':'Last name field must only contain letters, no numbers, spaces or special characters are allowed'
        }),
        email:joi.string().trim().email().messages({
            'string.email':'You must enter a valid email',
            'string.empty':'This field cannot be empty, it is required'
        }),
        image:joi.string().trim().min(8).messages({
            'string.min':'The URL entered is not valid, please select another URL',
            'string.empty':'This field cannot be empty, it is required'
        }),
        country:joi.string().messages({
            'string.empty':'This field cannot be empty, it is required',
        }),
    })

    const validation = schema.validate(req.body, {abortEarly: true})
    console.log(req.body)
    console.log(validation)
    if(validation.error){
        return res.json({success:false, errores: validation.error.details})   
    }

    next()
}

module.exports = validator