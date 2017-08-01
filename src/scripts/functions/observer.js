// ****************************************
// Execute model changes
// ****************************************
function modelChanges(changes) {
	//console.log("changes = "+JSON.stringify(changes, null, 2));
    var tasklist = _.pluck(changes, 'name');
    //console.log("tasklist = "+tasklist);
    // Just got the geometry yo. Let's make a map.
    if (_.contains(tasklist, "targetLayer")) {
    	//console.log("tasklist targetLayer");
    	if(activeLayer == "census"){
	    	// neighborhoods = censusFeatures;
  	        // metricConfig = censusMetricConfig;
	        // metricConfig = neighborhoodMetricConfig;
	  		// var modelTargetLayer = model.targetLayer;
	    	// console.log('model.targetLayer = '+modelTargetLayer);
	    	// metricConfig = censusMetricConfig;
	        // map.removeLayer(d3NeighborhoodLayer);
	        // getMetricValues();
	        // model.metricId =  $("#metric").val();
	        // d3Layer = undefined;
	        // // fetchMetricData(model.metricId, changeTargetLayer);
	        // fetchMetricData(model.metricId);
	    }
    	else if(activeLayer == "neighborhood"){
    		// neighborhoods = neighborhoodFeatures;
      		// metricConfig = neighborhoodMetricConfig;
	  		// var modelTargetLayer = model.targetLayer;
	    	// console.log('model.targetLayer = '+modelTargetLayer);
	        // map.removeLayer(d3CensusLayer);
	        // getMetricValues();
	        // model.metricId =  $("#metric").val();
	        // d3Layer = undefined;
	        // // fetchMetricData(model.metricId, changeTargetLayer);
	        // fetchMetricData(model.metricId);
	    }
        
        // switchMap(modelTargetLayer);
    	
    }
    if (_.contains(tasklist, "geom")) {
    	//console.log("tasklist geom activeLayer = " + activeLayer + " map.hasLayer(d3NeighborhoodLayer) = " + map.hasLayer(d3NeighborhoodLayer) + " map.hasLayer(d3CensusLayer) = " + map.hasLayer(d3CensusLayer)+" blInitMap = " + blInitMap);
        if (blInitMap== true){
            //console.log("tasklist geom initMap");
            initMap();
	        initTypeahead();
        }
    }
	// the metric id changed, get some data
    if (_.contains(tasklist, "metricId")) {
        // Make sure a year has been set before
        //console.log("metricId fired");
        var metricChange = _.filter(changes, function(el) { return el.name === "metricId"; });
        if (metricChange[0].hasOwnProperty('oldValue')) {
            // change chosen if not samsies
            if (model.metricId !== undefined && $(".chosen-select").chosen().val() !== model.metricId) {
                $('.chosen-select').val(model.metricId);
                $('.chosen-select').trigger("chosen:updated");
            }
            //console.log("observer model.metricId = "+model.metricId);
            fetchMetricData(model.metricId);
        	verticalBarChart();
        }
    }

    // Metrics in the house
    if (_.contains(tasklist, "metric")) {
        processMetric();
        drawMap();
        drawBarChart();
        //*****Remove the line chart functions
        // lineChartCreate();
        updateMeta();
        updateStats();
        drawTable();
        if (recordHistory) { recordMetricHistory(); }
        recordHistory = true;
        verticalBarChart();
    }

    // the selected set changed
    if (_.contains(tasklist, "selected")) {
    		//console.log("tasklist selected model.selected.length = "+model.selected.length);
      		d3.selectAll(".geom").classed("d3-select", false);
            d3.selectAll(".geom").classed("d3-select", function(d) { return _.contains(model.selected, $(this).attr("data-id")); });
            $(".report-launch").removeClass("disabled");
            // valueChart.selectedPointer(".value-select");
        	//*****Remove the line chart functions
        	// lineChartCreate();
            updateStats();
            drawTable();
            if (recordHistory) { recordMetricHistory(); }
            recordHistory = true;
        if (model.selected.length === 0) {
            //console.log("tasklist selected model.selected.length === 0");
            // disable report links and remove map marker
            $(".report-launch").addClass("disabled");
            try { 
            	map.removeLayer(marker); 
            	if (model.selected.length == 0){
			        //console.log("drawTable model.selected.length == 0");
			        if (blTargetLayerChange == true){
				        //console.log("blTargetLayerChange == true");
				        var evt = document.createEvent("Event");
						evt.initEvent("drawTable targetLayerChanged",true,true);
						document.dispatchEvent(evt);
						verticalBarChart();
					}
			    } 
            }
            catch (err) {}
        }
    }
}


function changeYear() {
    // change year slider if not samsies
    if ($('.slider').slider('value') !== model.year) {
        $('.slider').slider('value', model.year);
        verticalBarChart();
    }
    var keys = Object.keys(model.metric[0]);
    $('.time-year').text(keys[model.year + 1].replace("y_", ""));
    // set up data quantile from extent
    //console.log("changeYearFail");
    quantize = d3.scale.quantile()
        .domain(x_extent)
        .range(d3.range(colorbreaks).map(function (i) {
            return "q" + i;
        }));
    drawMap();
    drawBarChart();
    drawTable();
    updateStats();
}
function getMetricValues(){
	//console.log("getMetrticValues Fired");
	$("#metric").empty();
	//console.log("selectLength = " + $('#metric option').length);
	// _.each(metricConfig, function(el, key) {
        // console.log("genericMetric = "+el.title);
    // });
	// load metrics
    console.log("metricConfig: " + JSON.stringify(metricConfig));
    var selectVals = '',
        selectGroup = '';
    _.each(metricConfig, function(el, key) {
        // console.log("el.title = " + el.title);
        if (el.category === selectGroup) {
            selectVals += '<option value="' + key + '">' + el.title + '</option>';
        } else {
            if (selectVals.length > 0) { selectVals += '</optgroup>'; }
            selectVals += '<optgroup label="' + el.category + '">';
            selectVals += '<option value="' + key + '">' + el.title + '</option>';
            selectGroup = el.category;
        }
    });
    // console.log("selectVals = " + selectVals);
    selectVals += '</optgroup>';
    $("#metric").html(selectVals);
    $("#metric").trigger("chosen:updated");
    //console.log("selectLength = " + $('#metric option').length);
	//console.log("selected Metric = " + $("#metric option:selected").text());
}
function changeTargetLayer() {
		processMetric();
        drawMap();
        drawBarChart();//
        //*****Remove the line chart functions
        lineChartCreate();//
        updateMeta();
        updateStats();
        drawTable();
        // createVerticalBarChart();
}
