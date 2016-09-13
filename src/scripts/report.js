// ****************************************
// get the year(s) for each metric
// ****************************************
function getYear(m) {
    switch(metricConfig[m].type) {
        case 'sum': case 'normalize':
        	// console.log('metricConfig[m].metric = '+JSON.stringify(metricConfig[m].metric));
        	// console.log("theData['r' + metricConfig[m].metric][0] = "+JSON.stringify(theData['r' + metricConfig[m].metric][0]));
            // console.log(m +" "+"metricConfig[m].type = "+metricConfig[m].type);
            // console.log("_.without(_.keys(theData['r' + metricConfig[m].metric][0]), 'id' = "+_.without(_.keys(theData['r' + metricConfig[m].metric][0]), 'id'));
            return _.without(_.keys(theData['r' + metricConfig[m].metric][0]), 'id');
            break;
        case 'mean':
            //console.log(m +" "+"metricConfig[m].type = "+metricConfig[m].type);
            return _.without(_.keys(theData['n' + metricConfig[m].metric][0]), 'id');
            break;
    }
}

// ****************************************
// set model variable as needed from data type
// ****************************************
function setModel(m) {
    model.metricId = m;
    if (!(m in metricConfig)) {
        console.log("Error: metricConfig is undefined for " + m);
        return;
    }
    switch(metricConfig[m].type) {
        case 'sum':
            model.metric = theData['r' + metricConfig[m].metric];
            break;
        case 'mean':
            model.metric = theData['n' + metricConfig[m].metric];
            if (metricConfig[m].raw_label) {
                model.metricRaw = theData['r' + metricConfig[m].metric];
            }
            break;
        case 'normalize':
            model.metricRaw = theData['r' + metricConfig[m].metric];
            model.metricDenominator = theData['d' + metricConfig[m].metric];

            var calcMetric = $.extend(true, {}, model.metricRaw);
            var keys = _.without(_.keys(model.metricRaw[0]), "id");

            // this next bit can get taken out when the normalize capabilities are complete
             _.each(calcMetric, function(theval, i) {
                _.each(keys, function(key) {
                    theRaw = model.metricRaw[i][key];
                    theDemoninator = model.metricDenominator[i][key];
                    theval[key] = theRaw / theDemoninator;
                });
            });
            //console.log("calcMetric = "+JSON.stringify(calcMetric));
            model.metric = calcMetric;
            // end bit

            break;
    }
}

// ****************************************
// Return the nth instance of a substring
// ****************************************
function GetSubstringIndex(str, substring, n) {
    var times = 0, index = null;
    while (times < n && index !== -1) {
        index = str.indexOf(substring, index+1);
        times++;
    }
    return index;
}

