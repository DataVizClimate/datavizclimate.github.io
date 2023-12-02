let globeDataReady = false;
let temperatureData = {}
let world = null

const colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);

const legendContainer = d3.select('body').append('div')
  .attr('class', 'legend-container');

//const getVal = feat => feat.properties.AvgTemp / Math.max(1e5, feat.properties.AvgTemp);
const getVal = feat => feat.properties.AvgTemp;
let temperatureMapping = {}
// celsius, Land Temperature Avg
// 1840, 1850 - 2013

function buildGlobe(year) {
  world = Globe()
  //.globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
  //.backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
  .globeMaterial(new THREE.MeshLambertMaterial({ color: '#00303d' }))
  .backgroundColor('rgba(0, 0, 0, 0)')
  .lineHoverPrecision(0)
  .polygonsData(temperatureData.features.filter(d => d.properties.Year == year))
  .polygonAltitude(0.01)
  .polygonCapColor(feat => colorScale(getVal(feat)))
  .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
  .polygonStrokeColor(() => '#111')
  .polygonLabel(({ properties: d }) => `
  <b>${d.Country}</b>
  <br/>
  Land Temp: ${d.AvgTemp.toFixed(1)}°C
  `)
  .onPolygonHover(hoverD => world
      .polygonAltitude(d => d === hoverD ? 0.05 : 0.01)//0.05 : 0.01)
      //.polygonCapColor(d => d === hoverD ? 'steelblue' : colorScale(getVal(d)))
  )
  .polygonsTransitionDuration(0) //300
  (document.getElementById('globeViz'))
  world.controls().enableZoom = false;

  maxTemp = Math.max.apply(Math, temps)
  minTemp = Math.min.apply(Math, temps)

  colorScale.domain([minTemp, maxTemp + 100]);

  const reversedTicks = colorScale.ticks(7).reverse();

  const legendContainer = d3.select("#legendContainer");

  const legend = legendContainer.selectAll('.legend')
    .data(reversedTicks)
    .enter().append('div')
    .attr('class', 'legend');

  legend.append('div')
    .style('width', '20px')
    .style('height', '20px')
    .style('background-color', d => colorScale(d));

  legend.append('div')
    .text(d => d.toFixed(1));
}

fetch('static/data/GlobalTemp.geojson.gz')
.then(res => {
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    return res.arrayBuffer(); // Get the response as an ArrayBuffer
  }) //.json()
.then(gzippedData => {

    const inflatedData = pako.inflate(new Uint8Array(gzippedData), { to: 'string' });
    temperatureData = JSON.parse(inflatedData);

    years = temperatureData.features.map(element => element.properties.Year);
    temps = temperatureData.features.map(element => element.properties.AvgTemp);
    maxYear = Math.max.apply(Math, years)
    minYear = Math.min.apply(Math, years)

    buildGlobe("1850")

    fetch('static/data/GlobalTemp.json')
    .then(response => response.json())
    .then(globalTemp => {
      temperatureMapping = globalTemp;

      globeDataReady = true
      onYearSliderChange()
      resizeGlobe()
    });
});


function resizeGlobe() {
  if (globeDataReady){
    const { innerWidth, innerHeight } = window;
    const offset = document.getElementById("globe-prompt").offsetHeight;
    world.width(innerWidth).height(innerHeight - offset);
  }
}


function onYearSliderChange() { //event
  if (globeDataReady){
    let year = document.getElementById("year-slider").value;
    document.getElementById("selected-year").innerHTML = `${year}`;
    document.getElementById("year").innerHTML = `${year}`;
    document.getElementById("temperature").innerHTML = `${temperatureMapping[year].toFixed(1)}°C`
    //buildGlobe(year)
    world.polygonsData(temperatureData.features.filter(d => d.properties.Year == year))
    
  }
  // console.log("test")
}

window.addEventListener('resize', function() {
  resizeGlobe();
});
