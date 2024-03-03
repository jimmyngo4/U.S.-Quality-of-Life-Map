import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export const Map = () => {
    const position = [39.82834576736471, -98.57950344726182]
    const style = {
        height: '70vh',
        width: '100%',
    }

    return (
        <div>
            <MapContainer center={position} zoom={4} scrollWheelZoom={true} style={style}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png"
            />
            </MapContainer>
        </div>
    )
}