// ****************************************
// Create the metric blocks and table values
// ****************************************
function createData(featureSet) {
	var template = _.template($("script.template-metric").html()), categories = _.uniq(_.pluck(metricConfig, 'category'));
	//console.log("categories = " + JSON.stringify(categories));
	model.selected = featureSet;
	_.each(featureSet, function(feature) {
	    feature = feature.replace(/ /g,'-');
		_.each(categories, function(dim) {
			var theTable = $(".table-" + feature + "-" + dim.toLowerCase().replace(/\s+/g, "-") + " tbody");
			var theMetrics = _.filter(metricConfig, function(el) {
				return el.category.toLowerCase() === dim.toLowerCase();
			});
			//console.log("theMetrics = " + JSON.stringify(theMetrics));
			_.each(theMetrics, function(val) {
				var m = 'm' + val.metric;
				var lineChartObject = {
					"id" : m,
					"feature" : feature,
					"prefix": getPrefix(m),
					"suffix": getSuffix(m),
					"years" : "",
					"featurevalues" : "",
					"selectedvalues" : "",
					"countyvalues" : ""
				};
				setModel(m);
				var aboutHTML;
				var importance;
				var metricTitle;
				var additionalResourcesLinks;
				var additionalResourcesHTML;
				$.ajax({
					url : 'data/meta/' + m + '.html',
					type : 'GET',
					dataType : 'text',
					success : function(data) {
						metricTitle = data.substring(GetSubstringIndex(data, '</p>', 1), GetSubstringIndex(data, '<p', 1) + 3);
						aboutHTML = data.substring(GetSubstringIndex(data, '</h3>', 2) + 5, GetSubstringIndex(data, '<h3', 3));
						importance = data.substring(GetSubstringIndex(data, '</p>', 2), GetSubstringIndex(data, '<p', 2) + 3);
						var additionalResourcesHTML = "<table><thead></thead>" + data.substring(GetSubstringIndex(data, '</tbody>', 1) + 8, GetSubstringIndex(data, '<tbody', 1)) + "</body>";
						var parser = new DOMParser();
						var parserDoc = parser.parseFromString(additionalResourcesHTML, "text/html");
						//var table = parserDoc.getElementsByTagName('table');
						var tableTRs = parserDoc.getElementsByTagName("tr");
						var trTDs;
                        var additionalResourcesLinks = "";
						for (var i = 0; i < tableTRs.length; i++) {
							parserDoc = parser.parseFromString("<table><tr>" + tableTRs[i].innerHTML + "</tr></table>", "text/html");
							trTDs = parserDoc.getElementsByTagName("td");
							additionalResourcesLinks += "<div>" + [trTDs[0].innerHTML.slice(0, 3), 'title="' + trTDs[1].innerHTML + '"', trTDs[0].innerHTML.slice(3)].join('') + "</div>";;
						}
					},
					error : function(error, status, desc) {
					},
					complete : function() {
                        if (!(m in metricConfig)) {
                            console.log("Error: metricConfig is undefined for " + m);
                            return;
                        }

						var tdata = {
							"id" : m,
							"feature" : feature,
							"title" : metricTitle,
							"year" : "",
							"typeValues" : "",
							"about" : aboutHTML,
							"important" : importance,
							"additionalResources" : additionalResourcesLinks,
							"selectedVal" : "",
							"selectedRaw" : "",
							"selectedNVal" : "",
							"countyVal" : "",
							"countyRaw" : "",
							"countyNVal" : ""
						};
                        setModel(m);
                        model.metricID = m;
                        model.prefix = getPrefix(m);
                        model.suffix = getSuffix(m);

                        var keys = getYear(m);
						var year = keys[keys.length - 1];
						var yearTDs = "";
						var types = [];
                        var theYear;
						var yeariii;
						var iii;
						var years = [];
						var featureValue;
						var featureNValue;
						var featureValues = [];
						var selectedValues = [];
						var countyValues = [];
                        var lineCharts = [];
                        for (iii = 0; iii < keys.length; iii++) {
							theYear = keys[iii];
							model.years = keys;
							//*****Can I use dataPretty here?
							featureNValue = metricValuesByIDYear(model.metric, feature, theYear, m);
							featureValue = dataPretty(featureNValue, m);
							yeariii = keys[iii].replace('y_', '');
							tdata.countyNVal = dataCrunch('y_' + yeariii);
							tdata.selectedNVal = dataCrunch('y_' + yeariii, theFilter);
							model.suffix = val.suffix;
							if (model.suffix == "%") {
								featureValue = dataPretty(featureNValue * 100, m);
								featureNValue = featureNValue * 100;
								tdata.selectedNVal = tdata.selectedNVal * 100;
								tdata.countyNVal = tdata.countyNVal * 100;
							}
							tdata.selectedVal = dataPretty(tdata.selectedNVal, m);
							tdata.countyVal = dataPretty(tdata.countyNVal, m);
							years.push(yeariii);
							featureValues.push(dataRound(featureNValue, metricConfig[m].decimals));
							selectedValues.push(dataRound(tdata.selectedNVal, metricConfig[m].decimals));
							countyValues.push(dataRound(tdata.countyNVal, metricConfig[m].decimals));
							types.push([featureValue, yeariii, tdata.selectedVal, tdata.countyVal]);
							tdata.typeValues = types;
							$(".dataValues").innerHTML = yearTDs;
							if (metricConfig[m].raw_label) {
								tdata.countyRaw = '<br>' + dataSum(model.metricRaw, year).toFixed(0).commafy();
								theStat = dataSum(model.metricRaw, year, theFilter);
								if ($.isNumeric(theStat)) {
									theStat = theStat.toFixed(0).commafy();
								}
								tdata.selectedRaw = '<br>' + theStat;
							}
							// front page

							if ($('[data-metric="' + m + '"]').length > 0) {
								$('[data-metric="' + m + '"]').text(tdata.selectedVal);
							}
							if ($('[data-metric="r' + val.metric + '"]').length > 0) {
								$('[data-metric="r' + val.metric + '"]').text(tdata.selectedRaw.replace('<br>', ''));
							}
						}
						if (years.length > 1) {
							lineChartObject.years = years;
							lineChartObject.featurevalues = featureValues;
                            if (theFilter.length > 1) {
							    lineChartObject.selectedvalues = selectedValues;
                            }
							lineChartObject.countyvalues = countyValues;
							lineCharts.push(lineChartObject);
						}

						// Write out stuff
						theTable.append(template(tdata));

                        // Hide "Selected features" if there is only one feature selected.
                        if (theFilter.length == 1) {
                            _.each(document.querySelectorAll(".metric-table__selection-average"), function (el, i) {
                                el.style.display = "none";
                            });
                        }

                        // Create line charts if they exist.
						if (lineCharts.length > 0) {
						    console.log("Creating line chart for " + m)
							lineChartCreate(lineCharts);
						}

						// Otherwise hide the linechart div.
						else {
						    document.getElementById("lineChart"+lineChartObject.id+lineChartObject.feature).style.display = "none";
                        }
					}
				});
			});
		});
	});
}




