function makeDayBins(data) {
    let dayBins = {
        mon: [],
        tue: [],
        wed: [],
        thu: [],
        fri: [],
        sat: [],
        sun: []
    };

    data.forEach(function(d) {
        switch (d.Date.getDay()) {
            case 1: dayBins.mon.push(d); break;
            case 2: dayBins.tue.push(d); break;
            case 3: dayBins.wed.push(d); break;
            case 4: dayBins.thu.push(d); break;
            case 5: dayBins.fri.push(d); break;
            case 6: dayBins.sat.push(d); break;
            case 0: dayBins.sun.push(d); break;
            default: break;
        }
    });

    return dayBins;
}

function makeMonthBins(data) {
    let monthBins = [
        { month: "Jan", data: [] },
        { month: "Feb", data: [] },
        { month: "Mar", data: [] },
        { month: "Apr", data: [] },
        { month: "May", data: [] },
        { month: "Jun", data: [] },
        { month: "Jul", data: [] },
        { month: "Aug", data: [] },
        { month: "Sep", data: [] },
        { month: "Oct", data: [] },
        { month: "Nov", data: [] },
        { month: "Dec", data: [] }
    ];
    data.forEach(function(d) {
        let m = d.Date.getMonth();
            monthBins[m].data.push(d);
            monthBins[m].index = m;
    });

    return monthBins;
}

function makeYearBins(data) {
    const minYear = d3.min(data, d => d.Date.getFullYear());
    const maxYear = d3.max(data, d => d.Date.getFullYear());
    let yearBins = [];
    for (let i = 0; i <= maxYear - minYear; i++){
        yearBins.push({year: i, data: []});
    }
    data.forEach(function(d) {
        let y = d.Date.getFullYear();
        yearBins[y - minYear].data.push(d);
    });

    return yearBins;
}