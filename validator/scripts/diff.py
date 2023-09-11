import requests
import json
import re
import os
from bs4 import BeautifulSoup
from jira import JIRA

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
        return set()
    
#Should this detect CORE changes and, if so, should I flag each major for core changes?

#Modify the tolernance to ignore fluff (grammar changes, footnote numbering, etc)
#Determine what the cause of the diff is:
    #Course number change [*]
    #Degree credit hour changes [ ]
#Send the probable diff cause to the ticket send based on the problems and where they are
    
#They straight up remove majors sometimes (mostly ATEC majors lol)
# https://catalog.utdallas.edu/2023/undergraduate/programs/atec/arts-and-technology-animation
# https://catalog.utdallas.edu/2022/undergraduate/programs/atec/arts-and-technology-animation

#Almost like every major has a diff

#Business Admin is a pain in the ass with all of the concentrations

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

def createTicket(issueJson, jira_connection):
    issue_list = [
        {
        'project': {'key': 'NP'},
        'summary': 'Version inconsistencies between years',
        'description': 'The updated major requirements page has changed course names and/or requirements, course(s) changed include: ',
        'issuetype': {'name':'Task'}
        }
    ]

#TODO: Move API Token
JIRA_API_KEY='f'
if __name__ == "__main__":
    jira_connection = JIRA(
        basic_auth=('planner@utdnebula.com', JIRA_API_KEY),
        server="https://nebula-labs.atlassian.net"
    )
    for majorReqJson in os.scandir('validator/degree_data'):
        data = json.loads(open(f"validator/degree_data/" + majorReqJson.name, "r").read())
        catalog_uri=data["catalog_uri"]
        yearRegex = r'/(\d{4})/'
        match = int(re.search(yearRegex, catalog_uri).group(1))+1
        old=get_req_content(data["catalog_uri"])
        new=get_req_content(re.sub(yearRegex, f'/{ str(match) }/', data["catalog_uri"]))
        if len(new) == 0:
            print("Major/Concentration removed: " + re.sub(yearRegex, f'/{ str(match) }/', data["catalog_uri"]))
        else:
            print("Course(s) changed: " + data["catalog_uri"])
            print((new-old).union(old-new))
        