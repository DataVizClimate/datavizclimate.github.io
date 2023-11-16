import pandas as pd
import os
import json
import statistics

__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))

# Convert To Json
json_temp = {}
yearly_region_temp = {}

df = pd.read_csv(os.path.join(__location__,"..","..","static","data","GlobalTemperatures.csv"))
df.fillna('', inplace=True)
print(df.head())

for index, row in df.iterrows():
    date = row["dt"].split("-")
    year = date[0]

    if row["LandAverageTemperature"] != '':
        if year not in yearly_region_temp:
            yearly_region_temp[year] = []

        yearly_region_temp[year].append(row["LandAverageTemperature"])

print("Temps Got")
    
for year in yearly_region_temp:
        avg_temp = statistics.mean(yearly_region_temp[year])
        json_temp[year] = avg_temp


save_path = os.path.join(__location__,"..","..","static","data","GlobalTemp.json")
with open(save_path, 'w') as json_file:
    json.dump(json_temp, json_file, separators=(',', ':'))
