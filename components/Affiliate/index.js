import styles from "../../styles/common.module.css";

//import Component
import SmallStaker from "./smallStaker"
import BigStaker from "./bigStaker"
import {
    Form,
    InputGroup,
    Modal,
    Container,
    DropdownButton,
    Dropdown
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getPlan, joinStakers } from "../../services/affiliate/AffiliateService";
import { toastAlert } from "@/lib/toastAlert";
import { useDispatch, useSelector } from "@/store";
import isEmpty from "../../lib/isEmpty";
import { getAssetData } from "@/store/Wallet/dataSlice";
import { toFixedDown } from '@/lib/roundOf';

export default function AffiliateProgram() {
    const [orderShow, setOrderShow] = useState(false);
    const handleShow = () => {
        setId(defaultId)
        setOrderShow(true)
    };
    const handleClose = () => setOrderShow(false);
    const { refferedBy } = useSelector((state) => state.auth.user)

    const router = useRouter();

    const [planData, setPlanData] = useState({})

    const [type, setType] = useState("")

    const [stakerData, setStakerData] = useState({})

    const handleData = (data, item, type) => {
        setPlanData(item)
        setType(type)
        const curName = type === "small" ? data.tokenNames[0] : data.coinNames[0]
        const curId = type === "small" ? data.tokens[0] : data.coins[0]
        if (type == "small") {
            setStakerData({ ...data, tokenName: curName, token: curId })
        }
        else {
            setStakerData({ ...data, coinName: curName, coin: curId })
        }
        setInvestment(item.investment)
        setSelectedValue(curName)
    }

    const [id, setId] = useState("")
    const [defaultId, setDefaultId] = useState("")

    const [loader, setLoader] = useState(false)

    const dispatch = useDispatch()

    const handleSubmit = async () => {
        try {
            setLoader(true)
            const reqData = {
                type,
                stakerData,
                planData,
                referralId: id,
                investment
            }
            const { status, message } = await joinStakers(reqData)
            if (status) {
                setLoader(false)
                dispatch(getAssetData())
                toastAlert("success", message);
                setTimeout(() => router.push("/affiliateUserDetail"), 1000)
            }
            else {
                setLoader(false)
                if (message) {
                    toastAlert("error", message);
                }
            }
        }
        catch (err) {
            setLoader(false)
            console.log(err);
        }
    }
    const fetchPlans = async () => {
        try {
            const { status, result } = await getPlan()
            if (status) {
                if (!isEmpty(result)) {
                    setId(result?.refferedBy)
                    setDefaultId(result?.refferedBy)
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (refferedBy) {
            setId(refferedBy)
            setDefaultId(refferedBy)
        } else {
            fetchPlans()
        }
    }, [refferedBy])

    const [selectedValue, setSelectedValue] = useState("");

    const handleSelect = (value, id) => {
        setSelectedValue(value);
        const curName = type === "small" ? stakerData.tokenNames.find((item) => item === value) : stakerData.coinNames.find((item) => item === value)
        const curId = type === "small" ? stakerData.tokens.find((item) => item === id) : stakerData.coins.find((item) => item === id)
        if (type == "small") {
            setStakerData({ ...stakerData, tokenName: curName, token: curId })
        }
        else {
            setStakerData({ ...stakerData, coinName: curName, coin: curId })
        }
    };

    const replaceTest = (value) => {
        if (value.includes('_')) {
            return value.split('_')[0];
        }
        return value;
    }

    const { priceConversion } = useSelector((state) => state?.wallet)

    const [investment, setInvestment] = useState("")

    useEffect(() => {
        if (planData && selectedValue) {
            if (Array.isArray(priceConversion) && priceConversion.length > 0) {
                if (selectedValue !== "USDT" && selectedValue !== "ETH") {
                    const { convertPrice } = priceConversion.find((item) => replaceTest(item.baseSymbol) === (type === "small" ? "USDT" : "ETH") && item.convertSymbol === selectedValue)
                    let cnvPrice = planData.investment * convertPrice
                    cnvPrice = toFixedDown(cnvPrice, 8)
                    setInvestment(cnvPrice)
                }
                else {
                    setInvestment(planData.investment)
                }
            }
        }
    }, [selectedValue])

    return (
        <>
            <div className={`${styles.asset} pb-4`}>
                <Container>
                    <div className={`${styles.affiliate_tab} pb-4`}>
                        <div className={styles.flex_nav}>
                            <ul className={`${styles.nav_gap} nav nav-tabs`} id="myTab" role="tablist">
                                <li className={`${styles.nav_item} nav-item`} role="presentation">
                                    <button
                                        className="affiliate_tab_content nav-link active"
                                        id="home-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#home"
                                        type="button"
                                        role="tab"
                                        aria-controls="home"
                                        aria-selected="true"
                                    >
                                        Small Staker & Marketer
                                    </button>
                                </li>
                                <li className={`${styles.nav_item} nav-item`} role="presentation">
                                    <button
                                        className="affiliate_tab_content nav-link"
                                        id="profile-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#profile"
                                        type="button"
                                        role="tab"
                                        aria-controls="profile"
                                        aria-selected="false"
                                    >
                                        Big Staker & Marketer
                                    </button>
                                </li>

                            </ul>


                        </div>
                        <div className="tab-content" id="myTabContent">
                            <div
                                className="tab-pane fade show active"
                                id="home"
                                role="tabpanel"
                                aria-labelledby="home-tab"
                            >
                                <SmallStaker handleShow={handleShow} handleClose={handleClose} handleData={handleData} />
                            </div>
                            <div
                                className="tab-pane fade"
                                id="profile"
                                role="tabpanel"
                                aria-labelledby="profile-tab"
                            >
                                <BigStaker handleShow={handleShow} handleClose={handleClose} handleData={handleData} />
                            </div>

                        </div>
                    </div>
                </Container>
            </div>
            {/* modal */}
            <Modal
                show={orderShow}
                onHide={handleClose}
                centered
                backdrop="static"
                className={`${styles.custom_modal} ${styles.post_order}`}
            >
                <Modal.Header closeButton className={`${styles.modal_head}`}>
                    <Modal.Title className={styles.title}>
                        <span>Select Package
                        </span>

                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={styles.modalContent}>
                        <div className={`${styles.input_grp} ${styles.input_grp_box}`}>
                            <label htmlFor="amountInput" className={`${styles.input_label}`}>
                                Investment Amount</label>
                            <InputGroup className="mt-2 amount_select">
                                <Form.Control
                                    placeholder=""
                                    type="number"
                                    className={`${styles.input_box_1}`}
                                    value={investment}
                                    disabled
                                />
                                <DropdownButton
                                    // variant="outline-secondary"
                                    title={selectedValue}
                                    id="input-group-dropdown-2"
                                    align="end"
                                    className={`${styles.input_text} ${styles.dark}`}
                                >
                                    {type === "small"
                                        ? stakerData?.tokenNames?.map((token, index) => (
                                            <Dropdown.Item href="#" key={index}
                                                onClick={() => handleSelect(token, stakerData?.tokens[index])}>{token}</Dropdown.Item>
                                        ))
                                        : stakerData?.coinNames?.map((coin, index) => (
                                            <Dropdown.Item href="#" key={index}
                                                onClick={() => handleSelect(coin, stakerData?.coins[index])}>{coin}</Dropdown.Item>
                                        ))}
                                </DropdownButton>
                            </InputGroup>
                        </div>
                        <div className={`${styles.input_grp} ${styles.input_grp_box}  mt-4`}>
                            <label htmlFor="amountInput" className={`${styles.input_label}`}>
                                Referral ID</label>
                            <InputGroup>
                                <Form.Control
                                    placeholder=""
                                    type="text"
                                    className={`${styles.input_box} mt-2`}
                                    disabled={!isEmpty(refferedBy)}
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                />
                            </InputGroup>
                        </div>
                        {
                            loader ? (
                                <button className={`${styles.join_btn_1} mt-4 mx-auto`} disabled>
                                    <div class="spinner-border spinner-border-sm" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                </button>
                            ) : (
                                <button className={`${styles.join_btn_1} mt-4 mx-auto`} onClick={handleSubmit}>Join Now</button>
                            )
                        }
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}