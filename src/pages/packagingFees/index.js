import { Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
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
import { EditOutlined } from "@ant-design/icons";
import Edit from "./edit";

const initialState = {
  amount: "",
};
const PackagingFees = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, setState] = useState(initialState);
  const { token } = useSelector((state) => state.user);
  const [markets, setMarkets] = useState(undefined);

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const changeHandler = (e) =>
    setState({ ...state, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      setIsSubmitting(false);
      const res = await axios.post(
        BACKEND_URL + "/packagingfees",
        state,
        setHeaders(token)
      );
      setState(initialState);
      toastMessage("success", res.data.msg);
      setMarkets(res.data.fees);
    } catch (error) {
      errorHandler(error);
      setIsSubmitting(false);
    }
  };

  const fetchData = () => {
    setIsLoading(true);
    axios
      .get(BACKEND_URL + "/packagingfees")
      .then((res) => {
        setIsLoading(false);
        setMarkets(res.data.fees);
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
              <strong>Packaging Fees</strong>
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
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {markets !== undefined && (
                        <tr>
                          <td>{markets.id}</td>
                          <td>{currencyFormatter(markets.amount)} RWF</td>
                          <td>
                            <EditOutlined
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setEditItem(markets);
                                setShowModal(true);
                              }}
                            />
                          </td>
                        </tr>
                      )}
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
              <strong>Add New</strong>
            </Card.Header>
            <Card.Body>
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <input
                    type="number"
                    name="amount"
                    className="form-control"
                    value={state.amount}
                    placeholder="Enter Amount/value"
                    onChange={changeHandler}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="btn btn-primary"
                >
                  {isSubmitting && <Spinner />} Save
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
    </>
  );
};

export default PackagingFees;
