// ****************************************
// Global variables and settings
// ****************************************
var map,                // leaflet map
    quantize,           // d3 quantizer for color breaks
    x_extent,           // extent of the metric, including all years
    timer,              // timer for year slider
    barchartWidth,      // for responsive d3 barchart
    marker,             // marker for geocode
    d3CensusLayer,
    d3NeighborhoodLayer,
    d3Layer,            // the d3Layer on leaflet
    tour,               // I-don't-want-to-do-real-help thing
    recordHistory = false;  // stupid global toggle so it doesn't record page load metric etc. to google analytics
    var activeLayer;
    var blTargetLayerChange;

	if (loadLayer == "census"){
	activeLayer = "census";
	}
	else{
		activeLayer = "neighborhood";
	}
// ****************************************
// The One Model of Sauron. Change this and Frodo dies.
// ****************************************
var model = {
    "selected": []
};

var nhModel = {
	"selected": []
};

// var model;
// lodash/underscore template desucking
_.templateSettings.variable = "rc";

// ****************************************
// Document Ready - kickoff
// ****************************************
$(document).ready(function () {

	$(".geocodeButton").click(function(e) {
        // console.log("1");
        var address = document.getElementById('searchbox').value.toUpperCase();
        if (address.indexOf("DURHAM NC") == -1 || address.indexOf("DURHAM, NC") == -1) {
            //console.log("2");
        	if (address.indexOf("DURHAM") !== -1){
               // console.log("3");
        		address=address.split("DURHAM",1);
            }
            address.trim();
            address = address + " Durham, NC";
        }
        geocoder = new google.maps.Geocoder(); 
        geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            // console.log("4");
        	var lat = results[0].geometry.location.lat();
            var lon = results[0].geometry.location.lng();
            addMarker(lat, lon);
            // performIntersection(lat,lon);
        } else {
            $('#result').html('Geocode was not successful for the following reason: ' + status);
        }

        
      }); 
    });
		
	getMetricValues();
	if (loadLayer == "census"){
		model.targetLayer = "census";
	}
	else{
		model.targetLayer = "neighborhood";
	}
	
	// Start with random metric if none passed
    if (getURLParameter("t") !== "null"){
    	console.log('getURLParameter("t") = '+ getURLParameter("t"));
    	// if(getURLParameter("t") == 'census'){
    		// switchToCensusTargetLayer();
      	// }
    	if(getURLParameter("t") == 'neighborhood'){
      		model.targetLayer = "neighborhood";
      		activeLayer = "neighborhood";
      		neighborhoods = neighborhoodFeatures;
      		metricConfig = neighborhoodMetricConfig;
      		alert($("#metric").val());
      		getMetricValues();
	        model.metricId =  $("#metric").val();
	        alert($("#metric").val());
      	}
    }
    // Start with random metric if none passed
    if (getURLParameter("m") !== "null") {
    	
        $("#metric option[value='" + getURLParameter('m') + "']").prop('selected', true);
    }
    else {
        var $options = $('.chosen-select').find('option'),
            random = Math.floor((Math.random() * $options.length));
        $options.eq(random).prop('selected', true);
    }
    //set initial target layer variables for cansus at startup
    model.metricId =  $("#metric").val();

    // set up chosen
    $(".chosen-select").chosen({width: '100%', no_results_text: "Not found - ", "disable_search_threshold": 10}).change(function () {
        model.metricId = $(this).val();	
    });
    $(".chosen-search input").prop("placeholder", "search metrics");
    $(".chosen-select").removeClass("hide");  // just in case it's mobile
	
    // set window popstate handler
    if (history.pushState) {
        window.addEventListener("popstate", function(e) {
            if (getURLParameter("t") !== "null" && getURLParameter("t") !== activeLayer) {
	            recordHistory = false;
	            model.metricId = getURLParameter('m');
			}
            if (getURLParameter("m") !== "null" && getURLParameter("m") !== model.metricId) {
	            recordHistory = false;
	            model.metricId = getURLParameter('m');
			}
	        if (getURLParameter("n") !== "null" && !model.selected.compare(getURLParameter("n").split(","))) {
	            recordHistory = false;
	            model.selected = getURLParameter("n").split(",");
			} 
			else if (getURLParameter("n") === "null") {
	            recordHistory = false;
	            model.selected = [];
			}
		});
    }

    // launch report window with selected neighborhoods
    $("button.report-launch").on("click", function() {
        window.open("report.html?n=" + model.selected.join());
    });

	$(".censusRadio").click(function() {
	  //TODO - record last selected neighborhood metric to that it may be reset if neighborhoods are selected again
	  //TODO - set last selected census metric again 
	  //console.log("censusRadioClicked");
	  activeLayer = "census";
      if (model.selected.length > 0){
      	  document.addEventListener("targetLayerChanged",changeModelTargetLayer());
          blTargetLayerChange = true;
      	  model.selected = [];
          if (recordHistory) { recordMetricHistory(); }
      }
      else{
      	switchToCensusTargetLayer();
      }

    });
    $(".neighborhoodsRadio").click(function() {
	  //TODO - record last selected census metric to that it may be reset if census is selected again
	  //TODO - set last selected neighborhood metric again
	  //console.log("neighborhood radio Clicked");
	  //console.log("model.selected.length = "+model.selected.length);
	  activeLayer = "neighborhood";
      if (model.selected.length > 0){
      	  //console.log("more than one selected feature");
      	  document.addEventListener("targetLayerChanged",changeModelTargetLayer());
          blTargetLayerChange = true;
      	  model.selected = [];
      	  if (recordHistory) { recordMetricHistory(); }
      }
      else{
      	switchToNeighborhoodTargetLayer();
      }
      
    });
    // Social media links
    $(".social-links a").on("click", function() {
        window.open($(this).data("url") + encodeURI(document.URL), "", "width=450, height=250");
    });

    // download table to csv
    // Because IE doesn't do DATA URI's for cool stuff, I'm using a little utility PHP file
    // on one of my servers. Feel free to use it, but if you want to host your own, the PHP
    // code is:
    // <?php
    // header("Content-type: application/octet-stream");
    // header("Content-Disposition: attachment; filename=\"my-data.csv\"");
    // $data=stripcslashes($_REQUEST['csv_text']);
    // echo $data;
    // ?>
    $('body').on('click', '.table2CSV', function() {
        var csv = $(".datatable-container table").table2CSV({ delivery: 'value' });
        $("#csv_text").val(csv);
        $("#filename").val($("#metric [value='" + model.metricId + "']").text().trim());
    	$("#filename").val($("#metric [value='" + model.metricId + "']").text().trim());
    	// if(activeLayer == "census"){
			// $("#filename").val($("#metric [value='" + model.metricId + "']").text().trim());
    	// }
		// else if(activeLayer == "neighborhood"){
			// $("#filename").val($("#metric [value='" + nhModel.metricId + "']").text().trim());
    	// }
    });


    // Time slider and looper. Seems like a lot of code for this. Curse my stupid brains.
    $(".slider").slider({
        value: 1,
        min: 0,
        max: 1,
        step: 1,
        animate: true,
        slide: function( event, ui ) {
        	model.year = ui.value;
            // if(activeLayer == "census"){
				// model.year = ui.value;
            // }
			// else if(activeLayer == "neighborhood"){
				// nhModel.year = ui.value;
            // }
			changeYear();
        }
    });
    $(".btn-looper").on("click", function () {
        var that = $(this).children("span");
        var theSlider = $('.slider');
        if (that.hasClass("glyphicon-play")) {
            that.removeClass("glyphicon-play").addClass("glyphicon-pause");
            if (theSlider.slider("value") === theSlider.slider("option", "max")) {
                theSlider.slider("value", 0);
            }
            else {
                theSlider.slider("value", theSlider.slider("value") + 1);
            }
            model.year = theSlider.slider("value");
            // if(activeLayer == "census"){
				// model.year = theSlider.slider("value");
			// }
			// else if(activeLayer == "neighborhood"){
				// nhModel.year = theSlider.slider("value");
			// }
            changeYear();
            timer = setInterval(function () {
                    if (theSlider.slider("value") === theSlider.slider("option", "max")) {
                        theSlider.slider("value", 0);
                    }
                    else {
                        theSlider.slider("value", theSlider.slider("value") + 1);
                    }
                    model.year = theSlider.slider("value");
                    // if(activeLayer == "census"){
						// model.year = theSlider.slider("value");
                    // }
					// else if(activeLayer == "neighborhood"){
						// nhModel.year = theSlider.slider("value");
                    // }
                    changeYear();
                }, 3000);
        }
        else {
            that.removeClass("glyphicon-pause").addClass("glyphicon-play");
            clearInterval(timer);
        }
    });

    // Don't let clicked toggle buttons remain colored because ugly
    $(".datatoggle").on("focus", "button", function() { $(this).blur(); });

    // Scroll to begin position (i.e. get past enormous jumbotron)
    $(".scrollToStart").on("click", function() {
        var pos = $('.container-content').position().top - $('.navbar').height();
        $("html, body").animate({ scrollTop: pos }, "slow", function() {
            $(".focus_ring").addClass("focus_active");
        });
    });

    // Clear selected button.
    $(".select-clear").on("click", function() {
        model.selected = [];
    });

    // Now to put in some popover definitions. I hate popover definitions, but I am just a cog in the machine. The
    // really crappy machine.
    $('body').popover({
        selector: '[data-toggle=popover]',
        "placement": "auto",
        "trigger": "focus",
        "container": "body"
    });

    // Toggle the map, making polys less opaque and activating a base layer.
    $(".toggle-map").on("click", function() {
        var txt = $(this).text() === "Hide Map" ? 'Show Map' : 'Hide Map';
        console.log("toggle txt = "+txt);
        if (txt !== "Show Map") {
            $(".geom").css("fill-opacity", "0.6");
            $(".leaflet-overlay-pane svg path:not(.geom)").css("stroke-opacity", "0");
            map.addLayer(baseTiles);
        } else {
            $(".geom").css("fill-opacity", "1");
            $(".leaflet-overlay-pane svg path:not(.geom)").css("stroke-opacity", "0.6");
            map.removeLayer(baseTiles);
        }
        $(this).text(txt);
    });

    // Set up Tourbus for noob assistance
    var tour = $('#dashboard-tour').tourbus({ onStop: function( tourbus ) {$("html, body").animate({ scrollTop: 0 }, "slow");} });
    $('.btn-help').on("click", function() {
        tour.trigger('depart.tourbus');
    });

    // Use Google Analytics to track outbound resource links.
    $(".meta-resources").on("mousedown", "a", function(e){
        if (window.ga && e.which !== 3) {
            ga('send', 'event', 'resource', $(this).text().trim(), $("#metric option:selected").text().trim());
        }
    });

    // Contact form. You'll want to send this someplace else via config.js
    $(".contact form").submit(function(e) {
        e.preventDefault();
        $(".contact").dropdown("toggle");
        if ($("#message").val().trim().length > 0) {
            $.ajax({
                type: "POST",
                url: contactConfig.url,
                data: {
                    email: $("#email").val(),
                    url: window.location.href,
                    agent: navigator.userAgent,
                    subject: "Quality of Life Dashboard Feedback",
                    to: contactConfig.to,
                    message: $("#message").val()
                }
            });
        }
    });
    $('.dropdown .contact input').click(function(e) {
        e.stopPropagation();
    });

    // Set up the map
    mapCreate();

    // initialize the bar chart
    // valueChart = barChart();

	//*****todo - redo this for new barcharts
    // Window resize listener so the bar chart can be responsive
    // d3.select(window).on("resize", function () {
        // if ($(".barchart").parent().width() !== barchartWidth) {
            // // set up data quantile from extent
            // quantize = d3.scale.quantile()
                // .domain(x_extent)
                // .range(d3.range(colorbreaks).map(function (i) {
                    // return "q" + i;
                // }));
            // drawBarChart();
        // }
    // });

    // ****************************************
    // Initialize the observer
    // ****************************************
    Object.observe(model, function(changes) {
        modelChanges(changes);
    });
    // Object.observe(nhModel, function(changes) {
        // modelChanges(changes);
    // });
	
    // Get the data and kick everything off
    alert(model.metricId);
    fetchMetricData(model.metricId);

    // turn on form labels if placeholder not supported - curse you IE9
    if (!('placeholder' in document.createElement('input'))) {
        $("label").removeClass("sr-only");
    }
    // createVerticalBarChart();
	
});
function switchToCensusTargetLayer(){
	      blInitMap = true;
      //console.log("switchToCensusTargetLayer");
      model.targetLayer = "census";
      
	  neighborhoods = censusFeatures;
  	        metricConfig = censusMetricConfig;
	        metricConfig = neighborhoodMetricConfig;
	  		var modelTargetLayer = model.targetLayer;
	    	//console.log('model.targetLayer = '+modelTargetLayer);
	    	metricConfig = censusMetricConfig;
	        map.removeLayer(d3NeighborhoodLayer);
	        getMetricValues();
	        model.metricId =  $("#metric").val();
	        d3Layer = undefined;
	        // fetchMetricData(model.metricId, changeTargetLayer);
	        fetchMetricData(model.metricId);
}
function switchToNeighborhoodTargetLayer(){
	blInitMap = true;
      //console.log("switchToNeighborhoodTargetLayer");
      model.targetLayer = "neighborhood";
      
          		neighborhoods = neighborhoodFeatures;
      		metricConfig = neighborhoodMetricConfig;
	  		var modelTargetLayer = model.targetLayer;
	    	//console.log('model.targetLayer = '+modelTargetLayer);
	        map.removeLayer(d3CensusLayer);
	        getMetricValues();
	        model.metricId =  $("#metric").val();
	        d3Layer = undefined;
	        // fetchMetricData(model.metricId, changeTargetLayer);
	        fetchMetricData(model.metricId);
}
function changeModelTargetLayer(){
	//console.log("changeModleTargetLayer activeLayer = "+activeLayer);
	if (activeLayer == "census"){
		//console.log("switch to census target layer");
		switchToCensusTargetLayer();
	}
	else if (activeLayer == "neighborhood"){
		//console.log("switch to neighborhood target layer");
		switchToNeighborhoodTargetLayer();
	}
	if (blTargetLayerChange == true){
		document.removeEventListener("targetLayerChanged",changeModelTargetLayer);
		blTargetLayerChange = false;
	}
}

