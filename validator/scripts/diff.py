import requests
import json
import re
import os
import difflib
from bs4 import BeautifulSoup
from jira import JIRA

"""This script looks through all major/concentration
json files to find if any requirements have changed
over the year. If so, it raises a JIRA ticket with 
requirement change information
"""

jira_api_key = os.environ['JIRA_API_KEY']
major_json_path = "/home/runner/work/planner/planner/validator/degree_data"

#Extracts html from url and sends it to course extractor
def get_req_content(url: str) -> str:
    response = requests.get(url)
    if(response.status_code == 200):
        return response.text
    else:
        return "Webpage not found"

#Extracts the courses from each major and sends them to a set
def extract_courses(webData: str) -> set[str]:
    bs = BeautifulSoup(webData, features="html.parser")
    courses = set()
    course_elements = bs.find_all('a', href=True)

    for course_element in course_elements:
        course_name = course_element.text.strip()
        pattern = r'\b[A-Z]{2,4} \d{4}\b'
        
        if re.search(pattern, course_name):
            courses.add(course_name)
    return courses

#Diffs between webpages and works with the course diff sets
def htmldiff(previousYearURL: str, currentYearURL: str, oldCourses: set[str], newCourses: set[str]) -> str:
    oldContent = get_req_content(previousYearURL)
    newContent = get_req_content(currentYearURL)

    oldCourses.update(extract_courses(oldContent))
    newCourses.update(extract_courses(newContent))
    
    bsOld = BeautifulSoup(oldContent, features="lxml").find('div', attrs = {'id':'bukku-page'})
    bsNew = BeautifulSoup(newContent, features="lxml").find('div', attrs = {'id':'bukku-page'})

    if bsNew is None or bsOld is None:
        return ""

    bsOldLines = bsOld.get_text().split('\n')
    bsNewLines = bsNew.get_text().split('\n')

    diff = difflib.ndiff(bsOldLines, bsNewLines)
    diffString = "```"
    for line in diff:
        diffString+=line+'\n'

    return diffString + "```"

#Creates a ticket based on issue type, including URI and impacted courses in ticket
#C issue type = Course renamed/added/removed
#R issue type = Major/concentration removed
def createTicket(issueType: str, jira_connection: JIRA, URI: str, coursesImpacted: set[str], diffCodeBlock: str) -> None:
    description = "This is an automated diff script used to detect discrepancies between major requirements\nURI: " + URI + "\n"
    description += "Major: " + URI.split("/")[-1] + "\n"
    f = open("description.txt", "w")
    if issueType == 'R':
        description += "This major/concentration has been renamed or removed\n\n"
    elif issueType == 'C':
        description += "See attachment for the course(s) that have been renamed/added/removed:\n" + str(coursesImpacted) + "\n\n"
        f.write(diffCodeBlock)
    f.close()
    ticket = jira_connection.create_issue(
        project='NP',
        summary='Course requirement version changes: ' +  URI.split("/")[-1],
        description=description,
        issuetype={'name': 'Task'},
        customfield_10016=1,
        labels=["Engineering"],
    )
    if os.path.getsize("description.txt"):
        with open("description.txt", "rb") as descriptionFile:
            jira_connection.add_attachment(issue=ticket, attachment=descriptionFile)
    os.remove("description.txt")

#Establishes JIRA connection and ierates through each major for versioning issues
if __name__ == "__main__":
    jira_connection = JIRA(
        basic_auth=('planner@utdnebula.com', jira_api_key),
        server="https://nebula-labs.atlassian.net"
    )
    for majorReqJson in os.scandir(major_json_path):
        data = json.loads(open(f"/home/runner/work/planner/planner/validator/degree_data/" + majorReqJson.name, "r").read())
        catalog_uri=data["catalog_uri"]
        yearRegex = r'/(\d{4})/'
        result = re.search(yearRegex, catalog_uri)
        if result:
            match = str(int(result.group(1))+1)
            previousYearURL = data["catalog_uri"]
            currentYearURL = re.sub(yearRegex, f'/{ str(match) }/', data["catalog_uri"])
            oldCourses: set[str] = set()
            newCourses: set[str] = set()
            pageDiff = htmldiff(previousYearURL, currentYearURL, oldCourses, newCourses)
            if len(newCourses) == 0:
                createTicket('R', jira_connection, re.sub(yearRegex, f'/{ match }/', data["catalog_uri"]), set(), pageDiff)
            else:
                createTicket('C', jira_connection, re.sub(yearRegex, f'/{ match }/', data["catalog_uri"]), (newCourses-oldCourses).union(oldCourses-newCourses), pageDiff)
            