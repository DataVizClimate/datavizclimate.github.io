import os
import xml.etree.ElementTree as ET

__location__ = os.path.realpath(os.path.join(os.getcwd(), os.path.dirname(__file__)))

tree = ET.parse(os.path.join(__location__,'1617760_annual.xml'))
root = tree.getroot()

#for child in root:
#    print(child.tag, child.attrib)

print(root[14][0].tag)

root.tag
root.attrib
root.text

find_attribs = ["date", "day", "time", "pred_in_ft", "pred_in_cm", "highlow",]

csv_output = ",".join(find_attribs)
for item in root.find('data').findall('item'):
    entry = [item.find(attrib).text for attrib in find_attribs ]
    csv_output += entry

