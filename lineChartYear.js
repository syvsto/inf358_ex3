const yearheight = 200
    , yearwidth = window.innerWidth - 80;

function handleYearMouseClick(d, i) {
    currentYear = d.year + 2000;
    updatePlot(data);
}

function displayYearPlot(data) {
    const minYear = data[0].year;
    const maxYear = data[data.length-1].year;

    let yearArray = [];
    let yearNameArray = [];
    for (let i = 0; i <= maxYear; i++) {
        yearArray.push(i);
        yearNameArray.push(2000 + i);
    }

    data.forEach(function(d) {
        d.average = d3.mean(d.data, function(d) {  return d.POM; });
    });

    var x = d3.scaleBand()
        .rangeRound([0, yearwidth])
        .domain(yearArray);
    var xNames = d3.scaleBand()
        .rangeRound([0, yearwidth])
        .domain(yearNameArray);

    var intraDayX = d3.scaleLinear()
        .domain([ 0, d3.max(data, d => d.data.length)])
        .range([0, x.bandwidth()]);

    var y = d3.scaleLinear()
        .rangeRound([yearheight, 0]);
    var xAxis = d3.axisBottom()
        .scale(xNames)
        .tickSize(0);
    var yAxis = d3.axisLeft()
        .scale(y)
        .tickSize(3, 0);
    var line = d3.line()
        .x(function(d, i) { return intraDayX(i); })
        .y(function(d) { return y(d.POM) });

    y.domain([d3.min(data, d => d3.min(d.data, c => c.POM)) - 25, d3.max(data, d => d3.max(d.data, c => c.POM)) + 25]);

    var svg = d3.select("body").append("svg")
        .attr("class", "allYears")
        .attr("width", yearwidth + margin.left + margin.right)
        .attr("height", yearheight + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
        .attr("transform",
            "translate(" + (yearwidth/2) + " ," +
            (yearheight + margin.top + 20) + ")")
        .style("text-anchor", "middle")
        .text("Year");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (yearheight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Air Pressure (average for day)");


    svg.append("g")
        .attr("class", "x axis year")
        .attr("transform", "translate(0," + yearheight + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "y axis year")
        .call(yAxis)
        .append("text")
        .attr("class", "title")
        .attr("y", -5)
        .style("text-anchor", "middle")
        .text("POM");
    var months = svg.selectAll(".month")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "month")
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
        .attr("height", yearheight)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .on("click", handleYearMouseClick);

    months.append("path")
        .datum( function(d) { return d.data; })
        .attr("class", "line")
        .attr("d", line);
}

function updateYearPlot(data, year) {
    year = parseInt(year);
    data.forEach(m => m.data = m.data.filter(d => d.Date.getFullYear() === year));
    data.forEach(function(d) {
        d.average = d3.mean(d.data, function(d) {  return d.POM; });
    });

    var x = d3.scaleBand()
        .rangeRound([0, yearwidth])
        .domain([0,1,2,3,4,5,6,7,8,9,10,11]);

    var xNames = d3.scaleBand()
        .rangeRound([0, yearwidth])
        .domain(['Jan','Feb','Mar','Apr','May','Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']);

    var intraDayX = d3.scaleLinear()
        .domain([ 0, d3.max(data, d => d.data.length)])
        .range([0, x.bandwidth()]);

    var y = d3.scaleLinear()
        .rangeRound([yearheight, 0]);
    var xAxis = d3.axisBottom()
        .scale(xNames)
        .tickSize(0);
    var yAxis = d3.axisLeft()
        .scale(y)
        .tickSize(3, 0);
    var line = d3.line()
        .x(function(d, i) { return intraDayX(i); })
        .y(function(d) { return y(d.POM) });

    y.domain([d3.min(data, d => d3.min(d.data, c => c.POM)) - 25, d3.max(data, d => d3.max(d.data, c => c.POM)) + 25]);


    var svg = d3.select(".allYears");

    svg.select(".x axis year")
        .transition()
        .duration(500)
        .call(xAxis);
    svg.select(".y axis year")
        .transition()
        .duration(500)
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
        .duration(500)
        .attr("class", "line")
        .attr("d", line);

    months.select("line")
        .transition()
        .duration(500)
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
        .attr("height", yearheight)
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .on("click", handleYearMouseClick);
}
