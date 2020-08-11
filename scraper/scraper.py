#!/usr/bin/env sh
from bs4 import BeautifulSoup

"""A utility script that scrapes web pages"""

LATEST_CATALOG = 2020

CATALOG_VERSIONS = [year for year in range(2012, LATEST_CATALOG)]

SUBJECT_CODES = []

def get_catalog_url(year):
    return f'https://catalog.utdallas.edu/{year}/undergraduate/home/'


def get_subject_url(year):
    return f'https://catalog.utdallas.edu/{year}/undergraduate'


def scrape_catalog(year):
    pass


def scrape_subject(code):
    pass


def scrape_page(content):
    soup = BeautifulSoup(content)


def scrape_catalogs():
    print('Scraping undergraduate course catalogs for degree requirements.')
    for year in CATALOG_VERSIONS:
        url = get_catalog_url(year)
        try:
            response = requests.get(url)
        except Exception:
            print(f'Cannot retrieve catalog for year {year}')


def scrape_courses():
    """Returns a"""
    for subject in SUBJECT_CODES:
        url = get_subject_url(subject)
        try:
            response = requests.get(url)
            courses = scrape_subject(response.text)
        except Exception:
            print(f'Cannot retrieve courses with subject {subject}')


def main():
    print('Starting sraping proccess')


if __name__ is __main__:
    main()