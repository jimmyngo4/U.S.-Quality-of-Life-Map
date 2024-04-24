import React, { useState, useEffect } from "react";
import { Container, Row, Col, Dropdown, Button } from "react-bootstrap";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { Line } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.css";
import "leaflet/dist/leaflet.css";
import "chart.js/auto";
import data from "./us_states.json";

export const Map = () => {
  const position = [39.82834576736471, -98.57950344726182];
  const [state, setState] = useState("Alabama");
  const [compareState, setCompareState] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [povertyData, setPovertyData] = useState(null);
  const [incomeData, setIncomeData] = useState(null);
  const [unemploymentData, setUnemploymentData] = useState(null);
  const [bachelorsData, setBachelorsData] = useState(null);
  const [homeData, setHomeData] = useState(null);

  /*--------------------------Data From Database --------------------------*/
  const [state_data, setStateData] = useState([]); // violent crime data
  const [state_data_poverty, setStateDataPoverty] = useState([]); // poverty data
  const [state_data_unemployment, setStateDataUnemployment] = useState(null); // unemployment data
  const [state_data_income, setStateDataIncome] = useState(null); // median income data
  const [state_data_home, setStateDataHome] = useState(null); // home value
  const [state_data_degrees, setStateDataDegrees] = useState(null); // bachelor's degrees

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

  const incomeChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Median Income for the State of ${state}`,
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
          text: "Median Income",
          color: "black",
          font: {
            family: "Arial",
            size: 15,
            lineHeight: 1.2,
          },
        },
      },
    },
  }

  const unemploymentChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Unemployment Rate for the State of ${state}`,
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
          text: "Unemployment Rate",
          color: "black",
          font: {
            family: "Arial",
            size: 15,
            lineHeight: 1.2,
          },
        },
      },
    },
  }

  const homeChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Home Value for the State of ${state}`,
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
          text: "Home Value",
          color: "black",
          font: {
            family: "Arial",
            size: 15,
            lineHeight: 1.2,
          },
        },
      },
    },
  }

  const degreesChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Degrees for the State of ${state}`,
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
          text: "Degrees",
          color: "black",
          font: {
            family: "Arial",
            size: 15,
            lineHeight: 1.2,
          },
        },
      },
    },
  }

  // Get all data from the start
  useEffect(() => {
    async function fetchPovertyData() {
      try {
        const response1 = await fetch('http://54.160.249.134:5000/poverty-data');
        const data = await response1.json();
        setStateDataPoverty(data);
        
        const response2 = await fetch('http://54.160.249.134:5000/crime-data');
        const data2 = await response2.json();
        setStateData(data2);

        const response3 = await fetch('http://54.160.249.134:5000/unemployment-rate');
        const data3 = await response3.json();
        setStateDataUnemployment(data3);

        const response4 = await fetch('http://54.160.249.134:5000/median-income');
        const data4 = await response4.json();
        setStateDataIncome(data4);

        const response5 = await fetch('http://54.160.249.134:5000/home-value');
        const data5 = await response5.json();
        setStateDataHome(data5);

        const response6 = await fetch('http://54.160.249.134:5000/bachelors-degree');
        const data6 = await response6.json();
        setStateDataDegrees(data6);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchPovertyData();
  }, [])

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

    if (state_data_income) {
      getChartDataForIncome();
    }
    if (state_data_unemployment) {
      getChartDataForUnemployment();
    }
    if (state_data_degrees) {
      getChartDataForBachelors();
    }
    if (state_data_home) {
      getChartDataForHome();
    }

  }, [state, compareState, state_data_poverty, state_data, state_data_income]);

  const getChartDataForIncome = () => {
    const stateIncomeData = state_data_income[state];

    const years = stateIncomeData?.map((entry) => entry.Year);
    const incomeState = stateIncomeData.map(
      (entry) => {
        const value = entry["Median income"];
        if (typeof value == 'number')
          return value;
        else
          return Number(value.replaceAll(",", ""));
      }
    )

    // add data to compare between different states

    const newIncomeData = {
      labels: years,
      datasets: [
        {
          label: state,
          data: incomeState,
          borderColor: "rgb(75, 192, 192)",
        }
      ]
    }
    setIncomeData(newIncomeData);
  }

  const getChartDataForUnemployment = () => {
    const stateUnemploymentData = state_data_unemployment[state];

    const years = stateUnemploymentData?.map((entry) => entry.Year);
    const unemploymentState = stateUnemploymentData.map(
      (entry) => entry["Unemployment rate"]
    )

    // add data to compare between different states

    const newUnemploymentData = {
      labels: years,
      datasets: [
        {
          label: state,
          data: unemploymentState,
          borderColor: "rgb(75, 192, 192)",
        }
      ]
    }
    setUnemploymentData(newUnemploymentData);
  }

  const getChartDataForBachelors = () => {
    const stateDegreesData = state_data_degrees[state];

    const years = stateDegreesData?.map((entry) => entry.Year);
    const degreesState = stateDegreesData.map(
      (entry) => entry["Percent with bachelor's degree"]
    )

    // add data to compare between different states

    const newDegreeData = {
      labels: years,
      datasets: [
        {
          label: state,
          data: degreesState,
          borderColor: "rgb(75, 192, 192)",
        }
      ]
    }
    setBachelorsData(newDegreeData);
  }

  const getChartDataForHome = () => {
    const stateHomeData = state_data_home[state];

    const years = stateHomeData?.map((entry) => entry.Year);
    const homeState = stateHomeData.map(
      (entry) => entry["Home value"]
    )

    // add data to compare between different states

    const newHomeData = {
      labels: years,
      datasets: [
        {
          label: state,
          data: homeState,
          borderColor: "rgb(75, 192, 192)",
        }
      ]
    }
    setHomeData(newHomeData);
  }

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
        <Row className="justify-content-center">
          <Col xs={6}>
            {incomeData && <Line data={incomeData} options={incomeChartOptions} />}
          </Col>
          <Col xs={6}>
            {unemploymentData && <Line data={unemploymentData} options={unemploymentChartOptions}/>}
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={6}>
            {homeData && <Line data={homeData} options={homeChartOptions}/>}
          </Col>
          <Col xs={6}>
            {bachelorsData && <Line data={bachelorsData} options={degreesChartOptions}/>}
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
