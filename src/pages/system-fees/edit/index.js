import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";
import { Modal, Spinner } from "react-bootstrap";
import { BACKEND_URL } from "../../../constants";
import { errorHandler, setHeaders, toastMessage } from "../../../helpers";

const initialState = {
  id: 0,
  amount: "",
};
function Edit({ showModal, setShowModal, editItem, fetchData }) {
  const { token } = useSelector((state) => state.user);
  const [state, setState] = useState(initialState);
  const [isSubmitting, setSubmitting] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    Axios.put(BACKEND_URL + "/systemfees", state, setHeaders(token))
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
      editItem && setState(editItem);
    }
  }, [showModal]);

  const changeHandler = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
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
            <Modal.Title>Edit Fees</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group mb-3">
              <input
                type="number"
                name="amount"
                className="form-control"
                value={state.amount}
                placeholder="Enter Amount"
                onChange={changeHandler}
                required
                disabled={isSubmitting}
              />
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
