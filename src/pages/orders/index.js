import { Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import {
  currencyFormatter,
  errorHandler,
  setHeaders,
  toastMessage,
} from "../../helpers";
import { Grid } from "@mui/material";
import Loader from "../loader";
import { fetchOrders } from "../../actions/orders";

const Orders = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { orders, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, []);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12}>
          <Card>
            <Card.Header>
              <strong>Orders List ({orders.length})</strong>
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
                        <th>Market</th>
                        <th>Products</th>
                        <th>Subtotal</th>
                        <th>Total Amount</th>
                        <th>Payment</th>
                        <th>Delivery</th>
                        <th>System Fees</th>
                        <th>Packaging Fees</th>
                        <th>Client</th>
                        <th>Agent</th>
                        <th>Rider</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((item, index) => (
                        <tr>
                          <td>{item.id}</td>
                          <td>Market</td>
                          <td>Products</td>
                          <td>{currencyFormatter(item.cartTotalAmount)} RWF</td>
                          <td>
                            {currencyFormatter(
                              Number(item.cartTotalAmount) +
                                Number(item.deliveryFees) +
                                Number(item.systemFees) +
                                Number(item.packagingFees) +
                                Number(item.agentFees)
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
                            <p style={{ margin: 0 }}>{item.agent?.names}</p>
                            <p style={{ margin: 0 }}>
                              Email: {item.agent?.email}
                            </p>
                            <p style={{ margin: 0 }}>
                              Phone: {item.agent?.phone}
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
    </>
  );
};

export default Orders;
