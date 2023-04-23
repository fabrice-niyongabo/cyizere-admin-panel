import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";
import { Modal, Spinner } from "react-bootstrap";
import { BACKEND_URL } from "../../../constants";
import { errorHandler, setHeaders, toastMessage } from "../../../helpers";

const initialState = {
  id: 0,
  marketId: "",
  name: "",
  utubeLink: "",
  isActive: false,
};
function Edit({ showModal, setShowModal, editItem, fetchData, markets }) {
  const { token } = useSelector((state) => state.user);
  const [state, setState] = useState(initialState);
  const [isSubmitting, setSubmitting] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    Axios.put(BACKEND_URL + "/dishes/", state, setHeaders(token))
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
            <Modal.Title>Edit Dish</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group mb-3">
              <select
                name="marketId"
                className="form-select"
                value={state.marketId}
                onChange={changeHandler}
                required
                disabled={isSubmitting}
              >
                <option value="">Choose Market</option>
                {markets.map((item, index) => (
                  <option key={index} value={item.mId}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group mb-3">
              <input
                type="text"
                name="name"
                className="form-control"
                value={state.name}
                placeholder="Dish name"
                onChange={changeHandler}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="text"
                name="utubeLink"
                className="form-control"
                value={state.utubeLink}
                placeholder="Youtube link (optional)"
                onChange={changeHandler}
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group mb-3">
              <label>Status</label>
              <select
                name="isActive"
                className="form-select"
                value={state.isActive}
                onChange={changeHandler}
                required
                disabled={isSubmitting}
              >
                <option value="">Choose status</option>
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
