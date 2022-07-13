import L from "leaflet";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {MapContainer, TileLayer, useMapEvents, Popup, Marker} from "react-leaflet";

const icon = L.icon({iconUrl: "/static/icons/ic-pin.svg", iconSize: [60, 55]});

function PlacesMarker(props: { effectOn?: any; cords?: any; }) {
    const {cords} = props;
    const [position, setPosition] = useState([...cords]);

    return position === null
        ? null
        : cords.map((v: { address: { location: { point: L.LatLngExpression; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }; }; }, i: number) => (
            <Marker key={i}
                    position={v.address.location.point}
                    icon={icon}>
                <Popup>
                    {v.address.location.name}
                </Popup>
            </Marker>
        ));
}

function LocationMarker({...props}) {
    const [position, setPosition] = useState<any>(null);
    const eventHandlers = useMemo(
        () => ({
            dragend(e: any) {
                console.log(e.target._latlng)
            },
        }),
        [],
    )
    const map = useMapEvents({
        click() {

        },
        locationfound(e) {
            setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
        },
    });
    useEffect(()=>{
        if (!props)
            map.locate();
    },[])




    return position === null ? null : (
        <Marker position={position}
                draggable={true}
                icon={icon}
                eventHandlers={eventHandlers}>
            <Popup>You are here</Popup>
        </Marker>
    )
}

function Maps({...props}) {

    let state = {lat: 0, lng: 0}
    if (props.data)
        state = {
            lat: props.data.length > 0 ? props.data[0].address.location.point[0] : 0,
            lng: props.data.length > 0 ? props.data[0].address.location.point[1] : 0,
        };

    return (
        <>
            {props  &&
                <MapContainer
                    zoom={7}
                    style={{height: '70vh'}}
                    attributionControl={false}
                    scrollWheelZoom={false}
                    id="mapId">
                    <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"/>
                    <LocationMarker cords={props.data}/>

                    {props.data && <PlacesMarker cords={props.data}/>}
                </MapContainer>
            }
        </>
    )
}

export default Maps