import { Card } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { useSelector } from "react-redux";
import { errorHandler, setHeaders, toastMessage } from "../../helpers";
import { Grid } from "@mui/material";
import { Spinner } from "react-bootstrap";
import Loader from "../loader";
import Edit from "./edit";
import Confirmation from "../../controllers/confirmation";
import Products from "./products";
import DishItem from "./dish-item";

const initialState = {
  marketId: "",
  name: "",
  utubeLink: "",
  image: "",
};
const Dishes = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, setState] = useState(initialState);
  const { token } = useSelector((state) => state.user);
  const [dishes, setDishes] = useState([]);
  const [markets, setMarkets] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [dishItem, setDishItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const imageRef = useRef(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      setIsSubmitting(false);
      const res = await axios.delete(
        BACKEND_URL + "/dishes/" + deleteItem.id,
        setHeaders(token)
      );
      setState(initialState);
      toastMessage("success", res.data.msg);
      setDishes(dishes.filter((item) => item.id !== deleteItem.id));
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
    formData.append("name", state.name);
    formData.append("utubeLink", state.utubeLink);
    formData.append("marketId", state.marketId);
    setIsSubmitting(true);
    try {
      setIsSubmitting(false);
      const res = await axios.post(
        BACKEND_URL + "/dishes/",
        formData,
        setHeaders(token)
      );
      setState(initialState);
      toastMessage("success", res.data.msg);
      setDishes([...dishes, res.data.dish]);
      imageRef.current.value = "";
    } catch (error) {
      errorHandler(error);
      setIsSubmitting(false);
    }
  };

  const fetchData = () => {
    setIsLoading(true);
    axios
      .get(BACKEND_URL + "/dishes/admin/", setHeaders(token))
      .then((res) => {
        setIsLoading(false);
        setDishes(res.data.dishes);
      })
      .catch((error) => {
        setIsLoading(false);
        errorHandler(error);
      });
  };

  const fetchMarkets = () => {
    setIsLoading2(true);
    axios
      .get(BACKEND_URL + "/markets/admin/", setHeaders(token))
      .then((res) => {
        setIsLoading2(false);
        setMarkets(res.data.markets);
      })
      .catch((error) => {
        setIsLoading2(false);
        errorHandler(error);
      });
  };

  useEffect(() => {
    fetchData();
    fetchMarkets();
  }, []);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={8}>
          <Card>
            <Card.Header>
              <strong>Dishes</strong>
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
                        <th>Market</th>
                        <th>Link</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dishes.map((item, index) => (
                        <DishItem
                          key={index}
                          item={item}
                          index={index}
                          markets={markets}
                          setDeleteItem={setDeleteItem}
                          setShowAlert={setShowAlert}
                          setShowModal2={setShowModal2}
                          allItems={dishes}
                          deleteItem={deleteItem}
                          isDeleting={isDeleting}
                          setDishItem={setDishItem}
                          setEditItem={setEditItem}
                          setShowModal={setShowModal}
                        />
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
              <strong>Add New</strong>
            </Card.Header>
            <Card.Body>
              {isLoading2 ? (
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
                    {isSubmitting && <Spinner />} Save
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
      />
      <Products
        dishItem={dishItem}
        setShowModal={setShowModal2}
        showModal={showModal2}
      />
      <Confirmation
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        callback={handleDelete}
        title="Do you want to delete this dish?"
      />
    </>
  );
};

export default Dishes;
