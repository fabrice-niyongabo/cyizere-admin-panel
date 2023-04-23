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

const Agents = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = () => {
    setIsLoading(true);
    axios
      .get(BACKEND_URL + "/agents/", setHeaders(token))
      .then((res) => {
        setIsLoading(false);
        setUsers(res.data.agents);
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
              <strong>Agents List ({users.length})</strong>
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
                        <th>Names</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>ID No</th>
                        <th>Wallet Amount</th>
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
                          <td>{item.agentId}</td>
                          <td>
                            {item.image.trim() !== "" ? (
                              <img
                                src={FILE_URL + item.image}
                                style={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: 100,
                                }}
                              />
                            ) : (
                              <UserOutlined style={{ fontSize: 50 }} />
                            )}
                          </td>
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

export default Agents;
