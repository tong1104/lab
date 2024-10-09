function init() {
    var dataset = [5, 10, 20, 45, 6, 25];

    var w = 300;
    var h = 300;

    var outerRadius = w / 2;
    var innerRadius = 50;
    
    // Create arc generator
    var arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);

    // Create pie layout
    var pie = d3.pie();

    // Set up color scale
    var color = d3.scaleOrdinal(d3.schemePastel1);

    // Append the SVG element
    var svg = d3.select('body')
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    // Set up groups for each arc
    var arcs = svg.selectAll("g.arc")
        .data(pie(dataset))  // Apply pie layout to dataset
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + outerRadius + ", " + outerRadius + ")");

    // Draw arc paths
    arcs.append("path")
        .attr("fill", function(d, i) { return color(i); })
        .attr("d", arc);

    // Add text labels
    arcs.append("text")
        .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")";
        })
        .attr("text-anchor", "middle")
        .text(function(d) {
            return d.data;  // Display the value in the dataset
        });
}

window.onload = init;