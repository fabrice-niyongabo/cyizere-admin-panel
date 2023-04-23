import React, { useEffect, useState, useRef } from "react";
import Axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Spinner } from "react-bootstrap";
import { BACKEND_URL } from "../../../constants";
import {
  currencyFormatter,
  errorHandler,
  setHeaders,
  toastMessage,
} from "../../../helpers";
import { fetchPaymentList } from "../../../actions/supplierpayments";
import Confirmation from "../../../controllers/confirmation";
import { WhatsAppOutlined } from "@ant-design/icons";

const initialState = {
  id: 0,
  marketId: 0,
  orderId: 0,
  agentId: 0,
};
function Edit({ showModal, setShowModal, editItem, fetchData }) {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const [state, setState] = useState(initialState);
  const [rejectPayment, setRejectPayment] = useState(false);
  const [approvePayment, setApprovePayment] = useState(false);
  const [reason, setReason] = useState("");
  const [image, setImage] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const imageRef = useRef(null);

  const handleApprove = () => {
    if (image === "") {
      toastMessage("error", "Please provide payment proof");
      return;
    }
    setSubmitting(true);
    const formData = new FormData();
    formData.append("file", image);
    formData.append("id", state.id);

    Axios.post(BACKEND_URL + "/suppliers/pay", formData, setHeaders(token))
      .then((res) => {
        toastMessage("success", res.data.msg);
        setSubmitting(false);
        setShowModal(false);
        dispatch(fetchPaymentList());
      })
      .catch((error) => {
        setSubmitting(false);
        errorHandler(error);
      });
  };

  useEffect(() => {
    if (showModal) {
      editItem && setState({ ...state, ...editItem });
      setRejectPayment(false);
      setApprovePayment(false);
      setImage("");
    }
  }, [showModal]);

  const handleRejectPayment = () => {
    setShowConfirmation(false);
    if (reason.trim() === "") {
      toastMessage(
        "error",
        "Please provide a reason for cancelling this transaction"
      );
      return;
    }
    setSubmitting(true);
    Axios.post(
      BACKEND_URL + "/suppliers/reject/",
      { ...state, reason },
      setHeaders(token)
    )
      .then((res) => {
        toastMessage("success", res.data.msg);
        setSubmitting(false);
        setShowModal(false);
        dispatch(fetchPaymentList());
      })
      .catch((error) => {
        setSubmitting(false);
        errorHandler(error);
      });
  };
  return (
    <>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Supplier Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3>{state.supplierNames}</h3>
          <p>
            <b>MOMO Code: </b> {state.supplierMOMOCode}
          </p>
          <p>
            <b>Amount: </b> {currencyFormatter(state.totalAmount)} RWF
          </p>
          {rejectPayment && (
            <div className="form-group mb-3">
              <textarea
                disabled={isSubmitting}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Rejection Reason"
                className="form-control"
              ></textarea>
            </div>
          )}
          {approvePayment && (
            <div className="form-group mb-3">
              <input
                type="file"
                name="image"
                className="form-control"
                onChange={(e) => setImage(e.target.files[0])}
                required
                disabled={isSubmitting}
                ref={imageRef}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {rejectPayment ? (
            <button
              type="button"
              className="btn btn-danger"
              disabled={isSubmitting}
              onClick={() => setShowConfirmation(true)}
            >
              Reject Payment
            </button>
          ) : approvePayment ? (
            <>
              <button
                type="submit"
                className="btn btn-success"
                disabled={isSubmitting}
                onClick={handleApprove}
              >
                {isSubmitting && <Spinner size="sm" />} Approve
              </button>
            </>
          ) : (
            <>
              <a
                href={`tel:*182*1*${state.supplierMOMOCode}*${state.totalAmount}#`}
              >
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  <WhatsAppOutlined />
                </button>
              </a>{" "}
              <button
                type="button"
                className="btn btn-success"
                disabled={isSubmitting}
                onClick={() => {
                  setApprovePayment(true);
                  setRejectPayment(false);
                }}
              >
                {isSubmitting && <Spinner size="sm" />} Approve Payment
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={isSubmitting}
                onClick={() => {
                  setRejectPayment(true);
                  setApprovePayment(false);
                }}
              >
                Reject Payment
              </button>
            </>
          )}
        </Modal.Footer>
      </Modal>
      <Confirmation
        showAlert={showConfirmation}
        setShowAlert={setShowConfirmation}
        callback={handleRejectPayment}
      />
    </>
  );
}

export default Edit;
