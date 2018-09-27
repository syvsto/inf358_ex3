function parseData(data) {
    let parseTime = d3.timeParse("%d/%m/%Y");
    data.forEach(function (d) {
        d.Date = parseTime(d.Date);
        d.TAM = parseFloat(d.TAM);
        d.TAN = parseFloat(d.TAN);
        d.TA1 = parseFloat(d.TA1);
        d.POM = parseFloat(d.POM);
        d.PON = parseFloat(d.PON);
        d.POX = parseFloat(d.POX);
        d.PRM = parseFloat(d.PRM);
        d.PRN = parseFloat(d.PRN);
        d.PRX = parseFloat(d.PRX);
        d.RR = parseFloat(d.RR);
        d.SA = parseFloat(d.SA);
        d.SD = parseInt(d.SD);
        d.SLAG = parseInt(d.SLAG);
    });
    return data;
}