// ****************************************
// Compare two arrays to see if the are the same
// ****************************************
Array.prototype.compare = function(testArr) {
    if (this.length !== testArr.length) { return false; }
    for (var i = 0; i < testArr.length; i++) {
        if (this[i].compare) {
            if (!this[i].compare(testArr[i])) { return false; }
        }
        if (this[i] !== testArr[i]) { return false; }
    }
    return true;
};


// ****************************************
// Add commas to numbers (i.e. 1,123,123)
// ****************************************
String.prototype.commafy = function () {
    return this.replace(/(^|[^\w.])(\d{4,})/g, function($0, $1, $2) {
        return $1 + $2.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,");
    });
};
Number.prototype.commafy = function () {
    return String(this).commafy();
};

// ****************************************
// Capitalize first letter of strings
// ****************************************
String.prototype.toProperCase = function(opt_lowerCaseTheRest) {
  return (opt_lowerCaseTheRest ? this.toLowerCase() : this)
    .replace(/(^|[\s\xA0])[^\s\xA0]/g, function(s){ return s.toUpperCase(); });
};

// ****************************************
// Get URL GET Parameters
// ****************************************
function getURLParameter(name) {
	console.log("getURLParameter name = "+name);
    return decodeURI(
        (new RegExp(name + '=' + '(.+?)(&|$)').exec(location.search)||[,null])[1]
    );
}

// ****************************************
// The trend arrow thing for the tables
// ****************************************
function getTrend(x1, x2) {
    if ($.isNumeric(x1) && $.isNumeric(x2)) {
        var theDiff = x1 - x2;
        if (theDiff === 0) {
            return "&#8596; 0";
        } else if (theDiff > 0) {
            return "<span class='glyphicon glyphicon-arrow-up'></span> " + dataPretty(theDiff, model.metricId).replace("%","").replace("$","");
        }
        else if (theDiff < 0) {
            return "<span class='glyphicon glyphicon-arrow-down'></span> " + dataPretty(Math.abs(theDiff), model.metricId).replace("%","").replace("$","");
        }
    }
    else {
        return "--";
    }
}

// ****************************************
// Format metric data
// ****************************************
function dataRound(theValue, theDecimals) {
    console.log("theValue = " + theValue + " theDecimals = " + theDecimals);
	if(typeof stringValue != 'string'){
        return Number(theValue.toFixed(theDecimals));
    }
    else{
        return theValue;
    }
}
function dataFormat(theValue, theMetric) {
  var prefix = "",
  suffix = "";
  ////console.log("dataFormat started");
  if (theMetric) {
  	//console.log("theMetric = "+theMetric+" prefix = " + metricConfig[theMetric].prefix + " suffix = "+ metricConfig[theMetric].suffix);
    prefix = nullCheck(metricConfig[theMetric].prefix);
    suffix = nullCheck(metricConfig[theMetric].suffix);
  }

  return prefix + theValue.toString().commafy() + suffix;
}
function getPrefix(theMetric){
	var prefix = "";
    if (metricConfig[theMetric]) {
        var prefix
        //console.log("metricConfig[theMetric]: " + metricConfig[theMetric]);
        if (metricConfig[theMetric].hasOwnProperty('prefix')){
	  	    prefix = nullCheck(metricConfig[theMetric].prefix);
        }
        else{
            prefix = "";
        }
	}
	// if (prefix=="$"){prefix = "%";}
	return prefix;
}
function getSuffix(theMetric){
	var suffix = "";
    console.log("metricConfig: " + JSON.stringify(metricConfig));
    console.log("theMetric: " + theMetric);
    console.log("metricConfig[theMetric]: " + JSON.stringify(metricConfig[theMetric]));
    if (metricConfig[theMetric].hasOwnProperty('suffix')){
        suffix = nullCheck(metricConfig[theMetric].suffix);
    }
    else{
        suffix = "";
    }
	// console.log("suffix = "+suffix);
	// if (suffix=="%"){return "%";}
	// else{return suffix;}
	// console.log('suffix = '+suffix);
	return suffix;
}
function nullCheck(theCheck) {
    if (!theCheck) {
        return "";
    }
    else {
        return theCheck;
    }
}
function dataPretty(theValue, theMetric) {
    var pretty,
        numDecimals = 0;

	// _.each(metricConfig, function(el, key) {
        // console.log("genericMetric = "+el.title);
    // });
    //console.log("dataPretty theMetric = "+JSON.stringify(theMetric));
    //console.log("dataPretty metricConfig = "+JSON.stringify(metricConfig));
    // console.log("metricConfig = "+JSON.stringify(metricConfig[0], null, 2));
    if (theMetric !== null && metricConfig[theMetric].decimals) {
        numDecimals = metricConfig[theMetric].decimals;
    }

    if ($.isNumeric(theValue)) {
        pretty = dataFormat(dataRound(Number(theValue), numDecimals), theMetric);
    }
    else {
        pretty = "N/A";
    }
    return pretty;
    //console.log("DataPretty Complete");
}
function isEnter(obj, evt){
	var key= new Number;
	if (window.event){	
		key = window.event.keyCode;
	}	
	else if(evt){	
		key = evt.which;
	}	
	else{	
		return true;
	}
	if (key == 13)
	{
		evt.preventDefault();
		document.getElementById('btnSearch').click();
		return true;
	}

}
function addMarker(lat, lng) {
    if (marker) {
        try { map.removeLayer(marker); }
        catch(err) {}
    }
    marker = L.marker([lat, lng]).addTo(map);
}
function fireGAEvent(category, action, name){
	_gaq.push(['_trackEvent',
	 		category,    
	    	action,
	    	name,
	    	1,
	    	true
	 	]);
}

function getSelectedData(selectionSet){
	//console.log("selectionSet = "+ selectionSet);
	var metricArray = $.map(model.metric, function(el) { return el });
	var outputMetricArray = [];
	var year = model.years[model.year];
	
	var theCountyStat = dataCrunch(year);
	var countyAverageJSON={};
	countyAverageJSON["id"]="County Average";
	countyAverageJSON[year]=theCountyStat;
	outputMetricArray.push(countyAverageJSON);
	
	if (selectionSet.length>1){
		var theSelectionStat = dataCrunch(year, model.selected);
		var selectionAverageJSON = {};
		selectionAverageJSON["id"] = "Selection Average";
		selectionAverageJSON[year] = theSelectionStat;
		outputMetricArray.splice(1,0,selectionAverageJSON);
	}
	
	var metricJSON = model.metric; 
    //console.log("metricJsonlength = " + metricJSON.length);
    for(var i = 0; i < metricArray.length-1; i++) {
        var obj = metricJSON[i];
        if (selectionSet.indexOf(obj.id)>-1){
        	console.log("obj.id = "+ obj.id);
        	console.log("model.years[model.year] = "+model.years[model.year]);
        	console.log("model.years[model.year] = "+obj[model.years[model.year]]);
        	console.log("obj = "+ JSON.stringify(obj));
        	outputMetricArray.push(obj); 
        }
    }
    outputMetricArray.sort(function(a,b){
    	return b[model.years[model.year]]-a[model.years[model.year]];
    });
    model.outputMetric = outputMetricArray;
    return outputMetricArray;
}
