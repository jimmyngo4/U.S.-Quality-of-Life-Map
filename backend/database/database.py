from sqlalchemy import create_engine, URL
from sqlalchemy.orm import sessionmaker
from models import Base

from dotenv import load_dotenv
import pandas as pd
import os

def load_data():
    # load environment variables
    load_dotenv()

    # create database engine
    db_url = URL.create(
        "mysql",
        username=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        host=os.getenv("MYSQL_HOST"),
        database=os.getenv("MYSQL_DATABASE")
    )
    engine = create_engine(db_url)

    # create tables in the database if they don't already exist
    Base.metadata.create_all(engine)

    # create session
    Session = sessionmaker(bind=engine)
    session = Session()

    df = pd.read_csv('../scraped_data.csv')
