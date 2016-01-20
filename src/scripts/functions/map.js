

// ****************************************
// Zoom to polygons
// ****************************************
function d3ZoomPolys(msg, d) {
    var features = _.filter(d3Layer.toGeoJSON().features, function(data) { return _.contains(d.ids, data.id.toString()); });
    var bounds = L.latLngBounds(L.geoJson(features[0]).getBounds());
    _.each(features, function(feature) {
        bounds.extend(L.geoJson(feature).getBounds());
    });
    map.fitBounds(bounds);
}


// ****************************************
// Geocode a location or a neighborhood
// ****************************************
function geocode(d) {
    // add a marker if a point location is passed
    if (d.lat) {
        try { map.removeLayer(marker); }
        catch (err) {}
        marker = L.marker([d.lat, d.lng]).addTo(map);
    }

    // zoom to neighborhood
    var feature = _.filter(d3Layer.toGeoJSON().features, function(data) { return data.id === d.id; });
    var bounds = L.latLngBounds(L.geoJson(feature[0]).getBounds());
    map.fitBounds(bounds);
}


// ****************************************
// Create the map
// ****************************************
function mapCreate() {
	//console.log("mapCreate");
    L.Icon.Default.imagePath = './images';
    map = L.map("map", {
            attributionControl: false,
            touchZoom: true,
            minZoom: mapGeography.minZoom,
            maxZoom: mapGeography.maxZoom
        }).setView(mapGeography.center, mapGeography.defaultZoom);
    window.baseTiles = L.tileLayer(baseTilesURL);

    // full screen display button
    // L.easyButton('glyphicon glyphicon-fullscreen', function (){
            // map.setView(mapGeography.center, mapGeography.defaultZoom);
        // },
        // 'Zoom to full extent'
    // );

    // Add geolocation api control
    L.control.locate({
        icon: 'glyphicon glyphicon-map-marker locate-icon'
    }).addTo(map);

    // Year display
    var yearControl = L.control({position: 'bottomleft'});
    yearControl.onAdd = function(map) {
        this._div = L.DomUtil.create('div');
        this._div.innerHTML = '<h3 class="time-year"></h3>';
        return this._div;
    };
    yearControl.addTo(map);

    // make it so if scrolling on the page it disabled map zoom for a second
    $(window).on('scroll', function() {
        map.scrollWheelZoom.disable();
        setTimeout(function() { map.scrollWheelZoom.enable(); }, 1000);
    });

}


// ****************************************
// Initialize the D3 map layer
// ****************************************
var bndDataURL = "data/DurhamBnd.json";
var bndJSONData;
    
