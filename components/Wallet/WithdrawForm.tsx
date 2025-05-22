import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/common.module.css";
import {
  Container,
  Row,
  Col,
  InputGroup,
  DropdownButton,
  Dropdown,
  Form,
} from "react-bootstrap";
//import store
import { useSelector, useDispatch } from "../../store";
//import lib
import isEmpty from "@/lib/isEmpty";
import { toFixedDown, truncateDecimals } from "@/lib/roundOf";
import { upperCase } from "@/lib/stringCase";
import { precentConvetPrice } from "@/lib/calculation";
import { encryptObject } from "@/lib/cryptoJS";
import { toastAlert } from "@/lib/toastAlert";
import { removeByObj } from "@/lib/validation";
import { useRouter } from "next/router";
// import service
import { apiWithdrawRequestCoin } from "../../services/Wallet/WalletService";
import { getAssetData } from "../../store/Wallet/dataSlice";
//import component
import WithdrawHistory from "./WithdrawHistory";

type InitialType = {
  amount: string | number;
  address: string;
  twoFACode: string;
  password: string;
  destTag: string;
};
let initialFormValue: InitialType = {
  amount: "",
  address: "",
  twoFACode: "",
  password: "",
  destTag: "",
};
export default function WithdrawForm() {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  const { assets, currency } = useSelector((state: any) => state.wallet);
  const { idProof, assetPasswordStatus, twoFAStatus } = useSelector(
    (state: any) => state.auth.user
  );
  const [formValue, setFormValue] = useState<InitialType>(initialFormValue);
  const [userAsset, setUserAssetData] = useState<any>([]);
  const [selectAsset, setSelectAsset] = useState<any>({});
  const [tokenObj, setTokenObj] = useState<any>();
  const [error, setError] = useState<any>({});
  const [loader, setLoader] = useState<boolean>(false);
  const { address, amount, twoFACode, password, destTag } = formValue;
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isPassword, setIsPassword] = useState<boolean>(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    if (name == "amount") {
      let fee = precentConvetPrice(selectAsset.spotBal, selectAsset.fee);
      let withFee = toFixedDown(
        parseFloat(selectAsset.spotBal) - fee,
        selectAsset.decimals
      );
      if (
        value.split(".")[1] &&
        value.split(".")[1].length > selectAsset.decimals
      ) {
        return;
      }
      if (isNaN(value)) {
        return;
      }
      if (parseFloat(value) > withFee) {
        return setFormValue({ ...formValue, ...{ [name]: withFee } });
      }
    }
    setLoader(false);
    setError(removeByObj(error, name));
    setFormValue({ ...formValue, ...{ [name]: value } });
  };

  const handleAsset = () => {
    let tempArr = [...assets];
    currency?.length > 0 &&
      currency.map((item: any, index: number) => {
        let pairIndex =
          tempArr &&
          tempArr.findIndex((el: any) => {
            return el._id?.toString() == item._id?.toString();
          });
        if (pairIndex >= 0) {
          let btnStatus = "deActive";
          if (item.type == "crypto" && item?.status == "active") {
            btnStatus = "active";
          } else if (item.type == "token") {
            tempArr[pairIndex].tokenAddressArray.map((el: any) => {
              let currDoc = currency.find((e: any) => {
                return e._id == el.currencyId;
              });
              if (currDoc?.status == "active") {
                btnStatus = "active";
              }
            });
          }
          tempArr[pairIndex] = {
            ...tempArr[pairIndex],
            ...{
              image: item.image,
              minWithdraw: item.minimumWithdraw,
              fee: item.withdrawFee,
              decimals: item.decimals,
              type: item.type,
              btnStatus,
            },
          };
        }
      });
    setUserAssetData(tempArr);
    let checkIndex =
      tempArr &&
      tempArr.findIndex((el: any) => {
        return el._id == id;
      });
    if (checkIndex >= 0) {
      // if (tempArr[checkIndex].type == 'token') {
      //     let currDoc = currency.find((e: any) => { return e._id == tempArr[checkIndex]?.tokenAddressArray[0].currencyId })
      //     let data = { ...tempArr[checkIndex]?.tokenAddressArray[0], ...{ minWithdraw: currDoc?.minimumWithdraw, fee: currDoc?.withdrawFee } }
      //     setTokenObj(data)
      // }
      setSelectAsset(tempArr[checkIndex]);
    } else {
      let newArr = tempArr.filter((item: any) => {
        return item.btnStatus == "active";
      });
      // if (newArr[0].type == 'token') {
      //     let currDoc = currency.find((e: any) => { return e._id == newArr[0]?.tokenAddressArray[0].currencyId })
      //     let data = { ...newArr[0]?.tokenAddressArray[0], ...{ minWithdraw: currDoc?.minimumWithdraw, fee: currDoc?.withdrawFee } }
      //     setTokenObj(data)
      // }
      setSelectAsset(newArr[0]);
    }
  };

  const handleCoin = (coinID: string) => {
    let checkIndex = userAsset?.findIndex((el: any) => {
      return el._id == coinID;
    });
    if (checkIndex >= 0) {
      setSelectAsset(userAsset[checkIndex]);
      setTokenObj({});
      setLoader(false);
      setError({});
    }
  };

  const handleTokenArr = (type: string) => {
    let checkIndex = selectAsset?.tokenAddressArray?.findIndex((el: any) => {
      return el.tokenType == type;
    });
    if (checkIndex >= 0) {
      let currDoc = currency.find((e: any) => {
        return e._id == selectAsset?.tokenAddressArray[checkIndex].currencyId;
      });
      let data = {
        ...selectAsset?.tokenAddressArray[checkIndex],
        ...{ minWithdraw: currDoc?.minimumWithdraw, fee: currDoc?.withdrawFee },
      };
      setTokenObj(data);
      setLoader(false);
      setError({});
    }
  };
  const handleMax = () => {
    let fee = truncateDecimals(precentConvetPrice(selectAsset.spotBal, selectAsset.fee), selectAsset.decimals);
    let withFee = toFixedDown(
      parseFloat(selectAsset.spotBal) - fee,
      selectAsset.decimals
    );
    setFormValue({ ...formValue, ...{ amount: withFee } });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoader(true);
      let reqData = {
        coin: selectAsset.coin,
        currencyId: selectAsset._id,
        tokenCurrecnyAddress:
          selectAsset.type == "token" ? tokenObj?.currencyId : "",
        tokenType: !isEmpty(tokenObj) ? tokenObj?.tokenType : "",
        type: selectAsset.type,
        amount: amount,
        receiverAddress: address,
        twoFACode: twoFACode,
        password,
        isSecure: assetPasswordStatus,
        destTag,
      };
      let encryptToken = {
        token: encryptObject(reqData),
      };
      const result: any = await apiWithdrawRequestCoin(encryptToken);
      setLoader(false);
      if (result.data.success) {
        toastAlert("success", result.data.message, "withdraw");
        setFormValue(initialFormValue);
        setError({});
        dispatch(getAssetData());
      }
    } catch (err: any) {
      setLoader(false);
      if (!isEmpty(err?.response?.data?.errors))
        setError(err.response.data.errors);

      if (!isEmpty(err?.response?.data?.message))
        toastAlert("error", err.response.data.message, "withdraw");
    }
  };

  useEffect(() => {
    if (isEmpty(userAsset) && !isEmpty(assets) && !isEmpty(currency)) {
      handleAsset();
      setIsClient(true);
    }
  }, [assets, currency]);
  return (
    <>
      <div
        className={`mb-5 ${styles.inner_head_box} ${styles.inner_head_box_small}`}
      >
        <Container>
          <Row>
            <Col lg={4} className="text-center mx-auto">
              <h5 className={`mb-0 ${styles.inner_head_title}`}>Withdraw</h5>
            </Col>
          </Row>
          <button className={`${styles.primary_btn}`}>
            <span></span>
            <label className="mt-1" onClick={() => router.push("/deposit")}>
              {" "}
              Deposit
            </label>
          </button>
        </Container>
      </div>
      <Container>
        <Row className="pb-4">
          <Col lg={12} xxl={8}>
            <div className={`mb-4  ${styles.box}`}>
              <div className={styles.step_flx}>
                <div className={styles.num}>1</div>

                <div className={`w-100 ${styles.right_box}`}>
                  <p className={"mb-3"}>
                    Select the crypto you want to withdraw
                  </p>
                  <DropdownButton
                    id="dropdown-basic-button"
                    className={`mb-3 ${styles.drp_down}`}
                    title={
                      <>
                        {selectAsset?.image && (
                          <Image
                            src={selectAsset.image}
                            alt="image"
                            className="img-fluid me-3"
                            width={27}
                            height={27}
                          />
                        )}

                        {selectAsset?.coin}
                      </>
                    }
                  >
                    {userAsset?.length > 0 &&
                      userAsset.map((item: any, index: number) => {
                        if (item.btnStatus == "active") {
                          return (
                            <Dropdown.Item
                              eventKey={index}
                              onClick={() => handleCoin(item._id)}
                            >
                              {item.image && (
                                <Image
                                  src={item.image}
                                  alt="image"
                                  className="img-fluid me-3"
                                  width={27}
                                  height={27}
                                />
                              )}

                              {item.coin}
                            </Dropdown.Item>
                          );
                        }
                      })}
                  </DropdownButton>
                  <div className={styles.coin_info}>
                    <div>
                      <span>Available</span>
                      <p>{truncateDecimals(selectAsset?.spotBal, 8)}</p>
                    </div>
                    <div>
                      <span>In Orders</span>
                      <p>
                        {!isEmpty(selectAsset?.spotInOrder)
                          ? truncateDecimals(selectAsset?.spotInOrder, 8)
                          : 0}
                      </p>
                    </div>
                    <div>
                      <span>Total Amount</span>
                      <p>
                        {truncateDecimals(
                          parseFloat(selectAsset?.spotBal) +
                          truncateDecimals(selectAsset?.spotInOrder),
                          8
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.step_flx}>
                <div className={styles.num}>2</div>

                <div className={`w-100 ${styles.right_box}`}>
                  <p className={"mb-3"}>
                    Please fill in the withdrawal address and select the network
                  </p>
                  <div className={`mb-4  pb-2 ${styles.input_box}`}>
                    <Form.Control
                      placeholder="Please enter the withdrawal address"
                      aria-label="Recipient's username"
                      aria-describedby="basic-addon2"
                      name="address"
                      value={address}
                      onChange={handleChange}
                    />
                    <p className="text-danger">{error?.receiverAddress}</p>
                  </div>
                  {selectAsset?.type == "token" && (
                    <>
                      <div className={styles.step_flx}>
                        <div className={styles.num}>1</div>

                        <div className={`w-100 ${styles.right_box}`}>
                          <p className={"mb-3"}>Select Network</p>
                          <DropdownButton
                            id="dropdown-basic-button"
                            className={`mb-3 ${styles.drp_down}`}
                            title={
                              <>
                                {!isEmpty(tokenObj?.tokenType)
                                  ? upperCase(tokenObj?.tokenType)
                                  : "Select Token Type"}
                              </>
                            }
                          >
                            {selectAsset.type == "token" &&
                              selectAsset?.tokenAddressArray?.length >= 0 &&
                              selectAsset?.tokenAddressArray.map(
                                (item: any, index: number) => {
                                  let currDoc = currency.find((e: any) => {
                                    return e._id == item.currencyId;
                                  });
                                  if (currDoc?.status == "active") {
                                    return (
                                      <Dropdown.Item
                                        eventKey={index}
                                        onClick={() => {
                                          handleTokenArr(item.tokenType);
                                        }}
                                      >
                                        {upperCase(item.tokenType)}
                                      </Dropdown.Item>
                                    );
                                  }
                                }
                              )}
                          </DropdownButton>
                        </div>
                      </div>
                      <p className="text-danger">{error?.tokenType}</p>
                    </>
                  )}
                </div>
              </div>
              <div className={styles.step_flx}>
                <div className={styles.num}>3</div>

                <div className={styles.right_box}>
                  <p className={"mb-3"}>
                    {" "}
                    Please fill in the correct withdrawal information{" "}
                  </p>

                  <div className={`mb-2 ${styles.input_grp}`}>
                    <InputGroup>
                      <Form.Control
                        placeholder="Please enter the withdrawal amount"
                        aria-label="Recipient's username"
                        aria-describedby="basic-addon2"
                        name="amount"
                        value={amount}
                        onChange={handleChange}
                      />
                      <InputGroup.Text id="basic-addon2" className="pe-3">
                        <p className={styles.all} onClick={handleMax}>
                          All
                        </p>
                      </InputGroup.Text>
                    </InputGroup>
                    <p className="text-danger">
                      {error?.amount || error?.finalAmount}
                    </p>
                  </div>

                  {selectAsset?.type == "crypto" &&
                    (selectAsset?.coin?.toLowerCase() == "xrp" ||
                      selectAsset?.coin?.toLowerCase() == "ripple") && (
                      <>
                        <p className={"mb-3"}>Sequence Number (Optional)</p>
                        <div className={`mb-4 ${styles.input_grp}`}>
                          <Form.Control
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"
                            className={styles.addr}
                            onChange={handleChange}
                            name="destTag"
                            value={destTag}
                            type="number"
                          />
                        </div>
                        <p className="text-danger">{error?.destTag}</p>
                      </>
                    )}
                  {isClient && assetPasswordStatus && (
                    <>
                      <Form.Label> Asset Password </Form.Label>
                      <div className={`mb-4  ${styles.input_box}`}>
                        <InputGroup className={`mb-4 pb-2 ${styles.input_grp}`}>
                          <Form.Control
                            placeholder="Please enter password"
                            aria-label="password"
                            aria-describedby="basic-addon2"
                            onChange={handleChange}
                            type={!isPassword ? "password" : "text"}
                            name="password"
                          />
                          <InputGroup.Text
                            id="basic-addon2"
                            className="border-start-0"
                          >
                            {" "}
                            <i
                              className={`${styles.eye} ${isPassword
                                ? "fa-solid fa-eye"
                                : "fa-solid fa-eye-slash"
                                }`}
                              onClick={() =>
                                setIsPassword(isPassword ? false : true)
                              }
                            ></i>{" "}
                          </InputGroup.Text>
                        </InputGroup>
                        <p className="text-danger">{error?.password}</p>
                      </div>
                    </>
                  )}

                  {isClient && twoFAStatus == "enabled" && (
                    <>
                      <Form.Label> Two Factor Authentication </Form.Label>
                      <div className={`mb-4  ${styles.input_box}`}>
                        <Form.Control
                          placeholder="Please enter code"
                          aria-label="Recipient's username"
                          aria-describedby="basic-addon2"
                          name="twoFACode"
                          value={twoFACode}
                          onChange={handleChange}
                        />
                        <p className="text-danger">{error?.twoFACode}</p>
                      </div>
                    </>
                  )}

                  <div className={styles.links}>
                    {isClient && idProof != "approved" && (
                      <Link
                        href="/security?value=kyc"
                        className={styles.ylw}
                        onClick={() => router.push("/security?value=kyc")}
                      >
                        Enable KYC to the withdrawal process
                      </Link>
                    )}
                  </div>
                  <div className={styles.links}>
                    {isClient && twoFAStatus == "disabled" && (
                      <Link
                        href="/security?value=2fa"
                        className={styles.ylw}
                        onClick={() => router.push("/security?value=2fa")}
                      >
                        Enable 2FA to the withdrawal process
                      </Link>
                    )}
                  </div>

                  {isClient &&
                    idProof == "approved" &&
                    twoFAStatus == "enabled" && (
                      <button
                        className={`mb-4 ${styles.primary_btn}`}
                        onClick={handleSubmit}
                        disabled={loader}
                      >
                        <label>
                          {loader ? (
                            <i className="fa fa-spinner fa-spin"></i>
                          ) : (
                            "Withdrawal Confirmed"
                          )}
                        </label>
                      </button>
                    )}

                  <div className={styles.amount_info}>
                    <Row>
                      <Col lg={7}>
                        <div className={styles.flx}>
                          <span>Withdraw Fee:</span>
                          <h6>
                            {selectAsset.type == "crypto"
                              ? selectAsset?.fee
                              : tokenObj?.fee}
                            % {selectAsset?.coin}
                          </h6>
                        </div>
                        <div className={styles.flx}>
                          <span>Minimum withdraw:</span>
                          <h6>
                            {selectAsset.type == "crypto"
                              ? selectAsset?.minWithdraw
                              : tokenObj?.minWithdraw}{" "}
                            {selectAsset?.coin}
                          </h6>
                        </div>
                        <div className={styles.flx}>
                          <span>Estimated time to receive:</span>
                          <h6>10-30 Minutes</h6>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <Row>
                    <Col lg={10}>
                      <span className={styles.sm}>
                        If the recharge amount is less than the minimum recharge
                        amount, the account may not be received
                      </span>
                    </Col>
                  </Row>
                </div>
              </div>
              <div className={`m-0 p-0 border-0 ${styles.step_flx}`}>
                <div className={styles.num}>4</div>

                <div className={styles.right_box}>
                  <p>Complete the withdrawal</p>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={12} xxl={4}>
            <div className={`p-4  ${styles.box}`}>
              <p className="mb-4"> How to withdraw tokens</p>
              <ul>
                <li>
                  <span>
                    {" "}
                    Choose the network, and copy the address or save the QR code
                    of the outside exchange/wallet you'd like to deposit to.
                  </span>
                </li>
                <li>
                  <span>
                    Paste the address to B5Exchange, or scan the QR code that
                    you've copied, and start the withdrawal after confirming the
                    network.
                  </span>
                </li>
                <li>
                  <span>
                    It will take some time for the block to confirm your
                    withdrawal info., please wait patiently.
                  </span>
                </li>
                <li>
                  <span>The other platform will credit your asset.</span>
                </li>
              </ul>
            </div>
            {/* <div className={`p-4 mt-4  ${styles.box}`}>
                        <p className='mb-3'>Related Operation  </p>
                        <span className={styles.trade} >Trade</span>
                        <div className={styles.link_flx} >
                            <Link href="#"> BTC/USDT</Link>
                            <Link href="#">  ETH/USDT</Link>
                            <Link href="#"> LTC/USDT </Link>
                            <Link href="#"> TRX/USDT </Link>
                            <Link href="#"> DOGE/USDT </Link>
                            <Link href="#"> XRP/USDT </Link>
                            <Link href="#">  MATIC/USDT </Link>
                            <Link href="#"> BNB/USDT </Link>
                            <Link href="#"> USDC/USDT</Link>
                        </div>
                    </div> */}
          </Col>
        </Row>

        <div className={`mb-4 ${styles.deposit_table_flx}`}>
          <h5 className={`mb-0 ${styles.h5tag}`}>Withdraw History</h5>
          <div>
            <Link
              href="#"
              className={styles.ylw}
              onClick={() => router.push("/support-ticket")}
            >
              <Image
                src="/assets/images/info.png"
                alt="image"
                className="img-fluid me-2"
                width={24}
                height={24}
              />
              Withdrawals have not arrived yet?
            </Link>
          </div>
        </div>
        <div className={styles.asset}>
          <div className={styles.asset_table}>
            <WithdrawHistory />
            <div className={`mb-4 mt-3 ${styles.deposit_table_flx}`}>
              <Link href="/history?type=withdraw" className={styles.grey}>
                View More
                <Image
                  src="/assets/images/right_arw.png"
                  alt="image"
                  className="img-fluid ms-2"
                  width={14}
                  height={20}
                />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
