import './styles/style.css'

var all_data, pivot_data, svg, x, y

var line = d3.line()

var margin = { top: 20, right: 30, bottom: 50, left: 30 },
    width = $("#graph").outerWidth() - margin.left - margin.right,
    height = $('#graph').outerHeight() - margin.top - margin.bottom;

// data source: https://www.federalreserve.gov/releases/efa/efa-distributional-financial-accounts.htm
d3.csv('data/dfa-age-shares.csv')
    .then(function (data) {
        data.forEach(function (d) {
            var origdate = d.Date
            d.Date = d3.timeParse('%Y-%m')(origdate.slice(0, 4) + '-' + String(3 * origdate.slice(-1)))
        })

        all_data = data;
        pivot_data = d3.nest()
            .key(d => d.Category)
            .key(d => d.Date)
            .rollup(function (leaves) { return { 'total': d3.sum(leaves, d => d.Assets) } })
            .entries(data);

    })


setTimeout(function () {

    // set the ranges
    x = d3.scaleBand()
        .range([0, width])
        .domain(pivot_data.map(d => d.key));

    y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(pivot_data.map(function (d) { return d3.max(d.values.map(e => e.value.total)) }))])

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    svg = d3.select("#graph").append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // svg.selectAll(".bar")
    //     .data(data)
    //     .enter().append("rect")
    //     .attr("class", "bar")
    //     .attr("x", (d, i) => x(i))
    //     .attr("width", x.bandwidth())
    //     .attr("y", d => y(d))
    //     .attr("height", function (d) { return height - y(d); });

    svg.append('g')
        .selectAll('.dot')
        .data(pivot_data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('r', 5)
        .style('fill', d3.interpolateRdYlGn(0))
        // .style('fill', '#440154')
        .attr('cx', d => x(d.key) + x.bandwidth() / 2)
        .attr('cy', d => y(d.values[0].value.total))

    svg.append('path')
        .datum(pivot_data)
        .attr('class', 'line')
        .attr('d', d3.line()
            .x(d => x(d.key) + x.bandwidth() / 2)
            .y(d => y(d.values[0].value.total))
        )
        .style('fill', 'none')
        .style('stroke', d3.interpolateRdYlGn(0))
        .style('stroke-width', '2px')
        .style('opacity', 0.5)

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



}, 2000)


$(document).keydown(e => {

    console.log(e.which)

    var isNext = $.inArray(e.which, window.keys.next) > -1;
    var isPrev = $.inArray(e.which, window.keys.previous) > -1;

    if (isNext) {
        console.log('here')

        function doSetTimeout(i) {
            setTimeout(function () {
                svg.append('path')
                    .datum(pivot_data)
                    .attr('class', 'line')
                    .attr('d', d3.line()
                        .x(d => x(d.key) + x.bandwidth() / 2)
                        .y(d => y(d.values[i].value.total))
                    )
                    .style('fill', 'none')
                    .style('stroke', d3.interpolateRdYlGn(i/120))
                    .style('stroke-width', '2px')
                    .style('opacity', 1)

                svg.selectAll('.dot')
                    .attr('cy', d => y(d.values[i].value.total))
                    .style('fill', d3.interpolateRdYlGn(i/120))

                // svg.selectAll('.line').transition().delay(i * 100)
                //     .attr('d', d3.line()
                //         .x(d => x(d.key) + x.bandwidth() / 2)
                //         .y(d => y(d.values[i].value.total))
                //     )

                svg.selectAll('.line').transition()
                    .style('opacity', function (d) { return this.style.opacity * 0.9 })

            }, i * 100);
        }

        for (var i = 1; i < 120; i++) {
            doSetTimeout(i);
        }
    }

    if (isPrev) {
        console.log('here instead')
    }

})