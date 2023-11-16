import pandas as pd
import os
import json
from nameToIsoA2 import *
import statistics
import gzip

__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))

# Get Polygons From Example Globe.Gl Example
isoA2ToPolygon = {}

file_path = os.path.join(__location__,"..","..","static","data","ne_110m_admin_0_countries.geojson")
with open(file_path, 'r') as file:
    data = json.load(file)

    features = data["features"]
    for feature in features:
        isoA2 = feature["properties"]["ISO_A2"]
        geometry = feature["geometry"]

        isoA2ToPolygon[isoA2] = geometry





# Convert To GeoJson
geo_json = []
yearly_region_temp = {}

df = pd.read_csv(os.path.join(__location__,"..","..","static","data","GlobalLandTemperaturesByCountry.csv"))
df.fillna('', inplace=True)
print(df.head())

for index, row in df.iterrows():
    country = row["Country"]
    date = row["dt"].split("-")
    year = date[0]
    # month = date[1]
    # day = date[2]

    if row["AverageTemperature"] != '':
        if country not in yearly_region_temp:
            yearly_region_temp[country] = {}

        if year not in yearly_region_temp[country]:
            yearly_region_temp[country][year] = []

        yearly_region_temp[country][year].append(row["AverageTemperature"])

print("Temps Got")

for country in yearly_region_temp:
    for year in yearly_region_temp[country]:
        avg_temp = statistics.mean(yearly_region_temp[country][year])
        
        location = {
            "type": "Feature",
            # bbox: [1,1,1,1],
            "geometry": {},
            "properties": {}
        }

        isoA2Converted = getISOA2(country)
        
        location["properties"]["AvgTemp"] = avg_temp
        location["properties"]["Country"] = country
        location["properties"]["Year"] = year

        if isoA2Converted in isoA2ToPolygon:
            location["geometry"] = isoA2ToPolygon[isoA2Converted]
            geo_json.append(location)


# for index, row in df.iterrows():
#     # print(f"Index: {index}")
#     # print(row)
#     # if row["dt"] == "2008-12-01":
#     location = {
#         "type": "Feature",
#         # bbox: [1,1,1,1],
#         "geometry": {},
#         "properties": {}
#         }
#     isoA2Converted = getISOA2(row["Country"])
    
#     location["properties"]["AverageTemperature"] = row["AverageTemperature"]
#     # location["properties"]["AverageTemperatureUncertainty"] = row["AverageTemperatureUncertainty"]
#     location["properties"]["Country"] = row["Country"]
#     # location["properties"]["ISOA2"] = getISOA2(row["Country"])
#     location["properties"]["DateTime"] = row["dt"]

#     if isoA2Converted in isoA2ToPolygon:
#         location["geometry"] = isoA2ToPolygon[isoA2Converted]
#         geo_json.append(location)
    

save_path = os.path.join(__location__,"..","..","static","data","GlobalTemp.geojson.gz")
with gzip.open(save_path, "wt", encoding="utf-8") as json_file:
    geo_json_container = {
        "type": "FeatureCollection",
        "bbox": [-180, -90, 180, 83.64513],
        "features": geo_json,
    }
    json.dump(geo_json_container, json_file, separators=(',', ':'))
