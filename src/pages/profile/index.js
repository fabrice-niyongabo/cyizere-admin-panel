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

const initialState = {
  amount: "",
};
const Profile = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [state, setState] = useState(initialState);
  const { token } = useSelector((state) => state.user);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    axios
      .put(BACKEND_URL + "/users/pwd", {
        token,
        oldPassword: password,
        newPassword: newPassword,
        confirmPassword: "",
      })
      .then((res) => {
        setIsSubmitting(false);
        setPassword("");
        setNewPassword("");
        toastMessage("success", "Password updated successfull!");
      })
      .catch((error) => {
        setIsSubmitting(false);
        errorHandler(error);
      });
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={6}>
          <Card>
            <Card.Header>
              <strong>Change Password</strong>
            </Card.Header>
            <Card.Body>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label>Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your current password"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label>New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your current password"
                    required
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
    </>
  );
};

export default Profile;
