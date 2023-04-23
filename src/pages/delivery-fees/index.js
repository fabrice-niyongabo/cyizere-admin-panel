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

const initialState = {
  vehicleType: "",
  amountPerKilometer: "",
  defaultPrice: "",
};
const DeliveryFees = () => {
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

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      setIsSubmitting(false);
      const res = await axios.delete(
        BACKEND_URL + "/fees/" + deleteItem.id,
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
    setIsSubmitting(true);
    try {
      setIsSubmitting(false);
      const res = await axios.post(
        BACKEND_URL + "/fees/",
        state,
        setHeaders(token)
      );
      setState(initialState);
      toastMessage("success", res.data.msg);
      setMarkets([...markets, res.data.fees]);
    } catch (error) {
      errorHandler(error);
      setIsSubmitting(false);
    }
  };

  const fetchData = () => {
    setIsLoading(true);
    axios
      .get(BACKEND_URL + "/fees/")
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
              <strong>Delivery Fees</strong>
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
                        <th>Vehicle</th>
                        <th>Default Price</th>
                        <th>Amount / KM</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {markets.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.vehicleType}</td>
                          <td>{item.defaultPrice}</td>
                          <td>{item.amountPerKilometer}</td>
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
              <strong>Add New</strong>
            </Card.Header>
            <Card.Body>
              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <select
                    name="vehicleType"
                    className="form-select"
                    value={state.vehicleType}
                    onChange={changeHandler}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="">Choose Vehicle</option>
                    <option value="BIKE">BIKE</option>
                    <option value="MOTORCYCLE">MOTORCYCLE</option>
                    <option value="CAR">CAR</option>
                  </select>
                </div>
                <div className="form-group mb-3">
                  <input
                    type="number"
                    name="amountPerKilometer"
                    className="form-control"
                    value={state.amountPerKilometer}
                    placeholder="Amount per km"
                    onChange={changeHandler}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group mb-3">
                  <input
                    type="number"
                    name="defaultPrice"
                    className="form-control"
                    value={state.defaultPrice}
                    placeholder="Default Price"
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
      <Confirmation
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        callback={handleDelete}
        title="Do you want to delete this fee?"
      />
    </>
  );
};

export default DeliveryFees;
