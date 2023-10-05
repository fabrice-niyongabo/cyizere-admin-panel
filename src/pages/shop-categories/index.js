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

const initialState = { name: "", image: "" };
const ProductCategories = () => {
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

  //updating image
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(undefined);
  const [updatedImage, setUpdatedImage] = useState(undefined);
  const [showUpdateImageAlert, setShowUpdateImageAlert] = useState(false);

  const updateImageRef = useRef(null);
  const imageRef = useRef(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      setIsSubmitting(false);
      const res = await axios.delete(
        BACKEND_URL + "/shopcategories/" + deleteItem.id,
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
    formData.append("name", state.name);
    setIsSubmitting(true);
    try {
      setIsSubmitting(false);
      const res = await axios.post(
        BACKEND_URL + "/shopcategories/",
        formData,
        setHeaders(token)
      );
      setState(initialState);
      toastMessage("success", res.data.msg);
      setMarkets([...markets, res.data.category]);
      imageRef.current.value = "";
    } catch (error) {
      errorHandler(error);
      setIsSubmitting(false);
    }
  };

  const fetchData = () => {
    setIsLoading(true);
    axios
      .get(BACKEND_URL + "/shopcategories/", setHeaders(token))
      .then((res) => {
        setIsLoading(false);
        setMarkets(res.data.categories);
      })
      .catch((error) => {
        setIsLoading(false);
        errorHandler(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateImage = () => {
    if (selectedImage === undefined || updatedImage === undefined) {
      return;
    }
    setIsUpdating(true);
    const formData = new FormData();
    formData.append("file", updatedImage);
    formData.append("id", selectedImage.id);
    axios
      .put(BACKEND_URL + "/shopcategories/image", formData, setHeaders(token))
      .then((res) => {
        setIsUpdating(false);
        toastMessage("success", res.data.msg);
        const newData = markets;
        const index = newData.findIndex((item) => item.id === selectedImage.id);
        if (index > -1) {
          newData[index] = { ...newData[index], image: res.data.image };
          setMarkets(newData);
        }
        setSelectedImage(undefined);
        updateImageRef.current.value = "";
      })
      .catch((error) => {
        setSelectedImage(undefined);
        setUpdatedImage(undefined);
        updateImageRef.current.value = "";
        setIsUpdating(false);
        errorHandler(error);
      });
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={8}>
          <Card>
            <Card.Header>
              <strong>Shop Categories</strong>
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
                            <input
                              type="file"
                              name="image"
                              className="d-none"
                              onChange={(e) => {
                                setUpdatedImage(e.target.files[0]);
                                setShowUpdateImageAlert(true);
                              }}
                              required
                              ref={updateImageRef}
                            />
                            {isUpdating && selectedImage?.pId === item?.pId ? (
                              <Spinner size="sm" />
                            ) : (
                              <span
                                style={{
                                  display: "inline-block",
                                  cursor: "pointer",
                                  padding: 5,
                                }}
                                onClick={() => {
                                  setSelectedImage(item);
                                  updateImageRef.current.click();
                                }}
                              >
                                <EditOutlined />
                              </span>
                            )}
                          </td>
                          <td>{item.name}</td>
                          <td>
                            {deleteItem &&
                            deleteItem.id === item.id &&
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
              <strong>Add Category</strong>
            </Card.Header>
            <Card.Body>
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Category name"
                    value={state.name}
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
                  {isSubmitting && <Spinner />} Save Category
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
        title="Do you want to delete this category?"
      />

      <Confirmation
        title="Do you want to update this image?"
        setShowAlert={setShowUpdateImageAlert}
        showAlert={showUpdateImageAlert}
        callback={updateImage}
      />
    </>
  );
};

export default ProductCategories;
