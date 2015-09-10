function Bubble(output, data) {

    //var w = window.innerWidth * 0.68 * 0.95;
    //var h = Math.ceil(w * 0.7);
    var w = 600;
    var h = 500;
    var oR = 0;
    var nTop = 0;

    var svgContainer = d3.select(output)
        .style("height", h + "px");

    var svg = d3.select(output).append("svg") // shranim v div ID #mainBubble
        .attr("class", "mainBubbleSVG")
        .attr("width", w)
        .attr("height", h)
        .on("mouseleave", function () {
            return resetBubbles();
        });

    var mainNote = svg.append("text")
        .attr("id", "bubbleItemNote")
        .attr("x", 10)
        .attr("y", w / 2 - 15)
        .attr("font-size", 50)
        .attr("dominant-baseline", "middle")
        .attr("alignment-baseline", "middle")
        .style("fill", "#888888");

    var freeCars = data.prostiSmart + data.prostiZoe;
    var reservedCars = data.reservedSmart + data.reservedZoe;
    var chargingCars = data.polnjenjeSmart + data.polnjenjeZoe

    var root = {
        "name": "bubbnle", "children": [
            {
                "name": data.avtomobili - freeCars - reservedCars - chargingCars + " Parked",
                "children": []
            },
            {
                "name": freeCars + " Free",
                "children": [
                    {"name": data.prostiSmart + " Smart ED"},
                    {"name": data.prostiZoe + " Zoe"}
                ]
            },
            {
                "name": reservedCars + " Reserved",
                "children": [
                    {"name": data.reservedSmart + " Smart ED"},
                    {"name": data.reservedZoe + " Zoe"}
                ]
            },
            {
                "name": chargingCars + " Charging",
                "children": [
                    {"name": data.polnjenjeSmart + " Smart ED"},
                    {"name": data.polnjenjeZoe + " Zoe"}
                ]
            }
        ]
    };

    var bubbleObj = svg.selectAll(".topBubble")
        .data(root.children)
        .enter().append("g")
        .attr("aligh","center")
        .attr("id", function (d, i) {
            return "topBubbleAndText_" + i
        });

    nTop = root.children.length;
    oR = w / (1 + 3 * nTop);

    h = Math.ceil(w / nTop * 2);
    svgContainer.style("height", h + "px");

    var colVals = d3.scale.category10().range(["#82AFC5", "#C45454", "#4393B9", "#316A86"]);

    bubbleObj.append("circle")
        .attr("class", "topBubble")
        .attr("id", function (d, i) {
            return "topBubble" + i;
        })
        .attr("r", function (d) {
            return oR;
        })
        .attr("cx", function (d, i) {
            return oR * (3 * (1 + i) - 1);
        })
        .attr("cy", (h + oR) / 3)
        .style("fill", function (d, i) {
            return colVals(i);
        })
        .style("opacity", 0.8)
        .on("mouseover", function (d, i) {
            return activateBubble(d, i);
        });


    bubbleObj.append("text")
        .attr("class", "topBubbleText")
        .attr("x", function (d, i) {
            return oR * (3 * (1 + i) - 1);
        })
        .attr("y", (h + oR) / 3)
        .style("fill", function (d, i) {
            return "#ffffff"
        })
        .attr("font-size", 50)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("alignment-baseline", "middle")
        .html(function (d) {
            return d.name;
        })
        .on("mouseover", function (d, i) {
            return activateBubble(d, i);
        });


    for (var iB = 0; iB < nTop; iB++) {
        var childBubbles = svg.selectAll(".childBubble" + iB)
            .data(root.children[iB].children)
            .enter().append("g");

        //var nSubBubble = Math.floor(root.children[iB].children.length/2.0);

        childBubbles.append("circle")
            .attr("class", "childBubble" + iB)
            .attr("id", function (d, i) {
                return "childBubble_" + iB + "sub_" + i;
            })
            .attr("r", function (d) {
                return oR / 3.0;
            })
            .attr("cx", function (d, i) {
                return (oR * (3 * (iB + 1) - 1) + oR * 1.5 * Math.cos((i - 1) * 45 / 180 * 3.1415926));
            })
            .attr("cy", function (d, i) {
                return ((h + oR) / 3 + oR * 1.5 * Math.sin((i - 1) * 45 / 180 * 3.1415926));
            })
            .attr("cursor", "pointer")
            .style("opacity", 1)
            .style("fill", "#eee")
            .on("click", function (d, i) {
            })
            .on("mouseover", function (d, i) {
                var noteText = "";
                if (d.note == null || d.note == "") {
                    noteText = d.address;
                } else {
                    noteText = d.note;
                }
                d3.select("#bubbleItemNote").text(noteText);
            })
            .append("svg:title")
            .text(function (d) {
                return d.address;
            });

        childBubbles.append("text")
            .attr("class", "childBubbleText" + iB)
            .attr("x", function (d, i) {
                return (oR * (3 * (iB + 1) - 1) + oR * 1.5 * Math.cos((i - 1) * 45 / 180 * 3.1415926));
            })
            .attr("y", function (d, i) {
                return ((h + oR) / 3 + oR * 1.5 * Math.sin((i - 1) * 45 / 180 * 3.1415926));
            })
            .style("opacity", 1)
            .attr("text-anchor", "middle")
            .style("fill", function (d, i) {
                return colVals(iB);
            }) // #1f77b4
            .attr("font-size", 30)
            .attr("cursor", "pointer")
            .attr("dominant-baseline", "middle")
            .attr("alignment-baseline", "middle")
            .text(function (d) {
                return d.name
            })
            .on("click", function (d, i) {
            });

    }

    resetBubbles = function () {
        //w = window.innerWidth * 0.68 * 0.95;
        w = 600;
        oR = w / (1 + 3 * nTop);

        h = Math.ceil(w / nTop * 2);
        svgContainer.style("height", h + "px");

        mainNote.attr("y", h - 15);

        svg.attr("width", w);
        svg.attr("height", h);


        var t = svg.transition()
            .duration(650);

        t.selectAll(".topBubble")
            .attr("r", function (d) {
                return oR;
            })
            .attr("cx", function (d, i) {
                return oR * (3 * (1 + i) - 1);
            })
            .attr("cy", (h + oR) / 3);

        t.selectAll(".topBubbleText")
            .attr("font-size", 30)
            .attr("x", function (d, i) {
                return oR * (3 * (1 + i) - 1);
            })
            .attr("y", (h + oR) / 3);

        for (var k = 0; k < nTop; k++) {
            t.selectAll(".childBubbleText" + k)
                .attr("x", function (d, i) {
                    return (oR * (3 * (k + 1) - 1) + oR * 1.5 * Math.cos((i - 1) * 45 / 180 * 3.1415926));
                })
                .attr("y", function (d, i) {
                    return ((h + oR) / 3 + oR * 1.5 * Math.sin((i - 1) * 45 / 180 * 3.1415926));
                })
                .attr("font-size", 6)
                .style("opacity", 1);

            t.selectAll(".childBubble" + k)
                .attr("r", function (d) {
                    return oR / 3.0;
                })
                .style("opacity", 0.5)
                .attr("cx", function (d, i) {
                    return (oR * (3 * (k + 1) - 1) + oR * 1.5 * Math.cos((i - 1) * 45 / 180 * 3.1415926));
                })
                .attr("cy", function (d, i) {
                    return ((h + oR) / 3 + oR * 1.5 * Math.sin((i - 1) * 45 / 180 * 3.1415926));
                });

        }
    };

    function activateBubble(d, i) {
        // increase this bubble and decrease others
        var t = svg.transition()
            .duration(d3.event.altKey ? 7500 : 350);

        t.selectAll(".topBubble")
            .attr("cx", function (d, ii) {
                if (i == ii) {
                    // Nothing to change
                    return oR * (3 * (1 + ii) - 1) - 0.6 * oR * (ii - 1);
                } else {
                    // Push away a little bit
                    if (ii < i) {
                        // left side
                        return oR * 0.6 * (3 * (1 + ii) - 1);
                    } else {
                        // right side
                        return oR * (nTop * 3 + 1) - oR * 0.6 * (3 * (nTop - ii) - 1);
                    }
                }
            })
            .attr("r", function (d, ii) {
                if (i == ii)
                    return oR * 1.8;
                else
                    return oR * 0.8;
            });

        t.selectAll(".topBubbleText")
            .attr("x", function (d, ii) {
                if (i == ii) {
                    // Nothing to change
                    return oR * (3 * (1 + ii) - 1) - 0.6 * oR * (ii - 1);
                } else {
                    // Push away a little bit
                    if (ii < i) {
                        // left side
                        return oR * 0.6 * (3 * (1 + ii) - 1);
                    } else {
                        // right side
                        return oR * (nTop * 3 + 1) - oR * 0.6 * (3 * (nTop - ii) - 1);
                    }
                }
            })
            .attr("font-size", function (d, ii) {
                if (i == ii)
                    return 30 * 3;
                    //return 30 * 1.5;
                else
                    return 30 * 1.8;
                    //return 30 * 0.6;
            });

        var signSide = -1;
        for (var k = 0; k < nTop; k++) {
            signSide = 1;
            if (k < nTop / 2) signSide = 1;
            t.selectAll(".childBubbleText" + k)
                .attr("x", function (d, i) {
                    return (oR * (3 * (k + 1) - 1) - 0.6 * oR * (k - 1) + signSide * oR * 2.5 * Math.cos((i - 1) * 45 / 180 * 3.1415926));
                })
                .attr("y", function (d, i) {
                    return ((h + oR) / 3 + signSide * oR * 2.5 * Math.sin((i - 1) * 45 / 180 * 3.1415926));
                })
                .attr("font-size", function () {
                    return (k == i) ? 12 : 6;
                })
                .style("opacity", function () {
                    return (k == i) ? 1 : 0;
                });

            t.selectAll(".childBubble" + k)
                .attr("cx", function (d, i) {
                    return (oR * (3 * (k + 1) - 1) - 0.6 * oR * (k - 1) + signSide * oR * 2.5 * Math.cos((i - 1) * 45 / 180 * 3.1415926));
                })
                .attr("cy", function (d, i) {
                    return ((h + oR) / 3 + signSide * oR * 2.5 * Math.sin((i - 1) * 45 / 180 * 3.1415926));
                })
                .attr("r", function () {
                    return (k == i) ? (oR * 0.55) : (oR / 3.0);
                })
                .style("opacity", function () {
                    return (k == i) ? 1 : 0;
                });
        }
    }

    window.onresize = resetBubbles;
}
