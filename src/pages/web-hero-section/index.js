import { Card } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BACKEND_URL, FILE_URL } from "../../constants";
import { useSelector } from "react-redux";
import { errorHandler, setHeaders, toastMessage } from "../../helpers";
import { Grid } from "@mui/material";
import { Spinner } from "react-bootstrap";
import Loader from "../loader";
import {
  EditOutlined,
  CloseOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import Edit from "./edit";
import View from "./view";
import Confirmation from "../../controllers/confirmation";

const defaultFormValues = {
  eyebrow: "FRUIT & VEGETABLES",
  title: "Organic Fresh Fruit",
  subtitle: "Quality and Fresh Produce",
  ctaText: "",
  ctaLink: "",
  image: "",
};

const allowedImageTypes = ["image/png", "image/jpeg", "image/jpg"];
const allowedExtensions = [".png", ".jpg", ".jpeg"];

const isValidImageFile = (file) => {
  if (!file) return false;
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  return (
    allowedImageTypes.includes(file.type) && allowedExtensions.includes(ext)
  );
};

const WebHeroSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, setState] = useState(defaultFormValues);
  const { token } = useSelector((state) => state.user);
  const [heroSections, setHeroSections] = useState([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isUpdating, setIsUpdating] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const updateImageRef = useRef(null);
  const [selectedImageItem, setSelectedImageItem] = useState(null);

  const imageRef = useRef(null);
  const [imageError, setImageError] = useState("");

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await axios.delete(
        BACKEND_URL + "/web-hero-sections/" + deleteItem.id,
        setHeaders(token)
      );
      toastMessage("success", res.data.msg);
      setHeroSections(
        heroSections.filter((item) => item.id !== deleteItem.id)
      );
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setState({ ...state, image: "" });
      setImageError("");
      return;
    }
    if (!isValidImageFile(file)) {
      setImageError("Only PNG, JPG, and JPEG images are allowed.");
      setState({ ...state, image: "" });
      e.target.value = "";
      return;
    }
    setImageError("");
    setState({ ...state, image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!state.image) {
      setImageError("Hero image is required.");
      return;
    }
    if (!isValidImageFile(state.image)) {
      setImageError("Only PNG, JPG, and JPEG images are allowed.");
      return;
    }
    const formData = new FormData();
    formData.append("file", state.image);
    formData.append("eyebrow", state.eyebrow);
    formData.append("title", state.title);
    formData.append("subtitle", state.subtitle);
    formData.append("ctaText", state.ctaText);
    formData.append("ctaLink", state.ctaLink);
    setIsSubmitting(true);
    try {
      const res = await axios.post(
        BACKEND_URL + "/web-hero-sections",
        formData,
        setHeaders(token)
      );
      setState(defaultFormValues);
      toastMessage("success", res.data.msg);
      setHeroSections([...heroSections, res.data.heroSection]);
      imageRef.current.value = "";
      setImageError("");
      setIsSubmitting(false);
    } catch (error) {
      errorHandler(error);
      setIsSubmitting(false);
    }
  };

  const fetchData = () => {
    setIsLoading(true);
    axios
      .get(BACKEND_URL + "/web-hero-sections", setHeaders(token))
      .then((res) => {
        setIsLoading(false);
        setHeroSections(res.data.heroSections);
      })
      .catch((error) => {
        setIsLoading(false);
        errorHandler(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageUpdate = async (file, item) => {
    if (!isValidImageFile(file)) {
      toastMessage("error", "Only PNG, JPG, and JPEG images are allowed.");
      return;
    }
    setIsUpdating(true);
    setUpdatingId(item.id);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.patch(
        BACKEND_URL + "/web-hero-sections/" + item.id + "/image",
        formData,
        setHeaders(token)
      );
      toastMessage("success", res.data.msg);
      setHeroSections((prev) =>
        prev.map((row) =>
          row.id === item.id
            ? { ...row, image: res.data.heroSection.image }
            : row
        )
      );
    } catch (error) {
      errorHandler(error);
    } finally {
      setIsUpdating(false);
      setUpdatingId(null);
      setSelectedImageItem(null);
      if (updateImageRef.current) {
        updateImageRef.current.value = "";
      }
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={8}>
          <Card>
            <Card.Header>
              <strong>Web Hero Sections</strong>
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
                        <th>Eyebrow</th>
                        <th>Title</th>
                        <th>Subtitle</th>
                        <th>CTA Text</th>
                        <th>CTA Link</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {heroSections.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>
                            <img
                              src={FILE_URL + item.image}
                              alt=""
                              style={{ width: 50, height: 40, objectFit: "cover" }}
                            />
                            <input
                              type="file"
                              accept=".png,.jpg,.jpeg"
                              className="d-none"
                              ref={updateImageRef}
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file && selectedImageItem) {
                                  handleImageUpdate(file, selectedImageItem);
                                }
                              }}
                            />
                            {isUpdating && updatingId === item.id ? (
                              <Spinner size="sm" />
                            ) : (
                              <span
                                style={{
                                  display: "inline-block",
                                  cursor: "pointer",
                                  padding: 5,
                                }}
                                onClick={() => {
                                  setSelectedImageItem(item);
                                  updateImageRef.current.click();
                                }}
                              >
                                <EditOutlined />
                              </span>
                            )}
                          </td>
                          <td>{item.eyebrow}</td>
                          <td>{item.title}</td>
                          <td>{item.subtitle}</td>
                          <td>{item.ctaText}</td>
                          <td>{item.ctaLink}</td>
                          <td>
                            {deleteItem &&
                            deleteItem.id === item.id &&
                            isDeleting ? (
                              <Spinner size="sm" />
                            ) : (
                              <>
                                <EyeOutlined
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setViewItem(item);
                                    setShowViewModal(true);
                                  }}
                                />
                                &nbsp;&nbsp;
                                <EditOutlined
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setEditItem(item);
                                    setShowEditModal(true);
                                  }}
                                />
                                &nbsp;&nbsp;
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
              <strong>Create Hero Section</strong>
            </Card.Header>
            <Card.Body>
              <form onSubmit={handleSubmit}>
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
                <div className="form-group mb-3">
                  <label className="form-label">Hero Image</label>
                  <input
                    type="file"
                    name="image"
                    className="form-control"
                    accept=".png,.jpg,.jpeg"
                    onChange={handleImageChange}
                    required
                    disabled={isSubmitting}
                    ref={imageRef}
                  />
                  {imageError && (
                    <small className="text-danger">{imageError}</small>
                  )}
                </div>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="btn btn-primary"
                >
                  {isSubmitting && <Spinner />} Save Hero Section
                </button>
              </form>
            </Card.Body>
          </Card>
        </Grid>
      </Grid>
      <Edit
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        editItem={editItem}
        fetchData={fetchData}
      />
      <View
        showModal={showViewModal}
        setShowModal={setShowViewModal}
        viewItem={viewItem}
      />
      <Confirmation
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        callback={handleDelete}
        title="Are you sure you want to delete this Hero Section?"
      />
    </>
  );
};

export default WebHeroSection;
