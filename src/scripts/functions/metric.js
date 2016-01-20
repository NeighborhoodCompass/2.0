// *************************************************
// Process the new metric (slider/time, data extent and quantiles, set year values)
// *************************************************
function processMetric() {
    var keys = _.without(_.keys(model.metric[0]), "id");
	//console.log("processMetric _ = "+_.keys(model));
    model.year = keys.length - 1;
    model.years = keys;
    $('.time-year').text(keys[model.year].replace("y_", ""));

    // hide or show year related stuff
    if (model.years.length > 1) {
        $(".temporal").show();
        // set slider and time related stuff
        $('.slider label').remove();
        $(".slider").slider("option", "max", keys.length - 1).each(function() {
            var vals = $(this).slider("option", "max") - $(this).slider("option", "min");
            for (var i = 0; i <= vals; i++) {
                // Create a new element and position it with percentages
                var el = $('<label>' + keys[i].replace("y_", "") + '</label>').css('left', (i/vals*100) + '%');
                // Add the element inside #slider
                $(this).append(el);
            }
        });
        $(".slider").slider("value", $(".slider").slider("option", "max"));
    } else {
        $(".temporal").hide();
    }


    // Set up data extent
    var theVals = [];
    _.each(keys, function(key, i) {
        theVals = theVals.concat(dataStrip(model.metric, key));
    });
    x_extent = d3.extent(theVals);

    // set up data quantile from extent
    quantize = d3.scale.quantile()
        .domain(x_extent)
        .range(d3.range(colorbreaks).map(function (i) {
            return "q" + i;
        }));
}

// ****************************************
// Record history via pushstate and GA
// ****************************************
function recordMetricHistory() {
    // write metric viewed out to GA
    //console.log("recordMetricHistory test0");
    if (window.ga) {
    	//console.log("recordMetricHistory test1");
        theMetric = $("#metric option:selected");
        ga('send', 'event', 'metric', theMetric.text().trim(), theMetric.parent().prop("label"));
    	//console.log("recordMetricHistory test2");
    }
    //console.log("recordMetricHistory test2.5");
    if (history.pushState) {
    	//console.log("recordMetricHistory test3");
    	// console.log("history.pushState = "+history.pushState);
        history.pushState({myTag: true}, null, "?t=" + activeLayer + "&m=" + model.metricId + "&n=" + model.selected.join());
    	//console.log("recordMetricHistory test4");
    }
}


// ****************************************
// Get a count of neighborhoods in each quantile (array)
// ****************************************
function quantizeCount(data) {
    var q1 = _.countBy(data, function (d) {
        return quantize(d);
    });
    var q2 = [];
    for (var i = 0; i <= colorbreaks - 1; i++) {
        if (!q1["q" + i]) { q1["q" + i] = 0; }
        q2.push({
            "key": "q" + i,
            "value": q1["q" + i]
        });
    }
    return q2;
}

// ****************************************
// Make the nerd table via Underscore template
// ****************************************
function drawTable() {
	//*****Set Underscore Variables here. 
	var template = _.template($("script.template-table").html()),
        theSelected = dataFilter(model.metric, model.selected),
        theAccuracy = dataFilter(model.metricAccuracy, model.selected),
        theRaw = dataFilter(model.metricRaw, model.selected),
        keys = Object.keys(model.metric[0]);
	//console.log("templateFinished");
    $(".datatable-container").html(template({
        "theSelected": theSelected,
        "theAccuracy": theAccuracy,
        "theRaw": theRaw,
        "keys": keys
    }));
    //console.log("datatable-container finished");
}

// ****************************************
// Update stat boxes for study area and selected
// Stat boxes are those two suckers sitting above the charts
// ****************************************
function updateStats() {
	//console.log("updateStats Fired");
    var m = model.metricId,
        keys = Object.keys(model.metric[0]),
        theStat,
        params = {},
        year = model.years[model.year],
        template = _.template($("script.template-statbox").html());

    // median
    theStat = median(_.map(model.metric, function(num){ if ($.isNumeric(num[keys[model.year + 1]])) { return Number(num[keys[model.year + 1]]); } }));
    $(".median").html(dataPretty(theStat, m));
	//console.log("theStat1 = " + theStat);
    
    // set the units for the stat boxes
    params.mainUnits = nullCheck(metricConfig[model.metricId].label);
    // params.rawUnits = nullCheck(metricConfig[model.metricId].raw_label);

    // County stat box
    params.topText = "COUNTY";
    theStat = dataCrunch(year);
    //console.log("theStat2 = " + theStat);
    params.mainNumber = dataPretty(theStat, m);
    // raw number
    // console.log("model = " + JSON.stringify(model));
    // console.log("model title = "+model.metricId);
    // console.log("model year = "+model.year);
    // console.log("model.metricRaw = "+JSON.stringify(model.metricRaw[0], null, 2));
    // if (metricConfig[model.metricId].raw_label) {
        // //console.log("dataSum(model.metricRaw, year).toFixed(0).commafy(); = " +dataSum(model.metricRaw, year).toFixed(0).commafy());
        // //console.log("model.metricRaw = "+model.metricRaw + "year = " + year);
        // params.rawTotal = dataSum(model.metricRaw, year).toFixed(0).commafy();
    // }
    
    // write out stat box
    $(".stat-box-county").html(template(params));

    // Selected NPAs
    params.topText = 'SELECTED <a href="javascript:void(0)" tabindex="0" class="meta-definition" data-toggle="popover" data-content="' + neighborhoodDefinition + '">' + neighborhoodDescriptor.toUpperCase() + 's</a>';
    // main number
    theStat = dataCrunch(year, model.selected);
    params.mainNumber = dataPretty(theStat, m);
    // raw number
    // if (metricConfig[model.metricId].raw_label) {
        // theStat = dataSum(model.metricRaw, year, model.selected);
        // if ($.isNumeric(theStat)) { theStat = theStat.toFixed(0).commafy(); }
        // params.rawTotal = theStat;
    // }
    // write out stat box
    $(".stat-box-neighborhood").html(template(params));

}

