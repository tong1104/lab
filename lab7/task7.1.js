function init() {
    var w = 600;
    var h = 300;
    
    var dataset
    d3.csv("unemployment.csv", function(d){
        return{
            date: new Date(+d.year, +d.month-1),
            number: +d.number
        };
    })

    
}

window.onload = init;
