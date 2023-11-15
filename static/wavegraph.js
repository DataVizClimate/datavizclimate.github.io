//all_data = FileAttachment("output_2.csv").csv()
// Plotly = require("https://cdn.plot.ly/plotly-latest.min.js")
// const fs = require('fs');
// const path = require('path');

// Fetch the CSV file from the server

function updateWaveGraph() {
    let all_data = []

    fetch('static/data/output.csv')
    .then(response => response.text())
    .then(csv => {
        // Convert the CSV to JSON
        all_data = csvToJson(csv);
        //console.log(all_data);

        for (let i=0; i<all_data.length; i++) {
            all_data[i]["date"] = new Date(all_data[i]["date"]);
        }

        function func_high_tide() { 
            const high_tide = all_data.filter(obj => obj.highlow == "H")
            return high_tide
        }
        
        function func_low_tide() {
            const low_tide = all_data.filter(obj => obj.highlow == "L")
            return low_tide
        }
        
        let high_tide = func_high_tide()
        let low_tide  = func_low_tide()

        dates = all_data.map(element => element.date);
        
        minDate = new Date(Math.min.apply(null, dates));
        maxDate = new Date(Math.max.apply(null, dates));

        let trace_upper = {
            x: high_tide.map(item => item.date),
            y: high_tide.map(item => item.pred_in_cm),
            //mode: "lines+markers"
            type: 'scatter',
            fill: 'none',
            mode: 'lines',
            name: 'Upper Bound',
            line: {
            color: 'rgba(255,0,0,0.7)',
            },
        }
        
        let trace_lower = {
            x: low_tide.map(item => item.date),
            y: low_tide.map(item => item.pred_in_cm),
            //mode: "lines+markers"
            type: 'scatter',
            fill: 'tonexty', // This fills the area between this trace and the one before it
            mode: 'lines',
            name: 'Lower Bound',
            line: {
            color: 'rgba(255,0,0,0.7)',
            },
        }

        let data = [trace_upper, trace_lower]

        let layout = { // there are many layout options, in this example we just set the dimensions
            title: {
            text:'Plot Title',
            font: {
                family: 'Courier New, monospace',
                size: 24
            },
            xref: 'paper',
            x: 0.05,
            },
            xaxis: {
            title: {
                text: 'x Axis',
                font: {
                family: 'Courier New, monospace',
                size: 18,
                color: '#7f7f7f'
                }
            },

                rangeselector: {
                  buttons: [
                    {
                      count: 1,
                      label: '1m',
                      step: 'month',
                      stepmode: 'backward'
                    },
                    {
                      count: 6,
                      label: '6m',
                      step: 'month',
                      stepmode: 'backward'
                    },
                    {step: 'all'}
                  ]
                },
                rangeslider: {range: [minDate, maxDate]},
                type: 'date'
              
            },
            yaxis: {
            title: {
                text: 'y Axis',
                font: {
                family: 'Courier New, monospace',
                size: 18,
                color: '#7f7f7f'
                }
            }
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            
            // height: 400,
            // width: 900
        };
            
        const div = document.getElementById('WaveGraph');
        Plotly.newPlot(div, data, layout);
        //return div;

    })
    .catch(error => {
        console.error('Error fetching the CSV file:', error);
    });
}

updateWaveGraph();