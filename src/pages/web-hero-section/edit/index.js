import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";
import { Modal, Spinner } from "react-bootstrap";
import { BACKEND_URL } from "../../../constants";
import { errorHandler, setHeaders, toastMessage } from "../../../helpers";

const initialState = {
  id: "",
  eyebrow: "",
  title: "",
  subtitle: "",
  ctaText: "",
  ctaLink: "",
};

function Edit({ showModal, setShowModal, editItem, fetchData }) {
  const { token } = useSelector((state) => state.user);
  const [state, setState] = useState(initialState);
  const [isSubmitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    Axios.put(
      BACKEND_URL + "/web-hero-sections/" + state.id,
      {
        eyebrow: state.eyebrow,
        title: state.title,
        subtitle: state.subtitle,
        ctaText: state.ctaText,
        ctaLink: state.ctaLink,
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
    if (showModal && editItem) {
      setState({
        id: editItem.id,
        eyebrow: editItem.eyebrow,
        title: editItem.title,
        subtitle: editItem.subtitle,
        ctaText: editItem.ctaText,
        ctaLink: editItem.ctaLink,
      });
    }
  }, [showModal, editItem]);

  const changeHandler = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      backdrop="static"
      keyboard={false}
    >
      <form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Hero Section</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group mb-3">
            <label className="form-label">Eyebrow Text</label>
            <input
              type="text"
              name="eyebrow"
              className="form-control"
              value={state.eyebrow}
              onChange={changeHandler}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group mb-3">
            <label className="form-label">Main Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={state.title}
              onChange={changeHandler}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group mb-3">
            <label className="form-label">Subtitle</label>
            <input
              type="text"
              name="subtitle"
              className="form-control"
              value={state.subtitle}
              onChange={changeHandler}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group mb-3">
            <label className="form-label">Button Text</label>
            <input
              type="text"
              name="ctaText"
              className="form-control"
              value={state.ctaText}
              onChange={changeHandler}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group mb-3">
            <label className="form-label">Button Link</label>
            <input
              type="text"
              name="ctaLink"
              className="form-control"
              value={state.ctaLink}
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
  );
}

export default Edit;
