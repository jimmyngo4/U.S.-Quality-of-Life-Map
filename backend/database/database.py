from sqlalchemy import create_engine, URL
from sqlalchemy_utils import database_exists, create_database
from sqlalchemy.orm import sessionmaker
from models import Base, QualityOfLife

import csv

from dotenv import load_dotenv
import os


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

    with open('../scraped_data.csv', 'r') as csvfile:
        csvreader = csv.reader(csvfile)
        next(csvreader)  # skip header row
        for row in csvreader:
            new_row = QualityOfLife(
                city=row[0],
                state=row[1],
                purchasing_power_index=float(row[2]),
                safety_index=float(row[3]),
                health_care_index=float(row[4]),
                climate_index=float(row[5]),
                cost_of_living_index=float(row[6]),
                property_price_to_income_ratio=float(row[7]),
                traffic_commute_time_index=float(row[8]),
                pollution_index=float(row[9]),
                quality_of_life_index=float(row[10]),
                last_update=row[11]
            )

            session.merge(new_row)

    # commit the session to persist the changes to the database
    session.commit()


if __name__ == '__main__':
    load_data()
