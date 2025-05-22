import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "@/styles/common.module.css";
import QRCode from "qrcode.react";
import {
  Container,
  Row,
  Col,
  InputGroup,
  DropdownButton,
  Dropdown,
  Form,
} from "react-bootstrap";
import { useRouter } from "next/router";
//import store
import { useSelector } from "../../store";
//import lib
import isEmpty from "@/lib/isEmpty";
import { upperCase } from "@/lib/stringCase";
import { truncateDecimals } from "@/lib/roundOf";
import { toastAlert } from "@/lib/toastAlert";
//impot component
import DepositHistory from "./DepositHistory";
import { createAdderss } from "../../services/Wallet/WalletService";
const spinner: React.CSSProperties = {
  fontSize: "20px",
};
export default function DepositForm() {
  const router = useRouter();
  const { id } = router.query;
  const { assets, currency } = useSelector((state: any) => state.wallet);
  const { idProof } = useSelector((state: any) => state.auth.user);
  const [userAsset, setUserAssetData] = useState<any>([]);
  const [selectAsset, setSelectAsset] = useState<any>({});
  const [tokenObj, setTokenObj] = useState<any>();
  const [isClient, setIsClient] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const handleAddress = async (id: string) => {
    try {
      setLoader(true);

      let data = {
        assetId:
          selectAsset.type == "crypto" ? selectAsset._id : tokenObj.currencyId,
      };
      let response: any = await createAdderss(data);
      setLoader(false);
      if (response.data) {
        toastAlert("success", "Address generated successfully", "wallet");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (err: any) {
      setLoader(false);
      if (err?.response?.data?.message) {
        toastAlert("error", err.response.data.message, "wallet");
      }
    }
  };
  const handleAsset = () => {
    let tempArr = [...assets];
    currency?.length > 0 &&
      currency.map((item: any, index: number) => {
        let pairIndex =
          tempArr &&
          tempArr.findIndex((el: any) => {
            return el._id == item._id;
          });
        if (pairIndex >= 0 && !isEmpty(pairIndex)) {
          let btnStatus = "deActive";
          if (item.type == "crypto" && item.status == "active") {
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
              minDeposit: item.minimumDeposit,
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
      //     let data = { ...tempArr[checkIndex]?.tokenAddressArray[0], ...{ minDeposit: currDoc?.minimumDeposit } }
      //     setTokenObj(data)
      // }
      setSelectAsset(tempArr[checkIndex]);
    } else {
      let newArr = tempArr.filter((item: any) => {
        return item.btnStatus == "active";
      });
      // if (newArr[0].type == 'token') {
      //     let currDoc = currency.find((e: any) => { return e._id == newArr[0]?.tokenAddressArray[0].currencyId })
      //     let data = { ...newArr[0]?.tokenAddressArray[0], ...{ minDeposit: currDoc?.minimumDeposit } }
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
    }
  };
  const copyToClipboard = (text: string) => {
    const tempInput = document.createElement("input");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    toastAlert("success", "Copied", "copy");
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
        ...{ minDeposit: currDoc?.minimumDeposit },
      };
      setTokenObj(data);
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
              <h5 className={`mb-0 ${styles.inner_head_title}`}>Deposit</h5>
            </Col>
          </Row>
          <button className={`${styles.primary_btn}`}>
            <span></span>
            <label className="mt-1" onClick={() => router.push("/withdraw")}>
              {" "}
              Withdraw
            </label>
          </button>
        </Container>
      </div>

      <Container>
        <Row className="pb-4">
          <Col lg={12} xxl={8}>
            {isClient && (
              //  idProof != 'approved' ?
              //     <div className={`mb-4  ${styles.box}`}>
              //         <div className={styles.step_flx} >
              //             <div className={styles.num}>1</div>

              //             <div className={`w-100 ${styles.right_box}`}>
              //                 <p className={"mb-3"} >Verification Requirements for Deposit Process</p>
              //                 <div className={styles.links} >
              //                     {
              //                         isClient && idProof != 'approved' && <Link href="#" className={styles.ylw} onClick={() => router.push('/kyc')}>Enable KYC to the Deposit process</Link>
              //                     }
              //                 </div>
              //             </div>

              //         </div>
              //     </div> :
              <div className={`mb-4  ${styles.box}`}>
                <div className={styles.step_flx}>
                  <div className={styles.num}>1</div>

                  <div className={`w-100 ${styles.right_box}`}>
                    <p className={"mb-3"}>
                      Choose the crypto you want to deposit
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
                          if (
                            item.btnStatus == "active" &&
                            item.type != "fiat"
                          ) {
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
                {!isEmpty(selectAsset?.tokenAddressArray) && (
                  <div className={styles.step_flx}>
                    <div className={styles.num}>2</div>

                    <div className={`w-100 ${styles.right_box}`}>
                      <p className={"mb-3"}>Select Network</p>
                      <DropdownButton
                        id="dropdown-basic-button"
                        className={`mb-3 ${styles.drp_down}`}
                        title={
                          <>
                            {!isEmpty(tokenObj?.tokenType)
                              ? upperCase(tokenObj?.tokenType)
                              : "select Token Type"}
                          </>
                        }
                      >
                        {selectAsset.type == "token" &&
                          selectAsset?.tokenAddressArray?.length > 0 &&
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
                )}

                <div className={styles.step_flx}>
                  <div className={styles.num}>
                    {isEmpty(selectAsset?.tokenAddressArray) ? 2 : 3}
                  </div>
                  <div className={styles.right_box}>
                    {(selectAsset?.type == "crypto" &&
                      isEmpty(selectAsset?.address)) ||
                      (selectAsset?.type == "token" &&
                        !isEmpty(tokenObj) &&
                        isEmpty(tokenObj.address)) ? (
                      <>
                        <p className={"mb-3"}>Generate Address </p>
                        <div className={`mb-4 ${styles.input_grp}`}>
                          <button
                            className={`${styles.animate} ${styles.primary_btn} w-100 d-block text-center`}
                            onClick={() => handleAddress(selectAsset)}
                            disabled={loader}
                          >
                            {!loader && (
                              <i
                                className="fa fa-address-book"
                                style={spinner}
                              ></i>
                            )}
                            {loader ? (
                              <i className="fa fa-spinner fa-spin"></i>
                            ) : (
                              "Generate Address"
                            )}
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className={"mb-3"}>Copy Address </p>
                        <span className={`mb-3 d-block ${styles.sm}`}>
                          The address is for {selectAsset?.coin} deposit only.
                          Losses resulted by wrongly depositing any other assets
                          to this address cannot be recovered.
                        </span>
                        <div className={`mb-4 ${styles.input_grp}`}>
                          <InputGroup>
                            <Form.Control
                              placeholder="Select Token Type"
                              aria-label="Recipient's username"
                              aria-describedby="basic-addon2"
                              className={styles.addr}
                              value={
                                !isEmpty(selectAsset?.address)
                                  ? selectAsset.address
                                  : !isEmpty(tokenObj?.address)
                                    ? tokenObj.address
                                    : ""
                              }
                            />
                            <InputGroup.Text id="basic-addon2" className="pe-3">
                              <Image
                                src="/assets/images/copy.png"
                                alt="image"
                                className={`img-fluid ${styles.copy}`}
                                width={18}
                                height={23}
                                onClick={() =>
                                  copyToClipboard(
                                    !isEmpty(selectAsset?.address)
                                      ? selectAsset.address
                                      : !isEmpty(tokenObj?.address)
                                        ? tokenObj.address
                                        : ""
                                  )
                                }
                              />
                            </InputGroup.Text>
                          </InputGroup>
                        </div>
                        {selectAsset?.type == "crypto" &&
                          (selectAsset?.coin?.toLowerCase() == "xrp" ||
                            selectAsset?.coin?.toLowerCase() == "ripple") && (
                            <>
                              <p className={"mb-3"}>Sequence Number</p>
                              <div className={`mb-4 ${styles.input_grp}`}>
                                <InputGroup>
                                  <Form.Control
                                    aria-label="Recipient's username"
                                    aria-describedby="basic-addon2"
                                    className={styles.addr}
                                    value={selectAsset?.destTag}
                                  />
                                  <InputGroup.Text
                                    id="basic-addon2"
                                    className="pe-3"
                                  >
                                    <Image
                                      src="/assets/images/copy.png"
                                      alt="image"
                                      className={`img-fluid ${styles.copy}`}
                                      width={18}
                                      height={23}
                                      onClick={() =>
                                        copyToClipboard(selectAsset?.destTag)
                                      }
                                    />
                                  </InputGroup.Text>
                                </InputGroup>
                              </div>
                            </>
                          )}

                        {(!isEmpty(selectAsset?.address) ||
                          !isEmpty(tokenObj?.address)) && (
                            <div className={`mb-4 ${styles.qrcode}`}>
                              <QRCode
                                value={
                                  !isEmpty(selectAsset?.address)
                                    ? selectAsset.address
                                    : tokenObj.address
                                }
                              />
                            </div>
                          )}
                        <div className={styles.amount_info}>
                          <Row>
                            <Col lg={7}>
                              <div className={styles.flx}>
                                <span>Minimum deposit amount:</span>
                                <h6>
                                  {selectAsset.type == "crypto"
                                    ? selectAsset?.minDeposit
                                    : tokenObj?.minDeposit}{" "}
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
                      </>
                    )}
                    <Row>
                      <Col lg={10}>
                        <span className={styles.sm}>
                          If the recharge amount is less than the minimum
                          recharge amount, the account may not be received
                        </span>
                      </Col>
                    </Row>
                  </div>
                </div>
                <div className={`m-0 p-0 border-0 ${styles.step_flx}`}>
                  <div className={styles.num}>
                    {isEmpty(selectAsset?.tokenAddressArray) ? 3 : 4}
                  </div>

                  <div className={styles.right_box}>
                    <p>Complete the deposit </p>
                  </div>
                </div>
              </div>
            )}
          </Col>
          <Col lg={12} xxl={4}>
            <div className={`p-4  ${styles.box}`}>
              <p className="mb-4">How to Deposit</p>
              <ul>
                <li>
                  <span>
                    Choose the crypto and network, and copy the deposit address
                    or save the QR code.
                  </span>
                </li>
                <li>
                  <span>
                    Paste the address or scan the QR code that you've copied to
                    the outside exchange/wallet, and start the withdrawal after
                    confirming the network.
                  </span>
                </li>
                <li>
                  <span>
                    It will take some time for the block to confirm your
                    withdrawal info., please wait patiently.
                  </span>
                </li>
                <li>
                  <span>Deposit assets will be credited to your account.</span>
                </li>
                {selectAsset?.type == "crypto" &&
                  (selectAsset?.coin?.toLowerCase() == "xrp" ||
                    selectAsset?.coin?.toLowerCase() == "ripple") && (
                    <li>
                      <span>
                        In order to activate an XRP Ledger wallet, a deposit of
                        at least 10 XRP has to be made. The first 10 XRP
                        deposited to an XRP Ledger account are reserved and
                        cannot be withdrawn.
                      </span>
                    </li>
                  )}
              </ul>
            </div>
          </Col>
        </Row>

        <div className={`mb-4 ${styles.deposit_table_flx}`}>
          <h5 className={`mb-0 ${styles.h5tag}`}>Deposit History</h5>
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
              Deposit has not arrived?
            </Link>
          </div>
        </div>

        <div className={styles.asset}>
          <div className={styles.asset_table}>
            <DepositHistory />
            <div className={`mb-4 mt-3 ${styles.deposit_table_flx}`}>
              <Link href="/history?type=deposit" className={styles.grey}>
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
