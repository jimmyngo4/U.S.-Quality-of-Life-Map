import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// import data from './usa-cities.json';
import data from './tx.json';
// import data from './county/county.json'

export const Map = () => {
    const position = [39.82834576736471, -98.57950344726182]
    const style = {
        height: '70vh',
        width: '100%',
    }

    const onEachFeature = (feature, layer) => {
        const randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
        if (feature.properties && feature.properties.NAME) {
            layer.bindTooltip(feature.properties.NAME);
            layer.on('click', () => {
                alert(feature.properties.NAME)
            });
            layer.setStyle({color: randomColor});
        }
    };

    return (
        <div>
            <MapContainer center={position} zoom={4} scrollWheelZoom={true} style={style}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png"
                />
                {/* <GeoJSON data={data} onEachFeature={onEachFeature} /> */}
                {/* <GeoJSON data={data2} onEachFeature={onEachFeature} /> */}
                <GeoJSON data={data} onEachFeature={onEachFeature} />

            </MapContainer>
        </div>
    )
}