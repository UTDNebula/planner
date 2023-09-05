import requests
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
    #Course number change
    #Degree credit hour changes
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
    old=get_req_content("https://catalog.utdallas.edu/2022/undergraduate/programs/ecs/computer-science")
    new=get_req_content("https://catalog.utdallas.edu/2023/undergraduate/programs/ecs/computer-science")
    print((new-old).union(old-new))
    # oldURL = "https://catalog.utdallas.edu/2022/undergraduate/programs/ecs/computer-science"
    # newURL = "https://catalog.utdallas.edu/2021/undergraduate/programs/ecs/computer-science"

    # oldURL_HTML = get_req_content(oldURL)
    # newURL_HTML = get_req_content(newURL)

    # if oldURL_HTML and newURL_HTML:
    #     coursesDelta = oldCourses - newCourses
    #     lines = diff.split('\n')
    #     with open("./output.txt","w") as file:
    #         for line in lines:
    #             file.write(line + '\n')