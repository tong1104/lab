function init() {
    var w = 500;
    var h = 300;

    // Corrected center() method with a comma between longitude and latitude
    var projection = d3.geoMercator()
                     .center([145, -36.5])  // Corrected comma
                     .translate([w / 2, h / 2])
                     .scale(2450); 

    var path = d3.geoPath()
                 .projection(projection);

    var svg = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    // Load GeoJSON data
    d3.json("LGA_VIC.json").then(function(json){
        svg.selectAll("path")
           .data(json.features)
           .enter()
           .append("path")
           .attr("d", path)
           .attr("fill", "lightgrey")  // Add fill color to make paths visible
           .attr("stroke", "black");   // Add stroke to outline the paths
    });
}

window.onload = init;
