import { Card } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BACKEND_URL, FILE_URL } from "../../constants";
import { useSelector } from "react-redux";
import { errorHandler, setHeaders, toastMessage } from "../../helpers";
import { Grid } from "@mui/material";
import { Spinner } from "react-bootstrap";
import Loader from "../loader";
import { EditOutlined, CloseOutlined } from "@ant-design/icons";
import Edit from "./edit";
import Confirmation from "../../controllers/confirmation";

const initialState = {
  name: "",
  address: "",
  lat: "",
  long: "",
  image: "",
  bikeMaximumKm: "",
  open: "",
  close: "",
};
const Markets = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, setState] = useState(initialState);
  const { token } = useSelector((state) => state.user);
  const [markets, setMarkets] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const imageRef = useRef(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      setIsSubmitting(false);
      const res = await axios.delete(
        BACKEND_URL + "/markets/" + deleteItem.mId,
        setHeaders(token)
      );
      setState(initialState);
      toastMessage("success", res.data.msg);
      setMarkets(markets.filter((item) => item.mId !== deleteItem.mId));
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
    formData.append("address", state.address);
    formData.append("lat", state.lat);
    formData.append("long", state.long);
    formData.append("open", state.open);
    formData.append("close", state.close);
    formData.append("bikeMaximumKm", state.bikeMaximumKm);
    setIsSubmitting(true);
    try {
      setIsSubmitting(false);
      const res = await axios.post(
        BACKEND_URL + "/markets/",
        formData,
        setHeaders(token)
      );
      setState(initialState);
      toastMessage("success", res.data.msg);
      setMarkets([...markets, res.data.market]);
      imageRef.current.value = "";
    } catch (error) {
      errorHandler(error);
      setIsSubmitting(false);
    }
  };

  const fetchData = () => {
    setIsLoading(true);
    axios
      .get(BACKEND_URL + "/markets/admin/", setHeaders(token))
      .then((res) => {
        setIsLoading(false);
        setMarkets(res.data.markets);
      })
      .catch((error) => {
        setIsLoading(false);
        errorHandler(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={8}>
          <Card>
            <Card.Header>
              <strong>Markets</strong>
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
                        <th>Adress</th>
                        <th>Lat</th>
                        <th>Long</th>
                        <th>Bike Max Km</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {markets.map((item, index) => (
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
                          <td>{item.address}</td>
                          <td>{item.lat}</td>
                          <td>{item.long}</td>
                          <td>{item.bikeMaximumKm}</td>
                          <td>{item.isActive ? "Active" : "Not Active"}</td>
                          <td>
                            {deleteItem &&
                            deleteItem.mId === item.mId &&
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
              <strong>Add Market</strong>
            </Card.Header>
            <Card.Body>
              <form onSubmit={handleSubmit}>
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
                  {isSubmitting && <Spinner />} Save Market
                </button>
              </form>
            </Card.Body>
          </Card>
        </Grid>
      </Grid>
      <Edit
        showModal={showModal}
        setShowModal={setShowModal}
        editItem={editItem}
        fetchData={fetchData}
      />
      <Confirmation
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        callback={handleDelete}
        title="Do you want to delete this market?"
      />
    </>
  );
};

export default Markets;
