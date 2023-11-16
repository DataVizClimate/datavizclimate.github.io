import pandas as pd
import os
import json
import statistics

__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))

# Convert To Json
mapping = {}

with open(os.path.join(__location__,"..","..","static","data","ingress","epa-sea-level.json"), 'r') as json_file:
    data = json.load(json_file)

    for entry in data:
        if entry["CSIRO Adjusted Sea Level"] != None:
            mapping[entry["Year"].split("-")[0]] = entry["CSIRO Adjusted Sea Level"]
        else:
            print(entry["Year"], None)

save_path = os.path.join(__location__,"..","..","static","data","epa-sea-level-mapped.json")
with open(save_path, 'w') as json_file:
    json.dump(mapping, json_file, separators=(',', ':'))
