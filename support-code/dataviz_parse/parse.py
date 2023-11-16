import os
import xml.etree.ElementTree as ET

__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))
find_attribs = ["date", "day", "time", "pred_in_ft", "pred_in_cm", "highlow",]


def parse_xml(csv_output, path):
    tree = ET.parse(path)
    root = tree.getroot()

    for item in root.find('data').findall('item'):
        entry = [item.find(attrib).text for attrib in find_attribs ]
        csv_output.append(",".join(entry))
    
    return csv_output


csv_output = [",".join(find_attribs)]

csv_output = parse_xml(csv_output, os.path.join(__location__,'xmls','2021_1617760_annual.xml'))
csv_output = parse_xml(csv_output, os.path.join(__location__,'xmls','2022_1617760_annual.xml'))
csv_output = parse_xml(csv_output, os.path.join(__location__,'xmls','2023_1617760_annual.xml'))
csv_output = parse_xml(csv_output, os.path.join(__location__,'xmls','2024_1617760_annual.xml'))
csv_output = parse_xml(csv_output, os.path.join(__location__,'xmls','2025_1617760_annual.xml'))

with open(os.path.join(__location__,'output.csv'), 'w') as file:
        file.write("\n".join(csv_output))

