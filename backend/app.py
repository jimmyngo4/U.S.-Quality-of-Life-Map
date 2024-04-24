from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
import json

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:csds351qol@csds351.c50s2qyyunmp.us-east-1.rds.amazonaws.com:3306/qol'
db = SQLAlchemy(app)
CORS(app)

@app.route('/crime-data', methods=['GET'])
def get_crime():
    data = {}

    query = text("SELECT * FROM crime_rate")
    result = db.session.execute(query)
    for row in result:
        state = row[0]
        crime_data = []
        for i in range(1, len(row)):
            # The data for crime rate begins from 1985
            year = 1984 + i
            crime_data.append({'Year': year, "Violent Crime per hundred thousand people": row[i]})
        data[state] = crime_data
    
    return json.dumps(data)

@app.route('/poverty-data', methods=['GET'])
def get_poverty():
    data = {}

    query = text("SELECT * FROM poverty_rate")
    result = db.session.execute(query)
    for row in result:
        state = row[0]
        poverty_data = []
        for i in range(1, len(row)):
            # The data for poverty rate begins from 1985
            year = 1984 + i
            poverty_data.append({'Year': year, "Poverty in thousands": row[i]})
        data[state] = poverty_data

    return json.dumps(data)

@app.route("/home-value", methods=['GET'])
def get_home_value():
    data = {}

    query = text("SELECT * FROM home_value")
    result = db.session.execute(query)
    for row in result:
        state = row[0]
        home_value_data = []
        for i in range(1, len(row)):
            # The data for home value begins from 2000
            year = 1999 + i
            home_value_data.append({'Year': year, "Home value": row[i]})
        data[state] = home_value_data

    return json.dumps(data)

@app.route("/bachelors-degree", methods=['GET'])
def get_bachelors_degree():
    data = {}

    query = text("SELECT * FROM bachelors_degree")
    result = db.session.execute(query)
    for row in result:
        state = row[0]
        bachelors_data = []
        for i in range(1, len(row)):
            # The data for bachelor's degree begins from 2006
            year = 2005 + i
            bachelors_data.append({'Year': year, "Percent with bachelor's degree": row[i]})
        data[state] = bachelors_data

    return json.dumps(data)

@app.route("/median-income", methods=['GET'])
def get_median_income():
    data = {}

    query = text("SELECT * FROM median_income")
    result = db.session.execute(query)
    for row in result:
        state = row[0]
        median_income_data = []
        for i in range(1, len(row)):
            # The data for median income begins from 1984
            year = 1983 + i
            median_income_data.append({'Year': year, "Median income": row[i]})
        data[state] = median_income_data

    return json.dumps(data)

@app.route("/unemployment-rate", methods=['GET'])
def get_unemployment_rate():
    data = {}

    query = text("SELECT * FROM unemployment_rate")
    result = db.session.execute(query)
    for row in result:
        state = row[0]
        unemployment_data = []
        for i in range(1, len(row)):
            # The data for median income begins from 1976
            year = 1975 + i
            unemployment_data.append({'Year': year, "Unemployment rate": row[i]})
        data[state] = unemployment_data

    return json.dumps(data)

@app.route("/")
def hello_world():

    return "<p>Hello ,World!</p>"

# qol.median_income