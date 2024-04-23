from sqlalchemy import Column, VARCHAR, CHAR, DECIMAL, DATE
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class QualityOfLife(Base):
    __tablename__ = "indexes"

    city = Column(VARCHAR(30), primary_key=True)
    state = Column(CHAR(2), primary_key=True)
    purchasing_power_index = Column(DECIMAL(5, 2), nullable=True)
    safety_index = Column(DECIMAL(5, 2), nullable=True)
    health_care_index = Column(DECIMAL(5, 2), nullable=True)
    climate_index = Column(DECIMAL(5, 2), nullable=True)
    cost_of_living_index = Column(DECIMAL(5, 2), nullable=True)
    property_price_to_income_ratio = Column(DECIMAL(5, 2), nullable=True)
    traffic_commute_time_index = Column(DECIMAL(5, 2), nullable=True)
    pollution_index = Column(DECIMAL(5, 2), nullable=True)
    quality_of_life_index = Column(DECIMAL(5, 2), nullable=True)
    last_update = Column(DATE, nullable=True, primary_key=True)
