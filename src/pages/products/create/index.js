import { Card } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Grid } from "@mui/material";
import { Spinner } from "react-bootstrap";
import { BACKEND_URL } from "../../../constants";
import { errorHandler, setHeaders, toastMessage } from "../../../helpers";
import Loader from "../../loader";

const initialState = {
  supplierId: "",
  categoryId: "",
  name: "",
  description: "",
  priceType: "single",
  singlePrice: "",
  image: null,
  isActive: true,
};

const CreateProduct = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.user);
  const imageRef = useRef(null);

  const [state, setState] = useState(initialState);
  const [suppliers, setSuppliers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const changeHandler = (e) =>
    setState({ ...state, [e.target.name]: e.target.value });

  const fetchSuppliers = () =>
    axios
      .get(BACKEND_URL + "/suppliers", setHeaders(token))
      .then((res) => setSuppliers(res.data.suppliers))
      .catch(errorHandler);

  const fetchCategories = () =>
    axios
      .get(BACKEND_URL + "/productcategories", setHeaders(token))
      .then((res) => setCategories(res.data.categories))
      .catch(errorHandler);

  useEffect(() => {
    Promise.all([fetchSuppliers(), fetchCategories()]).finally(() =>
      setIsLoading(false)
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!state.image) {
      toastMessage("error", "Please choose a product image");
      return;
    }

    const formData = new FormData();
    formData.append("file", state.image);
    formData.append("supplierId", state.supplierId);
    formData.append("categoryId", state.categoryId);
    formData.append("name", state.name);
    formData.append("description", state.description);
    formData.append("priceType", state.priceType);
    formData.append(
      "singlePrice",
      state.priceType === "single" ? state.singlePrice : 0
    );

    setIsSubmitting(true);
    try {
      const res = await axios.post(
        BACKEND_URL + "/products/",
        formData,
        setHeaders(token)
      );
      toastMessage("success", res.data.msg);
      navigate("/dashboard/products");
    } catch (error) {
      errorHandler(error);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Grid container spacing={3}>
      <Grid item md={8} lg={6}>
        <Card>
          <Card.Header>
            <strong>Create Product</strong>
          </Card.Header>
          <Card.Body>
            <form onSubmit={handleSubmit}>
              <div className="form-group mb-3">
                <label>Supplier</label>
                <select
                  name="supplierId"
                  className="form-select"
                  value={state.supplierId}
                  onChange={changeHandler}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select supplier</option>
                  {suppliers.map((item) => (
                    <option value={item.supplierId} key={item.supplierId}>
                      {item.shopName} #{item.supplierId}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-3">
                <label>Category</label>
                <select
                  name="categoryId"
                  className="form-select"
                  value={state.categoryId}
                  onChange={changeHandler}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Select category</option>
                  {categories.map((item) => (
                    <option value={item.id} key={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-3">
                <label>Product Name</label>
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
                <label>Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  placeholder="Description"
                  value={state.description}
                  onChange={changeHandler}
                  required
                  disabled={isSubmitting}
                  rows={4}
                />
              </div>

              <div className="form-group mb-3">
                <label>Pricing Type</label>
                <div>
                  <input
                    type="radio"
                    name="priceType"
                    value="single"
                    checked={state.priceType === "single"}
                    onChange={() => setState({ ...state, priceType: "single" })}
                    disabled={isSubmitting}
                  />
                  <label className="ms-1 me-3">Single</label>
                  <input
                    type="radio"
                    name="priceType"
                    value="many"
                    checked={state.priceType === "many"}
                    onChange={() => setState({ ...state, priceType: "many" })}
                    disabled={isSubmitting}
                  />
                  <label className="ms-1">Many</label>
                </div>
              </div>

              {state.priceType === "single" && (
                <div className="form-group mb-3">
                  <label>Price per unit</label>
                  <input
                    type="number"
                    name="singlePrice"
                    className="form-control"
                    placeholder="Price per unit"
                    value={state.singlePrice}
                    onChange={changeHandler}
                    required
                    min={0}
                    disabled={isSubmitting}
                  />
                </div>
              )}

              <div className="form-group mb-3">
                <label>Product Image</label>
                <input
                  type="file"
                  name="image"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) =>
                    setState({ ...state, image: e.target.files[0] })
                  }
                  required
                  disabled={isSubmitting}
                  ref={imageRef}
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Spinner size="sm" />} Create Product
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/dashboard/products")}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </Card.Body>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CreateProduct;
