function displayDayPlot(data) {
    let x = d3.scaleLinear()
        .rangeRound([0, width])
        .domain([0,data.data.length]);

    var y = d3.scaleLinear()
        .domain([d3.min(data.data, d => d.POM) - resolution, d3.max(data.data, d => d.POM) + resolution])
        .rangeRound([height, 0]);

    var xAxis = d3.axisBottom()
        .scale(x)
        .tickSize(0);

    var yAxis = d3.axisLeft()
        .scale(y)
        .tickSize(3, 0);

    let line = d3.line()
        .x(function(d, i) { return x(i); })
        .y(function(d) { return y(d.POM) });
    let upperBoundLine = d3.line()
        .x(function(d, i) { return x(i); })
        .y(function(d) { return y(d.POX) });
    let lowerBoundLine = d3.line()
        .x(function(d, i) { return x(i); })
        .y(function(d) { return y(d.PON) });

    let svg = d3.select("body").append("svg")
        .attr("class", "daily")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
        .attr("transform",
            "translate(" + (width/2) + " ," +
            (height + margin.top + 10) + ")")
        .style("text-anchor", "middle")
        .text("Day");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Air Pressure");

    svg.append("g")
        .attr("class", "xAxisDaily")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "yAxisDaily")
        .call(yAxis)
        .append("text")
        .attr("class", "title")
        .attr("y", -5)
        .style("text-anchor", "middle")
        .text("POM");

    svg.append("path")
        .datum(data.data)
        .attr("class", "line")
        .attr("d", line);
    svg.append("path")
        .datum(data.data)
        .attr("class", "lowerBoundLine")
        .attr("d", lowerBoundLine);
    svg.append("path")
        .datum(data.data)
        .attr("class", "upperBoundLine")
        .attr("d", upperBoundLine);
}

function updateDayPlot(data) {
    let x = d3.scaleLinear()
        .rangeRound([0, width])
        .domain([0,data.data.length]);

    var y = d3.scaleLinear()
        .domain([d3.min(data.data, d => d.POM) - resolution, d3.max(data.data, d => d.POM) + resolution])
        .rangeRound([height, 0]);

    var xAxis = d3.axisBottom()
        .scale(x)
        .tickSize(0);

    var yAxis = d3.axisLeft()
        .scale(y)
        .tickSize(3, 0);

    let line = d3.line()
        .x(function(d, i) { return x(i); })
        .y(function(d) { return y(d.POM) });
    let upperBoundLine = d3.line()
        .x(function(d, i) { return x(i); })
        .y(function(d) { return y(d.POX) });
    let lowerBoundLine = d3.line()
        .x(function(d, i) { return x(i); })
        .y(function(d) { return y(d.PON) });

    d3.selectAll(".xAxisDaily")
        .transition()
        .call(xAxis);
    d3.selectAll(".yAxisDaily")
        .transition()
        .call(yAxis);

    let svg = d3.select(".daily").transition();
    svg.select(".line")
        .attr("d", line(data.data));
    svg.select(".lowerBoundLine")
        .attr("d", lowerBoundLine(data.data));
    svg.select(".upperBoundLine")
        .attr("d", upperBoundLine(data.data));
}
