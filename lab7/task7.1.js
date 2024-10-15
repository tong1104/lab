function init() {
    var w = 600;
    var h = 300;
    var padding = 55;
    var dataset;

    // Load CSV data
    d3.csv("unemployment.csv", function(d) {
        return {
            date: new Date(+d.year, +d.month - 1), // Combining year and month into a Date object
            number: +d.number // Converting the 'number' column to an integer
        };
    }).then(function(data) {
        dataset = data;

        // Log data to check the format
        console.table(dataset, ["date", "number"]);

        // Call the lineChart function to draw the line chart
        lineChart(dataset);
    });

    // Function to create a line chart
    function lineChart(dataset) {
        // Set up xScale (time) and yScale (linear)
        var xScale = d3.scaleTime()
            .domain([
                d3.min(dataset, function(d) { return d.date; }),
                d3.max(dataset, function(d) { return d.date; })
            ])
            .range([padding, w - padding]);

        var yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, function(d) { return d.number; })])
            .range([h - padding, padding]);

        // Set up the line generator
        var line = d3.line()
            .x(function(d) { return xScale(d.date); })
            .y(function(d) { return yScale(d.number); });

        // Append SVG element
        var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

        // Append the line path
        svg.append("path")
            .datum(dataset)
            .attr("class", "line")
            .attr("d", line);

        // Append x-axis
        svg.append("g")
            .attr("transform", "translate(0," + (h - padding) + ")")
            .call(d3.axisBottom(xScale).ticks(5));

        // Append y-axis
        svg.append("g")
            .attr("transform", "translate(" + padding + ",0)")
            .call(d3.axisLeft(yScale));

        // Add annotation for 500,000 unemployed
        svg.append("line")
            .attr("class", "halfMilMark")
            .attr("x1", padding)
            .attr("x2", w - padding)
            .attr("y1", yScale(500000))
            .attr("y2", yScale(500000))
            .attr("stroke", "red")
            .attr("stroke-dasharray", "5,5");

        svg.append("text")
            .attr("x", padding + 10)
            .attr("y", yScale(500000) - 5)
            .attr("class", "halfMilLabel")
            .text("Half a million unemployed");

        // Convert the line chart into an area chart
        var area = d3.area()
            .x(function(d) { return xScale(d.date); })
            .y0(function() { return yScale.range()[0]; }) // Baseline of the area chart (0)
            .y1(function(d) { return yScale(d.number); }); // Data points

        svg.append("path")
            .datum(dataset)
            .attr("class", "area")
            .attr("d", area)
            .attr("fill", "lightsteelblue")
            .attr("opacity", 0.6);
    }
}

window.onload = init;
