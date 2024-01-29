import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Confirmation from "../../../controllers/confirmation";
import { BACKEND_URL } from "../../../constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import {
  currencyFormatter,
  errorHandler,
  setHeaders,
  toastMessage,
} from "../../../helpers";
import { setAddOrUpdateOrder } from "../../../actions/orders";
function OrderSettings({ showModal, setShowModal, order }) {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [showCancellAlert, setShowCancellAlert] = useState(false);
  const [showApproveAlert, setShowApproveAlert] = useState(false);

  const handleCancellOrder = () => {
    setIsLoading(true);
    axios
      .post(
        BACKEND_URL + "/orders/cancell",
        { orderId: order.id },
        setHeaders(token)
      )
      .then((res) => {
        setIsLoading(false);
        dispatch(setAddOrUpdateOrder(res.data.order));
        toastMessage("success", res.data.msg);
        setShowModal(false);
      })
      .catch((error) => {
        setIsLoading(false);
        errorHandler(error);
      });
  };

  const handleManualApproveOrder = () => {
    setIsLoading(true);
    axios
      .post(
        BACKEND_URL + "/transactions/manual",
        { id: order.id },
        setHeaders(token)
      )
      .then((res) => {
        setIsLoading(false);
        dispatch(setAddOrUpdateOrder(res.data.order));
        toastMessage("success", res.data.msg);
        setShowModal(false);
      })
      .catch((error) => {
        setIsLoading(false);
        errorHandler(error);
      });
  };

  if (!order) return null;

  return (
    <>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton={!isLoading}>
          <Modal.Title>Order Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="p-0 m-0">
            <b>Order ID:</b> #{order.id}
          </p>
          <p className="p-0 m-0">
            <b>Order products:</b> {order.cartItems.length}
          </p>
          <p className="p-0 m-0">
            <b>Total Amount:</b>{" "}
            {currencyFormatter(
              Number(order.cartTotalAmount) +
                Number(order.deliveryFees) +
                Number(order.systemFees) +
                Number(order.packagingFees)
            )}{" "}
            RWF
          </p>
          <p className="p-0 m-0">
            <b>Payment Status:</b> {order.paymentStatus}
          </p>
          <hr />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "5px",
            }}
          >
            <button
              disabled={isLoading}
              className="btn btn-danger"
              onClick={() => setShowCancellAlert(true)}
            >
              Cancel Order
            </button>
            <button
              className="btn btn-success"
              disabled={isLoading}
              onClick={() => setShowApproveAlert(true)}
            >
              Approve payment
            </button>

            {isLoading && <Spinner />}
          </div>
        </Modal.Body>
      </Modal>

      <Confirmation
        callback={handleCancellOrder}
        setShowAlert={setShowCancellAlert}
        showAlert={showCancellAlert}
        title={"Do you want to cancel order #" + order?.id}
      />

      <Confirmation
        callback={handleManualApproveOrder}
        setShowAlert={setShowApproveAlert}
        showAlert={showApproveAlert}
        title={
          "Do you want to approve the payment of order #" +
          order?.id +
          "? NB: if you are wrong, this can cause loss"
        }
      />
    </>
  );
}

export default OrderSettings;
