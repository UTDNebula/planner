import json
import re
import os
import uuid
from glob import glob
from pathlib import Path

re = re.compile(r"(\w) \(")

degree_files = set()

for fname in glob("validator/degree_data/*.json"):
    with open(fname, "r") as f:
        data = json.load(f)
        if "abbreviation" in data:
            data["display_name"] = re.sub(r"\1(", data["abbreviation"])
            del data["abbreviation"]
        if "id" not in data:
            data["id"] = str(uuid.uuid4())
        if "uuid" in data:
            del data["uuid"]
        if "name" in data:
            del data["name"]
    # Delete the old file
    os.remove(fname)
    # Write to the new file using the new naming convention
    new_name = re.sub(r"\1(", fname)
    with open(new_name, "w") as f:
        json.dump(data, f, indent=2)
        degree_files.add(Path(new_name).stem)

"""
with open("src/data/majors.json", "r") as f:
    data = json.load(f)
    degree_names = set(data)

print("\n".join(degree_files.difference(degree_names)))
"""
