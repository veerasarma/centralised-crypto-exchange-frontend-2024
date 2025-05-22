import { useState } from 'react'
import styles from '@/styles/common.module.css';
import { InputGroup, Form } from 'react-bootstrap';
import {
    getCountries,
    getCountryCallingCode,
} from "react-phone-number-input/input";
import en from "react-phone-number-input/locale/en.json";
import { isValidPhoneNumber } from "react-phone-number-input";
//improt lib
import isEmpty from '@/lib/isEmpty'
import { toastAlert } from '@/lib/toastAlert'
import { removeByObj } from '@/lib/validation'
//improt service
import { deactiveReq, deactiveConfirm } from "../../services/User/UserServices";
type FormValueType = {
    newPhoneNo: string
    otp: string
}
let initialFormValue: FormValueType = {
    newPhoneNo: '',
    otp: ''
}
export default function MobileForm() {
    const [country, setCountry] = useState<string>('AC');
    const [error, setError] = useState<any>({});
    const [formValue, setFormValue] = useState<FormValueType>(initialFormValue);
    const [isValidMobile, setIsValidMobile] = useState(false);
    const [loader, setLoader] = useState(false);
    const [usrNo, setUsrNo] = useState<string>('');
    const [submit, setSubmit] = useState(false);
    const { newPhoneNo, otp } = formValue

    const handleCountry = (e: string) => {
        setCountry(e)
        if (!isEmpty(e) && !isEmpty(newPhoneNo)) {
            let val = `+${getCountryCallingCode(e)}${newPhoneNo}`
            let res = isValidPhoneNumber(val);
            if (res) {
                setIsValidMobile(res);
                setError({
                    ...error,
                    newPhoneNo: "",
                });
            } else if (!isValidPhoneNumber(newPhoneNo)) {
                setError({
                    ...error,
                    newPhoneNo: "Invalid mobile no",
                });
                return;
            }
        }
    }

    const CountrySelect = ({ value, onChange, labels, ...rest }: any) => (
        <select
            {...rest}
            value={value}
            onChange={(event) => onChange(event.target.value || undefined)}
        >
            {getCountries().map((country: any) => (
                <option key={country} value={country}>
                    {labels[country]} +{getCountryCallingCode(country)}
                </option>
            ))}
        </select>
    );



    const handleMobileNo = (e: any) => {
        try {
            let num = e.target.value
            setError({});
            setFormValue({ ...formValue, ...{ 'newPhoneNo': num } })
            if (num === undefined) {
                setError({
                    ...error,
                    newPhoneNo: "Mobile Number required",
                });
                return;
            }
            if (isEmpty(num)) {
                setError({
                    ...error,
                    newPhoneNo: "Mobile Number required",
                });
                return;
            }
            if (!isEmpty(num)) {
                let val = `+${getCountryCallingCode(country)}${num}`
                let res = isValidPhoneNumber(val);
                if (res) {
                    setIsValidMobile(res);
                } else if (!isValidPhoneNumber(num)) {
                    setError({
                        ...error,
                        newPhoneNo: "Invalid mobile no",
                    });
                    return;
                }
            } else {
                setError({
                    ...error,
                    newPhoneNo: "Mobile Number required",
                });
                return;
            }
        } catch (err) {
            console.log('err: ', err);

        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { name, value } = e.target
        setFormValue({ ...formValue, ...{ [name]: value } })
        setError(removeByObj(error, name))
        setLoader(false)
    }
    const handleOTP = async (e: any) => {
        e.preventDefault();
        try {

            setLoader(true)

            if (!isValidMobile) {
                setLoader(false)
                setError({
                    ...error,
                    newPhoneNo: "Mobile Number is required",
                });
                return;
            }
            let reqData = {
                newPhoneNo,
                roleType: 2,
            };

            let response = await deactiveReq(reqData);
            if (response.data.success == true) {
                setUsrNo(newPhoneNo)
                setSubmit(true)
                setLoader(false);
                setFormValue(initialFormValue);
                setError({});
                toastAlert("success", response.data.message, "forgotPassword");
            }
        } catch (err: any) {
            setLoader(false);
            if (err?.response?.data?.errors) {
                setError(err.response.data.errors);
            }
            if (err?.response?.data?.message) {
                toastAlert("error", err.response.data.message, "forgotPassword");
            }
        }
    };


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            setLoader(true)
            let reqData = {
                newPhoneNo: usrNo,
                roleType: 1,
                otp
            };
            let response = await deactiveConfirm(reqData);
            if (response.data.success == true) {
                setSubmit(false)
                setLoader(false);
                setFormValue(initialFormValue);
                setError({});
                toastAlert("success", response.data.message, "deactive");
            }

        } catch (err: any) {
            setLoader(false);
            if (err?.response?.data?.errors) {
                setError(err.response.data.errors);
            }
            if (err?.response?.data?.message) {
                toastAlert("error", err.response.data.message, "deactive");
            }
        }
    };


    return (
        <>

            <div className={styles.login_tabs} >
                {
                    !submit &&
                    <>
                        <InputGroup className={`mb-4 pb-2 `}>
                            <CountrySelect
                                labels={en}
                                value={country}
                                onChange={handleCountry}
                                name="countrySelect"
                                className="form-select"
                            />
                        </InputGroup>
                        <InputGroup className={`mb-4 pb-2 `}>
                            <Form.Control
                                placeholder="Please enter your Mobile Number"
                                aria-label="mobile"
                                aria-describedby="basic-addon1"
                                onChange={handleMobileNo}
                            />
                        </InputGroup>
                        <p className='text-danger'>{error?.newPhoneNo}</p>
                    </>
                }

                {
                    submit &&
                    <>
                        <div className="mb-4 pb-2">
                            <Form.Control
                                placeholder="Please enter OTP"
                                aria-label="twoFACode"
                                aria-describedby="basic-addon2"
                                name='otp'
                                onChange={handleChange}
                            />
                            <p className='text-danger'>{error?.otp}</p>
                        </div>
                    </>
                }
                {
                    !submit ?
                        <>
                            {
                                <button className={`my-3 ${styles.primary_btn}`} onClick={handleOTP} disabled={loader}>{loader ? <i className="fa fa-spinner fa-spin" ></i> : 'Confirm'}</button>
                            }
                        </> : <button className={`my-3 ${styles.primary_btn}`} onClick={handleSubmit} disabled={loader}>  {loader ? <i className="fa fa-spinner fa-spin" ></i> : 'Confirm'} </button>
                }
            </div>

        </>
    )
}
