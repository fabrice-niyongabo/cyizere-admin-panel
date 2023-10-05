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
import {
  EditOutlined,
  CloseOutlined,
  UserOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import Edit from "./edit";
import Confirmation from "../../controllers/confirmation";

const Suppliers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [shopCategories, setShopCategories] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  //updating image
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(undefined);
  const [updatedImage, setUpdatedImage] = useState(undefined);
  const [showUpdateImageAlert, setShowUpdateImageAlert] = useState(false);
  const updateImageRef = useRef(null);

  const fetchData = () => {
    setIsLoading(true);
    axios
      .get(BACKEND_URL + "/suppliers/", setHeaders(token))
      .then((res) => {
        setIsLoading(false);
        setUsers(res.data.suppliers);
      })
      .catch((error) => {
        setIsLoading(false);
        errorHandler(error);
      });
  };

  const fetchShopCategories = () => {
    axios
      .get(BACKEND_URL + "/shopcategories/", setHeaders(token))
      .then((res) => {
        setIsLoading(false);
        setShopCategories(res.data.categories);
      })
      .catch((error) => {
        errorHandler(error);
      });
  };

  const updateImage = () => {
    if (selectedImage === undefined || updatedImage === undefined) {
      return;
    }
    setIsUpdating(true);
    const formData = new FormData();
    formData.append("file", updatedImage);
    formData.append("supplierId", selectedImage.supplierId);
    axios
      .put(BACKEND_URL + "/suppliers/image", formData, setHeaders(token))
      .then((res) => {
        setIsUpdating(false);
        toastMessage("success", res.data.msg);
        const newData = users;
        const index = newData.findIndex(
          (item) => item.supplierId === selectedImage.supplierId
        );
        if (index > -1) {
          newData[index] = { ...newData[index], shopImage: res.data.image };
          setUsers(newData);
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

  useEffect(() => {
    fetchData();
    fetchShopCategories();
  }, []);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12}>
          <Card>
            <Card.Header>
              <strong>Suppiers List ({users.length})</strong>
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
                        <th>Owner</th>
                        <th>Shop</th>
                        <th>ID No</th>
                        <th>Status</th>
                        <th>Verification</th>
                        <th>Verification Status</th>
                        <th>Disabled</th>
                        <th>Gift Option</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((item, index) => (
                        <tr key={index}>
                          <td>{item.supplierId}</td>
                          <td>
                            {item?.shopImage?.trim() !== "" ? (
                              <img
                                src={FILE_URL + item.shopImage}
                                style={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: 10,
                                }}
                              />
                            ) : (
                              <UserOutlined style={{ fontSize: 50 }} />
                            )}
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
                          <td>
                            <p className="m-0">{item.names}</p>
                            <p className="m-0">{item.phone}</p>
                            <p className="m-0">{item.email}</p>
                          </td>
                          <td>
                            {item.shopName}
                            <p className="m-0">{item.shopAddress}</p>
                          </td>
                          <td>
                            {item.idNumber}
                            <br />
                            <a
                              href={FILE_URL + item.idNumberDocument}
                              target="_blank"
                            >
                              ID PROOF
                            </a>
                          </td>
                          <td
                            className={
                              item.isActive ? "text-primary" : "text-danger"
                            }
                          >
                            {item.isActive ? "Active" : "Inactive"}
                          </td>
                          <td
                            className={
                              item.isVerified ? "text-primary" : "text-danger"
                            }
                          >
                            {item.isVerified ? "Verified" : "Not Verified"}
                          </td>
                          <td
                            className={
                              item.verificationStatus === "Verified"
                                ? "text-primary"
                                : item.verificationStatus === "In Review"
                                ? "text-warning"
                                : "text-danger"
                            }
                          >
                            {item.verificationStatus}
                          </td>
                          <td
                            className={
                              item.isDisabled ? "text-danger" : "text-primary"
                            }
                          >
                            {item.isDisabled ? "YES" : "NO"}
                          </td>
                          <td
                            className={
                              item.hasGift ? "text-primary" : "text-danger"
                            }
                          >
                            {item.hasGift ? "YES" : "NO"}
                          </td>
                          <td>
                            <EditOutlined
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setEditItem(item);
                                setShowModal(true);
                              }}
                            />
                            &nbsp; &nbsp;
                            <a href={`tel:${item.phone}`}>Call</a>
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
      </Grid>
      <Edit
        showModal={showModal}
        setShowModal={setShowModal}
        editItem={editItem}
        fetchData={fetchData}
        shopCategories={shopCategories}
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

export default Suppliers;
