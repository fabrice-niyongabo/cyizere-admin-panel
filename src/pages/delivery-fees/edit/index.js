import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";
import { Modal, Spinner } from "react-bootstrap";
import { BACKEND_URL } from "../../../constants";
import { errorHandler, setHeaders, toastMessage } from "../../../helpers";

const initialState = {
  id: 0,
  vehicleType: "",
  amountPerKilometer: "",
  defaultPrice: "",
};
function Edit({ showModal, setShowModal, editItem, fetchData }) {
  const { token } = useSelector((state) => state.user);
  const [state, setState] = useState(initialState);
  const [isSubmitting, setSubmitting] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    Axios.put(BACKEND_URL + "/fees/", state, setHeaders(token))
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
              <select
                name="vehicleType"
                className="form-select"
                value={state.vehicleType}
                onChange={changeHandler}
                required
                disabled={isSubmitting}
              >
                <option value="">Choose Vehicle</option>
                <option value="BIKE">BIKE</option>
                <option value="MOTORCYCLE">MOTORCYCLE</option>
                <option value="CAR">CAR</option>
              </select>
            </div>
            <div className="form-group mb-3">
              <input
                type="number"
                name="amountPerKilometer"
                className="form-control"
                value={state.amountPerKilometer}
                placeholder="Amount per km"
                onChange={changeHandler}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="number"
                name="defaultPrice"
                className="form-control"
                value={state.defaultPrice}
                placeholder="Default Price"
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
