var calendarWidth = 960,
    calendarHeight = 136,
    cellSize = 17;
function displayCalendarView(data, year) {
    year = parseInt(year);
    data.forEach(m => m.data = m.data.filter(d => d.Date.getFullYear() === year));

    let dailyPOM = [];
    for (let i = 0; i < data.length; i++) {
        data[i].data.forEach(d => dailyPOM.push(d));
    }
    console.log(dailyPOM);

    var colors = d3.scaleQuantize()
        .domain([d3.min(data, d => d3.min(d.data, m => m.POM)), d3.max(data, d => d3.max(d.data, m => m.POM))])
        .range(["#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4"]);

    var svg = d3.select("body")
        .select("svg")
        .data(d3.range(year - 1, year + 1))
        .enter()
        .append("svg")
        .attr("class", "calendarView")
        .attr("width", calendarWidth)
        .attr("height", calendarHeight)
        .append("g")
        .attr("transform", "translate(" + ((calendarWidth - cellSize * 53) / 2) + "," + (calendarHeight - cellSize * 7 - 1) + ")");
    svg.append("text")
        .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "middle")
        .text(function(d) { return d; });

    var rect = svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .selectAll("rect")
        .data(function (d) {
            return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        })
        .enter()
        .append("rect")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function (d) {
            return d3.timeWeek.count(d3.timeYear(d), d) * cellSize;
        })
        .attr("y", function (d) {
            return d.getDay() * cellSize;
        })
        .datum(d3.timeFormat("%Y-%m-%d"));

    svg.append("g")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .selectAll("path")
        .data(function (d) {
            return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1));
        })
        .enter().append("path")
        .attr("d", pathMonth);

    rect.data(dailyPOM).attr("fill", function(d) {return colors(d.POM)});
}

function pathMonth(t0) {
    var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
        d0 = t0.getDay(), w0 = d3.timeWeek.count(d3.timeYear(t0), t0),
        d1 = t1.getDay(), w1 = d3.timeWeek.count(d3.timeYear(t1), t1);
    return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
        + "H" + w0 * cellSize + "V" + 7 * cellSize
        + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
        + "H" + (w1 + 1) * cellSize + "V" + 0
        + "H" + (w0 + 1) * cellSize + "Z";
}
