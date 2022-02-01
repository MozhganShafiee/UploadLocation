import React, { useState } from "react";
import { RiUpload2Fill } from "react-icons/ri";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { connect } from "react-redux";
import { addFormLocation } from "./../actions/index";
import MapView from "./MapView";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

function Form(props) {
  const initialState = {
    name: "",
    position: null,
    lType: "business",
    selectedFile: null,
  };
  const [locationData, setLocationData] = useState(initialState);

  const handleChange = (e) => {
    const inputName = e.target.name;
    const inputValue = e.target.value;
    setLocationData({ ...locationData, [inputName]: inputValue });
  };

  const handleChangeFile = (e) => {
    setLocationData({
      ...locationData,
      selectedFile: e.target.files[0],
    });
  };

  function LocationMarker() {
    const map = useMapEvents({
      click: (e) => {
        // console.log(`Lat: ${e.latlng.lat}, Long: ${e.latlng.lng}`);
        setLocationData({ ...locationData, position: e.latlng });
        map.flyTo(e.latlng, map.getZoom());
      },
    });
    return locationData.position === null ? null : (
      <Marker position={locationData.position}>
      </Marker>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      locationData.name &&
      locationData.lType &&
      locationData.position &&
      locationData.selectedFile
    ) {
      props.dispatch(addFormLocation(locationData));
      setLocationData(initialState);
    } else {
      alert("Please fill all inputs.");
    }
  };
  const handleCancel = () => {
    setLocationData(initialState);
  };

  return (
    <React.Fragment>
      <div className="mainLayout">
        <div className="formLayout">
          <div className="formContent">
            <div className="title">Share location</div>

            <div className="row">
              <label>Location name:</label>
              <input
                type="text"
                value={locationData.name}
                name="name"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="row">
              <label>Location on map:</label>
              <MapContainer
                center={[35.732498, 51.413787]}
                zoom={11}
                scrollWheelZoom={false}
                style={{ width: "70%", height: "400px" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker />
              </MapContainer>
            </div>
            <div className="row">
              <label>Location type:</label>
              <select
                value={locationData.lType}
                name="lType"
                onChange={(e) => handleChange(e)}
              >
                <option value="business">Business</option>
                <option value="entertainment">Entertainment</option>
                <option value="Health-Service">Health Service</option>
                <option value="pilgrimage ">Pilgrimage</option>
              </select>
            </div>
            <div className="row">
              <label style={{ height: "75px" }}>
                Logo:
                <RiUpload2Fill className="uploadIcon" />
                <input type="file" onChange={(e) => handleChangeFile(e)} />
              </label>
            </div>
          </div>
          <div className="submitButtonLayout">
            <button
              className="buttons"
              type="submit"
              value="Submit"
              onClick={handleSubmit}
            >
              Save
            </button>
            <button
              className="buttons"
              type="cancel"
              value="cancel"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </div>
        <MapView />
      </div>
    </React.Fragment>
  );
}

export default connect()(Form);
