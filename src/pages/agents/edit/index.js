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
};
function Edit({ showModal, setShowModal, editItem, fetchData }) {
  const { token } = useSelector((state) => state.user);
  const [state, setState] = useState(initialState);
  const [isSubmitting, setSubmitting] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    Axios.put(BACKEND_URL + "/agents/", state, setHeaders(token))
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
              {state.names} | #{state.agentId}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
                required
                disabled={isSubmitting}
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
                required
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
