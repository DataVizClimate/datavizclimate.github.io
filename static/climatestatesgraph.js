//all_data = FileAttachment("output_2.csv").csv()
// Plotly = require("https://cdn.plot.ly/plotly-latest.min.js")
// const fs = require('fs');
// const path = require('path');

// Fetch the CSV file from the server

function updateStatesClimateGraph() {
    let all_data = []

    fetch('static/data/climate_policy_states.csv')
    .then(response => response.text())
    .then(csv => {
        // Convert the CSV to JSON
        all_data = csvToJson(csv);
        //console.log(all_data);

        let codes = {
            "Alabama":"AL",
            "Alaska":"AK",
            "Arizona":"AZ",
            "Arkansas":"AR",
            "California":"CA",
            "Colorado":"CO",
            "Connecticut":"CT",
            "Delaware":"DE",
            "Florida":"FL",
            "Georgia":"GA",
            "Hawaii":"HI",
            "Idaho":"ID",
            "Illinois":"IL",
            "Indiana":"IN",
            "Iowa":"IA",
            "Kansas":"KS",
            "Kentucky":"KY",
            "Louisiana":"LA",
            "Maine":"ME",
            "Maryland":"MD",
            "Massachusetts":"MA",
            "Michigan":"MI",
            "Minnesota":"MN",
            "Mississippi":"MS",
            "Missouri":"MO",
            "Montana":"MT",
            "Nebraska":"NE",
            "Nevada":"NV",
            "New Hampshire":"NH",
            "New Jersey":"NJ",
            "New Mexico":"NM",
            "New York":"NY",
            "North Carolina":"NC",
            "North Dakota":"ND",
            "Ohio":"OH",
            "Oklahoma":"OK",
            "Oregon":"OR",
            "Pennsylvania":"PA",
            "Rhode Island":"RI",
            "South Carolina":"SC",
            "South Dakota":"SD",
            "Tennessee":"TN",
            "Texas":"TX",
            "Utah":"UT",
            "Vermont":"VT",
            "Virginia":"VA",
            "Washington":"WA",
            "West Virginia":"WV",
            "Wisconsin":"WI",
            "Wyoming":"WY"
        }

        function getCGoalData() {
            // Deep Copy
            //let cGoal = JSON.parse(JSON.stringify(all_data));
            // console.log(all_data)
            let cGoal = all_data;
          
            cGoal = cGoal.filter((state) => codes.hasOwnProperty(state["state"]));
            //cGoal = cGoal.filter((state) => state["Year to accomplish"] != 0);

            for (let i in cGoal) {
              // Generate Abbrivations
              cGoal[i]["State"] = codes[cGoal[i]["state"]]
              
              // // Parse
              // for (let variable in cGoal[i]) {
              //   if (variable != "Climate Goal" && variable != "state") {
              //     //modMarried[i][variable] = parseInt(modMarried[i][variable].replace(/,/g, ''))
              //     cGoal[i][variable] = parseInt(cGoal[i][variable].replace(/,/g, ''))
              //   }
              // }
            }
            
            return cGoal
        }

        const cGoal = getCGoalData();
        console.log(cGoal)
        
        let data = [{
            type: 'choropleth',
            locationmode: 'USA-states',
            locations: cGoal.map(item => item["State"]),
            z: cGoal.map(item => {
                if (item["Year to accomplish"] == 0) {
                    return 0
                } else {
                    return item["Year to accomplish"]}}),
            text: cGoal.map(item => {
                if (item['Climate Goal'] == 0) {
                    return `${item["state"]}: No Climate Initative}`
                } else {
                return `${item["state"]}: ${item["Climate Goal"]}`
                }
            }),
            colorscale: [  // Color Gradient Generated with Color Brewer
                    [0.0, '#eff3ff'], [0.1, '#c6dbef'],
                    [0.2, '#9ecae1'], [0.3, '#6baed6'],
                    [0.7, '#3182bd'], [1.0, '#08519c']
            ],
            // This probably does the same thing as auto.
            zmin: Math.min(...cGoal.map(item => (item["Year to accomplish"] == 0 ? Number.MAX_SAFE_INTEGER : item["Year to accomplish"]))),
            zmax: Math.max(...cGoal.map(item => (item["Year to accomplish"] == 0 ? 0 : item["Year to accomplish"]))),
        
            // customizing the color bar
            colorbar: {
            title: 'Year',
            thickness: 10
            },
        }];
          
        let layout = {
            title: 'State\'s Proposed Deadline Till 100% Clean Energy',
            geo:{
            bgcolor: 'rgba(0,0,0,0)',
            scope: 'usa',
            },
            dragmode: false,
            margin: {
                l: 0,
                r: 0,
                b: 0,
                t: 40
                  },
            // pad: 5
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)'
        };

        const div = document.getElementById('ClimateStatesGraph');
        Plotly.newPlot(div, data, layout, {responsive: true, displayModeBar: false});
        //return div;

    })
    .catch(error => {
        console.error('Error fetching the CSV file:', error);
    });
}

window.addEventListener('resize', function() {
    updateStatesClimateGraph();
});


updateStatesClimateGraph();