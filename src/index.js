import './styles/style.css'


var margin = { top: 20, right: 30, bottom: 50, left: 30 },
    width = $("#graph").outerWidth() - margin.left - margin.right,
    height = $('#graph').outerHeight() - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);
var y = d3.scaleLinear()
    .range([height, 0]);

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#graph").append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


var data = [2, 3, 4, 5, 6, 3]


x.domain(data.map((d, i) => i))
y.domain([0, d3.max(data, d => d)])

svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", (d, i) => x(i))
    .attr("width", x.bandwidth())
    .attr("y", d => y(d))
    .attr("height", function (d) { return height - y(d); });

// add the x Axis
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

// add the y Axis
svg.append("g")
    .call(d3.axisLeft(y));


window.keys = {
    next: [39, 32, 33],
    previous: [37, 34]
}

$(document).keydown(e => {

    console.log(e.which)

    var isNext = $.inArray(e.which, window.keys.next) > -1;
    var isPrev = $.inArray(e.which, window.keys.previous) > -1;

    if (isNext) {
        console.log('here')
    }

    if (isPrev) {
        console.log('here instead')
    }

})