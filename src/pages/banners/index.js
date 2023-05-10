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
import Confirmation from "../../controllers/confirmation";

const initialState = {
  urlOrComponentValue: "",
  image: "",
  hasUrl: false,
  hasScreenComponent: false,
};
const Banners = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, setState] = useState(initialState);
  const { token } = useSelector((state) => state.user);
  const [markets, setMarkets] = useState([]);

  const [showAlert, setShowAlert] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const imageRef = useRef(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      setIsSubmitting(false);
      const res = await axios.delete(
        BACKEND_URL + "/banners/" + deleteItem.id,
        setHeaders(token)
      );
      setState(initialState);
      toastMessage("success", res.data.msg);
      setMarkets(markets.filter((item) => item.id !== deleteItem.id));
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
    formData.append("urlOrComponentValue", state.urlOrComponentValue);
    formData.append("hasUrl", state.hasUrl);
    formData.append("hasScreenComponent", state.hasScreenComponent);
    setIsSubmitting(true);
    try {
      setIsSubmitting(false);
      const res = await axios.post(
        BACKEND_URL + "/banners/",
        formData,
        setHeaders(token)
      );
      setState(initialState);
      toastMessage("success", res.data.msg);
      setMarkets([...markets, res.data.banner]);
      imageRef.current.value = "";
    } catch (error) {
      errorHandler(error);
      setIsSubmitting(false);
    }
  };

  const fetchData = () => {
    setIsLoading(true);
    axios
      .get(BACKEND_URL + "/banners/", setHeaders(token))
      .then((res) => {
        setIsLoading(false);
        setMarkets(res.data.banners);
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
              <strong>Manage Banners</strong>
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
                        <th>Link</th>
                        <th>Link Type</th>
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
                          <td>{item.urlOrComponentValue}</td>
                          <td>
                            {item.hasUrl && "URL"}
                            {item.hasScreenComponent && "App Screen"}
                          </td>
                          <td>
                            {deleteItem &&
                            deleteItem.id === item.id &&
                            isDeleting ? (
                              <Spinner size="sm" />
                            ) : (
                              <CloseOutlined
                                onClick={() => {
                                  setDeleteItem(item);
                                  setShowAlert(true);
                                }}
                                style={{ color: "red", cursor: "pointer" }}
                              />
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
              <strong>Add Banner</strong>
            </Card.Header>
            <Card.Body>
              <form onSubmit={handleSubmit}>
                <label>Banner Link Type</label>
                <div className="form-group mb-3">
                  <input
                    type="checkbox"
                    checked={state.hasUrl}
                    onClick={() =>
                      setState({
                        ...state,
                        hasUrl: !state.hasUrl,
                        hasScreenComponent: false,
                        urlOrComponentValue: "",
                      })
                    }
                    disabled={isSubmitting}
                  />
                  <label>Link</label> &nbsp;&nbsp;&nbsp;
                  <input
                    type="checkbox"
                    checked={state.hasScreenComponent}
                    onClick={() =>
                      setState({
                        ...state,
                        hasUrl: false,
                        hasScreenComponent: !state.hasScreenComponent,
                        urlOrComponentValue: "",
                      })
                    }
                    disabled={isSubmitting}
                  />
                  <label>App screen</label>
                </div>
                {state.hasUrl && (
                  <div className="form-group mb-3">
                    <input
                      type="text"
                      name="urlOrComponentValue"
                      className="form-control"
                      placeholder="Enter url"
                      value={state.urlOrComponentValue}
                      onChange={changeHandler}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                )}
                {state.hasScreenComponent && (
                  <div className="form-group mb-3">
                    <select
                      className="form-select"
                      value={state.urlOrComponentValue}
                      onChange={changeHandler}
                      name="urlOrComponentValue"
                    >
                      <option value="">Choose screen</option>
                      <option value="Profile">Profile</option>
                      <option value="ShopCategories">ShopCategories</option>
                      <option value="Addresses">Addresses</option>
                    </select>
                  </div>
                )}
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
                  {isSubmitting && <Spinner />} Save Banner
                </button>
              </form>
            </Card.Body>
          </Card>
        </Grid>
      </Grid>
      <Confirmation
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        callback={handleDelete}
        title="Do you want to delete this banner?"
      />
    </>
  );
};

export default Banners;
