import { useEffect, useState } from "react";
import axios from "axios";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import Navbar from "../../components/Navbar";

function NearbyHelpers() {

  const [helpers,setHelpers] = useState([]);
  const [userLocation,setUserLocation] = useState(null);

  useEffect(()=>{

    navigator.geolocation.getCurrentPosition((pos)=>{

      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setUserLocation([lat,lng]);

      fetchHelpers(lat,lng);

    });

  },[]);

  const fetchHelpers = async (lat,lng)=>{

    const res = await axios.get(
      `https://backend2-3avp.onrender.com/api/users/nearby?lat=${lat}&lng=${lng}`
    );

    setHelpers(res.data);

  };

  if(!userLocation){

    return <p>Loading map...</p>;

  }

  return (

    <div>

      <Navbar/>

      <div className="p-6">

        <h1 className="text-2xl font-bold mb-4">
          Nearby Helpers
        </h1>

        <MapContainer
          center={userLocation}
          zoom={13}
          style={{height:"500px",width:"100%"}}
        >

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User marker */}
          <Marker position={userLocation}>
            <Popup>
              You are here
            </Popup>
          </Marker>

          {/* Helpers */}
          {helpers.map((helper)=>{

            const coords = helper.location.coordinates;

            return(

              <Marker
                key={helper._id}
                position={[coords[1],coords[0]]}
              >

                <Popup>

                  <b>{helper.name}</b>

                  <br/>

                  Rating: ⭐{helper.rating}

                </Popup>

              </Marker>

            );

          })}

        </MapContainer>

      </div>

    </div>

  );

}

export default NearbyHelpers;