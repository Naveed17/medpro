import React, { useState } from "react";
import {MapContainer, TileLayer, Marker, useMapEvents, Popup} from "react-leaflet";
import L from 'leaflet';
const icon = L.icon({ iconUrl: "/static/icons/ic-pin.svg" ,iconSize: [60, 55] });


function LocationMarker(props: { effectOn?: any; cords?: any; }) {
    const {cords} = props;
    const [position, setPosition] = useState([...cords]);

    const map = useMapEvents({
        click() {
            map.locate();
        },

        locationfound(e) {
            console.log(e);
            // @ts-ignore
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    return position === null
        ? null
        : cords.map((v: { cords: L.LatLngExpression; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }, i: React.Key | null | undefined) => (
            <Marker key={i}
                    position={v.cords}
                    icon={icon}>
                <Popup>
                    {v.name}
                </Popup>
            </Marker>
        ));
}

function Maps(cords: any) {
    const state = {
        lat:cords.data.length > 0 ? cords.data[0].cords[0] : 0,
        lng: cords.data.length > 0 ? cords.data[0].cords[1] : 0,
    };

    return(
        <MapContainer
            center={[state.lat, state.lng]}
            zoom={12}
            style={{height: '70vh'}}
            attributionControl={false}
            scrollWheelZoom={false}
            id="mapId">
            <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"/>
            <LocationMarker cords={cords.data}/>
        </MapContainer>
    )
}
export default Maps