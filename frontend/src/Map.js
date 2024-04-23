import React, { useState, useEffect } from "react";
import { Container, Row, Col, Dropdown, Button } from "react-bootstrap";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { Line } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.css";
import "leaflet/dist/leaflet.css";
import "chart.js/auto";
import data from "./us_states.json";
import state_data from "./state_data_violent_crime.json";
import state_data_poverty from "./state_data_poverty.json";

export const Map = () => {
  const position = [39.82834576736471, -98.57950344726182];
  const [state, setState] = useState("Alabama");
  const [compareState, setCompareState] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [povertyData, setPovertyData] = useState(null);
  const states = Object.keys(state_data);

  const violenceChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Violent Crime Rate per 100,000 People for the State of ${state}`,
        font: {
          family: "Arial",
          size: 20,
          weight: "bold",
        },
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
          text: "Year",
          color: "black",
          size: 20,
          font: {
            family: "Arial",
            size: 15,
            lineHeight: 1.2,
          },
        },
      },
      y: {
        display: true,
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "Violent Crime",
          color: "black",
          font: {
            family: "Arial",
            size: 15,
            lineHeight: 1.2,
          },
        },
      },
    },
  };

  const povertyChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Poverty In Thousands for the State of ${state}`,
        font: {
          family: "Arial",
          size: 20,
          weight: "bold",
        },
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
          text: "Year",
          color: "black",
          size: 20,
          font: {
            family: "Arial",
            size: 15,
            lineHeight: 1.2,
          },
        },
      },
      y: {
        display: true,
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: "People in Poverty (Thousands)",
          color: "black",
          font: {
            family: "Arial",
            size: 15,
            lineHeight: 1.2,
          },
        },
      },
    },
  };

  useEffect(() => {
    const state_violence_data = state_data[state];
    const statePovertyData = state_data_poverty[state];

    const years = state_violence_data?.map((entry) => entry.Year);
    const crime_rates_state = state_violence_data?.map(
      (entry) => entry["Violent Crime per hundred thousand people"]
    );
    const povertyRateState = statePovertyData?.map(
      (entry) => entry["Poverty in thousands"]
    );

    if (compareState) {
      const lineColors = ["black", "red", "green", "blue", "orange"];
      const stateViolenceData = [];
      const statePovertyData = [];

      for (const state of compareState) {
        const compareCrimeRates = state_data[state]?.map(
          (entry) => entry["Violent Crime per hundred thousand people"]
        );
        stateViolenceData.push({ state: state, data: compareCrimeRates });

        const comparePovertyRates = state_data_poverty[state]?.map(
          (entry) => entry["Poverty in thousands"]
        );
        statePovertyData.push({ state: state, data: comparePovertyRates });
      }

      const newChartData = {
        labels: years,
        datasets: [
          {
            label: state,
            data: crime_rates_state,
            borderColor: "rgb(75, 192, 192)",
          },
          ...stateViolenceData.map(({ state, data }, index) => ({
            label: state,
            data: data,
            borderColor: lineColors[index],
          })),
        ],
      };
      
      const newPovertyData = {
        labels: years,
        datasets: [
          {
            label: state,
            data: povertyRateState,
            borderColor: "rgb(75, 192, 192)",
          },
          ...statePovertyData.map(({ state, data}, index) => ({
            label: state,
            data: data,
            borderColor: lineColors[index],
          }))
        ]
      }

      setChartData(newChartData);
      setPovertyData(newPovertyData);
    } else if (state_violence_data) {
      const newChartData = {
        labels: years,
        datasets: [
          {
            label: state,
            data: crime_rates_state,
            borderColor: "rgb(75, 192, 192)",
          },
        ],
      };
      setChartData(newChartData);
    }else if (statePovertyData) {
      const newPovertyData = {
          labels: years,
          datasets: [
              {
                  label: state,
                  data: povertyRateState,
                  borderColor: "rgb(75, 192, 192)",
              }
          ]
      }
      setPovertyData(newPovertyData)
    }
  }, [state, compareState]);

  const onEachFeature = (feature, layer) => {
    if (feature?.properties?.NAME) {
      layer.bindTooltip(feature.properties.NAME);
      layer.on('click', () => {
        setState(feature.properties.NAME);
      })
      layer.setStyle({ color: "#808080" })
    }
  }

  return (
    <div>
      <MapContainer
        center={position}
        zoom={5}
        scrollWheelZoom={true}
        style={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png"
        />
        <GeoJSON data={data} onEachFeature={onEachFeature}/>
      </MapContainer>
      <Container fluid style={{paddingTop: 10}}>
        <Row className="justify-content-center">
          <Col xs={2}>
            <Dropdown>
              <Dropdown.Toggle variant="dark">{state}</Dropdown.Toggle>
              <Dropdown.Menu>
                {states &&
                  states.map((state) => (
                    <Dropdown.Item onClick={() => setState(state)} id="state">
                      {state}
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col xs={10}>
            <Row>
              <Col xs={2}>
                <Row>
                  <Col>
                    <Dropdown>
                      <Dropdown.Toggle variant="dark">Compare To</Dropdown.Toggle>
                      <Dropdown.Menu>
                        {states &&
                          states.map((compare) => (
                            <Dropdown.Item
                              onClick={() =>
                                setCompareState([...compareState, compare])
                              }
                              id={compare}
                            >
                              {compare}
                            </Dropdown.Item>
                          ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                </Row>
              </Col>
              <Col xs={10} style={{ display: "flex", flexWrap: "wrap" }}>
                  {compareState.map((state) => (
                      <Button
                        onClick={() =>
                          setCompareState(
                            compareState.filter((v) => v !== state)
                          )
                        }
                        id={state}
                        style={{ marginRight: '10px' }}
                      >
                        {state}
                      </Button>
                  ))}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={6}>
            {chartData && <Line data={chartData} options={violenceChartOptions} />}
          </Col>
          <Col xs={6}>
            {povertyData && <Line data={povertyData} options={povertyChartOptions} />}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const styles = {
  table: {
    color: "black",
    padding: "1rem",
    backgroundColor: "white",
    width: "100%",
    textAlign: "center",
  },
  map: {
    height: "70vh",
    width: "100%",
  },
  chart: {
    flex: 0,
    justifyContent: "center",
    paddinLeft: 20,
    paddingRight: 20,
  },
};
