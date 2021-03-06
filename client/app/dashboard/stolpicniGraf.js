function StolpicniGraf(pos, data) {

  var n = 2,
    m = 48,
    stack = d3.layout.stack(),
    layers = podatkiVgraf(data);

  yGroupMax = d3.max(layers, function (layer) {
    return d3.max(layer, function (d) {
      return d.y;
    });
  }),
    yStackMax = d3.max(layers, function (layer) {
      return d3.max(layer, function (d) {
        return d.y0 + d.y;
      });
    });

  var margin = {top: 20, right: 0, bottom: 20, left: 20},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // X časovna os
  var xLabels = [];
  var sedaj = new Date();
  for (i = 0; i <= 47; i++) {
    var t = new Date(sedaj - i * 1800000);
    if (i % 2 === 0) {
      var xCas = new Date(sedaj - i * 1800000);
      xLabels.push(("0" + xCas.getHours()).slice(-2) + ":" + ("0" + xCas.getMinutes()).slice(-2));
    } else {
      xLabels.push("");
    }
  }
  xLabels.reverse();

  var x = d3.scale.ordinal()
    .domain(d3.range(m))
    .rangeRoundBands([0, width], .3);

  var y = d3.scale.linear()
    .domain([0, yStackMax])
    .range([height, 0]);

  var color = d3.scale.linear()   // nastavitve barve
    .domain([0, n - 1])
    .range(["#C45454", "#82AFC5"]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(function (d) {
      return xLabels[d];
    })
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .tickSize(0)
    .tickPadding(6)
    .orient("left");

  var svg = d3.select(pos).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var layer = svg.selectAll(".layer")
    .data(layers)
    .enter().append("g")
    .attr("class", "layer")
    .style("fill", function (d, i) {
      return color(i);
    });

  var rect = layer.selectAll("rect")
    .data(function (d) {
      return d;
    })
    .enter().append("rect")
    .attr("x", function (d) {
      return x(d.x); // tole vrne x os
    })
    .attr("y", height)
    .attr("width", x.rangeBand())
    .attr("height", 0);

  rect.transition()
    .delay(function (d, i) {
      return i * 10;
    })
    .attr("y", function (d) {
      return y(d.y0 + d.y);
    })
    .attr("height", function (d) {
      return y(d.y0) - y(d.y0 + d.y);
    });

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  function transitionGrouped() {
    y.domain([0, yGroupMax]);

    var yAxis2 = d3.svg.axis()
      .scale(y)
      .tickSize(0)
      .tickPadding(6)
      .orient("left");

    svg.append("g")
      .attr("class", "yaxis")
      .call(yAxis2);

    rect.transition()
      .duration(500)
      .delay(function (d, i) {
        return i * 10;
      })
      .attr("x", function (d, i, j) {
        return x(d.x) + x.rangeBand() / n * j;
      })
      .attr("width", x.rangeBand() / n)
      .transition()
      .attr("y", function (d) {
        return y(d.y);
      })
      .attr("height", function (d) {
        return height - y(d.y);
      });
  }

  function razlikaCasov($cas1, $cas2) {
    var datum1 = new Date($cas1);
    var datum2 = new Date($cas2);
    var razlika = Math.abs(datum1 - datum2) * 1.66666667 * Math.pow(10, -5);
    return razlika;
  }

  function urediCas(casi) {
    var vrni = new Array();
    var currentDate = new Date();

    casi.forEach(function (date) {
      var preteklicCas = razlikaCasov(currentDate, date);
      if (preteklicCas <= 1440) { // 1440 je minut v dnevu
        vrni.push([preteklicCas, date]);
      }
    });
    return vrni;
  }

  function podatkiVgraf(data) {
    var checkOut24 = urediCas(data.checkoutTimers);
    var checkIn24 = urediCas(data.checkinTimers);

    var checkOutDict = [];
    var checkInDict = [];

    for (j = 0; j < 48; j++) {
      checkOutDict.push({x: j, y: 0, y0: 0});
      checkInDict.push({x: j, y: 0, y0: 0});
    }

    for (i = 0; i < checkOut24.length; i++) {
      var xos = 47 - Math.round((parseInt(checkOut24[i][0]) / 30)); // zrcali
      for (j = 0; j < checkOutDict.length; j++) {
        if (checkOutDict[j].x === xos) {
          checkOutDict[j].y += 1;
          checkInDict[j].y0 += 1;
        }
      }
    }
    for (i = 0; i < checkIn24.length; i++) {
      var xos = 47 - Math.round((parseInt(checkIn24[i][0]) / 30));
      for (j = 0; j < checkInDict.length; j++) {
        if (checkInDict[j].x === xos) {
          checkInDict[j].y += 1;
        }
      }
    }
    return [checkOutDict, checkInDict];
  }

  transitionGrouped();
}