// ****************************************
// Initialize the map
// Neighborhoods labled with leaflet.label
// ****************************************
function createMap(data){
    // set up map
    L.Icon.Default.imagePath = './images';
    var smallMap = L.map("smallmap", {
            attributionControl: false,
            zoomControl: false,
            touchZoom: false
        }).setView(mapGeography.center, mapGeography.defaultZoom - 1);
    
    // Disable drag and zoom handlers.
    smallMap.dragging.disable();
    smallMap.touchZoom.disable();
    smallMap.doubleClickZoom.disable();
    smallMap.scrollWheelZoom.disable();
    var selectedFeatures = [], 
    selectedIDs = [];
    // add data filtering by passed neighborhood id's
    geom = L.geoJson(topojson.feature(data, data.objects[neighborhoods]), {
        style: {
            "color": "#FFA400",
            "fillColor": "#FFA400",
            "weight": 2,
            "opacity": 1
        },
        filter: function(feature, layer) {
            return theFilter.indexOf(feature.id.toString()) !== -1;
        },
        onEachFeature: function(feature, layer) {
            selectedFeatures.push(feature);
            selectedIDs.push(feature.id);
        }
    }).addTo(smallMap);
    //console.log("geom.style = " + geom);
    // add base tiles at the end so no extra image grabs/FOUC
    L.tileLayer(baseTilesURL).addTo(smallMap);

    //console.log("selectedFeature = "+JSON.stringify(selectedFeatures[0]));
    //console.log("selectedIDs = "+selectedIDs[0]+","+selectedIDs[1]);
    // scaffold in category pages
    pageTemplates(geom,selectedFeatures,selectedIDs);
}

