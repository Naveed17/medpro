import L from "leaflet";
import React, {useEffect, useMemo, useState} from "react";
import {MapContainer, TileLayer, useMapEvents, Popup, Marker} from "react-leaflet";

const icon = L.icon({iconUrl: "/static/icons/ic-pin.svg", iconSize: [60, 55]});

function PlacesMarker({...props}) {
    const {cords} = props;
    const [position, setPosition] = useState([...cords]);

    return position === null
        ? null
        : cords.map((v: {
            points: L.LatLngExpression;
            name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined;
        }, i: number) => (
            <Marker key={i}
                    position={v.points}
                    icon={icon}>
                <Popup>
                    {v.name}
                </Popup>
            </Marker>
        ));
}

function LocationMarker({...props}) {
    const {cords} = props;
    const [position, setPosition] = useState<any>(null);
    const eventHandlers = useMemo(
        () => ({
            dragend(e: any) {
                props.editCords(e.target._latlng)
            },
        }),
        [props],
    )
    const map = useMapEvents({
        click() {

        },
        locationfound(e) {
            setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
            props.editCords(e.latlng)

        }


    });
    useEffect(() => {
        if (!cords)
            map.locate();
        else {
            if (cords.length > 0) {
                setPosition(cords[0].points)
                map.flyTo(cords[0].points, map.getZoom())
            }

        }
    }, [cords, map])


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
    const {data, outerBounds, draggable, editCords} = props
    return (
        <>
            {props && outerBounds.length > 0 &&
                <MapContainer
                    bounds={outerBounds}
                    style={{height: '70vh'}}
                    attributionControl={false}
                    scrollWheelZoom={false}
                    id="mapId">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

                    {draggable && data?.points !== null && <LocationMarker cords={data} editCords={editCords}/>}

                    {!draggable && data?.points !== null && <PlacesMarker cords={data}/>}

                </MapContainer>
            }
        </>
    )
}

export default Maps
