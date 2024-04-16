import React, {useState, useEffect} from 'react';
import { Container, Row, Col, Dropdown } from 'react-bootstrap';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { Line } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.css'; 
import 'leaflet/dist/leaflet.css';
import "chart.js/auto"
import data from './us_states.json';
import state_data from './state_data_violent_crime.json';

export const Map = () => {
    const position = [39.82834576736471, -98.57950344726182]
    const [state, setState] = useState('Alabama')
    const [chartData, setChartData] = useState(null);
    const states = Object.keys(state_data)

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
            position: 'top'
            },
            title: {
                display: true,
                text: `Violent Crime Rate per 100,000 People for the State of ${state}`,
                font: {
                    family: 'Arial',
                    size: 20,
                    weight: 'bold'
                }
            },
        },
        scales: {
            x: {
                display: true,
                grid: {
                    display: false,
                },
                title: {
                    display: true,
                    text: 'Year',
                    color: 'white',
                    size: 20,
                    font: {
                        family: 'Arial',
                        size: 15,
                        lineHeight: 1.2,
                    },
                }
            },
            y: {
                display: true,
                grid: {
                    display: false,
                },
                title: {
                    display: true,
                    text: 'Violent Crime',
                    color: 'white',
                    font: {
                        family: 'Arial',
                        size: 15,
                        lineHeight: 1.2,
                    },
                }
            }
        }
    };

    useEffect(() => {
        const state_violence_data = state_data[state];
        if (state_violence_data) {
            const years = state_violence_data.map(entry => entry.Year);
            const crime_rates = state_violence_data.map(entry => entry["Violent Crime per hundred thousand people"]);
    
            const newChartData = {
                labels: years,
                datasets: [
                    {
                        label: 'Violent Crime Rate per 100,000 People',
                        data: crime_rates,
                        borderColor: 'rgb(75, 192, 192)',
                    }
                ]
            };
    
            setChartData(newChartData);
        }
    }, [state]);
    
    return (
        <div>
            <MapContainer center={position} zoom={4} scrollWheelZoom={true} style={styles.map}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png"
                />
                <GeoJSON data={data} />

            </MapContainer>
            <Dropdown>
                <Dropdown.Toggle variant='dark'>
                    State
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {states && states.map((state) => (
                        <Dropdown.Item onClick={() => setState(state)} id='state'>
                            {state}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
            <Container fluid>
                <Row className="justify-content-center">
                    <Col xs={6}>
                        {chartData && <Line data={chartData} options={chartOptions} />}
                    </Col>
                    <Col xs={6}>
                        {chartData && <Line data={chartData} options={chartOptions} />}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

const styles = {
    table: {
        color: 'black',
        padding: '1rem',
        backgroundColor: 'white',
        width: '100%',
        textAlign: 'center',
    },
    map: {
        height: '70vh',
        width: '100%',
    },
    chart: {
        flex: 0,
        justifyContent: 'center',
        paddinLeft: 20,
        paddingRight: 20,
    }
}