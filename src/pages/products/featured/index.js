import axios from "axios";
import React, { useEffect, useState } from "react";
import { BACKEND_URL } from "../../../constants";
import { errorHandler, setHeaders, toastMessage } from "../../../helpers";
import { useSelector } from "react-redux";

function Featured({ item }) {
  const [isChecked, setIsChecked] = useState(item.isFeatured);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useSelector((state) => state.user);
  const handleClick = () => {
    setIsChecked(!isChecked);
    axios
      .put(
        BACKEND_URL + "/products/featured",
        { ...item, isChecked: !isChecked },
        setHeaders(token)
      )
      .then((res) => {
        setIsLoading(false);
        toastMessage("success", res.data.msg);
      })
      .catch((error) => {
        setIsLoading(false);
        errorHandler(error);
      });
  };
  return (
    <input
      type="checkbox"
      checked={isChecked}
      onClick={() => handleClick()}
      disabled={isLoading}
      style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
    />
  );
}

export default Featured;
