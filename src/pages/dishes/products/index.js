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
import ProductItem from "./productItem";

const initialState = {
  productId: "",
};
function Products({ showModal, setShowModal, dishItem }) {
  const { token } = useSelector((state) => state.user);
  const [state, setState] = useState(initialState);
  const [isSubmitting, setSubmitting] = useState(false);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isGettingData, setIsGettingData] = useState(false);
  const [prices, setPrices] = useState([]);

  const [editItem, setEditItem] = useState(null);
  const [editState, setEditState] = useState(initialState);
  const [isEditing, setIsEditing] = useState(false);

  const [deleteItem, setDeleteItem] = useState(null);
  const [showAlert, setShowAlert] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = () => {
    setIsLoading(true);
    Axios.get(BACKEND_URL + "/products/admin/", setHeaders(token))
      .then((res) => {
        setIsLoading(false);
        setProducts(res.data.products);
      })
      .catch((error) => {
        setIsLoading(false);
        errorHandler(error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    Axios.post(
      BACKEND_URL + "/dishes/products/",
      {
        ...state,
        dishId: dishItem.id,
        marketId: dishItem.marketId,
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
      BACKEND_URL + "/dishes/products/" + deleteItem.dpId,
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
    if (showModal && dishItem) {
      fetchData();
      fetchProducts();
    }
  }, [showModal, dishItem]);

  const fetchData = () => {
    setIsGettingData(true);
    Axios.get(BACKEND_URL + "/dishes/products/" + dishItem.id)
      .then((res) => {
        setPrices(res.data.dishProducts);
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
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {dishItem !== null && dishItem.name} - Products
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Grid container spacing={3}>
            <Grid item md={8}>
              {isGettingData ? (
                <Loader />
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prices.map((item, index) => (
                        <ProductItem
                          key={index}
                          item={item}
                          products={products}
                          deleteItem={deleteItem}
                          setDeleteItem={setDeleteItem}
                          index={index}
                          setShowAlert={setShowAlert}
                          isDeleting={isDeleting}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Grid>
            <Grid item md={4}>
              <h3>Add Product to this dish</h3>
              {isLoading ? (
                <Loader />
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <select
                      type="number"
                      name="productId"
                      className="form-select"
                      value={state.productId}
                      onChange={changeHandler}
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">Choose product</option>
                      {products
                        .filter((item) => item.marketId === dishItem.marketId)
                        .map((item, index) => (
                          <option key={index} value={item.pId}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <Spinner size="sm" />} Submit
                  </button>
                </form>
              )}
            </Grid>
          </Grid>
        </Modal.Body>
      </Modal>
      <Confirmation
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        callback={handleDelete}
        title="Do you want to remove this product?"
      />
    </>
  );
}

export default Products;
