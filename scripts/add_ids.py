# type: ignore
import json

"""This script adds IDs to major requirements which 
is utilized in the bypass logic

TODO: Add typing
"""
# Parse json file
FILE_NAME = "Accounting(BS)"


# Get major data from json
data = json.loads(open(f"degree_data/{FILE_NAME}.json", "r").read())
requirements_data = data["requirements"]["major"]

# Add metadata field w/ ids to each requirement
# For id, I think it's fine to just use indexes for now


def add_ids(requirement_data) -> None:
    def recursively_add_ids(requirement: any) -> None:
        # Add metadata field if not already present
        if not "metadata" in requirement:
            requirement["metadata"] = {}

        # Add id
        requirement["metadata"]["id"] = counter[0]
        counter[0] += 1

        # Add ids to other requirements
        if not "requirements" in requirement:
            return

        for req in requirement["requirements"]:
            recursively_add_ids(req)

    recursively_add_ids(requirement_data)

    return requirement_data


counter = [0]
for re in requirements_data:
    add_ids(re)

print(json.dumps(requirements_data, sort_keys=True))
