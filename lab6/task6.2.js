function init() {
    var w = 600;
    var h = 300;
    var barPadding = 3;
    var maxValue = 25; // Maximum value for randomly generated data

    var dataset = [24, 10, 29, 19, 8, 15, 20, 12, 9, 6, 21, 28];
    var isAscending = true; // Variable to track sort direction

    // yScale is used to scale the bar heights based on dataset values
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset) + 5])
        .range([0, h]);

    // Append the SVG element to the body, which will contain the chart
    var svg1 = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h + 50);

    // Function to update the bars and value labels whenever data changes
    function updateBars() {
        // Update yScale for new data
        yScale.domain([0, d3.max(dataset) + 5]);

        // Bind data to rectangles (bars)
        var bars = svg1.selectAll("rect")
            .data(dataset);

        bars.enter()
            .append("rect")
            .merge(bars)
            .attr("x", function (d, i) {
                return i * (w / dataset.length);
            })
            .attr("y", function (d) {
                return h - yScale(d);
            })
            .attr("width", w / dataset.length - barPadding)
            .attr("height", function (d) {
                return yScale(d);
            })
            .attr("fill", function (d) {
                return "rgb(0, 0, " + Math.round(d * 10) + ")";
            })
            // Mouseover event to change color and display value inside the bar
            .on("mouseover", function (event, d) {
                d3.select(this) // Select the current bar
                    .attr("fill", "orange");

                var xPosition = parseFloat(d3.select(this).attr("x")) + (w / dataset.length - barPadding) / 2; // Center the value
                var yPosition = h - yScale(d) + (yScale(d) / 2); // Center vertically in the bar

                svg1.append("text")
                    .attr("class", "valueLabelInside")
                    .attr("x", xPosition)
                    .attr("y", yPosition)
                    .attr("text-anchor", "middle")
                    .attr("font-family", "sans-serif")
                    .attr("font-weight", "bold")
                    .attr("fill", "white")
                    .text(d);  // Show the correct data point
            })
            .on("mouseout", function (event, d) {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr("fill", function (d) {
                        return "rgb(0, 0, " + Math.round(d * 10) + ")";
                    });

                d3.selectAll(".valueLabelInside").remove(); // Remove the tooltip
            });
        };

    

    // Function to sort bars
    var sortBars = function () {
        // Sort the dataset based on current direction
        dataset.sort(isAscending ? d3.ascending : d3.descending);

        // Update bars with new x values based on sorted dataset
        svg1.selectAll("rect")
            .sort(function (a, b) { 
                return (isAscending ? d3.ascending(a, b) : d3.descending(a, b)); }) // Sort bars
            .transition() // Add transition for sorting
            .duration(750) // Duration for the transition
            .attr("x", function (d, i) {
                return i * (w / dataset.length); // Update x based on new sorted order
            });


        svg1.selectAll("text.bar-label")
            .transition()
            .duration(750) // Duration for the transition
            .attr("x", function (d, i) {
                return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2; // Update x position for labels
            });
    };

    // Function to add a new value
    function addValue() {
        var newNumber = Math.floor(Math.random() * maxValue);
        dataset.push(newNumber);
        updateBars();
    }

    // Function to remove the first value
    function removeValue() {
        dataset.shift(); // Remove the first element
        updateBars(); // Update remaining bars
    }

    // Button click events
    d3.select("#add").on("click", function () {
        addValue();
    });

    d3.select("#remove").on("click", function () {
        removeValue();
    });

    d3.select("#sort").on("click", function () {
        sortBars(); // Call the sort function
        isAscending = !isAscending; // Sorting direction
    });

    // Initialize the chart
    updateBars();
   
}
window.onload = init;
