import { Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { APP_COLORS, BACKEND_URL } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import {
  currencyFormatter,
  errorHandler,
  setHeaders,
  toastMessage,
} from "../../helpers";
import { Grid } from "@mui/material";
import Loader from "../loader";
import { fetchOrders, setAddOrUpdateOrder } from "../../actions/orders";
import Products from "./products";
import Confirmation from "../../controllers/confirmation";
import { Spinner } from "react-bootstrap";

const Orders = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { orders, isLoading } = useSelector((state) => state.orders);
  const [successTotal, setSuccessTotal] = useState(0);
  const [failedTotat, setFailedTotal] = useState(0);
  const [ordersToShow, setOrdersToshow] = useState([]);

  //
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [fromDateFilter, setFromDateFilter] = useState("");
  const [toDateFilter, setToDateFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  //

  const [selectedOrder, setSelectedOrder] = useState(undefined);
  const [showProducts, setShowProducts] = useState(false);

  //
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [allProducts, setAllProducts] = useState([]);

  const [isCancellingOrder, setIsCancellingOrder] = useState(false);
  const [showCancellAlert, setShowCancellAlert] = useState(false);

  const handleCancellOrder = () => {
    setIsCancellingOrder(true);
    axios
      .post(
        BACKEND_URL + "/orders/cancell",
        { orderId: selectedOrder.id },
        setHeaders(token)
      )
      .then((res) => {
        setIsCancellingOrder(false);
        dispatch(setAddOrUpdateOrder(res.data.order));
        toastMessage("success", res.data.msg);
      })
      .catch((error) => {
        setIsCancellingOrder(false);
        errorHandler(error);
      });
  };

  const fetchSuppliers = () => {
    setIsLoadingSuppliers(true);
    axios
      .get(BACKEND_URL + "/suppliers", setHeaders(token))
      .then((res) => {
        setIsLoadingSuppliers(false);
        setSuppliers(res.data.suppliers);
      })
      .catch((error) => {
        setIsLoadingSuppliers(false);
        errorHandler(error);
      });
  };

  const fetchProducts = () => {
    setIsLoadingProducts(true);
    axios
      .get(BACKEND_URL + "/products/admin/", setHeaders(token))
      .then((res) => {
        setIsLoadingProducts(false);
        setAllProducts(res.data.products);
      })
      .catch((error) => {
        setIsLoadingProducts(false);
        errorHandler(error);
      });
  };

  useEffect(() => {
    dispatch(fetchOrders());
    fetchSuppliers();
    fetchProducts();
  }, []);

  useEffect(() => {
    let sub = true;
    if (sub) {
      const success = ordersToShow.filter(
        (item) => item.paymentStatus === "SUCCESS"
      );
      const failed = ordersToShow.filter(
        (item) => item.paymentStatus === "FAILED"
      );

      let s1 = 0;
      let s2 = 0;
      for (let i = 0; i < success.length; i++) {
        s1 +=
          Number(success[i].cartTotalAmount) +
          Number(success[i].deliveryFees) +
          Number(success[i].systemFees) +
          Number(success[i].packagingFees);
      }

      for (let i = 0; i < failed.length; i++) {
        s2 +=
          Number(failed[i].cartTotalAmount) +
          Number(failed[i].deliveryFees) +
          Number(failed[i].systemFees) +
          Number(failed[i].packagingFees);
      }
      setSuccessTotal(s1);
      setFailedTotal(s2);
    }
    return () => {
      sub = false;
    };
  }, [ordersToShow]);

  useEffect(() => {
    let sub = true;
    if (sub) {
      let res = orders;
      // if (keyWord.trim() !== "") {
      //   res = allPcList.filter(
      //     (item) =>
      //       item.serialNumber.toLowerCase().includes(keyWord.toLowerCase()) ||
      //       item.model.toLowerCase().includes(keyWord.toLowerCase())
      //   );
      // }
      if (supplierFilter !== "") {
        res = res.filter((item) => item.supplierId == supplierFilter);
      }
      if (paymentStatusFilter !== "") {
        res = res.filter((item) => item.paymentStatus === paymentStatusFilter);
      }
      if (deliveryStatusFilter !== "") {
        res = res.filter(
          (item) => item.deliveryStatus === deliveryStatusFilter
        );
      }

      if (fromDateFilter !== "") {
        res = res.filter(
          (item) => new Date(item.createdAt) >= new Date(fromDateFilter)
        );
      }
      if (toDateFilter !== "") {
        res = res.filter(
          (item) => new Date(item.createdAt) <= new Date(toDateFilter)
        );
      }
      setOrdersToshow(res);
    }
    return () => {
      sub = false;
    };
  }, [
    paymentStatusFilter,
    deliveryStatusFilter,
    fromDateFilter,
    toDateFilter,
    orders,
    supplierFilter,
  ]);

  const getSupplierShopName = (id) => {
    const sup = suppliers.find((item) => item.supplierId == id);
    if (sup) {
      return sup.shopName;
    } else {
      return "-";
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12}>
          <Card>
            <Card.Header>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <strong>Orders List ({orders.length})</strong>
                <div>
                  <Grid container>
                    <Grid item md={4} sm={6} xs={6}>
                      <select
                        value={supplierFilter}
                        onChange={(e) => setSupplierFilter(e.target.value)}
                        title="Suppliers Filter"
                      >
                        <option value="">All suppliers</option>
                        {suppliers.map((item, index) => (
                          <option value={item.supplierId} key={index}>
                            {item.shopName} #{item.supplierId}
                          </option>
                        ))}
                      </select>
                    </Grid>
                    <Grid item md={4} sm={6} xs={6}>
                      <select
                        value={deliveryStatusFilter}
                        onChange={(e) =>
                          setDeliveryStatusFilter(e.target.value)
                        }
                        title="Delivery Status Filter"
                      >
                        <option value="">Delivery Status</option>
                        <option value="PENDING">PENDING</option>
                        <option value="WAITING">WAITING</option>
                        <option value="FAILED">FAILED</option>
                        <option value="SUCCESS">SUCCESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                      </select>
                    </Grid>
                    <Grid item md={4} sm={6} xs={6}>
                      <select
                        value={paymentStatusFilter}
                        onChange={(e) => setPaymentStatusFilter(e.target.value)}
                        title="Payment Status Filter"
                      >
                        <option value="">Payment Status</option>
                        <option value="PENDING">PENDING</option>
                        <option value="SUCCESS">SUCCESS</option>
                        <option value="FAILED">FAILED</option>
                      </select>
                    </Grid>
                    <Grid item md={4} sm={6} xs={6}>
                      <input
                        type="date"
                        value={fromDateFilter}
                        onChange={(e) => setFromDateFilter(e.target.value)}
                        title="From Date Filter"
                      />
                    </Grid>
                    <Grid item md={4} sm={6} xs={6}>
                      <input
                        type="date"
                        value={toDateFilter}
                        onChange={(e) => setToDateFilter(e.target.value)}
                        title="To Date Filter"
                      />
                    </Grid>
                    <Grid item md={4} sm={6} xs={6}></Grid>
                  </Grid>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              {isLoading ? (
                <Loader />
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>OrderId</th>
                        <th>Shop</th>
                        <th>Products</th>
                        <th>Subtotal</th>
                        <th>Total Amount</th>
                        <th>Payment</th>
                        <th>Delivery</th>
                        <th>System Fees</th>
                        <th>Packaging Fees</th>
                        <th>Client</th>
                        <th>Rider</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ordersToShow.map((item, index) => (
                        <tr key={index}>
                          <td>{item.id}</td>
                          <td>
                            #{item.supplierId}{" "}
                            {getSupplierShopName(item.supplierId)}
                          </td>
                          <td>
                            <span
                              style={{
                                color: APP_COLORS.lightBlue,
                                textDecoration: "underline",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setSelectedOrder(item);
                                setShowProducts(true);
                              }}
                            >
                              {item.cartItems.length} products
                            </span>
                          </td>
                          <td>{currencyFormatter(item.cartTotalAmount)} RWF</td>
                          <td>
                            {currencyFormatter(
                              Number(item.cartTotalAmount) +
                                Number(item.deliveryFees) +
                                Number(item.systemFees) +
                                Number(item.packagingFees)
                            )}{" "}
                            RWF
                          </td>
                          <td>
                            <p
                              style={{ margin: 0 }}
                              className={
                                item.paymentStatus === "FAILED"
                                  ? "text-danger"
                                  : item.paymentStatus === "PENDING"
                                  ? "text-info"
                                  : "text-primary"
                              }
                            >
                              {item.paymentStatus}
                            </p>
                            <p style={{ margin: 0 }}>
                              Method: {item.paymentMethod}
                            </p>
                            <p style={{ margin: 0 }}>
                              Phone: {item.paymentPhoneNumber}
                            </p>
                          </td>
                          <td>
                            <p style={{ margin: 0 }}>{item.deliveryStatus}</p>
                            <p style={{ margin: 0, fontWeight: "bold" }}>
                              Address:
                            </p>
                            <p style={{ margin: 0 }}>
                              {item.deliveryAddress.name}
                            </p>
                            <p style={{ margin: 0, fontWeight: "bold" }}>
                              Delivery Fees:
                            </p>
                            <p style={{ margin: 0 }}>
                              {currencyFormatter(item.deliveryFees)} RWF
                            </p>
                            <p style={{ margin: 0, fontWeight: "bold" }}>
                              Code:
                            </p>
                            <p style={{ margin: 0 }}>{item.deliveryCode}</p>
                          </td>
                          <td>{currencyFormatter(item.systemFees)} RWF</td>
                          <td>{currencyFormatter(item.packagingFees)} RWF</td>
                          <td>
                            <p style={{ margin: 0 }}>{item.client?.names}</p>
                            <p style={{ margin: 0 }}>
                              Email: {item.client?.email}
                            </p>
                            <p style={{ margin: 0 }}>
                              Phone: {item.client?.phone}
                            </p>
                          </td>
                          <td>
                            <p style={{ margin: 0 }}>{item.rider?.names}</p>
                            <p style={{ margin: 0 }}>
                              Email: {item.rider?.email}
                            </p>
                            <p style={{ margin: 0 }}>
                              Phone: {item.rider?.phone}
                            </p>
                          </td>
                          <td>{new Date(item.createdAt).toUTCString()}</td>
                          <td>
                            {item.paymentStatus !== "FAILED" &&
                              item.deliveryStatus !== "COMPLETED" && (
                                <button
                                  disabled={
                                    isCancellingOrder &&
                                    selectedOrder?.id === item.id
                                  }
                                  onClick={() => {
                                    setSelectedOrder(item);
                                    setShowCancellAlert(true);
                                  }}
                                  className="btn btn-danger"
                                  title="This order will be cancelled"
                                >
                                  {isCancellingOrder &&
                                    selectedOrder?.id === item.id && (
                                      <Spinner size="sm" />
                                    )}{" "}
                                  Cancel Order
                                </button>
                              )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-success">
                    <b>Total success orders: </b>{" "}
                    {currencyFormatter(successTotal)} RWF
                  </p>
                  <p className="text-danger">
                    <b>Total failed orders: </b>{" "}
                    {currencyFormatter(failedTotat)} RWF
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Grid>
      </Grid>
      <Products
        order={selectedOrder}
        showModal={showProducts}
        setShowModal={setShowProducts}
        isLoading={isLoadingProducts}
        products={allProducts}
      />
      <Confirmation
        callback={handleCancellOrder}
        setShowAlert={setShowCancellAlert}
        showAlert={showCancellAlert}
        title={"Do you want to cancel order #" + selectedOrder?.id}
      />
    </>
  );
};

export default Orders;
