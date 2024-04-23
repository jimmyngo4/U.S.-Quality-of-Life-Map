import requests
from bs4 import BeautifulSoup
import csv
import os.path
import time


def scrape_cities(url):
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')
        select = soup.find('select', id='city')
        cities = [option['value'] for option in select.find_all('option') if option['value']]
        with open('cities.txt', 'w') as file:
            for city in cities:
                file.write(city + '\n')
        return cities
    else:
        print("Failed to fetch cities.")
        return []


def get_data(city):
    params = {
        "country": "United States",
        "city": city
    }
    url = "https://www.numbeo.com/quality-of-life/city_result.jsp"
    response = requests.get(url, params=params)
    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')

        if "There are no  data for " not in soup.get_text():
            data = [td.get_text(strip=True) for td in soup.find_all('td')]
            return data
        else:
            return []
    else:
        print("Failed to fetch data.")


def get_city(file, line):
    with open(file, 'r') as file:
        for i, line_number in enumerate(file):
            if i == line - 1:
                return line_number.strip()


def extract(data):
    keywords = ['Quality of Life Index:', 'Purchasing Power Index', 'Safety Index', 'Health Care Index',
                'Climate Index', 'Cost of Living Index', 'Property Price to Income Ratio', 'Traffic Commute Time Index',
                'Pollution Index']
    filtered_data = []
    for i, text in enumerate(data):
        if text in keywords:
            if i < len(data) - 1:
                next_keyword = data[i + 1]
                filtered_data.append(next_keyword)
    return filtered_data


def save_data(line_number):
    # Gets all the cities from the website
    # url = "https://www.numbeo.com/quality-of-life/country_result.jsp?country=United+States"
    # cities = scrape_cities(url)

    # Grabs a city to use from cities.txt
    city = get_city("cities.txt", line_number)

    # Gets unfiltered data for the city
    city_data = get_data(city)

    # Filters the data
    data = extract(city_data)

    # Inserts the city name to the beginning of the data
    data.insert(0, city)

    return data


def write_to_csv(filtered_data):
    keywords = ['City', 'Quality of Life Index', 'Purchasing Power Index', 'Safety Index', 'Health Care Index',
                'Climate Index', 'Cost of Living Index', 'Property Price to Income Ratio', 'Traffic Commute Time Index',
                'Pollution Index']
    if not os.path.exists('city.csv'):
        with open('city.csv', mode='w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(keywords)
            writer.writerow(filtered_data)

    else:
        with open('city.csv', mode='a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(filtered_data)


def main():

    start = 1
    num_lines = 50

    for line in range(start, num_lines + 1):
        data = save_data(line)

        if len(data) > 1:
            print(data)
            write_to_csv(data)

        time.sleep(1)
    print(f"Finished: {num_lines}")


if __name__ == "__main__":
    main()
