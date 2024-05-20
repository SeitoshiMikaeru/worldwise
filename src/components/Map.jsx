import styles from "./Map.module.css";
import {useNavigate} from "react-router-dom";
import {MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents} from "react-leaflet";
import {useEffect, useState} from "react";
import {useCities} from "../context/CitiesContext";
import {useGeolocation} from "../hooks/useGeolocation";
import Button from "./Button";
import {useURLPosition} from "../hooks/useURLPosition";

export default function Map() {
   const {lat, lng} = useURLPosition();

    const {isLoading: isLoadingPosition, position: geoPosition, getPosition} = useGeolocation();

    const [position, setPosition] = useState([40, 0]);

    useEffect(() => {
        if(lat && lng) {
            setPosition([lat, lng]);
        }
    }, [lat, lng]);

    useEffect(() => {
        if(geoPosition) {
            setPosition([geoPosition.lat, geoPosition.lng]);
        }
    }, [geoPosition]);

    const {cities} = useCities();

    return (
        <div className={styles.mapContainer}>
            {
                !geoPosition && <Button type="position" onClick={getPosition}>
                    {isLoadingPosition ? "Loading..." : "Use your position"}
                </Button>
            }
            <MapContainer center={position} zoom={13} scrollWheelZoom={true} className={styles.map}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                />
                {
                    cities?.map((city) => (
                        <Marker position={[city.position.lat, city.position.lng]} key={city.id}>
                            <Popup>
                                {city.notes}
                            </Popup>
                        </Marker>
                    ))
                }

                <ChangeCenter position={position} />
                <DetectClick />
            </MapContainer>
        </div>
    );
}

function ChangeCenter({position}) {
    const map = useMap();
    map.setView(position, 8);

    return null;
}

function DetectClick() {
    const navigate = useNavigate();

    useMapEvents({
        click: e => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
    })
}

// <Marker position={position}>
//     <Popup>
//         A pretty CSS3 popup. <br /> Easily customizable.
//     </Popup>
// </Marker>