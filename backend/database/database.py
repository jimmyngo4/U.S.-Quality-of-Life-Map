from sqlalchemy import create_engine, URL, inspect

import pandas as pd

from dotenv import load_dotenv
import os


def load_data():
    # df1 = bachelors_degree()
    # df2 = median_income()
    # df3 = crime_rate()
    # df4 = poverty_rate()
    # df5 = unemployment_rate()
    # df6 = home_value()
    # df7 = qol()

    load_dotenv()

    db_url = URL.create(
        "mysql+pymysql",
        username=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        host=os.getenv("MYSQL_HOST"),
        database=os.getenv("MYSQL_DATABASE")
    )
    engine = create_engine(db_url)

    # df1.to_sql('bachelors_degree', engine, index=False)
    # df2.to_sql('median_income', engine, index=False, if_exists='replace')
    # df3.to_sql('crime_rate', engine, index=False)
    # df4.to_sql('poverty_rate', engine, index=False)
    # df5.to_sql('unemployment_rate', engine, index=False, if_exists='replace')
    # df6.to_sql('home_value', engine, index=False)
    # df7.to_sql('qol', engine, index=False)

    print(inspect(engine).get_table_names())


def bachelors_degree():
    df1 = pd.read_csv("../data/bachelors_degree_by_state.csv")
    df2 = pd.read_csv("../predicted_data/predicted_vs_actual_bachelors_degrees_2022.csv")
    df3 = pd.read_csv("../predicted_data/predicted_bachelors_degrees_2023.csv")
    df4 = pd.read_csv("../predicted_data/predicted_bachelors_degree_by_state_2024.csv")

    df2 = df2.iloc[:, 0:2]
    df4 = df4.rename(columns={'Predicted 2024 Percentage': 'Predicted 2024'})

    df1 = df1.join(df2.set_index('State'), on='State')
    df1 = df1.join(df3.set_index('State'), on='State')

    return df1.join(df4.set_index('State'), on='State')


def median_income():
    df1 = pd.read_csv("../data/median_household_income.csv")
    df2 = pd.read_csv("../predicted_data/median_income_predictions_2022_2023_2024.csv")

    df1 = df1.replace(',', '', regex=True)
    cols = df1.columns[1:]
    df1[cols] = df1[cols].astype(float)

    df2 = df2.rename(columns={'Predicted 2022 Median Income': 'Predicted 2022',
                              'Predicted 2023 Median Income': 'Predicted 2023',
                              'Predicted 2024 Median Income': 'Predicted 2024'})
    df2.pop('Actual 2022 Median Income')
    df2.insert(len(df2.columns) - 1, 'Error 2022', df2.pop('Error 2022'))

    median_income_df = df1.join(df2.set_index('State'), on='State')

    return median_income_df


def crime_rate():
    df1 = pd.read_csv("../data/State-data.csv")
    df2 = pd.read_csv("../predicted_data/crime_poverty_predictions_2022_2023_2024.csv")

    df1 = df1.pivot_table(index='State', columns='Year', values='Violent Crime per hundred thousand people')
    df1 = df1.reset_index()
    df1.columns.name = ''

    df2 = df2.iloc[:, 0:4]
    df2 = df2.rename(columns={'Predicted 2022_Crime': 'Predicted 2022',
                              'Predicted 2023_Crime': 'Predicted 2023',
                              'Predicted 2024_Crime': 'Predicted 2024'})

    crime_rate_df = df1.join(df2.set_index('State'), on='State')

    return crime_rate_df


def poverty_rate():
    df1 = pd.read_csv("../data/State-data.csv")
    df2 = pd.read_csv("../predicted_data/crime_poverty_predictions_2022_2023_2024.csv")

    df1 = df1.pivot_table(index='State', columns='Year', values='Poverty in thousands')
    df1 = df1.reset_index()
    df1.columns.name = ''

    states = df2.iloc[:, 0:1]
    df2 = df2.iloc[:, 4:]
    df2 = pd.concat([states, df2], axis=1)

    poverty_rate_df = df1.join(df2.set_index('State'), on='State')

    return poverty_rate_df


def unemployment_rate():
    df1 = pd.read_csv("../data/Unemployment in America Per US State.csv")
    df2 = pd.read_csv("../predicted_data/Predicted_Unemployment_Rate_2022_2024_by_State.csv")

    df1.drop(df1.iloc[:, 0:1], axis=1, inplace=True)
    df1.drop(df1.iloc[:, 3:9], axis=1, inplace=True)
    df1 = df1.rename(columns={"Percent (%) of Labor Force Unemployed in State/Area": "Percent Unemployed"})
    df1 = df1.groupby(['State/Area', 'Year']).mean()
    df1.pop('Month')

    df1 = df1.pivot_table(index='State/Area', columns='Year', values='Percent Unemployed')
    df1 = df1.reset_index()
    df1.columns.name = ''

    df1 = df1.drop([18, 34])
    df1 = df1.reset_index()
    df1.pop('index')
    df1 = df1.rename(columns={'State/Area': 'State'})
    df2 = df2.pivot_table(index='State', columns='Year', values='Predicted Unemployment Rate (%)')
    df2 = df2.rename(columns={2022: 'Predicted 2022',
                              2023: 'Predicted 2023',
                              2024: 'Predicted 2024'})
    df2 = df2.reset_index()
    df2.columns.name = ''

    unemployment_rate_df = df1.join(df2.set_index('State'), on='State')

    return unemployment_rate_df


def home_value():
    df = pd.read_csv("../data/ZHVI_bystate_monthly.csv")
    df.drop(df.iloc[:, 0:2], axis=1, inplace=True)
    df.drop(df.iloc[:, 1:3], axis=1, inplace=True)

    states = df.iloc[:, 0:1]
    states = states.rename(columns={'RegionName': 'State'})
    df.pop('RegionName')
    df.columns = pd.to_datetime(df.columns)
    df = df.groupby(df.columns.year, axis=1).mean()

    return states.join(df)


def qol():
    df = pd.read_csv("../predicted_data/state_qol.csv")

    return df


if __name__ == '__main__':
    poverty_rate()
