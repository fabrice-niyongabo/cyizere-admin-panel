import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";
import { Modal, Spinner } from "react-bootstrap";
import { BACKEND_URL } from "../../../constants";
import { errorHandler, setHeaders, toastMessage } from "../../../helpers";

const initialState = {
  isActive: false,
  isVerified: false,
  verificationStatus: "In Review",
  verificationMessage: "",
  isDisabled: false,
  sendNotification: false,
  shopLat: "",
  shopLong: "",
  hasGift: false,
  shopCategoryId: 0,
  shopName: "",
};
function Edit({
  showModal,
  setShowModal,
  editItem,
  fetchData,
  shopCategories,
}) {
  const { token } = useSelector((state) => state.user);
  const [state, setState] = useState(initialState);
  const [isSubmitting, setSubmitting] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      state.verificationStatus === "Rejected" &&
      state.verificationMessage.trim() === ""
    ) {
      toastMessage("errror", "Please enter rejection reason");
      return;
    }
    setSubmitting(true);
    Axios.put(BACKEND_URL + "/suppliers/", state, setHeaders(token))
      .then((res) => {
        toastMessage("success", res.data.msg);
        setSubmitting(false);
        setShowModal(false);
        fetchData();
      })

      .catch((error) => {
        setSubmitting(false);
        errorHandler(error);
      });
  };

  useEffect(() => {
    if (showModal) {
      editItem && setState({ ...state, ...editItem });
    }
  }, [showModal]);

  const changeHandler = (e) => {
    if (e.target.name === "verificationMessage") {
      if (
        e.target.value.toLowerCase() ===
        editItem.verificationMessage.toLowerCase()
      ) {
        setState({
          ...state,
          [e.target.name]: e.target.value,
          sendNotification: false,
        });
      } else {
        setState({
          ...state,
          [e.target.name]: e.target.value,
          sendNotification: true,
        });
      }
    } else {
      setState({ ...state, [e.target.name]: e.target.value });
    }
  };
  return (
    <>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {state.names} | #{state.supplierId}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group mb-3">
              <label>Shop Name</label>
              <input
                name="shopName"
                className="form-control"
                value={state.shopName}
                onChange={changeHandler}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group mb-3">
              <label>Shop category</label>
              <select
                className="form-select"
                name="shopCategoryId"
                value={state.shopCategoryId}
                onChange={changeHandler}
                required
                disabled={isSubmitting}
              >
                {shopCategories.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group mb-3">
              <label>Latitude (optional)</label>
              <input
                name="shopLat"
                className="form-control"
                value={state.shopLat}
                onChange={changeHandler}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group mb-3">
              <label>Longitude (optional)</label>
              <input
                name="shopLong"
                className="form-control"
                value={state.shopLong}
                onChange={changeHandler}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group mb-3">
              <label>Status (optional)</label>
              <select
                name="isActive"
                className="form-select"
                value={state.isActive}
                onChange={changeHandler}
                required
                disabled={isSubmitting}
              >
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
            </div>
            <div className="form-group mb-3">
              <label>Verification Status (optional)</label>
              <select
                name="verificationStatus"
                className="form-select"
                value={state.verificationStatus}
                onChange={changeHandler}
                disabled={isSubmitting}
                required
              >
                <option value="In Review">In Review</option>
                <option value="Rejected">Rejected</option>
                <option value="Verified">Verified</option>
              </select>
            </div>
            <div className="form-group mb-3">
              <label>Verification Comment (optional)</label>
              <textarea
                name="verificationMessage"
                className="form-control"
                value={state.verificationMessage}
                onChange={changeHandler}
                disabled={isSubmitting}
                placeholder="Add description for verification status you specified"
              />
            </div>
            <div className="form-group mb-3">
              <label>Disabled (optional)</label>
              <select
                name="isDisabled"
                className="form-select"
                value={state.isDisabled}
                onChange={changeHandler}
                required
                disabled={isSubmitting}
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
            </div>
            <div className="form-group mb-3">
              <label>Gift Option (optional)</label>
              <select
                name="hasGift"
                className="form-select"
                value={state.hasGift}
                onChange={changeHandler}
                required
                disabled={isSubmitting}
              >
                <option value={true}>Yes</option>
                <option value={false}>No</option>
              </select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting && <Spinner size="sm" />} Save changes
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

export default Edit;
