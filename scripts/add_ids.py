# type: ignore
import json
import os

"""This script adds IDs to major requirements which 
is utilized in the bypass logic

TODO: Add typing
"""

# Add metadata field w/ ids to each requirement
# For id, I think it's fine to just use indexes for now


def add_ids(requirement_data) -> None:
    def recursively_add_ids(requirement: any) -> None:
        # Add metadata field if not already present
        if not "metadata" in requirement:
            requirement["metadata"] = {}

        # Add id
        requirement["metadata"]["id"] = f"{major_name[0]}-{counter[0]}"
        counter[0] += 1

        # Add ids to other requirements
        if not "requirements" in requirement:
            return

        for req in requirement["requirements"]:
            recursively_add_ids(req)

    recursively_add_ids(requirement_data)

    return requirement_data


# # Parse json file
# FILE_NAME = "Business Analytics(BS)"


# # Get major data from json
# data = json.loads(open(f"degree_data/{FILE_NAME}.json", "r").read())
# requirements_data = data["requirements"]["major"]

# counter = [0]
# for re in requirements_data:
#     add_ids(re)

# data["requirements"]["major"] = requirements_data
# print(json.dumps(data, sort_keys=True))


# Get the list of all files and directories
# dir_list = [
#     "Psychology(BS).json",
#     "Speech, Language, and Hearing Sciences(BS).json",
# ]
# Get the list of all files and directories
path = "degree_data"
# dir_list = os.listdir(path)

for dir in dir_list:
    try:
        # Get major data from json
        data = json.loads(open(f"degree_data/{dir}", "r").read())
        requirements_data = data["requirements"]["major"]

        counter = [0]
        major_name = [data["abbreviation"]]
        for re in requirements_data:
            add_ids(re)

        data["requirements"]["major"] = requirements_data
        # print(json.dumps(data, sort_keys=True))

        # Write to file
        f = open(f"degree_data/{dir}", "w")
        f.write(json.dumps(data))
        f.close()
    except:
        print(dir)
