import { Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { useSelector } from "react-redux";
import { currencyFormatter, errorHandler, setHeaders } from "../../helpers";
import { Grid } from "@mui/material";
import Loader from "../loader";
import Paginator from "../../components/paginator";

const Riders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useSelector((state) => state.user);
  const [transactions, setTransactions] = useState([]);

  //pagination
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  const itemsToShow = transactions.slice(
    itemOffset > transactions.length ? 0 : itemOffset,
    endOffset
  );
  const pageCount = Math.ceil(transactions.length / itemsPerPage);
  //pagination

  const fetchData = () => {
    setIsLoading(true);
    axios
      .get(BACKEND_URL + "/transactions/", setHeaders(token))
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
              <strong>Transactions ({transactions.length})</strong>
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
                        <th>Amount</th>
                        <th>currency</th>
                        <th>status</th>
                        <th>date</th>
                        <th>chargedCommission</th>
                        <th>spTransactionId</th>
                        <th>transactionId</th>
                        <th>statusDescription</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemsToShow.map((item, index) => (
                        <tr
                          key={index}
                          className={
                            item.status === "FAILED" ? "text-danger" : ""
                          }
                        >
                          <td>{item.id}</td>
                          <td>{currencyFormatter(item.paidAmount)}</td>
                          <td>{item.currency}</td>
                          <td>{item.status}</td>
                          <td>{new Date(item.createdAt).toUTCString()}</td>
                          <td>{item.chargedCommission}</td>
                          <td>{item.spTransactionId}</td>
                          <td>{item.transactionId}</td>
                          <td>{item.statusDescription}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Paginator
                    itemsPerPage={itemsPerPage}
                    pageCount={pageCount}
                    setItemOffset={setItemOffset}
                    setItemsPerPage={setItemsPerPage}
                    tableData={transactions}
                  />
                </div>
              )}
            </Card.Body>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Riders;
