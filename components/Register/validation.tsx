import isEmpty from '../../lib/isEmpty'
import { MyFormValuesError, MyFormValuesMobileError } from './types'

const registerValid = (value: any): object => {
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;
    let passwordRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\W).{6,18}/g;
    let emailRegQuotes = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (value.roleType == 1) {
        let errors = {} as MyFormValuesError;

        if (isEmpty(value.email)) {
            errors.email = "Email field is required";
        } else if (!emailRegex.test(value.email)) {
            errors.email = "Email is invalid";
        } else if (!emailRegQuotes.test(value.email)) {
            errors.email = "Email is invalid";
        }
        if (isEmpty(value.password)) {
            errors.password = "Password field is required";
        } else if (!passwordRegex.test(value.password)) {
            errors.password = 'Password should contain at least one uppercase, at least one lowercase, at least one number, at least one special character, and minimum 6 and maximum 18 characters';
        }
        if (isEmpty(value.confirmPassword)) {
            errors.confirmPassword = "Confirm password field is required";
        }
        if (!isEmpty(value.password) && !isEmpty(value.confirmPassword) && value.password != value.confirmPassword) {
            errors.confirmPassword = "Passwords must match";
        }
        if (!value.checkbox) {
            errors.checkbox = "You need to accept the terms and conditions"
        }
        if (isEmpty(value.reCaptcha)) {
            errors.reCaptcha = "ReCAPTCHA field is required";
        }
        return errors;

    } else {
        let errors = {} as MyFormValuesMobileError;

        if (value.roleType == 2) {
            if (isEmpty(value.newPhoneNo)) {
                errors.newPhoneNo = "Please enter your Mobile number";
            }
        }
        if (isEmpty(value.newPhoneCode)) {
            errors.newPhoneCode = "Please select your country";
        }
        if (isEmpty(value.password)) {
            errors.password = "Password field is required";
        } else if (!passwordRegex.test(value.password)) {
            errors.password = 'Password should contain at least one uppercase, at least one lowercase, at least one number, at least one special character, and minimum 6 and maximum 18 characters';
        }
        if (isEmpty(value.confirmPassword)) {
            errors.confirmPassword = "Confirm password field is required";
        }
        if (!isEmpty(value.password) && !isEmpty(value.confirmPassword) && value.password != value.confirmPassword) {
            errors.confirmPassword = "Passwords must match";
        }
        if (!value.checkbox) {
            errors.checkbox = "You need to accept the terms and conditions"
        }
        if (isEmpty(value.reCaptcha)) {
            errors.reCaptcha = "ReCAPTCHA field is required";
        }
        return errors;

    }
}
export default registerValid