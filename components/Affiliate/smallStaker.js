import Image from "next/image";
import styles from "../../styles/common.module.css";
import { useEffect, useState } from "react";
import { getStakers } from "../../services/affiliate/AffiliateService";

export default function SmallStaker({ handleShow, handleClose, handleData }) {
    const [stakerData, setStakerData] = useState([])

    const [planDetails, setPlanDetails] = useState([])

    const [loader, setLoader] = useState(false)

    const getStakeDet = async () => {
        try {
            setLoader(true)
            const { status, result, message } = await getStakers("small")
            if (status) {
                setStakerData(result)
                setPlanDetails(result.planDetails)
            }
            setLoader(false)
        }
        catch (error) {
            setLoader(false)
            console.log(error);
        }
    }

    useEffect(() => {
        getStakeDet()
    }, [])

    return (
        <div>
            {
                loader ? (
                    <div className="text-center">
                        <div class="spinner-border spinner-border-lg" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table class="table table-bordered staker_table">
                            <thead>
                                <tr>
                                    <th scope="col" style={{ width: "26%" }}>
                                        <div className="d-flex align-items-center">
                                            <Image
                                                src={require("../../public/assets/images/affiliate-program/b5_icon_1.png")}
                                                alt="Icon"
                                                width={28}
                                                height={32}
                                                className="me-3"
                                            />
                                            <span>Investment</span>
                                        </div>
                                    </th>
                                    {
                                        Array.isArray(planDetails) && planDetails.map((item) => (
                                            <th scope="col">{"$ " + item.investment}</th>
                                        ))
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="row_bg_1">
                                    <th scope="row" className="head_bg"> <div className="d-flex align-items-center">
                                        <Image
                                            src={require("../../public/assets/images/affiliate-program/b5_icon.png")}
                                            alt="Icon"
                                            width={32}
                                            height={32}
                                            className="me-3"
                                        />
                                        <span>Worth of B5 Tokens</span>
                                    </div></th>
                                    {
                                        Array.isArray(planDetails) && planDetails.map((item) => (
                                            <td>{item.tokenValue + `x ($ ${item.tokenValue * item.investment})`}</td>
                                        ))
                                    }
                                </tr>
                                <tr>
                                    <th scope="row" className="head_bg"> <div className="d-flex align-items-center gap-1">
                                        <Image
                                            src={require("../../public/assets/images/affiliate-program/b5_icon_2.png")}
                                            alt="Icon"
                                            width={23}
                                            height={29}
                                            className="me-3 ms-1"
                                        />
                                        <span>1st contributor</span>
                                    </div></th>
                                    {
                                        Array.isArray(planDetails) && planDetails.map((item) => (
                                            <td>{item.firstCont === 0 ? "-" : item.firstCont + `x ($ ${item.tokenValue * item.investment})`}</td>
                                        ))
                                    }
                                </tr>
                                <tr className="row_bg_1">
                                    <th scope="row" className="head_bg"> <div className="d-flex align-items-center">
                                        <Image
                                            src={require("../../public/assets/images/affiliate-program/b5_icon_3.png")}
                                            alt="Icon"
                                            width={32}
                                            height={32}
                                            className="me-3"
                                        />
                                        <div>
                                            <span>2nd contributor</span>
                                            <p className={`mb-0 mt-1 ${styles.affiliate_para}`}>(credited and visible but not able to withdraw)</p>
                                        </div>
                                    </div></th>
                                    {
                                        Array.isArray(planDetails) && planDetails.map((item) => (
                                            <td>{item.secondCont + `x ($ ${item.secondCont * item.investment})`}</td>
                                        ))
                                    }
                                </tr>
                                <tr>
                                    <th scope="row" className="head_bg">
                                        <div className="d-flex align-items-center">
                                            <Image
                                                src={require("../../public/assets/images/affiliate-program/b5_icon_4.png")}
                                                alt="Icon"
                                                width={35}
                                                height={32}
                                                className="me-3"
                                            />
                                            <span>3rd contributor</span>
                                        </div>
                                    </th>
                                    {
                                        Array.isArray(planDetails) && planDetails.map((item) => (
                                            <td>{item.thirdCont + `x ($ ${item.thirdCont * item.investment})`}</td>
                                        ))
                                    }
                                </tr>
                                <tr className="row_bg_1">
                                    <th scope="row" className="head_bg"> <div className="d-flex align-items-center">
                                        <Image
                                            src={require("../../public/assets/images/affiliate-program/b5_icon_5.png")}
                                            alt="Icon"
                                            width={32}
                                            height={32}
                                            className="me-3"
                                        />
                                        <span>Brokerage Return in %</span>
                                    </div></th>
                                    {
                                        Array.isArray(planDetails) && planDetails.map((item) => (
                                            <td>{item.brokerage}%</td>
                                        ))
                                    }
                                </tr>
                                <tr>
                                    <th scope="row">
                                    </th>
                                    {
                                        Array.isArray(planDetails) && planDetails.map((item, i) => (
                                            <td><div className={`${styles.table_btn}`}>
                                                <button className={styles.join_btn_1} onClick={() => { handleData(stakerData, item, "small"), handleShow() }}>Join Now</button>
                                            </div></td>
                                        ))
                                    }
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )
            }
        </div>
    )
}