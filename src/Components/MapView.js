import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { connect } from "react-redux";
import { editFormLocation } from "./../actions/index";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapView(props) {
  let{markersData}=props
  const [selectedLocation, setSelectedLocation] = useState({});
  const popupElRef = useRef(null);

  const hideElement = () => {
    if (!popupElRef.current) return;
    popupElRef.current._close();
  };

  const handleMarkerChange = (e) => {
    const inputName = e.target.name;
    const inputValue = e.target.value;
    setSelectedLocation({
      ...selectedLocation,
      [inputName]: inputValue,
    });
    // console.log(JSON.stringify(selectedLocation));
  };

  const handleEditSubmit = (e, id) => {
    e.preventDefault();

    //without dispatching

    // let editableLocation = markersData.findIndex((data) => data.id === id);
    // markersData[editableLocation] = selectedLocation;
    // editableLocation = {
    //   ...editableLocation,
    //   name: selectedLocation.name,
    //   lType: selectedLocation.lType,
    // };
    // console.log(markersData);

    //with dispatching
    let editableLocation = markersData.find((data) => data.id === id);
    editableLocation = {
      ...editableLocation,
      name: selectedLocation.name,
      lType: selectedLocation.lType,
    };
    props.dispatch(editFormLocation(editableLocation));
  };

  const clickAction = (selectedLocation) => {
    // console.log(`${JSON.stringify(selectedLocation)}`);
    setSelectedLocation(selectedLocation);
  };

  return (
    <React.Fragment>
      <div className="mapView">
        <MapContainer
          center={[35.732498, 51.413787]}
          zoom={11}
          scrollWheelZoom={false}
          style={{ width: "600px", height: "500px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markersData.length > 0
            ? markersData.map((data) => {
                return (
                  <Marker
                    key={data.id}
                    position={[data.position.lat, data.position.lng]}
                    eventHandlers={{
                      click: () => {
                        clickAction(data);
                      },
                    }}
                  >
                    <Popup ref={popupElRef} closeButton={false}>
                      <div>
                        <div className="markerTitle">Location Details</div>
                        <div className="row">
                          <label>Location name:</label>
                          <input
                            type="text"
                            value={selectedLocation.name}
                            name="name"
                            onChange={(e) => handleMarkerChange(e)}
                          />
                        </div>
                        <div className="row">
                          <label>Location type:</label>
                          <select
                            value={selectedLocation.lType}
                            name="lType"
                            onChange={(e) => handleMarkerChange(e)}
                          >
                            <option value="business">Business</option>
                            <option value="entertainment">Entertainment</option>
                            <option value="Health-Service">
                              Health Service
                            </option>
                            <option value="pilgrimage ">Pilgrimage</option>
                          </select>
                        </div>
                        <div className="editButtonLayout">
                          <button
                            className="buttons"
                            type="submit"
                            value="Submit"
                            onClick={(e) => handleEditSubmit(e, data.id)}
                          >
                            Edit
                          </button>
                          <button
                            className="buttons"
                            type="cancel"
                            value="cancel"
                            onClick={hideElement}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })
            : null}
        </MapContainer>
      </div>
    </React.Fragment>
  );
}

const mapStateToProps = (state) => {
  // console.log("NewStates=", state.addFormLocation);
  return { markersData: state.addFormLocation };
};
export default connect(mapStateToProps)(MapView);
