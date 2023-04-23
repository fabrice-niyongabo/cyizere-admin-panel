import React from "react";
import { Link as RouterLink } from "react-router-dom";

// material-ui
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";

// project import
import AnimateButton from "../../../components/@extended/AnimateButton";

// assets
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import axios from "axios";
import { BACKEND_URL } from "../../../constants";
import { errorHandler, toastMessage } from "../../../helpers";
import { useDispatch } from "react-redux";
import { useNavigate } from "../../../../node_modules/react-router-dom/dist/index";
import {
  setUserEmail,
  setUserNames,
  setUserPhone,
  setUserRole,
  setUserToken,
} from "../../../actions/user";

// ============================|| FIREBASE - LOGIN ||============================ //

const initialState = {
  emailOrPhone: "",
  password: "",
};
const AuthLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [state, setState] = React.useState(initialState);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [checked, setChecked] = React.useState(false);

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (state.password.trim() === "" || state.emailOrPhone.trim() === "") {
      toastMessage("error", "All field are required");
      return;
    }
    axios
      .post(BACKEND_URL + "/users/login/", state)
      .then((res) => {
        const { email, role, phone, names, token } = res.data;
        if (role !== "admin") {
          toastMessage(
            "error",
            "This is not a client app, Please download the Ntuma app to get started."
          );
        } else {
          dispatch(setUserNames(names));
          dispatch(setUserEmail(email));
          dispatch(setUserPhone(phone));
          dispatch(setUserToken(token));
          dispatch(setUserRole(role));
          navigate("/dashboard");
          toastMessage("success", "Logged in successfull");
        }
      })
      .catch((error) => {
        setState(initialState);
        setIsSubmitting(false);
        errorHandler(error);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="email-login">Email Address</InputLabel>
              <OutlinedInput
                id="email-login"
                type="text"
                value={state.emailOrPhone}
                name="email"
                onChange={(e) =>
                  setState({ ...state, emailOrPhone: e.target.value })
                }
                placeholder="Enter email address / phone"
                fullWidth
                disabled={isSubmitting}
                required={true}
              />
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="password-login">Password</InputLabel>
              <OutlinedInput
                fullWidth
                id="-password-login"
                type={showPassword ? "text" : "password"}
                value={state.password}
                name="password"
                onChange={(e) =>
                  setState({ ...state, password: e.target.value })
                }
                disabled={isSubmitting}
                required={true}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? (
                        <EyeOutlined />
                      ) : (
                        <EyeInvisibleOutlined />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                placeholder="Enter password"
              />
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <AnimateButton>
              <Button
                disableElevation
                disabled={isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="primary"
              >
                {isSubmitting ? "Login..." : "Login"}
              </Button>
            </AnimateButton>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default AuthLogin;
