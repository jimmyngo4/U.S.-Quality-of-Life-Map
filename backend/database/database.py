from sqlalchemy import create_engine, URL
from sqlalchemy_utils import database_exists, create_database
from sqlalchemy.orm import sessionmaker
from models import Base, QualityOfLife

import pandas as pd
import csv
from datetime import date

from dotenv import load_dotenv
import os


def clean_data():
    df = pd.read_csv('../city.csv')
    df.replace('?', 'NULL', inplace=True)
    df.to_csv('cleaned_data.csv')


def load_data():
    # load environment variables
    load_dotenv()

    # create database engine
    db_url = URL.create(
        "mysql+pymysql",
        username=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        host=os.getenv("MYSQL_HOST"),
        database=os.getenv("MYSQL_DATABASE")
    )
    engine = create_engine(db_url)

    # check if the database exists, if not, create it
    if not database_exists(engine.url):
        create_database(engine.url)

    # create tables in the database if they don't already exist
    Base.metadata.create_all(engine)

    # create a session
    Session = sessionmaker(bind=engine)
    session = Session()

    with open('cleaned_data.csv', 'r') as csvfile:
        csvreader = csv.reader(csvfile)
        next(csvreader)  # skip header row
        for row in csvreader:
            location = row[1].split(', ')

            new_row = QualityOfLife(
                city=location[0],
                state=location[1],
                purchasing_power_index=float(row[2]) if row[2] != 'NULL' else None,
                safety_index=float(row[3]) if row[3] != 'NULL' else None,
                health_care_index=float(row[4]) if row[4] != 'NULL' else None,
                climate_index=float(row[5]) if row[5] != 'NULL' else None,
                cost_of_living_index=float(row[6]) if row[6] != 'NULL' else None,
                property_price_to_income_ratio=float(row[7]) if row[7] != 'NULL' else None,
                traffic_commute_time_index=float(row[8]) if row[8] != 'NULL' else None,
                pollution_index=float(row[9]) if row[9] != 'NULL' else None,
                quality_of_life_index=float(row[10]) if row[10] != 'NULL' else None,
                last_update=date.today()
            )

            session.merge(new_row)

    # commit the session to persist the changes to the database
    session.commit()


if __name__ == '__main__':
    # clean_data()
    load_data()
