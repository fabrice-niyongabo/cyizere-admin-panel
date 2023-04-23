import { resetUser } from "../../actions/user";
import { resetApp } from "../../actions/app";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetUser());
    dispatch(resetApp());
    navigate("/");
  }, []);
  return null;
}

export default Logout;