//vertical barchart:
var svg, g, xAxisG, xAxisLabel, yAxisG, xScale, yScale, xAxis, yAxis, bars;
var xColumn, yColumn, xAxisLabelText, xAxisLabelOffset = 55;

            

function verticalBarChart() {
	var classlist = [];
	for ( i = 0; i < colorbreaks; i++) {
		classlist.push("q" + i);
	}
	console.log("classlist = " + classlist);
	var quantize = d3.scale.quantile().domain(x_extent).range(d3.range(colorbreaks).map(function(i) {
		return "q" + i;
	}));
	var qtiles = quantize.quantiles();
	console.log("qtiles = " + qtiles);
	var svgLength = $("#verticalChart svg").length;
	var year = model.years[model.year];

	console.log("vertical chart svg length" + $("verticalChart svg").length);
	if (svgLength < 1) {
		createVerticalBarChart();
	} else {
		updateVerticalBarChart();
	}
	function createVerticalBarChart() {
		console.log("verticalBarChart2 1");
		console.log("model.selected = " + model.selected);
		var outputMetricArray = getSelectedData(model.selected);
		var theCountyStat = dataCrunch(year);
		console.log("theCountyStat = " + theCountyStat);
		var theSelectionStat = dataCrunch(year, model.selected);
		console.log("theSelectionStat = " + theSelectionStat);
		var outerWidth = 500;
		bars = outputMetricArray.length;
		var outerHeight = 475;
		var margin = {
			left : 125,
			top : 0,
			right : 25,
			bottom : 60
		};
		var barPadding = 0.03;
		xAxisLabelText = "";
		xAxisLabelOffset = 55;
		var innerWidth = outerWidth - margin.left - margin.right;
		var innerHeight = outerHeight - margin.top - margin.bottom;

		svg = d3.select("#verticalChart").append("svg").attr("width", outerWidth).attr("height", outerHeight);
		g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		xAxisG = g.append("g").attr("class", "x axis").attr("transform", "translate(0," + innerHeight + ")");
		xAxisLabel = xAxisG.append("text").style("text-anchor", "middle").attr("x", innerWidth / 2).attr("y", xAxisLabelOffset).attr("class", "label").text(xAxisLabelText);
		yAxisG = g.append("g").attr("class", "y axis");
		console.log("verticalBarChart2 2");
		xScale = d3.scale.linear().range([0, innerWidth]);
		yScale = d3.scale.ordinal().rangeBands([0, innerHeight], barPadding);
		xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(5)// Use approximately 5 ticks marks.
		.tickFormat(d3.format("s"))// Use intelligent abbreviations, e.g. 5M for 5 Million
		.outerTickSize(0);
		// Turn off the marks at the end of the axis.
		yAxis = d3.svg.axis().scale(yScale).orient("left").outerTickSize(0);
		// Turn off the marks at the end of the axis.

		//var jsonRoot = JSON.parse(model.metric);
		//d3.json(model.metric, type, render);

		// metricArray.push(model.metric);
		//metricArray = JSON.parse(metricArray);
		//console.log("metricArray = "+JSON.stringify(metricArray));
		bars = outputMetricArray.length;
		render(outputMetricArray);
		// d3.csv("data/metric/rPOP.csv", type, render);
		// d3.json("data/verticalChart2Data.csv", type, render);
	}

	function render(data) {
		xColumn = year;
		yColumn = "id";
		//console.log("data = " + JSON.stringify(data));
		// console.log("data[0] = "+ JSON.stringify(data[0]));
		// console.log("model.metric = "+ JSON.stringify(model.metric));
		xScale.domain([0, d3.max(data, function(d) {
			return d[xColumn];
		})]);
		yScale.domain(data.map(function(d) {
			return d[yColumn];
		}));
		xAxisG.call(xAxis);
		yAxisG.call(yAxis);
		var bars = g.selectAll("rect").data(data, function(d) {
			return d[yColumn];
		}).attr("class", function(d, i) {
			return classlist[getClosestValues(d[xColumn])];
		});
		bars.enter().append("rect").attr("height", yScale.rangeBand()).attr("class", function(d, i) {
			return classlist[getClosestValues(d[xColumn])];
		}).style("stroke", "#303030")
		  .style("stroke-width", 0.25);
		bars.attr("x", 0).attr("y", function(d) {
			return yScale(d[yColumn]);
		}).attr("width", function(d) {
			return xScale(d[xColumn]);
		}).attr("class", function(d, i) {
			return classlist[getClosestValues(d[xColumn])];
		}).on("mouseover", function(d) {
			addHighlightFromBarChart(d.id);
			d3.select(this).attr("class", function() {
				return "orange";
			});
		}).on("mouseout", function(d) {
			removeHighlightFromBarChart(d.id);
			d3.select(this).attr("class", function(d, i) {
				return classlist[getClosestValues(d[xColumn])];
			});
		});
		bars.exit().remove();
		bars.transition().attr("class", function(d, i) {
			//console.log("d & i = "+ d[xColumn] +" & "+i);
			return classlist[getClosestValues(d[xColumn])];
		}).attr("height", yScale.rangeBand());
		// .attr("x",function(d){return xScale(d[xColumn]);});
	}

	function type(d) {

		d[yColumn] = +d[xColumn];
		return d;
	}

	function updateVerticalBarChart() {
		console.log("verticalBarchartCreate");
		console.log("document.getElementById('verticalChart').children = " + document.getElementById("verticalChart").children);
		console.log("verticalBarChart2 1");
		console.log("model.selected = " + model.selected);

		outputMetricArray = getSelectedData(model.selected);
		console.log("bars = " + bars);
		bars += outputMetricArray.length;
		console.log("bars = " + bars);
		//TODO update all of the heights of the svg and g element
		render(outputMetricArray);
	}

	function getClosestValues(featureValue) {
		var lo, hi;
		for (var i = qtiles.length; i--; ) {
			if (qtiles[i] <= featureValue && (lo === undefined || lo < qtiles[i]))
				lo = qtiles[i];
			if (qtiles[i] >= featureValue && (hi === undefined || hi > qtiles[i]))
				hi = qtiles[i];
		};

		// console.log("featureValue = "+featureValue);
		// console.log("qtiles = "+qtiles);
		// console.log("[lo, hi] = "+[qtiles.indexOf(lo), qtiles.indexOf(hi)]);
		if (qtiles.indexOf(lo) == -1 && qtiles.indexOf(hi) == 0) {
			return 0;
		} else if (qtiles.indexOf(lo) == 0 && qtiles.indexOf(hi) == 1) {
			return 1;
		} else if (qtiles.indexOf(lo) == 1 && qtiles.indexOf(hi) == 2) {
			return 2;
		} else if (qtiles.indexOf(lo) == 2 && qtiles.indexOf(hi) == 3) {
			return 3;
		} else if (qtiles.indexOf(lo) == 3 && qtiles.indexOf(hi) == -1) {
			return 4;
		}
	}

	function getQValue(featureValue) {
		for ( i = 1; i < qtiles.length; i++) {
			console.log("featureValue = " + featureValue);
			if (qtiles[i] >= featureValue) {
				console.log("[i - 1, i] = " + [i - 1, i]);
				return i - 1;
			}
		}
	}

}

