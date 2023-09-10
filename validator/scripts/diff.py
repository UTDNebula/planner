import requests
import json
import re
import os
from bs4 import BeautifulSoup

course_prefixes = ["ACCT","ACTS","AHST","AMS","ARAB","ARHM","ARTS","ATCM","BA","BBSU","BCOM","BIOL","BIS","BLAW","BMEN","BPS","CE","CGS",
                   "CHEM","CHIN","CLDP","COMM","CRIM","CRWT","CS","DANC","ECON","ECS","ECSC","ED","EE","ENGR","ENGY","ENTP","ENVR","EPCS",
                   "EPPS","FILM","FIN","FREN","GEOG","GEOS","GERM","GISC","GOVT","GST","HIST","HLTH","HMGT","HONS","HUMA","IMS","IPEC","ISAE",
                   "ISAH","ISEC","ISIS","ISNS","ITSS","JAPN","KORE","LANG","LATS","LIT","MATH","MECH","MECO","MKT","MSEN","MUSI","NATS","NSC",
                   "OBHR","OPRE","PA","PHIL","PHIN","PHYS","PPOL","PSCI","PSY","REAL","RELS","RHET","RMIS","SE","SOC","SPAN","SPAU","STAT","THEA",
                   "UNIV","VIET","VPAS"]


def get_req_content(url):
    response = requests.get(url)
    if(response.status_code == 200):
        return extract_courses(response.text)
    else:
        print("Failed to fetch " + url + " with status code " + response.status_code)
        return None
    
#Should this detect CORE changes and, if so, should I flag each major for core changes?

#Modify the tolernance to ignore fluff (grammar changes, footnote numbering, etc)
#Determine what the cause of the diff is:
    #Course number change [*]
    #Degree credit hour changes [ ]
#Send the probable diff cause to the ticket send based on the problems and where they are
    
def extract_courses(webData):
    bs = BeautifulSoup(webData)
    courses = set()
    course_elements = bs.find_all('a', href=True)

    for course_element in course_elements:
        course_name = course_element.text.strip()
        for prefix in course_prefixes:
            if prefix in course_name:
                courses.add(course_name)
    return courses

if __name__ == "__main__":
    for majorReqJson in os.scandir('validator/degree_data'):
        data = json.loads(open(f"validator/degree_data/" + majorReqJson.name, "r").read())
        catalog_uri=data["catalog_uri"]
        yearRegex = r'/(\d{4})/'
        match = int(re.search(yearRegex, catalog_uri).group(1))+1
        print(data["catalog_uri"])
        print(re.sub(yearRegex, f'/{match}/', data["catalog_uri"]))
        old=get_req_content(data["catalog_uri"])
        new=get_req_content(re.sub(yearRegex, f'/{match}/', data["catalog_uri"]))
        print((new-old).union(old-new))
        