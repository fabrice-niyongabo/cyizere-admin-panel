import { Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { useSelector } from "react-redux";
import { currencyFormatter, errorHandler, setHeaders } from "../../helpers";
import { Grid } from "@mui/material";
import Loader from "..//loader";

const RidersWallet = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useSelector((state) => state.user);
  const [transactions, setTransactions] = useState([]);

  const fetchData = () => {
    setIsLoading(true);
    axios
      .get(BACKEND_URL + "/riderswallet/all", setHeaders(token))
      .then((res) => {
        setIsLoading(false);
        setTransactions(res.data.transactions);
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
        <Grid item xs={12} sm={12} md={12}>
          <Card>
            <Card.Header>
              <strong>
                Riders Wallet Transactions ({transactions.length})
              </strong>
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
                        <th>Rider</th>
                        <th>Amount</th>
                        <th>Tx Type</th>
                        <th>status</th>
                        <th>Order ID</th>
                        <th>Phone</th>
                        <th>Tx ID</th>
                        <th>date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((item, index) => (
                        <tr
                          key={index}
                          className={
                            item.transactionType === "withdraw"
                              ? "text-danger"
                              : ""
                          }
                        >
                          <td>{item.id}</td>
                          <td>
                            {item.rider.names} #{item.rider.riderId}
                          </td>
                          <td>{currencyFormatter(item.amount)} RWF</td>
                          <td>
                            {item.transactionType === "deposit"
                              ? "Earnings"
                              : item.transactionType}
                          </td>
                          <td>{item.paymentStatus}</td>
                          <td>{item.orderId}</td>
                          <td>{item.paymentPhoneNumber}</td>
                          <td>{item.transactionId}</td>
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

export default RidersWallet;
