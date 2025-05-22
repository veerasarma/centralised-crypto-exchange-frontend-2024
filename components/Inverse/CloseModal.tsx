import { Modal } from 'react-bootstrap';
import styles from '@/styles/common.module.css';
import spot from "@/styles/Spot.module.css";

export default function CancelModal({ show, setShow, handleSumbit, type }: any) {

    return (
        <>
            <Modal show={show} centered onHide={() => setShow(false)} className={styles.custom_modal}  >
                <Modal.Header closeButton className={styles.modal_head}>
                    <Modal.Title>{type == 'pos' ? 'Are you sure want to close this position' : ' Are you sure want to cancel this order'}  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={`${spot.form_box}`}>
                        <div className='row'>
                            <div className='col-md-6'>
                                <button className={spot.order_buy_btn} onClick={() => setShow(false)} >Cancel</button>
                            </div>
                            <div className='col-md-6'>
                                <button className={spot.order_sell_btn} onClick={() => handleSumbit()} >Confirm</button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}