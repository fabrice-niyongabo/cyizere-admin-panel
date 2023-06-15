import React, { useState, useEffect } from "react";
import Switch from "@mui/material/Switch";
import { useSelector } from "react-redux";
import axios from "axios";
import { BACKEND_URL } from "../../../constants";
import { errorHandler, setHeaders, toastMessage } from "../../../helpers";

function SystemStatus() {
  const [isActive, setIsActive] = useState([true]);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useSelector((state) => state.user);
  const handleChange = () => {
    setIsActive(!isActive);
    setIsLoading(true);
    axios
      .put(
        BACKEND_URL + "/system",
        {
          isActive: !isActive,
        },
        setHeaders(token)
      )
      .then((res) => {
        setIsLoading(false);
        toastMessage("success", res.data.msg);
      })
      .catch((error) => {
        errorHandler(error);
        setIsActive(!isActive);
        setIsLoading(false);
      });
  };
  const fetchStatus = () => {
    setIsLoading(true);
    axios
      .get(BACKEND_URL + "/system/")
      .then((res) => {
        setIsLoading(false);
        setIsActive(res.data.systemStatus.isActive);
      })
      .catch((error) => {
        setIsLoading(false);
        errorHandler(error);
      });
  };

  useEffect(() => {
    fetchStatus();
  }, []);
  return (
    <div>
      <h2>SystemStatus</h2>
      <div>
        <Switch
          disabled={isLoading}
          checked={isActive}
          onChange={(e) => handleChange()}
        />
        <span>{isActive ? "ON" : "OFF"}</span>
      </div>
    </div>
  );
}

export default SystemStatus;
