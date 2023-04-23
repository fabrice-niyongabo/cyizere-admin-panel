import { Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import {
  currencyFormatter,
  errorHandler,
  setHeaders,
  toastMessage,
} from "../../helpers";
import { Grid } from "@mui/material";
import Loader from "../loader";
import { EditOutlined, WhatsAppOutlined } from "@ant-design/icons";
import Edit from "./edit";
import { useSelector, useDispatch } from "react-redux";
import { fetchPaymentList } from "../../actions/supplierpayments";
import { FILE_URL } from "../../constants";

const Payments = () => {
  const dispatch = useDispatch();
  const { isLoading, payments } = useSelector(
    (state) => state.supplierpayments
  );

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    dispatch(fetchPaymentList());
  }, []);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12}>
          <Card>
            <Card.Header>
              <strong>Suppliers Payments Details</strong>
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
                        <th>Supplier's Name</th>
                        <th>Amount</th>
                        <th>Order ID</th>
                        <th>Products</th>
                        <th>Market</th>
                        <th>Agent</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((item, index) => (
                        <tr key={index}>
                          <td>{item.id}</td>
                          <td>{item.supplierNames}</td>
                          <td>{currencyFormatter(item.totalAmount)} RWF</td>
                          <td>{item?.orderId}</td>
                          <td>{item?.productsList?.length}</td>
                          <td>{item?.market?.name}</td>
                          <td>{item?.agent?.names}</td>
                          <td>{item?.paymentStatus}</td>
                          <td>
                            {item.paymentStatus === "PENDING" && (
                              <button
                                className="btn btn-primary"
                                onClick={() => {
                                  setEditItem(item);
                                  setShowModal(true);
                                }}
                              >
                                Pay
                              </button>
                            )}
                            {item.paymentStatus === "SUCCESS" && (
                              <a
                                href={FILE_URL + item.payementProof}
                                target="_blank"
                              >
                                View Proof
                              </a>
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
      />
    </>
  );
};

export default Payments;
