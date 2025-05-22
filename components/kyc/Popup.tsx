import { Modal } from 'react-bootstrap';
import styles from '@/styles/common.module.css';
import { useRouter } from "next/router";
export default function Popup({ show, setShow, status }: any) {
    const router = useRouter();
    const handleclose = () => {
        setShow(false)
        router.push('/security')
    }
    return (
        <Modal
            show={show}
            onHide={() => handleclose()}
            centered
            className={styles.custom_modal}
        >
            <Modal.Header closeButton className={styles.modal_head}>
                <Modal.Title>KYC</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    {status == 'pending' ? 'Your KYC is submitted successfully please wait for admin review' : 'Your KYC is completed successfully!'}
                </p>
            </Modal.Body>
            <Modal.Footer>
                <button className={styles.primary_btn} onClick={() => handleclose()}><label>Confirm</label></button>
            </Modal.Footer>
        </Modal>
    )
}
