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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, setState] = useState(initialState);
  const { token } = useSelector((state) => state.user);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [showPriceModal, setShowPriceModal] = useState(false);
  const [priceProduct, setPriceProduct] = useState(null);

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

  const fetchSuppliers = () => {
    setIsLoadingMarkets(true);
    axios
      .get(BACKEND_URL + "/suppliers", setHeaders(token))
      .then((res) => {
        setIsLoadingMarkets(false);
        setSuppliers(res.data.suppliers);
      })
      .catch((error) => {
        setIsLoadingMarkets(false);
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
    fetchSuppliers();
  }, []);

  const getSupplierObj = (supplierId) => {
    const sup = suppliers.find((item) => item.supplierId == supplierId);
    if (sup) {
      return sup;
    }
    return undefined;
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={12}>
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
                        <th>Description</th>
                        <th>Shop</th>
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
                          <td>{item.description}</td>
                          <td>
                            <p className="m-0">
                              {getSupplierObj(item.supplierId)?.shopName}
                            </p>
                            <p className="m-0">
                              {getSupplierObj(item.supplierId)?.shopAddress}
                            </p>
                          </td>
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
      </Grid>
      <Edit
        showModal={showModal}
        setShowModal={setShowModal}
        editItem={editItem}
        fetchData={fetchData}
        markets={suppliers}
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
