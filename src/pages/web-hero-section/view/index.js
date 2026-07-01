import React from "react";
import { Modal } from "react-bootstrap";
import { FILE_URL } from "../../../constants";

function View({ showModal, setShowModal, viewItem }) {
  if (!viewItem) {
    return null;
  }

  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>View Hero Section</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3 text-center">
          <img
            src={FILE_URL + viewItem.image}
            alt={viewItem.title}
            style={{ maxWidth: "100%", maxHeight: 200, objectFit: "cover" }}
          />
        </div>
        <p>
          <strong>Eyebrow Text:</strong> {viewItem.eyebrow}
        </p>
        <p>
          <strong>Main Title:</strong> {viewItem.title}
        </p>
        <p>
          <strong>Subtitle:</strong> {viewItem.subtitle}
        </p>
        <p>
          <strong>Button Text:</strong> {viewItem.ctaText}
        </p>
        <p>
          <strong>Button Link:</strong> {viewItem.ctaLink}
        </p>
      </Modal.Body>
    </Modal>
  );
}

export default View;
