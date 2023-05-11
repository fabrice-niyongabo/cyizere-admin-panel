import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";
import { Modal, Spinner } from "react-bootstrap";
import { BACKEND_URL } from "../../../constants";
import {
  errorHandler,
  setHeaders,
  toastMessage,
  currencyFormatter,
} from "../../../helpers";
import { Grid } from "@mui/material";
import Loader from "../../loader";
import Confirmation from "../../../controllers/confirmation";

const initialState = {
  productId: "",
  name: "",
  amount: "",
};
function Prices({ showModal, setShowModal, productItem }) {
  const { token } = useSelector((state) => state.user);
  const [state, setState] = useState(initialState);
  const [isSubmitting, setSubmitting] = useState(false);

  const [isGettingData, setIsGettingData] = useState(false);
  const [prices, setPrices] = useState([]);

  const [editItem, setEditItem] = useState(null);
  const [editState, setEditState] = useState(initialState);
  const [isEditing, setIsEditing] = useState(false);

  const [deleteItem, setDeleteItem] = useState(null);
  const [showAlert, setShowAlert] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditSubmit = () => {
    if (editState.name.trim() === "" || editState.amount.trim() === "") {
      toastMessage("error", "All fields are mandatory");
      return;
    }
    setIsEditing(true);
    Axios.put(
      BACKEND_URL + "/products/prices/",
      {
        ...editState,
      },
      setHeaders(token)
    )
      .then((res) => {
        setIsEditing(false);
        toastMessage("success", res.data.msg);
        setEditItem(null);
        setEditState(initialState);
        fetchData();
      })
      .catch((error) => {
        setIsEditing(false);
        errorHandler(error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    Axios.post(
      BACKEND_URL + "/products/prices/",
      {
        ...state,
        productId: productItem.pId,
      },
      setHeaders(token)
    )
      .then((res) => {
        toastMessage("success", res.data.msg);
        setState(initialState);
        setSubmitting(false);
        fetchData();
      })
      .catch((error) => {
        setSubmitting(false);
        errorHandler(error);
      });
  };

  const handleDelete = () => {
    setIsDeleting(true);
    Axios.delete(
      BACKEND_URL + "/products/prices/" + deleteItem.ppId,
      setHeaders(token)
    )
      .then((res) => {
        toastMessage("success", res.data.msg);
        setDeleteItem(null);
        setIsDeleting(false);
        fetchData();
      })
      .catch((error) => {
        setIsDeleting(false);
        errorHandler(error);
      });
  };

  useEffect(() => {
    if (showModal) {
      fetchData();
    }
  }, [showModal, productItem]);

  const fetchData = () => {
    setIsGettingData(true);
    Axios.get(BACKEND_URL + "/products/prices/" + productItem.pId)
      .then((res) => {
        setPrices(res.data.prices);
        setIsGettingData(false);
      })
      .catch((error) => {
        setIsGettingData(false);
        errorHandler(error);
      });
  };

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
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Prices For {productItem !== null && productItem.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Grid container spacing={3}>
            <Grid item md={12}>
              {isGettingData ? (
                <Loader />
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>P/U</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prices.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            {editItem !== null &&
                            editItem.ppId === item.ppId ? (
                              <input
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder="Title  ex: mironko or kg"
                                value={editState.name}
                                onChange={(e) =>
                                  setEditState({
                                    ...editState,
                                    name: e.target.value,
                                  })
                                }
                                required
                                disabled={isSubmitting}
                              />
                            ) : (
                              item.name
                            )}
                          </td>
                          <td>
                            {editItem !== null &&
                            editItem.ppId === item.ppId ? (
                              <input
                                type="number"
                                name="amount"
                                className="form-control"
                                placeholder="Amount"
                                value={editState.amount}
                                onChange={(e) =>
                                  setEditState({
                                    ...editState,
                                    amount: e.target.value,
                                  })
                                }
                                required
                                disabled={isSubmitting}
                              />
                            ) : (
                              currencyFormatter(item.amount)
                            )}
                          </td>
                          <td>
                            {editItem !== null &&
                            editItem.ppId === item.ppId ? (
                              <>
                                <button
                                  disabled={isEditing}
                                  className="btn text-primary"
                                  onClick={() => handleEditSubmit()}
                                >
                                  {isEditing ? "Saving..." : "Save"}
                                </button>
                                &nbsp; &nbsp;
                                <button
                                  disabled={isEditing}
                                  className="btn text-warning"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setEditItem(null);
                                    setEditState(initialState);
                                  }}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <span
                                  className="text-primary"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setEditItem(item);
                                    setEditState(item);
                                  }}
                                >
                                  Edit
                                </span>
                                &nbsp; &nbsp;
                                <span
                                  className="text-danger"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    if (
                                      !(
                                        isDeleting &&
                                        deleteItem.ppId === item.ppId
                                      )
                                    ) {
                                      setDeleteItem(item);
                                      setShowAlert(true);
                                    }
                                  }}
                                >
                                  {isDeleting && deleteItem.ppId === item.ppId
                                    ? "Deleting..."
                                    : "Delete"}
                                </span>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Grid>
          </Grid>
        </Modal.Body>
      </Modal>
      <Confirmation
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        callback={handleDelete}
        title="Do you want to delete this price?"
      />
    </>
  );
}

export default Prices;
