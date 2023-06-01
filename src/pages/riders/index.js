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
import Loader from "../loader";
import {
  EditOutlined,
  CloseOutlined,
  UserOutlined,
  WhatsAppOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import Edit from "./edit";
import { Link } from "react-router-dom";

const Riders = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const fetchData = () => {
    setIsLoading(true);
    axios
      .get(BACKEND_URL + "/riders/", setHeaders(token))
      .then((res) => {
        setIsLoading(false);
        setUsers(res.data.riders);
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
        <Grid item md={12}>
          <Card>
            <Card.Header>
              <strong>Riders List ({users.length})</strong>
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
                        <th>Names</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>ID No</th>
                        <th>Wallet Amount</th>
                        <th>Vehicle</th>
                        <th>Status</th>
                        <th>Verification</th>
                        <th>Verification Status</th>
                        <th>Disabled</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((item, index) => (
                        <tr key={index}>
                          <td>{item.riderId}</td>
                          <td>{item.names}</td>
                          <td>{item.email}</td>
                          <td>{item.phone}</td>
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
                          <td>{currencyFormatter(item.walletAmounts)} RWF</td>
                          <td>{item.vehicleType}</td>
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
                          <td>
                            <EditOutlined
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setEditItem(item);
                                setShowModal(true);
                              }}
                            />
                            &nbsp; &nbsp;
                            <a href={`tel:${item.phone}`}>
                              <WhatsAppOutlined />
                            </a>
                            &nbsp; &nbsp;
                            <Link to={`/dashboard/riders/` + item.riderId}>
                              <EnvironmentOutlined />
                            </Link>
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
      />
    </>
  );
};

export default Riders;
