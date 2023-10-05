import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";
import { Modal, Spinner } from "react-bootstrap";
import { BACKEND_URL } from "../../../constants";
import { errorHandler, setHeaders, toastMessage } from "../../../helpers";

const initialState = {
  pId: 0,
  marketId: "",
  categoryId: "",
  name: "",
  description: "",
  priceType: "",
  supportsDynamicPrice: "",
  singlePrice: "",
  kName: "",
  kDescription: "",
  image: "",
  categoryId: 0,
};
function Edit({ showModal, setShowModal, editItem, fetchData, categories }) {
  const { token } = useSelector((state) => state.user);
  const [state, setState] = useState(initialState);
  const [isSubmitting, setSubmitting] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    Axios.put(
      BACKEND_URL + "/products/",
      {
        ...state,
        singlePrice: state.priceType === "single" ? state.singlePrice : 0,
      },
      setHeaders(token)
    )
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
            <Modal.Title>Edit Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group mb-3">
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Product Name"
                value={state.name}
                onChange={changeHandler}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group mb-3">
              <label>Category</label>
              <select
                name="categoryId"
                className="form-select"
                value={state.categoryId}
                onChange={changeHandler}
                disabled={isSubmitting}
                required
              >
                {categories.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group mb-3">
              <label>Pricing Type</label>
              <div>
                <input
                  type="radio"
                  name="priceType"
                  value="single"
                  onClick={() => setState({ ...state, priceType: "single" })}
                  checked={state.priceType === "single"}
                  required
                  disabled={isSubmitting}
                />
                <label>Single</label>&nbsp;&nbsp;&nbsp;
                <input
                  type="radio"
                  name="priceType"
                  value="many"
                  checked={state.priceType === "many"}
                  onClick={() => setState({ ...state, priceType: "many" })}
                  required
                  disabled={isSubmitting}
                />
                <label>Many</label>
              </div>
            </div>
            {state.priceType === "single" && (
              <div className="form-group mb-3">
                <input
                  type="number"
                  name="singlePrice"
                  className="form-control"
                  placeholder="Price per unit"
                  value={state.singlePrice}
                  onChange={changeHandler}
                  required
                  disabled={isSubmitting}
                />
              </div>
            )}
            <div className="form-group mb-3">
              <label>Supports Dynamic Pricing?</label>
              <div>
                <input
                  type="radio"
                  name="supportsDynamicPrice"
                  value={true}
                  checked={state.supportsDynamicPrice}
                  onClick={() =>
                    setState({ ...state, supportsDynamicPrice: true })
                  }
                  required
                  disabled={isSubmitting}
                />
                <label>Yes</label> &nbsp;&nbsp;&nbsp;
                <input
                  type="radio"
                  name="supportsDynamicPrice"
                  value={false}
                  checked={!state.supportsDynamicPrice}
                  onClick={() =>
                    setState({ ...state, supportsDynamicPrice: false })
                  }
                  required
                  disabled={isSubmitting}
                />
                <label>No</label>
              </div>
            </div>
            <div className="form-group mb-3">
              <textarea
                type="text"
                name="description"
                className="form-control"
                placeholder="Description"
                value={state.description}
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
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
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
