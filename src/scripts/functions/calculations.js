// ****************************************
// Serious mathing
// ****************************************

// Filter our selected records out
function dataFilter(dataSet, filter) {
    return _.filter(dataSet, function(el) { return filter.indexOf(el.id) !== -1; });
}

// strip to just numbers
function dataStrip(dataSet, key) {
    return _.filter(_.pluck(dataSet, key), function (el) {  return $.isNumeric(el); }).map(Number);
}
function metricValuesByIDYear(data, ID, theYear, m){
	var values = [];
    for (var i in data) {
        if(data[i].id == ID){
        	return data[i][theYear];
        }
    }
}
// sum a metric
function dataSum(dataSet, key, filter) {
    //console.log(" dataSum dataSet = "+JSON.stringify(dataSet));
    //console.log("key = "+ key);
    // apply filter if passed
    if (typeof filter !== "undefined" && filter !== null) {
       dataSet = dataFilter(dataSet, filter);
    }
	
    // reduce dataSet to numbers - no nulls
    dataSet = dataStrip(dataSet, key);
	//console.log(" dataStrip(dataSet, key); = "+dataStrip(dataSet, key));
    if (dataSet.length > 0) {
        // calculate
    	var total = dataSet.reduce(function(a, b) {
            //console.log("dataSum dataSet.reduce a-b = "+ a+" - "+b);
            return a + b;
        });
    	// console.log("dataSum total / dataSet.length = "+ total +" / "+ dataSet.length);
        return total;
    } else {
    	return 'N/A';
    }
}

// average a metric
function dataMean(dataSet, key, filter) {
    //console.log(" dataMean dataSet = "+JSON.stringify(dataSet));
    // apply filter if passed
    if (typeof filter !== "undefined" && filter !== null) {
       dataSet = dataFilter(dataSet, filter);
    }

    // reduce dataSet to numbers - no nulls
    dataSet = dataStrip(dataSet, key);

    if (dataSet.length > 0) {
        // calculate
        var total = dataSet.reduce(function(a, b) {
            //console.log("dataSum dataSet.reduce a-b = "+ a+" - "+b);
            return a + b;
        });
        //console.log("dataSum total / dataSet.length = "+ total +" / "+ dataSet.length);
            
        return total / dataSet.length;
    } else {
        return 'N/A';
    }
}

// decide which computation to run and run it
function dataCrunch(key, filter) {
    var theReturn;
    if (typeof filter === "undefined") { filter = null; }
	//console.log("metricConfig[model.metricId].type = "+metricConfig[model.metricId].type+" model.metricID = "+model.metricID + " key = "+key+" filter = " + filter + 'case = ' + metricConfig[model.metricId].type + " dataCrunch model.metric = "+JSON.stringify(model.metric));
    switch (metricConfig[model.metricId].type) {
        case "sum":
            theReturn = dataSum(model.metric, key, filter);
            break;
        case "mean": case "normalize":
            theReturn = dataMean(model.metric, key, filter);
            break;
    }
    return theReturn;
}

function getSelectionSetValues(key, filter){
	var returnJSON;
	if (typeof filter === "undefined") { filter = null; }
	//console.log("metricConfig[model.metricId].type = "+metricConfig[model.metricId].type+" model.metricID = "+model.metricID + " key = "+key+" filter = " + filter + 'case = ' + metricConfig[model.metricId].type + " dataCrunch model.metric = "+JSON.stringify(model.metric));
    for (selection in selectionSet){
    	console.log("selection = "+selection);
	    switch (metricConfig[model.metricId].type) {
	        case "sum":
	            theReturn = dataSum(model.metric, key, filter);
	            break;
	        case "mean": case "normalize":
	            theReturn = dataMean(model.metric, key, filter);
	            break;
	    }
    }
}

// ****************************************
// Return median metric value
// ****************************************
function median(values) {
	var nonNullValues = values.filter(function(val) { if (val != null){return val;} });
	var total = 0;
	$.each(nonNullValues,function() {
	    total += this;
	});
	nonNullValues.sort( function(a,b) {return a - b;} );
    var half = Math.floor(nonNullValues.length/2);
    if(nonNullValues.length % 2) {
        return nonNullValues[half];
    }
    else {
        return (nonNullValues[half-1] + nonNullValues[half]) / 2.0;
    }
}
