function init() {
    var w = 500;  // Adjust the width
    var h = 300;  // Adjust the height

    // Create SVG container
    var svg = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    // Define Mercator projection centered on Victoria
    var projection = d3.geoMercator()
                       .center([145, -36.51])
                       .translate([w / 2, h / 2])
                       .scale(2500);

    var path = d3.geoPath().projection(projection);

    // Define a color scale for unemployment data
    var color = d3.scaleQuantize()
                  .range([
                      "rgb(222,235,247)", 
                      "rgb(158,202,225)", 
                      "rgb(107,174,214)", 
                      "rgb(66,146,198)", 
                      "rgb(33,113,181)"
                  ]);

    // Tooltip div for displaying city and unemployment information
    var tooltip = d3.select("body")
                    .append("div")
                    .attr("class", "tooltip")
                    .style("position", "absolute")
                    .style("visibility", "hidden")
                    .style("background", "#fff")
                    .style("padding", "5px")
                    .style("border", "1px solid #ccc")
                    .style("border-radius", "4px");

    d3.csv("VIC_LGA_unemployment.csv").then(function(unemploymentData) {
        // Set the domain of the color scale
        color.domain([
            d3.min(unemploymentData, d => +d.unemployed),
            d3.max(unemploymentData, d => +d.unemployed)
        ]);

        d3.json("LGA_VIC.json").then(function(json) {
            //Merge unemployment data with GeoJSON
            unemploymentData.forEach(function(d) {
                var dataLGA = d.LGA;
                var dataValue = parseFloat(d.unemployed);

                // Find the corresponding LGA in GeoJSON
                json.features.forEach(function(feature) {
                    if (feature.properties.LGA_name === dataLGA) {
                        feature.properties.unemployed = dataValue;
                    }
                });
            });

            //Draw the map with color encoding for unemployment data
            svg.selectAll("path")
               .data(json.features)
               .enter()
               .append("path")
               .attr("d", path)
               .attr("stroke", "black")
               .attr("fill", function(d) {
                   var value = d.properties.unemployed;
                   return value ? color(value) : "#ccc"; // Default color if no data
               })
               .on("mouseover", function(event, d) {
                   var value = d.properties.unemployed ? d.properties.unemployed : "No data";
                   tooltip.style("visibility", "visible")
                          .html(`LGA: ${d.properties.LGA_name}<br>Unemployment: ${value}`)
                          .style("top", (event.pageY - 10) + "px")
                          .style("left", (event.pageX + 10) + "px");
               })
               .on("mousemove", function(event) {
                   tooltip.style("top", (event.pageY - 10) + "px")
                          .style("left", (event.pageX + 10) + "px");
               })
               .on("mouseout", function() {
                   tooltip.style("visibility", "hidden");
               });

            //Load city data and add circles for towns/cities
            d3.csv("VIC_city.csv").then(function(cityData) {
                svg.selectAll("circle")
                   .data(cityData)
                   .enter()
                   .append("circle")
                   .attr("cx", d => projection([+d.lon, +d.lat])[0])
                   .attr("cy", d => projection([+d.lon, +d.lat])[1])
                   .attr("r", 5)
                   .style("fill", "red")
                   .style("opacity", 0.75)
                   .on("mouseover", function(event, d) {
                       // Show only the place name on hover
                       tooltip.style("visibility", "visible")
                              .html(`Place: ${d.place}`)
                              .style("top", (event.pageY - 10) + "px")
                              .style("left", (event.pageX + 10) + "px");
                   })
                   .on("mousemove", function(event) {
                       tooltip.style("top", (event.pageY - 10) + "px")
                              .style("left", (event.pageX + 10) + "px");
                   })
                   .on("mouseout", function() {
                       tooltip.style("visibility", "hidden");
                   });
            }).catch(function(error) {
                console.error("Error loading city data: ", error);
            });

        }).catch(function(error) {
            console.error("Error loading GeoJSON: ", error);
        });
    }).catch(function(error) {
        console.error("Error loading unemployment data: ", error);
    });
}

window.onload = init;
