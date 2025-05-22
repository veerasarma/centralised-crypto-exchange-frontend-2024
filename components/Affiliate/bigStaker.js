import Image from "next/image";
import styles from "../../styles/common.module.css";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { getStakers } from "../../services/affiliate/AffiliateService";


export default function BigStaker({ handleShow, handleClose, handleData }) {

    const [stakerData, setStakerData] = useState([])

    const [planDetails, setPlanDetails] = useState([])

    const [loader, setLoader] = useState(false)

    const getStakeDetails = async () => {
        try {
            setLoader(true)
            const { status, result, message } = await getStakers("big")
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
        getStakeDetails()
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
                    <div class="table-responsive">
                        <table class="table table-bordered staker_table">
                            <thead>
                                <tr>
                                    <th scope="col">
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
                                            <th scope="col">{item.investment + " " + stakerData?.coinNames[0]}</th>
                                        ))
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="row_bg">
                                    <th colspan="7" scope="row" className="head_bg">
                                        <div className="d-flex align-items-center">
                                            <Image
                                                src={require("../../public/assets/images/affiliate-program/b5_icon.png")}
                                                alt="Icon"
                                                width={32}
                                                height={32}
                                                className="me-3"
                                            />
                                            <span>B5 Token allocation</span>
                                        </div>
                                    </th>
                                </tr>
                                <tr>
                                    <th scope="row"> <div className="d-flex align-items-center">
                                        <Image
                                            src={require("../../public/assets/images/affiliate-program/b5_icon_6.png")}
                                            alt="Icon"
                                            width={20}
                                            height={22}
                                            className="me-3"
                                        />
                                        <span>1st Month</span>
                                    </div></th>
                                    {
                                        Array.isArray(planDetails) && planDetails.map((item) => (
                                            <td>{item.firstMonth}</td>
                                        ))
                                    }
                                </tr>
                                <tr>
                                    <th scope="row"> <div className="d-flex align-items-center">
                                        <Image
                                            src={require("../../public/assets/images/affiliate-program/b5_icon_6.png")}
                                            alt="Icon"
                                            width={20}
                                            height={22}
                                            className="me-3"
                                        />
                                        <span>2nd Month</span>
                                    </div></th>
                                    {
                                        Array.isArray(planDetails) && planDetails.map((item) => (
                                            <td>{item.secondMonth}</td>
                                        ))
                                    }
                                </tr>
                                <tr>
                                    <th scope="row"> <div className="d-flex align-items-center">
                                        <Image
                                            src={require("../../public/assets/images/affiliate-program/b5_icon_6.png")}
                                            alt="Icon"
                                            width={20}
                                            height={22}
                                            className="me-3"
                                        />
                                        <span>3rd Month</span>
                                    </div></th>
                                    {
                                        Array.isArray(planDetails) && planDetails.map((item) => (
                                            <td>{item.thirdMonth}</td>
                                        ))
                                    }
                                </tr>
                                <tr className="row_bg">
                                    <th colspan="7" scope="row" className="head_bg">
                                        <div className="d-flex align-items-center">
                                            <Image
                                                src={require("../../public/assets/images/affiliate-program/total_icon_1.png")}
                                                alt="Icon"
                                                width={33}
                                                height={33}
                                                className="me-3"
                                            />
                                            <span>ROI per month</span>
                                        </div>
                                    </th>

                                </tr>
                                <tr>
                                    <th scope="row"> <div className="d-flex align-items-center">
                                        <Image
                                            src={require("../../public/assets/images/affiliate-program/b5_icon_2.png")}
                                            alt="Icon"
                                            width={23}
                                            height={29}
                                            className="me-3"
                                        />
                                        <span>Self Invest. & 1 mandatory contributor</span>
                                    </div></th>
                                    {
                                        Array.isArray(planDetails) && planDetails.map((item) => (
                                            <td>{item.firstCont}%</td>
                                        ))
                                    }
                                </tr>
                                <tr>
                                    <th scope="row"> <div className="d-flex align-items-center">
                                        <Image
                                            src={require("../../public/assets/images/affiliate-program/b5_icon_3.png")}
                                            alt="Icon"
                                            width={31}
                                            height={32}
                                            className="me-3"
                                        />
                                        <span>2 contributors</span>
                                    </div></th>
                                    {
                                        Array.isArray(planDetails) && planDetails.map((item) => (
                                            <td>{item.secondCont}%</td>
                                        ))
                                    }
                                </tr>
                                <tr>
                                    <th scope="row"> <div className="d-flex align-items-center">
                                        <Image
                                            src={require("../../public/assets/images/affiliate-program/b5_icon_4.png")}
                                            alt="Icon"
                                            width={35}
                                            height={32}
                                            className="me-3"
                                        />
                                        <span>3 contributors</span>
                                    </div></th>
                                    {
                                        Array.isArray(planDetails) && planDetails.map((item) => (
                                            <td>{item.thirdCont}%</td>
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
                                    <th scope="row" >
                                    </th>
                                    {
                                        Array.isArray(planDetails) && planDetails.map((item, i) => (
                                            <td><div className={`${styles.table_btn}`}>
                                                <button className={styles.join_btn_1} onClick={() => { handleData(stakerData, item, "big"), handleShow() }}>Join Now</button>
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