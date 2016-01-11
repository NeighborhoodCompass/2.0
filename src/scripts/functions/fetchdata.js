// ****************************************
// Fetch metric data.
// Depending on the metric, different files may be fetched.
// ****************************************
//~*~*~*~*~*This is where you set the data path
//ToDo - set the data path variable relative to the selected target layer.  
function fetchAccuracy(m) {
    //console.log(" fetchAccuracy activeLayer = "+activeLayer);
    //console.log(metricConfig[m]);
    if (metricConfig[m].accuracy) {
    	return $.get("data/metric/" + m + "-accuracy.json");
    }
    else { return [[]]; }
}
function fetchRaw(m) {
    //console.log("fetchRaw activeLayer = "+activeLayer);
    if (metricConfig[m].raw_label || metricConfig[m].type === "normalize" || metricConfig[m].type === "sum") {
        //console.log("$.get(data/metric/r + metricConfig[m].metric + .json) = " + JSON.stringify($.get("data/metric/r" + metricConfig[m].metric + ".json")));
    	return $.get("data/metric/r" + metricConfig[m].metric + ".json");
    }
    else { return [[]]; }
}
function fetchDenominator(m) {
    //console.log("fetchDenominator activeLayer = "+activeLayer);
    if (metricConfig[m].type === "normalize") {
	    return $.get("data/metric/d" + metricConfig[m].metric + ".json");
    }
    else { return [[]]; }
}
function fetchNormalized(m) {
    //console.log("fetchNormalized activeLayer = "+activeLayer);
    if (metricConfig[m].type === "mean") {
        //console.log("fetchNormalize metric = "+$.get("data/metric/n" + metricConfig[m].metric + ".json"));
		return $.get("data/metric/n" + metricConfig[m].metric + ".json");
	}
    else { return [[]]; }
}
function fetchGeometry() {
	//TODO 08182015 - what is the d3Layer = how do we make it null for the typeof() test
	// console.log("fetchGeometry fired");
	// console.log("d3Layer = "+d3Layer);
	// console.log("geom[0] = " + JSON.stringify(d3Layer, null, 2));
    if (typeof(d3Layer) == "undefined") {
    	//console.log("fetchGeometry Fired");
        if(activeLayer == "census"){
			//console.log("fetchGeometry activeLayer = "+activeLayer);
    		return $.get(censusTOPOJSON);
		}
		else if(activeLayer == "neighborhood"){
			//console.log("fetchGeometry activeLayer = "+activeLayer);
    		return $.get(neighborhoodTOPOJSON);
		}
	
    }
    else { return [[]]; }
}

