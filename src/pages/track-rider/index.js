import React, { useEffect, useState } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import { BACKEND_URL, GOOGLE_MAP_API_KEY } from "../../constants";
import { useParams } from "react-router";
import axios from "axios";
import { errorHandler, setHeaders } from "../../helpers";
import { useSelector } from "react-redux";
import Loader from "../loader";

const mapStyles = {
  width: "100%",
  height: "100%",
};

const MapContainer = (props) => {
  const { google } = props;
  const { id } = useParams();
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [names, setNames] = useState("");
  const { token } = useSelector((state) => state.user);

  useEffect(() => {
    let sub = true;
    if (sub) {
      fetchData();
    }
    return () => {
      sub = false;
    };
  }, [id]);

  const fetchData = () => {
    setIsLoading(true);
    axios
      .get(BACKEND_URL + "/riders/" + id, setHeaders(token))
      .then((res) => {
        setIsLoading(false);
        setLat(res.data.rider.lat);
        setLng(res.data.rider.lng);
        setNames(res.data.rider.names);
        setIsLoading(false);
        console.log(res.data.rider);
      })
      .catch((error) => {
        setIsLoading(false);
        errorHandler(error);
      });
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <Map
          google={google}
          zoom={14}
          style={mapStyles}
          initialCenter={{
            lat: lat,
            lng: lng,
          }}
        >
          <Marker position={{ lat: lat, lng: lng }} title={"Agent " + names} />
        </Map>
      )}
    </>
  );
};

export default GoogleApiWrapper({
  apiKey: GOOGLE_MAP_API_KEY,
})(MapContainer);
