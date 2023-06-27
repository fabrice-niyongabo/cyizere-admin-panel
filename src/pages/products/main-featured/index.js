import axios from "axios";
import React, { useState } from "react";
import { BACKEND_URL } from "../../../constants";
import { errorHandler, setHeaders, toastMessage } from "../../../helpers";
import { useSelector } from "react-redux";

function MainFeatured({ item }) {
  const [isChecked, setIsChecked] = useState(item.isMainFeatured);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useSelector((state) => state.user);
  const handleClick = () => {
    setIsChecked(!isChecked);
    axios
      .put(
        BACKEND_URL + "/products/mainfeatured",
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

export default MainFeatured;