var feature;
function fetchMetricData(m, callback) {
    // flush
    //console.log("fetchMetricDAta");
    model.metricAccuracy = [];
    model.metricRaw = [];
    model.denominator = [];
    //console.log("fetchMetricData start");
	//console.log("fetchMetricData model.metricId = " + m);
	//console.log("fetchMetricData metricConfig = " + JSON.stringify(metricConfig, null, 2));
	//console.log("fetchMetricData metricConfig[m] = " + JSON.stringify(metricConfig[m], null, 2));
    // fetch data based on metric
    //console.log("fetchdata metricConfig[m].type = "+metricConfig[m].type);
    var i;
    switch (metricConfig[m].type) {
        case "sum":
        	$.when(
                fetchGeometry(),
                fetchAccuracy(m),
                fetchRaw(m)
            ).then(function(geom, accuracy, raw) {
            	//console.log("fetchMetricData sum raw");
            	//console.log("geom[0] = " + JSON.stringify(geom[0], null, 2));
                if (geom[0].type) { 
                	if (activeLayer == "census"){
                		feature = geom[0].objects.blockgroups.geometries;
                		// for (i=0;i<feature.length;i++){
                			// console.log("feature id = " + feature[i].id);
                		// }
                		//feature.each(function(index, value) { console.log(value.id);});
                		// console.log ("sum raw model.geom = " + feature.length); 
                	}
                	else{
                		feature = geom[0].objects.neighborhoods.geometries;
                		// for (i=0;i<feature.length;i++){
                			// console.log("feature id = " + feature[i].id);
                		// }
                		//feature.each(function(index, value) { console.log(value.id);});
                		// console.log ("sum raw model.geom = " + feature.length); 
                	}
                	//console.log ("sum raw model.geom = " + JSON.stringify(feature, null, 2)); 
                	model.geom = geom[0]; 
                }
                model.metricAccuracy = accuracy[0];
                model.metricRaw = raw[0];
                model.metric = raw[0];
                //console.log("fetchdata model.metric = "+ JSON.stringify(model.metric));
            });
            break;
        case "mean":
            $.when(
                fetchGeometry(),
                fetchAccuracy(m),
                fetchNormalized(m),
                fetchRaw(m)
            ).then(function(geom, accuracy, normalized, raw) {
                //console.log("fetchMetricData sum mean");
            	//console.log("geom[0] = " + JSON.stringify(geom[0], null, 2));
                if (geom[0].type) { 
                	if (activeLayer == "census"){
                		feature = geom[0].objects.blockgroups.geometries;
                		// for (i=0;i<feature.length;i++){
                			// console.log("feature id = " + feature[i].id);
                		// }
                		//feature.each(function(index, value) { console.log(value.id);});
                		// console.log ("sum mean model.geom = " + feature.length); 
                	}
                	else{
                		feature = geom[0].objects.neighborhoods.geometries;
                		// for (i=0;i<feature.length;i++){
                			// console.log("feature id = " + feature[i].id);
                		// }
                		//feature.each(function(index, value) { console.log(value.id);});
                		// console.log ("sum mean model.geom = " + feature.length); 
                	}
                	//console.log ("sum raw model.geom = " + JSON.stringify(feature, null, 2)); 
                	model.geom = geom[0]; 
                }
                model.metricAccuracy = accuracy[0];
                model.metricRaw = raw[0];
                model.metric = normalized[0];
            });
            break;
        case "normalize":
            $.when(
                fetchGeometry(),
                fetchAccuracy(m),
                fetchRaw(m),
                fetchDenominator(m)
            ).then(function(geom, accuracy, raw, denominator) {
                //console.log("fetchMetricData sum normalize");
            	//console.log("geom[0] = " + JSON.stringify(geom[0], null, 2));
                if (geom[0].type) { 
                	if (activeLayer == "census"){
                		feature = geom[0].objects.blockgroups.geometries;
                		// for (i=0;i<feature.length;i++){
                			// console.log("feature id = " + feature[i].id);
                		// }
                		//feature.each(function(index, value) { console.log(value.id);});
                		// console.log ("sum normalize model.geom = " + feature.length); 
                	}
                	else{
                		feature = geom[0].objects.neighborhoods.geometries;
                		// for (i=0;i<feature.length;i++){
                			// console.log("feature id = " + feature[i].id);
                		// }
                		//feature.each(function(index, value) { console.log(value.id);});
                		// console.log ("sum normalize feature.length = " + feature.length); 
                	}
                	// console.log ("sum raw model.geom = " + JSON.stringify(feature, null, 2)); 
                	model.geom = geom[0]; 
                }
                model.metricAccuracy = accuracy[0];
                //console.log("fetchMetricData sum normalize accuracy");
                model.metricRaw = raw[0];
                //console.log("fetchMetricData sum normalize raw");
                model.metricDenominator = denominator[0];
				//console.log("fetchMetricData sum normalize denominator");
                
                var calcMetric = $.extend(true, {}, model.metricRaw);
                var keys = _.without(_.keys(model.metricRaw[0]), "id");

                 _.each(calcMetric, function(theval, i) {
                    _.each(keys, function(key) {
                        theRaw = model.metricRaw[i][key];
                        theDemoninator = model.metricDenominator[i][key];
                        if (metricConfig[m].suffix == "%"){
                        	theval[key] = (theRaw / theDemoninator)*100;
                        }
                        else{
                        	theval[key] = theRaw / theDemoninator;
                        }
                    });
                });

                model.metric = calcMetric;
            });
            if(callback){
            	//console.log("fetching done prior to callback");
            	callback();
            }
            break;
    }
}
