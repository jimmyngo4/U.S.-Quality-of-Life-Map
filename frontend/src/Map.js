import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import data from './tx.json';
import { Table, Container } from 'react-bootstrap'

export const Map = () => {
    const position = [39.82834576736471, -98.57950344726182]
    const style = {
        height: '70vh',
        width: '100%',
    }

    const city_data = [
        {city: 'Dallas',  index: 176.24, purchasing_power: 143.47, safety_index: 48.16, health_care_index: 65.75},
        {city: 'Austin',  index: 177.60, purchasing_power: 139.74, safety_index: 58.21, health_care_index: 66.25},
        {city: 'El Paso', index: 187.52, purchasing_power: 140.69, safety_index: 68.82, health_care_index: 62.21},
    ]

    function getColorForValue(value) {
        const minValue = 70;
        const maxValue = 210;
        
        if (value < minValue) {
            value = minValue;
        } else if (value > maxValue) {
            value = maxValue;
        }
        
        const normalizedValue = (value - minValue) / (maxValue - minValue);
        const hue = 120 * normalizedValue;
        const rgbColor = hslToRgb(hue / 360, 1, 0.5);

        return `rgb(${rgbColor[0]}, ${rgbColor[1]}, ${rgbColor[2]})`;
        }
        
        function hslToRgb(h, s, l) {
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }

    const onEachFeature = (feature, layer) => {
        if (city_data.some(city => city.city === feature.properties.NAME)) {
            const city = city_data.find(city => city.city === feature.properties.NAME)
            const index = city.index
            console.log(index)

            layer.setStyle({color: getColorForValue(index)});
            layer.bindTooltip(feature.properties.NAME);
            layer.on('click', () => {
                alert(`${feature.properties.NAME} Quality of Life Index: ${index}`)
            });
        }
        else if (feature.properties && feature.properties.NAME) {
            layer.bindTooltip(feature.properties.NAME);
            layer.on('click', () => {
                alert(`${feature.properties.NAME} Quality of Life Index: Unknown`)
            });
            layer.setStyle({color: "#808080"});
        }
    };

    return (
        <div>
            <MapContainer center={position} zoom={4} scrollWheelZoom={true} style={style}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png"
                />
                <GeoJSON data={data} onEachFeature={onEachFeature} />

            </MapContainer>
            <Container fluid className='text-center'>
                <Table striped bordered hover style={styles.table}>
                    <thead>
                        <tr>
                            <th>City</th>
                            <th>Quality of Life Index</th>
                            <th>Purchasing Power Index</th>
                            <th>Safety Index</th>
                            <th>Health Care Index</th>
                        </tr>
                    </thead>
                    {/* Map array containing QoL indices to add rows to table. */}
                    <tbody>
                        {
                            city_data.map(city => (
                                <tr>
                                    <td>{city.city}</td>
                                    <td>{city.index}</td>
                                    <td>{city.purchasing_power}</td>
                                    <td>{city.safety_index}</td>
                                    <td>{city.health_care_index}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </Container>
        </div>
    )
}

const styles = {
    table: {
        color: 'black',
        padding: '1rem',
        backgroundColor: 'white',
        width: '100%',
        textAlign: 'center'
    }
}
