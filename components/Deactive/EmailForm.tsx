import { useState } from 'react'
import styles from '@/styles/common.module.css';
import { InputGroup, Form } from 'react-bootstrap';
//import lib
import { removeByObj } from '@/lib/validation'
import { toastAlert } from '@/lib/toastAlert'
//improt service
import { deactiveReq, deactiveConfirm } from "../../services/User/UserServices";

type FomrValue = {
    email: string,
    otp: string
}
let initialFormValue: FomrValue = {
    email: '',
    otp: ''
}
export default function EmailForm() {
    const [formValue, setFormValue] = useState<FomrValue>(initialFormValue)
    const [error, setError] = useState<any>({})
    const [loader, setLoader] = useState<boolean>(false)
    const [submit, setSubmit] = useState<boolean>(false)
    const [usrEmail, setSUsrEmail] = useState<string>('')
    const { email, otp } = formValue

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { name, value } = e.target
        setFormValue({ ...formValue, ...{ [name]: value } })
        setError(removeByObj(error, name))
        setLoader(false)
    }

    const handleRequest = async (e: any) => {
        e.preventDefault();
        try {
            setLoader(true)
            let reqData = {
                email,
                roleType: 1,
            };
            let response = await deactiveReq(reqData);
            if (response.data.success == true) {
                setSUsrEmail(email)
                setSubmit(true)
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

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            setLoader(true)
            let reqData = {
                email: usrEmail,
                roleType: 2,
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
                <InputGroup className={`mb-4 pb-2 `}>
                    {
                        !submit ?
                            <Form.Control
                                placeholder="Please enter your email"
                                aria-label="mobile"
                                aria-describedby="basic-addon1"
                                name='email'
                                onChange={handleChange}
                                value={email}
                            /> :
                            <Form.Control
                                placeholder="Please enter otp"
                                aria-label="mobile"
                                aria-describedby="basic-addon1"
                                name='otp'
                                onChange={handleChange}
                                value={otp}
                            />
                    }

                </InputGroup>
                <p className='text-danger'>{error?.email}</p>
                <button className={`my-3 ${styles.primary_btn}`} onClick={!submit ? handleRequest : handleSubmit} disabled={loader}>  {loader ? <i className="fa fa-spinner fa-spin" ></i> : 'Confirm'} </button>
            </div>

        </>
    )
}