// ****************************************
// Hover highlights for all except the map
// ****************************************
function addHighlight(elem) {
	console.log ("addHighlight elem = " + JSON.stringify(elem));
    if (elem.attr('data-id')) {
    	//console.log("if elem.attr('data-id')");
        var theId = elem.attr('data-id');
        console.log("addHighlight theId = "+theId);
        var theValue = $('.geom[data-id="' + theId + '"]').attr("data-value");
        d3.selectAll('[data-id="' + theId + '"]').classed("d3-highlight", true).transition().attr("r", 8);
        // if ($.isNumeric(theValue)) {
            // if(! elem.closest(".barchart-container").length ) { valueChart.pointerAdd(theId, theValue, ".value-hover"); }
        // }
    }
    else {
    	//console.log("else elem.attr('data-id')");
        d3.selectAll('[data-quantile="' + elem.attr('data-quantile') + '"]').classed("d3-highlight", true);
    }
}
function removeHighlight(elem) {
    if (elem.data('id')) {
        var theId = elem.attr('data-id');
        d3.selectAll('[data-id="' + theId + '"]').classed("d3-highlight", false).transition().attr("r", 5);
        // valueChart.pointerRemove(theId, ".value-hover");
    }
    else {
        d3.selectAll('[data-quantile="' + elem.data('quantile') + '"]').classed("d3-highlight", false);
    }
}
var stallToolTip = false;
//TODO create custom events to stall addition of tooltip until previous tooltip has been removed. 
function addHighlightFromBarChart(theId) {
	console.log("addToolTip theID = " + theId );
	var i;
	if (theId == "County Average"){
		// console.log("County Average model metric = "+JSON.stringify(model.metric));
		// console.log("model metric length = "+model.metric.length);
		jQuery.each(model.metric, function(i, val) {
			d3.selectAll('[data-id="' + val.id + '"]').classed("d3-highlight", true).transition().attr("r", 8);
		});
	}
	else if(theId == "Selection Average"){
		for(i = 0; i < model.selected.length; i++) {
			// console.log("model.selected[i]"+model.selected[i]);
			d3.selectAll('[data-id="' + model.selected[i] + '"]').classed("d3-highlight", true).transition().attr("r", 8);
		}
    }
	else{ 
		// console.log("highlight");
    	// console.log( "JSON.stringify(d3.selectAll('[data-id= & etc...'"+JSON.stringify(d3.selectAll('[data-id="' + theId + '"]')));
        d3.selectAll('[data-id="' + theId + '"]').classed("d3-highlight", true).transition().attr("r", 8);
        // console.log("d3.selectAll('[data-id=' + theId + ']) = "+JSON.stringify(d3.select('[data-id="' + theId + '"]')));
        var d3geom = d3.selectAll(".geom");
        // console.log("$geom = " + JSON.stringify($('.geom'))+" "+ $('.geom').length);
        // console.log("$geom[theId] = " + JSON.stringify($('.geom')[theId])+" "+$('.geom')[theId].length);
        if(stallToolTip == false){
        	//$('.geom').tooltip('show');
        	console.log("add stallToolTip & theId = " + stallToolTip+" & "+theId);
        	stallToolTip=true;
        }
        
    }
}
function removeHighlightFromBarChart(theId) {
	console.log("removeToolTip theID = " + theId );
	if (theId == "County Average"){
		jQuery.each(model.metric, function(i, val) {
			d3.selectAll('[data-id="' + model.metric[i].id + '"]').classed("d3-highlight", false).transition().attr("r", 5);
		});
		
	}
	else if(theId == "Selection Average"){
		for(var i = 0; i < model.selected.length; i++) {
			//console.log("model.selected[i]"+model.selected[i]);
    		d3.selectAll('[data-id="' + model.selected[i] + '"]').classed("d3-highlight", false).transition().attr("r", 5);
		}
	}
	else{ 
		console.log("remove stallToolTip & theId = " + stallToolTip+" & "+theId);
    	d3.selectAll('[data-id="' + theId + '"]').classed("d3-highlight", false).transition().attr("r", 5);
    	//$('.geom').tooltip('hide');
    	stallToolTip = false;
    }
}
$(document).on({
    mouseenter: function(event){
        event.stopPropagation();
        addHighlight($(this));
    },
    mouseleave: function(event){
    event.stopPropagation();
        removeHighlight($(this));
    }
}, '.metric-hover');