// ****************************************
// get pages in for data categories
// ****************************************
function pageTemplates(layer,geoms,IDs) {
    var template = _.template($("#template-category").html()),
        categories = _.uniq(_.pluck(metricConfig, 'category')),
        pages = $(".category-pages");

	var mapEle;
	var ticker = 0;
	_.each(geoms, function(geom){
		var geomID = geom.id;

	 	var poly = L.polygon(geom.geometry.coordinates);
		var polyBounds = poly.getBounds();
		var swLng = polyBounds._southWest.lat,
		swLat = polyBounds._southWest.lng,
		neLng = polyBounds._northEast.lat,
		neLat = polyBounds._northEast.lng;

		mapEle = document.createElement('div');

		mapEle = document.createElement('div');
		mapEle.setAttribute("class", "page page-category");

		mapEle.innerHTML = '<div><h3>'+geomID+'</h3></div><div class="row text-center"><div id="bigMap'+ticker+'"></div></div>';
		pages.append(mapEle);

		var bigMap = document.getElementById('bigMap'+ticker);
		bigMap.style.width = '670px';
		bigMap.style.height = '900px';
		bigMap.style.margin = 'auto';

		var largeMap = L.map('bigMap'+ticker,{
	        attributionControl: false,
	        zoomControl: false,
	        touchZoom: false
	    });
	    largeMap.fitBounds([[swLat,swLng],[neLat,neLng]]);

	    largeMap.dragging.disable();
	    largeMap.touchZoom.disable();
	    largeMap.doubleClickZoom.disable();
	    largeMap.scrollWheelZoom.disable();
		var feature = L.geoJson(geom, {
	        style: {
	            "color": "#FFA400",
	            "fillColor": "rgba(255,164,0,0.3)",
	            "weight": 2,
	            "opacity": 1
	        },
	        filter: function(feature, layer) {
	            return theFilter.indexOf(feature.id.toString()) !== -1;
	        },
	        onEachFeature: function(feature, layer) {
	            var pt = L.geoJson(feature).getBounds().getCenter();
	            label = new L.Label();
	            label.setContent(feature.id.toString());
	            label.setLatLng(pt);
	            largeMap.showLabel(label);
	        }
	    }).addTo(largeMap);
		L.tileLayer(baseTilesURL).addTo(largeMap);

	 	ticker ++;
	 	_.each(categories, function(el) {
	        cat = el.toLowerCase();

	        // get vis if available
	        if ($("#template-vis-" + cat).length > 0) {
	            vis = _.template($("#template-vis-" + cat.replace(/\s+/g, "-")).html());
	        } else {
	            vis = "";
	        }

	        // drop in category page
	        pages.append(template({ "vis": vis, "category": cat ,"featureID":geomID}));
	    });
	 });
}
function lineChartData(lineChart) {
    var featureValues = lineChart.featurevalues,
    	npaMean = lineChart.selectedvalues,
        countyMean = lineChart.countyvalues,
        keys = _.without(_.keys(model.metric[0]), "id");

    var data = {
        labels: [],
        datasets: []
    };

    // Set axis labels.
    _.each(lineChart.years, function(el, i) {
        data.labels.push(el.replace("y_", ""));
    });

    // Add feature values (if set).
    if (featureValues && featureValues.length > 0) {
        var featureValuesData = {
            label: 'Feature',
            fillColor : "rgba(239,223,0,0.2)",
            strokeColor : "rgba(239,223,0,1)",
            pointColor : "rgba(239,223,0,1)",
            pointStrokeColor : "#fff",
            pointHighlightFill : "#fff",
            pointHighlightStroke : "rgba(239,223,0,1)",
            data :[]
        };

        _.each(featureValues, function(el, i){
            featureValuesData.data.push(el);
        });

        data.datasets.push(featureValuesData);
    }

    // Add average for selection (if set).
    if (npaMean && npaMean.length > 0) {
        var npaMeanData = {
                label: 'Selected',
                fillColor : "rgba(81,164,75,0.2)",
                strokeColor : "rgba(81,164,75,1)",
                pointColor : "rgba(81,164,75,1)",
                pointStrokeColor : "#fff",
                pointHighlightFill : "#fff",
                pointHighlightStroke : "rgba(81,164,75,1)",
                data :[]
            };
        _.each(npaMean, function (el, i) {
            npaMeanData.data.push(Math.round(el * 10) / 10);
        });

        data.datasets.push(npaMeanData);
    }

    // Add county mean (if set).
    if (countyMean && countyMean.length > 0) {

        var countyMeanData = {
            label: "County",
            fillColor : "rgba(220,220,220,0.5)",
            strokeColor : "rgba(220,220,220,1)",
            pointColor : "rgba(220,220,220,1)",
            pointStrokeColor : "#fff",
            pointHighlightFill : "#fff",
            pointHighlightStroke : "rgba(220,220,220,1)",
            data : []
        };

        _.each(countyMean, function (el, i) {
            countyMeanData.data.push(Math.round(el * 10) / 10);
        });

        data.datasets.push(countyMeanData);
    }

    return data;
}
function lineChartCreate(lineCharts) {
	_.each(lineCharts, function(lineChart, i){
		thePrefix = lineChart.prefix;
        theSuffix = lineChart.suffix;
	    if (window.myLine) { window.myLine.destroy(); }
	    var ctx = document.getElementById("lineChart"+lineChart.id+lineChart.feature).getContext("2d");
	    window.myLine = new Chart(ctx).Line(lineChartData(lineChart), {
	        responsive: true,
	        maintainAspectRatio: true,
	        showTooltips: true,
	        animation: true,
	        animationSteps: 1,
	        tooltipEvents: ["mousemove", "touchstart", "touchmove"],
	        tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",
	        multiTooltipTemplate: "<%= value %>",
	        scaleLabel: '<%= thePrefix + value + theSuffix %>',
	        legendTemplate : '<% for (var i=0; i<datasets.length; i++){%><span class="title"  style="background-color:<%=datasets[i].strokeColor%>; margin-right: 5px">&nbsp;&nbsp;&nbsp;</span><span class="title"  style="margin-right: 5px"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span><%}%>'
	    });
	    $("#chartLegend"+lineChart.id+lineChart.feature).html(myLine.generateLegend());
	});
}

