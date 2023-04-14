import json

""" In MongoDB, course ids are stored in the following format:

    "_id": {
        "$oid": "course_id_here"
    }

    This script converts the id field to the following format
    "id": "course_id_here"

    This script needs to be run whenever you export the courses info from the db to json.
    Note: This is a temporary workaround. In the future, we should be querying directly from the db.
    Reason why we're doing this is if we query from databse now, it takes too long 
"""

data = json.loads(open(f"src/data/courses.json", "r").read())
for course in data:
    course["id"] = course["id"]["$oid"]
# Serializing json
json_object = json.dumps(data, indent=4)

# Writing to sample.json
with open("src/data/courses.json", "w") as outfile:
    outfile.write(json_object)