function initMap() {
    // Eyes wide open for this gnarly hack.
    // There are lots of different ways to put a D3 layer on Leaflet, and I found
    // them all to be annoying and/or weird. So, here I'm adding the topojson as a
    // regular leaflet layer so Leaflet can manage zooming/redrawing/events/etc. However,
    // I want D3 to manage symbolization et al, so I rely on the fact that Leaflet
    // adds the polys in the topojson order to add a data-id and geom class to the
    // layer so I can handle it D3-ish rather than through the Leaflet API.
    //console.log("initMap activeLayer = "+ activeLayer);
    
    	// bndgeojson = d3.select(map.getPanes().overlayPane).append("svg").classed("transparent", true),
	    // g = bndgeojson.append("g").attr("class","leaflet-zoom-hide");
//     
	// d3.json(bndDataURL, function(error, collection) {
		// if (error) throw error;
// 
    	// var transform = d3.geo.transform({point: projectPoint}),
        // path = d3.geo.path().projection(transform);
// 
  		// var feature = g.selectAll("path")
      		// .data(collection.features)
    		// .enter().append("path");
// 
  		// map.on("viewreset", reset);
  		// reset();
// 
  		// // Reposition the SVG to cover the features.
  		// function reset() {
		  	// var bounds = path.bounds(collection),
		        // topLeft = bounds[0],
		        // bottomRight = bounds[1];
// 		
	        // bndgeojson.attr("width", bottomRight[0] - topLeft[0])
		        // .attr("height", bottomRight[1] - topLeft[1])
		        // .style("left", topLeft[0] + "px")
		        // .style("top", topLeft[1] + "px");
// 		
		    // g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
// 		
		    // feature.attr("d", path);
		// }
// 	
	  // // Use Leaflet to implement a D3 geometric transformation.
	    // function projectPoint(x, y) {
	        // var point = map.latLngToLayerPoint(new L.LatLng(y, x));
	        // this.stream.point(point.x, point.y);
	    // }
//    
    // });
    
    if (activeLayer == "census"){
    	//console.log("census d3CensusLayer added");
    	d3CensusLayer = L.geoJson(topojson.feature(model.geom, model.geom.objects[censusFeatures]), {
		    style: {
		        "fillColor": "rgba(100,100,100,100)",
		        "color": "none",
		        "fillOpacity": 1
		    }
		}).addTo(map);
		d3Layer = d3CensusLayer;
	}
	else if (activeLayer == "neighborhood"){
    	//console.log("neighborhood d3NeighborhoodLayer added");
    	d3NeighborhoodLayer = L.geoJson(topojson.feature(model.geom, model.geom.objects[neighborhoodFeatures]), {
		    style: {
		        "fillColor": "rgba(100,100,100,100)",
		        "color": "none",
		        "fillOpacity": 1
		    }
		}).addTo(map);
		d3Layer = d3NeighborhoodLayer;
	}
	
    //console.log("map.hasLayer(d3NeighborhoodLayer) "+ map.hasLayer(d3NeighborhoodLayer));
	var count = model.geom.objects[neighborhoods].geometries.length;
	//console.log("geometry count = "+count);
	d3.selectAll(".leaflet-overlay-pane svg path").attr("class", "geom metric-hover").attr("data-id", function(d, i) {
        	
		if (i < count){
        	return model.geom.objects[neighborhoods].geometries[i].id;
        }
    });
	d3Layer.on("click", function(d) {
    	//console.log("d = "+ JSON.stringify(d.layer.feature));
        var sel = d3.select(".geom[data-id='" + d.layer.feature.id + "']");
        if (sel.classed("d3-select")) {
            model.selected = _.difference(model.selected, [d.layer.feature.id]);
        }
        else {
            model.selected = _.union(model.selected, [d.layer.feature.id]);
        }
        //console.log("model.selected = "+model.selected);
        verticalBarChart();
    });

    $(".geom").on({
        mouseenter: function(){
        	console.log ("mouseenter this = " + JSON.stringify($(this), null, 2));
            addHighlight($(this));
        },
        mouseleave: function(){
            //console.log ("mouseleave this = " + JSON.stringify($(this), null, 2));
            removeHighlight($(this));
        }
    });

    // Using D3 tooltips because I like them better. YMMV.
    console.log('$(".geom") = ' + JSON.stringify($(".geom")));
    
    
    $(".geom").tooltip({
        html: true,
        title: function() {
            var sel = $(this),
                num = "<br>N/A";
            // console.log("tooltip $(this) = " + JSON.stringify($(this))+ " length = "+JSON.stringify($(this)[0]).length);
            //console.log("$(geom) = " + JSON.stringify($(".geom")));
	        if(JSON.stringify($(this)[0]).length>2){
	        	console.log("tooltip hit "+JSON.stringify($(this)[0]).length);
	        	console.log("tooltip hit "+JSON.stringify($(this)));
	        	if ($.isNumeric(sel.attr("data-value"))) {
	                num = "<br>" + dataPretty(sel.attr("data-value"), $("#metric").val());
	            }
	            if (metricConfig[model.metricId].label) {
	                num += "<br>" + metricConfig[model.metricId].label;
	            }
	            return "<p class='tip'><strong><span>" + neighborhoodDescriptor + " " + sel.attr("data-id") + "</strong>" + num + "</span></p>";
	        }
        },
        container: '#map'
    });

	console.log('$(".geom").tooltip() = '+JSON.stringify($(".geom").tooltip()));
    
    // Here's where you would load other crap in your topojson for display purposes.
    // Change the styling here as desired.
    if (typeof overlay !== 'undefined') {
    	//console.log("overlay defined");
        geojson = L.geoJson(topojson.feature(model.geom, model.geom.objects[overlay]), {
            style: {
                "fillColor": "rgba(0,0,0,0)",
                "color": "white",
                "fillOpacity": 1,
                "opacity": 0.8,
                "weight": 3
            }
        }).addTo(map);
    }
    //  initialize neighborhood id's in typeahead
    polyid = _.map(model.geom.objects[neighborhoods].geometries, function(d){ return d.id.toString(); });

    // if neihborhoods are being passed from page load
    if (getURLParameter("n") !== "null") {
        var arr = [];
        _.each(getURLParameter("n").split(","), function(d) {
            arr.push(d);
        });
        model.selected = arr;
        d3ZoomPolys("", {"ids": arr});
    }
    blInitMap = false;

    //SVG Durham BND implimentation
	
    
    // //geojson durhamBnd implimentation
    // $.ajax({
        // url: bndDataURL,
        // dataType: "json",
        // type: "GET",
        // async: false,
        // success: function(data) {
           // bndJSONData = data;
        // }
    // });
    // var bndStyle = {
          // "color": "#330000",
          // "weight": 0,
          // "fillOpacity": 0,
          // "opacity": 0
    // };
    // bndgeojson = L.geoJson(bndJSONData, { style: bndStyle});
    // map.addLayer(bndgeojson);
}

