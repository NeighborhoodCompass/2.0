// All Hail Ye Report
//
// The idea was this would be a print page, because try as I might I can't convince
// people that burning your screen into pressed tree pulp in 2014 is a bad idea.
// But I figured I could format it well for printing and display so it could be a
// "nice feature".
//
// Because it's very printer/designer-y, it's mostly hard coded to our data.
// Sorry - I can't figure out a generic way to do what we wanted.
//
// Imagine my face while coding up a print page. IMAGINE MY FACE.



// ****************************************
// Globals
// ****************************************
var theFilter = ["434","372","232"],        // default list of neighborhoods if none passed
    theData,
    theMetadata,                                // global for fetched raw data
    model = {};

_.templateSettings.variable = "rc";


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
// Create charts
// ****************************************
function createCharts() {
    // var colors = ["#5C2B2D", "#7A9993", "#959BA9", "#FAFBDD", "#C3DBDE"];
// 
    // // doughnut charts
    // $(".chart-doughnut").each(function() {
        // var data = [];
        // var selector = $(this).data("selector");
        // _.each($(this).data('chart').split(','), function(el, i) {
            // dataTypeKey = el;
            // data.push({
                // value: Number($(".data-" + el).data(selector)),
                // color: colors[i],
                // label: $(".label-" + el).data("val").replace('Race/Ethnicity - ', '')
            // });
        // });
        // ctx = document.getElementById($(this).prop("id")).getContext("2d");
        // var chart = new Chart(ctx).Doughnut(data, {
            // showTooltips: true,
            // legendTemplate : '<% for (var i=0; i<segments.length; i++){%><span style="border-color:<%=segments[i].fillColor%>" class="title"><%if(segments[i].label){%><%=segments[i].label%><%}%></span><%}%>',
            // tooltipTemplate: "<%= dataPretty(value, '" + dataTypeKey + "') %>",
            // multiTooltipTemplate: "<%= dataPretty(value, '" + dataTypeKey + "') %>",
        // });
        // $("#" + $(this).prop("id") + "-legend").html(chart.generateLegend());
    // });
// 
    // // bar charts
    // $(".chart-bar").each(function() {
        // // prep the data
        // var data = {};
        // var dataTypeKey = "";
// 
        // datasets = [
            // {
                // fillColor: "rgba(151,187,205,0.5)",
                // strokeColor: "rgba(151,187,205,0.8)",
                // data: [],
                // label: "Selected " + neighborhoodDescriptor + "s"
            // },
            // {
                // fillColor: "rgba(220,220,220,0.5)",
                // strokeColor: "rgba(220,220,220,0.8)",
                // data: [],
                // label: "County"
            // }
        // ];
// 
        // data.labels = $(this).data('labels').split(",");
// 
        // _.each($(this).data('chart').split(','), function(el) {
            // datasets[0].data.push($(".data-" + el).data("selected-val"));
            // datasets[1].data.push($(".data-" + el).data("county-val"));
            // dataTypeKey = el;
        // });
// 
        // if (!$.isNumeric(datasets[0].data[0])) {
            // datasets.shift();
        // }
// 
        // data.datasets = datasets;
// 
        // ctx = document.getElementById($(this).prop("id")).getContext("2d");
        // var chart = new Chart(ctx).Bar(data, {
            // showTooltips: true,
            // legendTemplate : '<% for (var i=0; i<datasets.length; i++){%><span class="title"  style="border-color:<%=datasets[i].strokeColor%>"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span><%}%>',
            // scaleLabel: "<%= dataFormat(dataRound(Number(value), 2), '" + dataTypeKey + "') %>",
            // tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= dataPretty(value, '" + dataTypeKey + "') %>",
            // multiTooltipTemplate: "<%= dataPretty(value, '" + dataTypeKey + "') %>",
        // });
// 
        // $("#" + $(this).prop("id") + "-legend").html(chart.generateLegend());
// 
    // });
// 
    // // line charts
    // $(".chart-line").each(function() {
        // var m = $(this).data("chart"),
            // npaMean = [],
            // countyMean = [];
// 
        // setModel(m);
        // keys = getYear(m);
// 
        // // stats
        // _.each(keys, function(year) {
            // countyMean.push(dataCrunch(year));
            // npaMean.push(dataCrunch(year, theFilter));
            // dataTypeKey = m;
        // });
// 
        // // make sure selected stuff really has a value
        // _.each(npaMean, function(el) {
            // if (!$.isNumeric(el)) {
                // npaMean = null;
            // }
        // });
// 
        // var data = {
            // labels: [],
            // datasets: [
                // {
                    // fillColor: "rgba(151,187,205,0.2)",
                    // strokeColor: "rgba(151,187,205,1)",
                    // pointColor: "rgba(151,187,205,1)",
                    // pointStrokeColor: "#fff",
                    // data: [],
                    // label: "Selected " + neighborhoodDescriptor + "s"
                // },
                // {
                    // fillColor: "rgba(220,220,220,0.2)",
                    // strokeColor: "rgba(220,220,220,1)",
                    // pointColor: "rgba(220,220,220,1)",
                    // pointStrokeColor: "#fff",
                    // data: [],
                    // label: "County"
                // }
            // ]
        // };
// 
        // _.each(countyMean, function(el, i) {
            // data.labels.push(keys[i].replace("y_", ""));
            // if (npaMean !== null) { data.datasets[0].data.push(Math.round(npaMean[i] * 10) / 10); }
            // data.datasets[1].data.push(Math.round(el * 10) / 10);
        // });
// 
        // // remove select mean if no values are there
        // if (!npaMean || npaMean === null) { data.datasets.shift(); }
// 
        // ctx = document.getElementById($(this).prop("id")).getContext("2d");
        // var chart = new Chart(ctx).Line(data, {
            // showTooltips: true,
            // legendTemplate : '<% for (var i=0; i<datasets.length; i++){%><span class="title"  style="border-color:<%=datasets[i].strokeColor%>"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span><%}%>',
            // scaleLabel: "<%= dataFormat(dataRound(Number(value), 2), '" + m + "') %>",
            // tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= dataPretty(value, '" + dataTypeKey + "') %>",
            // multiTooltipTemplate: "<%= dataPretty(value, '" + dataTypeKey + "') %>",
        // });
// 
        // if ($("#" + $(this).prop("id") + "-legend").length > 0) {
            // $("#" + $(this).prop("id") + "-legend").html(chart.generateLegend());
        // }
    // });
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

var featureIndex = 0;
function createData(featureSet) {
	var template = _.template($("script.template-metric").html()), categories = _.uniq(_.pluck(metricConfig, 'category'));
	//console.log("categories = " + JSON.stringify(categories));
	model.selected = featureSet;
	var lineCharts = [];
	_.each(featureSet, function(feature) {
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
				//console.log(m+" prefix + suffix = "+lineChartObject.prefix + " "+ lineChartObject.suffix);
				//console.log("val = " + JSON.stringify(val));
				//console.log("JSON.stringify(val) = "+JSON.stringify(val));
				//console.log("metric = " + m);
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
						//console.log("data = " + JSON.stringify(data));
						// $('.meta-subtitle').html(
						// data.substring(GetSubstringIndex(data, '</h2>', 1) + 5, GetSubstringIndex(data, '<h3', 1))
						// );
						// $('.meta-important').html(
						// data.substring(GetSubstringIndex(data, '</h3>', 1) + 5, GetSubstringIndex(data, '<h3', 2))
						// );
						metricTitle = data.substring(GetSubstringIndex(data, '</p>', 1), GetSubstringIndex(data, '<p', 1) + 3);
						// console.log("GetSubstringIndex(data, '<h3', 3) = "+GetSubstringIndex(data, '<h3', 3));
						aboutHTML = data.substring(GetSubstringIndex(data, '</h3>', 2) + 5, GetSubstringIndex(data, '<h3', 3));
						// console.log("data = " + data);
						// console.log("aboutHTML = " + aboutHTML);
						importance = data.substring(GetSubstringIndex(data, '</p>', 2), GetSubstringIndex(data, '<p', 2) + 3);
						//console.log("importance = "+importance);
						//var additionalResourcesHTML = data.substring(GetSubstringIndex(data, '</tbody>', 1),GetSubstringIndex(data, '<tbody', 1));
						additionalResourcesHTML = "<table><thead></thead>" + data.substring(GetSubstringIndex(data, '</tbody>', 1) + 8, GetSubstringIndex(data, '<tbody', 1)) + "</body>";
						// console.log("additionalResourcesHTML = " + additionalResourcesHTML);
						var parser = new DOMParser();
						var parserDoc = parser.parseFromString(additionalResourcesHTML, "text/html");
						//var table = parserDoc.getElementsByTagName('table');
						var tableTRs = parserDoc.getElementsByTagName("tr");
						var trTDs;
						var additionalResourceLink;
						additionalResourcesLinks = "";
						//console.log("outside");
						for (var i = 0; i < tableTRs.length; i++) {
							//console.log("tableTRs iteration = " + i);
							//console.log('tableTRs[i].innerHTML = '+tableTRs[i].innerHTML);
							parserDoc = parser.parseFromString("<table><tr>" + tableTRs[i].innerHTML + "</tr></table>", "text/html");
							trTDs = parserDoc.getElementsByTagName("td");
							//console.log('trTDs[0].innerHTML = '+trTDs[0].innerHTML);
							additionalResourceLink = "<div>" + [trTDs[0].innerHTML.slice(0, 3), 'title="' + trTDs[1].innerHTML + '"', trTDs[0].innerHTML.slice(3)].join('') + "</div>";
							//console.log("additionalResourceLink = "+ additionalResourceLink);
							additionalResourcesLinks += additionalResourceLink;
							//console.log("additionalResourcesLinks = "+ i + " "+ additionalResourcesLinks);
							// for (var ii=0; ii<trTDs.length; ii++){
							// console.log('trTDs[i].innerHTML = '+trTDs[i].innerHTML);
							// }
						}
					},
					error : function(error, status, desc) {
						//console.log(status, desc);
					},
					complete : function() {
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
							var keys = getYear(m);
						setModel(m);
							// year
						var year = keys[keys.length - 1];
						var yearTDs = "";
						var types = [];
						model.metricID = m;
						model.prefix = getPrefix(m);
						model.suffix = getSuffix(m);
						//console.log("model.metric = "+JSON.stringify(model.metric));
						var theYear;
						var yeariii;
						var iii;
						var years = [];
						var featureValue;
						var featureNValue;
						var featureValues = [];
						var selectedValues = [];
						var countyValues = [];
						for ( iii = 0; iii < keys.length; iii++) {
							theYear = keys[iii];
							model.years = keys;
							//*****Can I use dataPretty here?
							featureNValue = metricValuesByIDYear(model.metric, feature, theYear, m);
							featureValue = dataPretty(featureNValue, m);
							//console.log("Metric = " + m + " theYear = "+theYear+ " feature = "+feature+" featureValue = " + featureValue);
							yeariii = keys[iii].replace('y_', '');
							// console.log("yeariii = " + yeariii);
							tdata.countyNVal = dataCrunch('y_' + yeariii);
							tdata.selectedNVal = dataCrunch('y_' + yeariii, theFilter);
							//console.log("val.suffix = " + val.suffix);
							model.suffix = val.suffix;
							if (model.suffix == "%") {
								featureValue = dataPretty(featureNValue * 100, m);
								//console.log("val.suffix = " + val.suffix);
								featureNValue = featureNValue * 100;
								tdata.selectedNVal = tdata.selectedNVal * 100;
								tdata.countyNVal = tdata.countyNVal * 100;
							}
							tdata.selectedVal = dataPretty(tdata.selectedNVal, m);
							// console.log("tdata.selectedVal = " + tdata.selectedVal);
							tdata.countyVal = dataPretty(tdata.countyNVal, m);
							// console.log("yeariii = " + yeariii);
							// console.log("createData featureValue = " + featureValue);
							years.push(yeariii);
							//metricConfig[theMetric].decimals
							//dataRound(theValue, theDecimals)
							featureValues.push(dataRound(featureNValue, metricConfig[m].decimals));
							selectedValues.push(dataRound(tdata.selectedNVal, metricConfig[m].decimals));
							countyValues.push(dataRound(tdata.countyNVal, metricConfig[m].decimals));
							//console.log("tdata.selectedVal = " + tdata.selectedVal);
							types.push([featureValue, yeariii, tdata.selectedVal, tdata.countyVal]);
							// model.featurevalues = featureValues;
							// types.push("Selected");
							// types.push("County");
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
							lineChartObject.selectedvalues = selectedValues;
							lineChartObject.countyvalues = countyValues;
							lineCharts.push(lineChartObject);
						}
						// console.log("lineCharts = " + JSON.stringify(lineCharts));
						// Write out stuff
						theTable.append(template(tdata));
						// console.log("theTableID = " + "lineChart" + tdata.id + tdata.feature);
						if (iii > 0) {
							lineChartCreate(lineCharts);
						}
					}
				});
				// var tdata = {
							// "id" : m,
							// "feature" : feature,
							// "title" : metricTitle,
							// "year" : "",
							// "typeValues" : "",
							// // "about" : aboutHTML,
							// // "important" : importance,
							// // "additionalResources" : additionalResourcesLinks,
							// "selectedVal" : "",
							// "selectedRaw" : "",
							// "selectedNVal" : "",
							// "countyVal" : "",
							// "countyRaw" : "",
							// "countyNVal" : ""
						// };
						// var keys = getYear(m);
						// console.log("keys = "+keys);
						// setModel(m);
							// // year
// 						
						// var yearTDs = "";
						// var types = [];
						// model.metricID = m;
						// model.prefix = getPrefix(m);
						// model.suffix = getSuffix(m);
						// //console.log("model.metric = "+JSON.stringify(model.metric));
						// var theYear;
						// var yeariii;
						// var iii;
						// var years = [];
						// var featureValue;
						// var featureNValue;
						// var featureValues = [];
						// var selectedValues = [];
						// var countyValues = [];
						// for ( iii = 0; iii < keys.length; iii++) {
							// theYear = keys[iii];
							// model.years = keys;
							// //*****Can I use dataPretty here?
							// featureNValue = metricValuesByIDYear(model.metric, feature, theYear, m);
							// featureValue = dataPretty(featureNValue, m);
							// //console.log("Metric = " + m + " theYear = "+theYear+ " feature = "+feature+" featureValue = " + featureValue);
							// yeariii = keys[iii].replace('y_', '');
							// // console.log("yeariii = " + yeariii);
							// tdata.countyNVal = dataCrunch('y_' + yeariii);
							// tdata.selectedNVal = dataCrunch('y_' + yeariii, theFilter);
							// //console.log("val.suffix = " + val.suffix);
							// model.suffix = val.suffix;
							// if (model.suffix == "%") {
								// featureValue = dataPretty(featureNValue * 100, m);
								// //console.log("val.suffix = " + val.suffix);
								// featureNValue = featureNValue * 100;
								// tdata.selectedNVal = tdata.selectedNVal * 100;
								// tdata.countyNVal = tdata.countyNVal * 100;
							// }
							// tdata.selectedVal = dataPretty(tdata.selectedNVal, m);
							// // console.log("tdata.selectedVal = " + tdata.selectedVal);
							// tdata.countyVal = dataPretty(tdata.countyNVal, m);
							// // console.log("yeariii = " + yeariii);
							// // console.log("createData featureValue = " + featureValue);
							// years.push(yeariii);
							// //metricConfig[theMetric].decimals
							// //dataRound(theValue, theDecimals)
							// console.log("featureNValue, metricConfig[m].decimals = " + featureNValue + ", " + metricConfig[m].decimals);
							// if(metricConfig[m].decimals>1){
								// featureValues.push(dataRound(featureNValue, metricConfig[m].decimals));
								// selectedValues.push(dataRound(tdata.selectedNVal, metricConfig[m].decimals));
								// countyValues.push(dataRound(tdata.countyNVal, metricConfig[m].decimals));
							// }
							// //console.log("tdata.selectedVal = " + tdata.selectedVal);
							// types.push([featureValue, yeariii, tdata.selectedVal, tdata.countyVal]);
							// // model.featurevalues = featureValues;
							// // types.push("Selected");
							// // types.push("County");
							// tdata.typeValues = types;
							// $(".dataValues").innerHTML = yearTDs;
							// if (metricConfig[m].raw_label) {
								// console.log("m = "+m);
								// console.log("model.metricRaw, theYear = "+JSON.stringify(model.metricRaw)+', '+theYear+" "+yeariii);
								// console.log("dataSum(model.metricRaw, theYear) = "+dataSum(model.metricRaw, theYear));
								// tdata.countyRaw = '<br>' + dataSum(model.metricRaw, theYear).toFixed(0).commafy();
								// theStat = dataSum(model.metricRaw, theYear, theFilter);
								// if ($.isNumeric(theStat)) {
									// theStat = theStat.toFixed(0).commafy();
								// }
								// tdata.selectedRaw = '<br>' + theStat;
							// }
							// // front page
							// if ($('[data-metric="' + m + '"]').length > 0) {
								// $('[data-metric="' + m + '"]').text(tdata.selectedVal);
							// }
							// if ($('[data-metric="r' + val.metric + '"]').length > 0) {
								// $('[data-metric="r' + val.metric + '"]').text(tdata.selectedRaw.replace('<br>', ''));
							// }
						// }
						// if (years.length > 1) {
							// lineChartObject.years = years;
							// lineChartObject.featurevalues = featureValues;
							// lineChartObject.selectedvalues = selectedValues;
							// lineChartObject.countyvalues = countyValues;
							// lineCharts.push(lineChartObject);
						// }
						// // console.log("lineCharts = " + JSON.stringify(lineCharts));
						// // Write out stuff
						// theTable.append(template(tdata));
						// // console.log("theTableID = " + "lineChart" + tdata.id + tdata.feature);
						// if (iii > 0) {
							// lineChartCreate(lineCharts);
						// }
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

function createLargeMaps(geom){
	// onEachFeature: function(feature, layer) {
            // var pt = L.geoJson(feature).getBounds().getCenter();
            // label = new L.Label();
            // label.setContent(feature.id.toString());
            // label.setLatLng(pt);
            // largeMap.showLabel(label);
        // }
    // var largeMap = L.map("largemap", {
        // attributionControl: false,
        // zoomControl: false,
        // touchZoom: false
    // });
	// // Disable drag and zoom handlers.
    // largeMap.dragging.disable();
    // largeMap.touchZoom.disable();
    // largeMap.doubleClickZoom.disable();
    // largeMap.scrollWheelZoom.disable();
//     
    // // zoom large map
    // largeMap.fitBounds(geom.getBounds());
    // // add base tiles at the end so no extra image grabs/FOUC
    // L.tileLayer(baseTilesURL).addTo(largeMap);
}
// ****************************************
// get pages in for data categories
// ****************************************
function pageTemplates(layer,geoms,IDs) {
    var template = _.template($("#template-category").html()),
    	// mapTemplate = _.template($("#template-bigMap").html()),
        categories = _.uniq(_.pluck(metricConfig, 'category')),
        pages = $(".category-pages");
        
        //console.log("categories = "+ categories);
		
		//console.log('geoms = '+JSON.stringify(geoms));
	var mapEle;
	var ticker = 0;
	_.each(geoms, function(geom){
		var geomID = geom.id;	
	 	
	 	var poly = L.polygon(geom.geometry.coordinates);
		//console.log('L.poly.getbounds = '+ JSON.stringify(poly.getBounds()));
		var polyBounds = poly.getBounds();
		//console.log('polyBounds._southWest.lat = '+polyBounds._southWest.lat);
		var swLng = polyBounds._southWest.lat,
		swLat = polyBounds._southWest.lng,
		neLng = polyBounds._northEast.lat,
		neLat = polyBounds._northEast.lng;
		//console.log('swLat = '+swLat);
		//console.log('swLng = '+swLng);
		//console.log('neLat = '+neLat);
		//console.log('neLng = '+neLng);
		
		mapEle = document.createElement('div');
	 	
		mapEle = document.createElement('div');
		// mapEle.setAttribute("id", "mapPage");
		mapEle.setAttribute("class", "page page-category");
		
		mapEle.innerHTML = '<div><h3>'+geomID+'</h3></div><div class="row text-center"><div id="bigMap'+ticker+'"></div></div>';
		pages.append(mapEle);
		
		var bigMap = document.getElementById('bigMap'+ticker);
		bigMap.style.width = '670px';
		bigMap.style.height = '900px';
		bigMap.style.margin = 'auto';
		
		//console.log("bigmap.id = " + bigMap.id);
		var largeMap = L.map('bigMap'+ticker,{
	        attributionControl: false,
	        zoomControl: false,
	        touchZoom: false
	    });
	    largeMap.fitBounds([[swLat,swLng],[neLat,neLng]]);
		
	    // largeMp.fitBounds(polyBounds);
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
		
		//console.log("layoutMap.id = "+mapEle.id);
	 	ticker ++;
	 	_.each(categories, function(el) {
	        cat = el.toLowerCase();
	        //console.log("cat = " + cat);
	
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
    //console.log("lineChart = " + JSON.stringify(lineChart));
    var featureValues = lineChart.featurevalues,
    	npaMean = lineChart.selectedvalues,
        countyMean = lineChart.countyvalues,
        keys = _.without(_.keys(model.metric[0]), "id");
	// get stats
    // _.each(lineChart.year, function(year) {
        // countyMean.push(dataCrunch(year));
       	// npaMean.push(dataCrunch(year, lineChart.selectedvalues));
       	// featureValues.push(dataCrunch(year, model.featurevalues));
    // });
    //console.log("countyMean = " + countyMean);
	//console.log("npaMean = "+npaMean);
    //console.log("featureValues = "+featureValues);
    // console.log("model.fgeatureValue = "+model.featurevalues);
    // make sure selected stuff really has a value
    // _.each(npaMean, function(el) {
        // if (!$.isNumeric(el)) {
            // npaMean = null;
        // }
    // });
//     
    // _.each(featureValues, function(el) {
        // if (!$.isNumeric(el)) {
            // featureValues = null;
        // }
    // });

    var data = {
        labels: [],
        datasets: [
        	{
                label: 'Feature',
                fillColor : "rgba(239,223,0,0.2)",
                strokeColor : "rgba(239,223,0,1)",
                pointColor : "rgba(239,223,0,1)",
                pointStrokeColor : "#fff",
                pointHighlightFill : "#fff",
                pointHighlightStroke : "rgba(239,223,0,1)",
                data :[]
            },
            {
                label: 'Selected',
                fillColor : "rgba(81,164,75,0.2)",
                strokeColor : "rgba(81,164,75,1)",
                pointColor : "rgba(81,164,75,1)",
                pointStrokeColor : "#fff",
                pointHighlightFill : "#fff",
                pointHighlightStroke : "rgba(81,164,75,1)",
                data :[]
            },
            {
                label: "County",
                fillColor : "rgba(220,220,220,0.5)",
                strokeColor : "rgba(220,220,220,1)",
                pointColor : "rgba(220,220,220,1)",
                pointStrokeColor : "#fff",
                pointHighlightFill : "#fff",
                pointHighlightStroke : "rgba(220,220,220,1)",
                data : []
            }
        ]
    };
	//console.log("npaMean = "+npaMean);
	
	//console.log("featureValues = "+featureValues);
	_.each(featureValues, function(el, i){
		//console.log("each featureValues");
		//console.log("model.metricID el = "+el);
		data.datasets[0].data.push(el);
	});
	_.each(npaMean, function(el, i){
		//console.log("each NPAmean");
		if (npaMean !== null) { data.datasets[1].data.push(Math.round(npaMean[i] * 10) / 10); };
    });
    //console.log("countyMean = "+countyMean);
    _.each(countyMean, function(el, i) {
		//console.log("each Countymean");
        data.labels.push(lineChart.years[i].replace("y_", ""));
        data.datasets[2].data.push(Math.round(el * 10) / 10);        
    });
    // console.log(model.metricID + " " + model.feature);
	// console.log("data.datasets[0;1;&2].data = "+ data.datasets[0].data +"; "+data.datasets[1].data +";& "+data.datasets[2].data);
    // remove select mean if no values are there
    if (!npaMean || npaMean === null) { data.datasets.shift(); }
	//console.log("data = "+ JSON.stringify(data));
    return data;
}
var thePrefix, theSuffix;
function lineChartCreate(lineCharts) {
    // console.log("lineChartCreate id = " + id);
   	// console.log("lineChartCreate label = " + label);
   	// console.log("lineChartCreate model.metricID = " + model.metricId);
   	// console.log("lineChartCreate value = " + value);
   	// console.log("lineChartCreate title = " + title);
   	//console.log("lineCharts = "+ JSON.stringify(lineCharts));
   	// dataFormat(dataRound(Number(value), 2), model.metricId);
	_.each(lineCharts, function(lineChart, i){   	
		thePrefix = lineChart.prefix;
        theSuffix = lineChart.suffix;
	    if (window.myLine) { window.myLine.destroy(); }
	    lineChartData(lineChart);
	    //console.log('linchartCreate id =  '+"lineChart"+lineChart.id+lineChart.feature);
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
	        //scaleLabel: "<%= '$'+value+'%'%>",
	        scaleLabel: '<%= thePrefix + value + theSuffix %>',
	        //scaleLabel: "<%console.log('model.metricId = '+model.metricId+' dataFormat(dataRound(Number(value), 2), model.metricId)  = '+dataFormat(dataRound(Number(value), 2), model.metricId) );%><%= dataFormat(dataRound(Number(value), 2), model.metricId) %>",
	        legendTemplate : '<% for (var i=0; i<datasets.length; i++){%><span class="title"  style="background-color:<%=datasets[i].strokeColor%>; margin-right: 5px">&nbsp;&nbsp;&nbsp;</span><span class="title"  style="margin-right: 5px"><%if(datasets[i].label){%><%=datasets[i].label%><%}%></span><%}%>'
	    	//legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
	    });
	    $("#chartLegend"+lineChart.id+lineChart.feature).html(myLine.generateLegend());
	});
}
// ****************************************
// Document ready kickoff
// ****************************************
$(document).ready(function() {
    
    $.ajax({
		url : 'data/meta/merge_cb.json',
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
    	//console.log('theFilter = '+theFilter);
        theFilter = getURLParameter("n").split(",");
    }

    // populate the neighborhoods list on the first page
    // if too long to fit one one line it lists the number of neighborhoods instead
    var theNeighborhoods = theFilter.join(", ");
    if (theNeighborhoods.length > 85) {
        theNeighborhoods = theFilter.length;
        $(".neighborhoods").text(theNeighborhoods.commafy() + " " + neighborhoodDescriptor + "s");
    } else {
        $(".neighborhoods").text(neighborhoodDescriptor + ": " + theNeighborhoods.commafy());
    }

    // fetch the metrics and make numbers and charts
    //console.log("activeMergeJSON = " + activeMergeJSON);
    $.get(activeMergeJSON, function(data) {
    	//console.log("activeMergeJSON data = "+JSON.stringify(data));
        theData = data;
        // console.log("theData = "+ JSON.stringify(theData));
        createData(theFilter);
        createCharts();
    });

});
