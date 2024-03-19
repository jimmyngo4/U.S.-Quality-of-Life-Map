from sqlalchemy import Column, VARCHAR, CHAR, DECIMAL, DATE
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class QualityOfLife(Base):
    __tablename__ = "indexes"

    city = Column(VARCHAR(30), primary_key=True)
    state = Column(CHAR(2), primary_key=True)
    purchasing_power_index = Column(DECIMAL(5, 2))
    safety_index = Column(DECIMAL(5, 2))
    health_care_index = Column(DECIMAL(5, 2))
    climate_index = Column(DECIMAL(5, 2))
    cost_of_living_index = Column(DECIMAL(5, 2))
    property_price_to_income_ratio = Column(DECIMAL(5, 2))
    traffic_commute_time_index = Column(DECIMAL(5, 2))
    pollution_index = Column(DECIMAL(5, 2))
    quality_of_life_index = Column(DECIMAL(5, 2))
    last_update = Column(DATE)
