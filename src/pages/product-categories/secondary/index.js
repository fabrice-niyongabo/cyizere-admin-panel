import axios from "axios";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { BACKEND_URL } from "../../../constants";
import { errorHandler, setHeaders, toastMessage } from "../../../helpers";
import { useSelector } from "react-redux";

function Secondary({ item, onUpdate }) {
  const [isChecked, setIsChecked] = useState(Boolean(item.isSecondary));
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useSelector((state) => state.user);

  useEffect(() => {
    setIsChecked(Boolean(item.isSecondary));
  }, [item.isSecondary]);

  const handleChange = async () => {
    if (isLoading) return;

    const newValue = !isChecked;
    setIsChecked(newValue);
    setIsLoading(true);

    try {
      const res = await axios.put(
        BACKEND_URL + "/productcategories/flags",
        { id: item.id, is_secondary: newValue },
        setHeaders(token)
      );
      toastMessage("success", res.data.msg);
      if (onUpdate && res.data.category) {
        onUpdate(res.data.category);
      }
    } catch (error) {
      setIsChecked(!newValue);
      errorHandler(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner size="sm" />;
  }

  return (
    <input
      type="checkbox"
      checked={isChecked}
      onChange={handleChange}
      disabled={isLoading}
      style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
    />
  );
}

export default Secondary;
