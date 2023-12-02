seaDataReady = false
seaMapping = {}
seaLevel = 0;

fetch('static/data/epa-sea-level-mapped.json')
.then(response => response.json())
.then(globalSea => {
    seaMapping = globalSea;

  seaDataReady = true
  onSeaSliderChange()
});


function onSeaSliderChange() { //event
    if (seaDataReady){
      let year = document.getElementById("sea-slider").value;
      document.getElementById("selected-sea-year").innerHTML = `${year}`;
      document.getElementById("sea-year").innerHTML = `${year}`;
      document.getElementById("sea-rise").innerHTML = `${seaMapping[year].toFixed(1)}mm`;
      seaLevel = seaMapping[year];
      document.getElementById("sea-coin-bar").style = `height: ${mapRange(seaLevel, 0, 19, 100, 0)}px;`;
    }
  }