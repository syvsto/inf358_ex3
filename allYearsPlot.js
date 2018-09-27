let allYearsUsingMean = true;

let displayAllYearsPlot = function (data) {
    // Data-independent declarations
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Get all monthly averages across all years
    data.forEach(function(d) {
        d.data.forEach(function(m) {
            m.average = d3.mean(m.data, function(d) {  return d.POM; });
        });
    });

    let monthlyAverages = [];
    for(let i = 0; i < monthNames.length; i++) {
        monthlyAverages.push({ month: monthNames[i], data: []});
    }

    data.forEach(function(d) {
        d.data.forEach(function(m) {
            monthlyAverages[m.index].data.push({ avg: m.average, year: d.year });
        });
    });

    monthlyAverages.forEach(d => d.data.sort(function(a, b) {
        return d3.ascending(a.avg, b.avg);
    }));
    monthlyAverages.forEach(function(d) {
        d.minYear = d.data[0].year;
        d.maxYear = d.data[d.data.length - 1].year;
    });

    monthlyAverages.forEach(function(d) {
        d.data = d.data.map(a => a.avg);
    });

    monthlyAverages.forEach(function (d) {
        d.mode = mode(d.data);
        d.mean = d3.mean(d.data);
        d.max = d3.max(d.data);
        d.min = d3.min(d.data);
        d.lowerQuartile = d3.quantile(d.data, 0.25);
        d.middleQuartile = d3.quantile(d.data, 0.5);
        d.upperQuartile = d3.quantile(d.data, 0.75);
    });


    // Set up ranges and other datadependent varialbes

    var x = d3.scaleBand()
        .rangeRound([0, width])
        .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

    var xNames = d3.scaleBand()
        .rangeRound([0, width])
        .domain(monthNames);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);
    var xAxis = d3.axisBottom()
        .scale(xNames)
        .tickSize(0);
    var yAxis = d3.axisLeft()
        .scale(y)
        .tickSize(3, 0);
    var svg = d3.select("body").append("svg")
        .attr("class", "allYearAvg")
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

    let totalMin = d3.min(monthlyAverages, d => d.min) - resolution;
    let totalMax = d3.max(monthlyAverages, d => d.max) + resolution;
    y.domain([totalMin, totalMax]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("class", "title")
        .attr("y", -5)
        .style("text-anchor", "middle")
        .text("POM");
    var months = svg.selectAll(".month")
        .data(monthlyAverages)
        .enter()
        .append("g")
        .attr("class", "month")
        .attr("transform", function (d, i) {
            return "translate(" + x(i) + ",0)";
        });
    months.append("rect")
        .attr("class", "allYearsRect")
        .attr("x", 0)
        .attr("y", function (d) {
            return y(d.upperQuartile);
        })
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
            return y(d.lowerQuartile) - y(d.upperQuartile);

        });
    months.append("line")
        .attr("class", "outlierLine")
        .attr("x1", 0)
        .attr("y1", d => y(d.middleQuartile))
        .attr("x2", x.bandwidth())
        .attr("y2", d => y(d.middleQuartile));
    months.append("line")
        .attr("class", "outlierLine")
        .attr("x1", 0)
        .attr("y1", d => y(d.min))
        .attr("x2", x.bandwidth())
        .attr("y2", d => y(d.min));
    months.append("line")
        .attr("class", "outlierLine")
        .attr("x1", 0)
        .attr("y1", d => y(d.max))
        .attr("x2", x.bandwidth())
        .attr("y2", d => y(d.max));
    months.append("line")
        .attr("class", "meanExtra")
        .attr("x1", 0)
        .attr("y1", function(d) {
            if (allYearsUsingMean) {
                return y(d.mean);
            } else {
                return y(d.mode);
            }
        })
        .attr("x2", x.bandwidth())
        .attr("y2", function(d) {
            if (allYearsUsingMean) {
                return y(d.mean);
            } else {
                return y(d.mode);
            }
        });
    months.append("text")
        .attr("x", 0)
        .attr("y", d => y(d.min) + 15)
        .text( y => y.minYear + 2000);
    months.append("text")
        .attr("x", 0)
        .attr("y", d => y(d.max) - 5)
        .text( y => y.maxYear + 2000);
};

// Code from: http://bl.ocks.org/zikes/4285872
function mode(arr) {
    var counts = {};
    for (var i = 0, n = arr.length ; i < n ; i++) {
        arr[i] = Math.floor(arr[i]);
        if (counts[arr[i]] === undefined)
            counts[arr[i]] = 0;
        else
            counts[arr[i]]++;
    }
    var highest;
    for (var number in counts) {
        if (counts.hasOwnProperty(number)) {
            if (highest === undefined || counts[number] > counts[highest])
                highest = number;
        }
    }
    return Number(highest);
}
