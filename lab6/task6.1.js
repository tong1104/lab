function init() {
        var w = 600;
        var h = 300;
        var barPadding = 3;
        var maxValue = 25; // Maximum value for randomly generated data

        var dataset = [24, 10, 29, 19, 8, 15, 20, 12, 9, 6, 21, 28];

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

            // Enter new bars and update all bars
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
                // Mouseout event to reset color and remove value label
                .on("mouseout", function (event, d) {
                    d3.select(this) // Select the current bar
                        .transition()
                        .duration(500)
                        .attr("fill", function (d) {
                            return "rgb(0, 0, " + Math.round(d * 10) + ")"; // Reset color based on data value
                        });

                    d3.selectAll(".valueLabelInside").remove(); // Remove the tooltip
                });

            // Update the labels above the bars
            var text = svg1.selectAll("text.bar-label")
                .data(dataset); // Bind the dataset to text elements

            // Enter new labels
            var textEnter = text.enter()
                .append("text")
                .attr("class", "bar-label")
                .attr("text-anchor", "middle")
                .attr("font-family", "sans-serif")
                .attr("font-weight", "bold")
                .attr("fill", "black");

            // Update the text positions and values
            textEnter.merge(text)
                .attr("x", function (d, i) {
                    return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2;
                })
                .attr("y", function (d) {
                    return h - yScale(d) - 5; // Position just above the bar
                })
                .text(function (d) {
                    return d; // Show the corresponding value
                });

            // Exit selection for bars that are no longer in the data
            bars.exit()
                .transition()
                .duration(500)
                .attr("x", w)
                .remove();
            
            // Exit selection for text labels that are no longer in the data
            text.exit()
                .transition()
                .duration(500)
                .remove();
        }

        // Function to add a new value
        function addValue() {
            var newNumber = Math.floor(Math.random() * maxValue); // Generate a random number
            dataset.push(newNumber); // Add the new number to the dataset
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

        // Initialize the chart
        updateBars();
}
window.onload = init;
