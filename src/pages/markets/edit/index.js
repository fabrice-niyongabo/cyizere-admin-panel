import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";
import { Modal, Spinner } from "react-bootstrap";
import { BACKEND_URL } from "../../../constants";
import { errorHandler, setHeaders, toastMessage } from "../../../helpers";

const initialState = {
  mId: 0,
  name: "",
  address: "",
  lat: "",
  long: "",
  image: "",
  isActive: false,
  bikeMaximumKm: "",
  open: "",
  close: "",
  createdAt: "",
  updatedAt: "",
};
function Edit({ showModal, setShowModal, editItem, fetchData }) {
  const { token } = useSelector((state) => state.user);
  const [state, setState] = useState(initialState);
  const [isSubmitting, setSubmitting] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    Axios.put(BACKEND_URL + "/markets/", state, setHeaders(token))
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
            <Modal.Title>Edit Market</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group mb-3">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Market name"
                value={state.name}
                onChange={changeHandler}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="text"
                name="address"
                className="form-control"
                placeholder="Address"
                value={state.address}
                onChange={changeHandler}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="text"
                name="lat"
                className="form-control"
                placeholder="Latitude"
                value={state.lat}
                onChange={changeHandler}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="text"
                name="long"
                className="form-control"
                placeholder="Longitude"
                value={state.long}
                onChange={changeHandler}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="number"
                name="bikeMaximumKm"
                className="form-control"
                placeholder="Bike Max Km"
                value={state.bikeMaximumKm}
                onChange={changeHandler}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="time"
                name="open"
                className="form-control"
                placeholder="Opens at"
                value={state.open}
                onChange={changeHandler}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="time"
                name="close"
                className="form-control"
                placeholder="Closes at"
                value={state.close}
                onChange={changeHandler}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group mb-3">
              <select
                name="isActive"
                className="form-select"
                value={state.isActive}
                onChange={changeHandler}
              >
                <option value={true}>Active</option>
                <option value={false}>Not Active</option>
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
