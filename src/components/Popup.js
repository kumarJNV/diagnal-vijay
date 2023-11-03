import React from 'react'
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Popup = (props) => {

    const closeTab = () => {
        window.location.replace('http://closed')
    }

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header>
                <Modal.Title id="contained-modal-title-vcenter">
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className='text-center'>
                <h5>Are you sure you want to exit?</h5>
            </Modal.Body>
            <Modal.Footer className='text-center d-lg-flex justify-content-center'>
                <Button onClick={closeTab} className='mx-4'>Yes</Button>
                <Button onClick={props.onHide} className='mx-4'>No</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default Popup