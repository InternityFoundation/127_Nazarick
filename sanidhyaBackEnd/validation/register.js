const validator = require('validator');
const isEmpty = require('./is-empty')



module.exports = function validateRegistorInput(data) {

    let errors = {}

    data.name = !isEmpty(data.name) ? data.name : ''
    data.email = !isEmpty(data.email) ? data.email : ''
    data.password = !isEmpty(data.password) ? data.password : ''
    data.password2 = !isEmpty(data.password2) ? data.password2 : ''
    data.contact = !isEmpty(data.contact) ? data.contact : ''
    data.deviceid = !isEmpty(data.deviceid) ? data.deviceid : ''
    data.lastlocation = !isEmpty(data.lastlocation) ? data.lastlocation : ''

    if (!validator.isLength(data.name, { min: 2, max: 30 })) {
        errors.name = "Name must be between 2 and 30 characters";
    }

    if (isEmpty(data.name)) {
        errors.name = "Name field is required";
    }

    if (isEmpty(data.email)) {
        errors.email = "Email field is required";
    }
    else if (!validator.isEmail(data.email)) {
        errors.email = "Please Enter a valid email address";
    }

    if (isEmpty(data.password)) {
        errors.password = "Password is required";
    }
    else if (!isEmpty(data.password) && !validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = "Password must be 6 to 30 characters long"
    }

    if (data.password && isEmpty(data.password2)) {
        errors.password2 = "Please Enter the password again to confirm";
    }
    else if (!isEmpty(data.password) && !isEmpty(data.password2) && !validator.equals(data.password, data.password2)) {
        errors.password2 = "Password must match"
    }
    if (isEmpty(data.contact)) {
        errors.contact = "Contact field is required";
    }
    if (isEmpty(data.deviceid)) {
        errors.device = "Device field is required";
    }

    return ({
        errors,
        isValid: isEmpty(errors)
    })

}