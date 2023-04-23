import { Card } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BACKEND_URL, FILE_URL } from "../../constants";
import { useSelector } from "react-redux";
import {
  currencyFormatter,
  errorHandler,
  setHeaders,
  toastMessage,
} from "../../helpers";
import { Grid } from "@mui/material";
import { Spinner } from "react-bootstrap";
import Loader from "../loader";
import { EditOutlined, CloseOutlined } from "@ant-design/icons";
import Edit from "./edit";
import Confirmation from "../../controllers/confirmation";
import Prices from "./prices/index";

const initialState = {
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
};
const Products = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMarkets, setIsLoadingMarkets] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, setState] = useState(initialState);
  const { token } = useSelector((state) => state.user);
  const [markets, setMarkets] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showPriceModal, setShowPriceModal] = useState(false);
  const [priceProduct, setPriceProduct] = useState(null);

  const imageRef = useRef(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      setIsSubmitting(false);
      const res = await axios.delete(
        BACKEND_URL + "/products/" + deleteItem.pId,
        setHeaders(token)
      );
      setState(initialState);
      toastMessage("success", res.data.msg);
      setProducts(products.filter((item) => item.pId !== deleteItem.pId));
      setIsDeleting(false);
      setDeleteItem(null);
    } catch (error) {
      errorHandler(error);
      setIsDeleting(false);
      setDeleteItem(null);
    }
  };

  const changeHandler = (e) =>
    setState({ ...state, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", state.image);
    formData.append("marketId", state.marketId);
    formData.append("name", state.name);
    formData.append("kName", state.kName);
    formData.append("categoryId", state.categoryId);
    formData.append("description", state.description);
    formData.append("kDescription", state.kDescription);
    formData.append("priceType", state.priceType);
    formData.append("supportsDynamicPrice", state.supportsDynamicPrice);
    formData.append(
      "singlePrice",
      state.priceType === "single" ? state.singlePrice : 0
    );
    setIsSubmitting(true);
    try {
      setIsSubmitting(false);
      const res = await axios.post(
        BACKEND_URL + "/products/",
        formData,
        setHeaders(token)
      );
      setState(initialState);
      toastMessage("success", res.data.msg);
      setProducts([...products, res.data.product]);
      imageRef.current.value = "";
    } catch (error) {
      errorHandler(error);
      setIsSubmitting(false);
    }
  };

  const fetchMarkets = () => {
    setIsLoadingMarkets(true);
    axios
      .get(BACKEND_URL + "/markets/admin/", setHeaders(token))
      .then((res) => {
        setIsLoadingMarkets(false);
        setMarkets(res.data.markets);
      })
      .catch((error) => {
        setIsLoadingMarkets(false);
        errorHandler(error);
      });
  };

  const fetchCategories = () => {
    setIsLoadingCategories(true);
    axios
      .get(BACKEND_URL + "/categories/")
      .then((res) => {
        setIsLoadingCategories(false);
        setCategories(res.data.categories);
      })
      .catch((error) => {
        setIsLoadingCategories(false);
        errorHandler(error);
      });
  };

  const fetchData = () => {
    setIsLoading(true);
    axios
      .get(BACKEND_URL + "/products/admin/", setHeaders(token))
      .then((res) => {
        setIsLoading(false);
        setProducts(res.data.products);
      })
      .catch((error) => {
        setIsLoading(false);
        errorHandler(error);
      });
  };

  useEffect(() => {
    fetchData();
    fetchCategories();
    fetchMarkets();
  }, []);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={8}>
          <Card>
            <Card.Header>
              <strong>Products List</strong>
            </Card.Header>
            <Card.Body>
              {isLoading ? (
                <Loader />
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>KName</th>
                        <th>Description</th>
                        <th>KDescription</th>
                        <th>Price Type</th>
                        <th>Dynamic Price</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <img
                              src={FILE_URL + item.image}
                              alt=""
                              style={{ width: 50, height: 40 }}
                            />
                          </td>
                          <td>{item.name}</td>
                          <td>{item.kName}</td>
                          <td>{item.description}</td>
                          <td>{item.kDescription}</td>
                          <td>{item.priceType}</td>
                          <td>{item.supportsDynamicPrice ? "Yes" : "No"}</td>
                          <td>
                            {item.priceType == "single" ? (
                              currencyFormatter(item.singlePrice)
                            ) : (
                              <>
                                <span
                                  className="text-primary"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setPriceProduct(item);
                                    setShowPriceModal(true);
                                  }}
                                >
                                  Manage
                                </span>
                              </>
                            )}
                          </td>
                          <td>{item.isActive ? "Active" : "Not Active"}</td>
                          <td>
                            {deleteItem &&
                            deleteItem.pId === item.pId &&
                            isDeleting ? (
                              <Spinner size="sm" />
                            ) : (
                              <>
                                <EditOutlined
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setEditItem(item);
                                    setShowModal(true);
                                  }}
                                />
                                &nbsp; &nbsp;
                                <CloseOutlined
                                  onClick={() => {
                                    setDeleteItem(item);
                                    setShowAlert(true);
                                  }}
                                  style={{ color: "red", cursor: "pointer" }}
                                />
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Grid>
        <Grid item md={4}>
          <Card>
            <Card.Header>
              <strong>Add New Product</strong>
            </Card.Header>
            <Card.Body>
              {isLoadingCategories || isLoadingMarkets ? (
                <Loader />
              ) : (
                <form onSubmit={handleSubmit}>
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
                      {markets.map((item, i) => (
                        <option key={i} value={item.mId}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group mb-3">
                    <select
                      name="categoryId"
                      className="form-select"
                      value={state.categoryId}
                      onChange={changeHandler}
                      required
                      disabled={isSubmitting}
                    >
                      <option value="">Choose Category</option>
                      {categories.map((item, i) => (
                        <option key={i} value={item.id}>
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
                      placeholder="Product Name"
                      value={state.name}
                      onChange={changeHandler}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <input
                      type="text"
                      name="kName"
                      className="form-control"
                      placeholder="Kinyarwanda Product Name"
                      value={state.kName}
                      onChange={changeHandler}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Pricing Type</label>
                    <div>
                      <input
                        type="radio"
                        name="priceType"
                        value="single"
                        onClick={() =>
                          setState({ ...state, priceType: "single" })
                        }
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
                        onClick={() =>
                          setState({ ...state, priceType: "many" })
                        }
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
                        checked={state.supportsDynamicPrice === true}
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
                        checked={state.supportsDynamicPrice === false}
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
                    <textarea
                      type="text"
                      name="kDescription"
                      className="form-control"
                      placeholder="Kinyarwanda Description"
                      value={state.kDescription}
                      onChange={changeHandler}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <input
                      type="file"
                      name="image"
                      className="form-control"
                      onChange={(e) =>
                        setState({ ...state, image: e.target.files[0] })
                      }
                      required
                      disabled={isSubmitting}
                      ref={imageRef}
                    />
                  </div>
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="btn btn-primary"
                  >
                    {isSubmitting && <Spinner />} Save Product
                  </button>
                </form>
              )}
            </Card.Body>
          </Card>
        </Grid>
      </Grid>
      <Edit
        showModal={showModal}
        setShowModal={setShowModal}
        editItem={editItem}
        fetchData={fetchData}
        markets={markets}
        categories={categories}
      />
      <Confirmation
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        callback={handleDelete}
        title="Do you want to delete this product? All associated information will be gone forever."
      />
      <Prices
        setShowModal={setShowPriceModal}
        showModal={showPriceModal}
        productItem={priceProduct}
      />
    </>
  );
};

export default Products;
