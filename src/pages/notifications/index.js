import { Card, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import HtmlParser from "react-html-parser";
import axios from "axios";
import { BACKEND_URL } from "../../constants";
import { useDispatch, useSelector } from "react-redux";
import { errorHandler, setHeaders, toastMessage } from "../../helpers";
import { Grid } from "@mui/material";
import Loader from "../loader";
import {
  fetchNotifications2,
  setNotifications,
} from "../../actions/notifications";
import Confirmation from "../../controllers/confirmation";

const Orders = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.user);
  const { notifications, isLoading } = useSelector(
    (state) => state.notifications
  );

  const [selectedNotification, setSelectedNotification] = useState(undefined);
  const [showAlert, setShowAlert] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchNotifications2());
  }, []);

  const deleteNoti = () => {
    if (selectedNotification === undefined) {
      return;
    }
    setIsDeleting(true);
    axios
      .delete(
        BACKEND_URL + "/notifications/admin/" + selectedNotification.id,
        setHeaders(token)
      )
      .then((res) => {
        setIsDeleting(false);
        toastMessage("success", res.data.msg);
        dispatch(
          setNotifications(
            notifications.filter((item) => item.id !== selectedNotification.id)
          )
        );
        setSelectedNotification(undefined);
      })
      .catch((error) => {
        errorHandler(error);
        setIsDeleting(false);
      });
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
                <strong>Notifications </strong>
              </div>
            </Card.Header>
            <Card.Body>
              {isLoading ? (
                <Loader />
              ) : (
                notifications.map((item, index) => (
                  <div className="card mb-2 p-2" key={index}>
                    <h3 style={{ fontSize: 16 }}>{item.title}</h3>
                    <p>{HtmlParser(item.message)}</p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>
                        <b> {new Date(item.createdAt).toLocaleDateString()}</b>{" "}
                        -{" "}
                        {`${new Date(item.createdAt).getHours()}:${new Date(
                          item.createdAt
                        ).getMinutes()}`}
                      </span>
                      {isDeleting ? (
                        <>
                          {selectedNotification.id === item.id && (
                            <Spinner size="sm" />
                          )}
                        </>
                      ) : (
                        <span
                          className="text-danger"
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => {
                            setSelectedNotification(item);
                            setShowAlert(true);
                          }}
                        >
                          Delete
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Grid>
      </Grid>
      <Confirmation
        showAlert={showAlert}
        setShowAlert={setShowAlert}
        callback={deleteNoti}
        title="Do you want to delete this notification?"
      />
    </>
  );
};

export default Orders;
