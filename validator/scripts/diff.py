import requests
import json
import re
import os
from bs4 import BeautifulSoup
from jira import JIRA

#Should this detect CORE changes and, if so, should I flag each major for core changes?

#Modify the tolernance to ignore fluff (grammar changes, footnote numbering, etc)
#Determine what the cause of the diff is:
    #Course number change [*]
    #Major/Concentration deleted [*]
    #Degree credit hour changes [ ]

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

def createTicket(issueType, jira_connection, coursesImpacted):
    description = ""
    if issueType == 'R':
        print("R issue type")
        #TODO: Let description say course/concentration removed
    elif issueType == 'C':
        print("C issue type")
        #TODO: Let description say course was renamed/added/removed
    issue = jira_connection.create_issue(
        project='NP',
        summary='Course requirement version changes',
        #Let the description include the URI, try to add description formatting
        description=description,
        issuetype={'name': 'Task'}
    )
    #NEED EDIT PERMISSIONS to change assignee information
    #WHO do I assign them to?
    issue.update(assignee={'name': 'Kevin Ge'})

#TODO: Move API Token
# C issue type = Course renamed/added/removed
# R issue type = Major/concentration removed
if __name__ == "__main__":
    jira_connection = JIRA(
        basic_auth=('planner@utdnebula.com', 'CHANGE ME'),
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
            createTicket('R', jira_connection, re.sub(yearRegex, f'/{ str(match) }/', data["catalog_uri"]))
        else:
            createTicket('C', jira_connection, (new-old).union(old-new))
        