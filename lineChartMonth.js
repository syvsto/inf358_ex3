let displayingDaily = false;

const margin = { top: 20, right: 20, bottom: 40, left: 50 },
    width = 800 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

function handleMouseOver(d, i) {
    d3.select(this).attr("fill-opacity", "0.3");
    d3.select(this).attr("stroke-opacity", "0.3");
}

function handleMouseOut(d, i) {
    d3.select(this).attr("fill-opacity", "0.0");
    d3.select(this).attr("stroke-opacity", "0.0");
}

function handleMouseClick(d, i) {
    if (!displayingDaily) {
        displayingDaily = true;
        displayDayPlot(d);
    } else {
        updateDayPlot(d);
    }
}

function displayMonthPlot(data, year) {
    year = parseInt(year);
    data.forEach(m => m.data = m.data.filter(d => d.Date.getFullYear() === year));
    data.forEach(function(d) {
        d.average = d3.mean(d.data, function(d) {  return d.POM; });
    });

    var x = d3.scaleBand()
        .rangeRound([0, width])
        .domain([0,1,2,3,4,5,6,7,8,9,10,11]);

    var xNames = d3.scaleBand()
        .rangeRound([0, width])
        .domain(['Jan','Feb','Mar','Apr','May','Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);

    var intraDayX = d3.scaleLinear()
        .domain([ 0, d3.max(data, d => d.data.length)])
        .range([0, x.bandwidth()]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);
    y.domain([d3.min(data, d => d3.min(d.data, c => c.POM)) - resolution, d3.max(data, d => d3.max(d.data, c => c.POM)) + resolution]);
    var xAxis = d3.axisBottom()
        .scale(xNames)
        .tickSize(0);
    var yAxis = d3.axisLeft()
        .scale(y)
        .tickSize(3, 0);
    var line = d3.line()
        .x(function(d, i) { return intraDayX(i); })
        .y(function(d) { return y(d.POM) });


    var svg = d3.select("body").append("svg")
        .attr("class", "yearly")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
        .attr("transform",
            "translate(" + (width/2) + " ," +
            (height + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Month");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Air Pressure (average for day)");


    svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "yAxis")
        .call(yAxis)
        .append("text")
        .attr("class", "title")
        .attr("y", -5)
        .style("text-anchor", "middle")
        .text("POM");
    var months = svg.selectAll(".day")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "day")
        .attr("transform", function(d, i) { return "translate(" + x(i) + ",0)"; });
    months.append("line")
        .attr("class", "mean")
        .attr("x1", 0)
        .attr("y1", function(d) { return y(d.average); })
        .attr("x2", x.bandwidth())
        .attr("y2", function(d) { return y(d.average); });



    months.append("rect")
        .attr("class", "hoverbox")
        .attr("fill-opacity", "0.0")
        .attr("stroke-opacity", "0.0")
        .attr("x", 0)
        .attr("width", x.bandwidth())
        .attr("y", 0)
        .attr("height", height)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .on("click", handleMouseClick);

    months.append("path")
        .datum( function(d) { return d.data; })
        .attr("class", "line")
        .attr("d", line);
}

function updateMonthPlot(data, year) {
    year = parseInt(year);
    data.forEach(m => m.data = m.data.filter(d => d.Date.getFullYear() === year));
    data.forEach(function(d) {
        d.average = d3.mean(d.data, function(d) {  return d.POM; });
    });

    var x = d3.scaleBand()
        .rangeRound([0, width])
        .domain([0,1,2,3,4,5,6,7,8,9,10,11]);

    var xNames = d3.scaleBand()
        .rangeRound([0, width])
        .domain(['Jan','Feb','Mar','Apr','May','Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);

    var intraDayX = d3.scaleLinear()
        .domain([ 0, d3.max(data, d => d.data.length)])
        .range([0, x.bandwidth()]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0])
        .domain([d3.min(data, d => d3.min(d.data, c => c.POM)) - resolution, d3.max(data, d => d3.max(d.data, c => c.POM)) + resolution]);

    let xAxis = d3.axisBottom()
        .scale(xNames)
        .tickSize(0);
    let yAxis = d3.axisLeft()
        .scale(y)
        .tickSize(3, 0);
    var line = d3.line()
        .x(function(d, i) { return intraDayX(i); })
        .y(function(d) { return y(d.POM) });

    var svg = d3.select(".yearly");

    d3.selectAll(".xAxisj")
        .transition()
        .call(xAxis);
    d3.selectAll(".yAxis")
        .transition()
        .call(yAxis);

    var months = svg.selectAll(".day")
        .data(data);
    months.enter()
        .append("g")
        .attr("transform", function(d, i) { return "translate(" + x(i) + ",0)"; });

    months.select("path")
        .exit().remove();

    months.select("path")
        .datum( function(d) { return d.data; })
        .transition()
        .attr("class", "line")
        .attr("d", line);

    months.select("line")
        .transition()
        .attr("x1", 0)
        .attr("y1", function(d) { return y(d.average); })
        .attr("x2", x.bandwidth())
        .attr("y2", function(d) { return y(d.average); });

    months.append("rect")
        .attr("class", "hoverbox")
        .attr("fill-opacity", "0.0")
        .attr("stroke-opacity", "0.0")
        .attr("x", 0)
        .attr("width", x.bandwidth())
        .attr("y", 0)
        .attr("height", height)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .on("click", handleMouseClick);
}