// function switchMap(newTargetLayer){
	// //console.log("switchMap newTargetLayer = "+newTargetLayer);
	// if (newTargetLayer == "census"){
		// map.removeLayer(d3NeighborhoodLayer);
		// d3CensusLayer = L.geoJson(topojson.feature(model.geom, model.geom.objects[censusFeatures]), {
		    // style: {
		        // "fillColor": "rgba(0,0,0,0)",
		        // "color": "none",
		        // "fillOpacity": 1
		    // }
		// }).addTo(map);
		// d3Layer = d3CensusLayer;
	// }
	// else if(newTargetLayer == "neighborhood"){
		// map.removeLayer(d3CensusLayer);
		// d3NeighborhoodLayer = L.geoJson(topojson.feature(model.geom, model.geom.objects[neighborhoodFeatures]), {
		    // style: {
		        // "fillColor": "rgba(0,0,0,0)",
		        // "color": "none",
		        // "fillOpacity": 1
		    // }
		// }).addTo(map);
	// }
// 	
// }
// ****************************************
// Color the map
// ****************************************
function drawMap() {
	
	//console.log("_ = "+ _);
	//console.log("drawMap() model title = "+model.metricId);
	// console.log ("drawMap model = " + JSON.stringify(model, null, 2));
	// console.log("drawmap model.metric = " + JSON.stringify(model.metric[0], null, 2));
    var theGeom = d3.selectAll(".geom"),
        classlist = [],
        keys = Object.keys(model.metric[0]);
	// clear out quantile classes
    for (i = 0; i < colorbreaks; i++) {
        classlist.push("q" + i);
    }
    theGeom.classed(classlist.join(" "), false);

    theGeom.each(function() {
        //console.log("theGeom.each");    
        var item = d3.select(this);
        // var ticker = 0;
        var theData = _.filter(model.metric, function(el) { 
        	try{
        		// ticker++;
        		// console.log(ticker);
        		// console.log(el.id + " == "+item.attr('data-id'));
        		return el.id == item.attr('data-id');
        		}
        	catch(err){console.log("theError is = "+err);} 
        });
        //console.log("theData = " + JSON.stringify(theData[0].id, null, 2));
	    var theValue = theData[0][keys[model.year + 1]];
        var styleClass = "";
		// console.log("theGeom = " + theData);
    	if (theData[0].id){
	    	//console.log("theData = " + JSON.stringify(theData[0].id, null, 2));
	    	// console.log("theValue = " + theValue);
	    	// console.log("JSON.stringify(theData[0], null, 2) = "+ JSON.stringify(theData[0], null, 2));
	    	
	        if ($.isNumeric(theValue)) {
	            styleClass = quantize(theValue);
	        }
	
	        item.classed(styleClass, true)
	            .attr("data-value", theValue)
	            .attr("data-quantile", styleClass)
	            .attr("data-toggle", "tooltip");
        }
    });

    // var xScale = d3.scale.linear().domain(x_extent).range([0, $("#barChart").parent().width() - 60]);
// 
    // var y = d3.scale.linear().range([260, 0]).domain([0, 260]);

    // make sure our stuff is highlighted
    d3.selectAll(".geom").classed("d3-select", function(d) { return _.contains(model.selected, $(this).attr("data-id")); });
	if (document.getElementById('mapToggle').innerHTML == "Hide Map"){
		$(".geom").css("fill-opacity", "0.6");
	    map.addLayer(baseTiles);
	} 
}