// ****************************************
// Globals
// ****************************************
var theFilter = ["434","372","232"],        // default list of neighborhoods if none passed
    theData,
    theMetadata,                                // global for fetched raw data
    thePrefix,
    theSuffix,
    featureIndex = 0,
    model = {};

_.templateSettings.variable = "rc";


// ****************************************
// Document ready kickoff
// ****************************************
$(document).ready(function() {

    $.ajax({
		url : 'data/merge_cb.json',
		type : 'GET',
		dataType : 'json',
		success : function(data) {
			theMetadata = data;
		}
	});

    // fetch map data and make map
    $.get(activeTOPOJSON, function(data) {
        createMap(data);
    });

    // ye customizable subtitle
    $(".subtitle").on("click", function() { $(this).select(); });

    // grab the neighborhood list from the URL to set the filter
    if (getURLParameter("n") !== "null") {
        theFilter = getURLParameter("n").split(",");
    }

    // populate the neighborhoods list on the first page
    // if too long to fit one one line it lists the number of neighborhoods instead
    // @todo this is not working since the template changed.
    var theNeighborhoods = theFilter.join(", ");
    if (theNeighborhoods.length > 85) {
        theNeighborhoods = theFilter.length;
        $(".neighborhoods").text(theNeighborhoods.commafy() + " " + neighborhoodDescriptor + "s");
    } else {
        $(".neighborhoods").text(neighborhoodDescriptor + ": " + theNeighborhoods.commafy());
    }

    // fetch the metrics and make numbers and charts
    $.get(activeMergeJSON, function(data) {
        theData = data;
        createData(theFilter);
        createCharts();
    });

});
