// Here we have a bunch of configuration nobs.

//searching for other configurable items
//There are other configurable items that i have found throughout the project that may be of use. I have peppered
//the applicaiton with the following search terms so that these items may be altered as needed. To find these search 
//terms, search the entire project for the following words:
//1. Quantile Color Breaks - this is where the color scheme for the map quantiles is stored these values are RGB values
// and are indexed starting a q0 and ending with q4. do not change the number of 'q' values without changing the 
//'colorbreaks' variable listed in this file below. Always that q0 is the first instance so if colorbreaks = n then
//the 'q' values should extend from q0 to qn-1.

// Stick your Google Analytics key here
var gaKey = "UA-47136977-1";

// Here's where to put what you are calling your neighborhoods. We call them NPA,
// you might call them NSA or precinct or even something crazy like "neighborhood".
// Shorter is better lest you run into some unintended wrapping text issues.
//TODO - set these variables according to selected target layer. 
var neighborhoodDescriptor = "Block Group";
var neighborhoodDefinition = "Census block groups";

// The URL for your base map tiles.
// Here's a good place to find some:
// http://leaflet-extras.github.io/leaflet-providers/preview/
// Ex: http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png http://tiles.mcmap.org/meckbase/{z}/{x}/{y}.png
// You want to change this - our base tiles only cover Mecklenburg County NC.
var baseTilesURL = "http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png";

// Server-side processor for feedback.
// Post arguments passed to the server: email, url, agent (browser info), subject, to, message
var contactConfig = {
    "to": "tobin.bradley@gmail.com",
    "url": "/utilities/feedback.php"
};

// The basic geographic setup for your map: the minimum zoom level,
// maximum zoom level, and the starting zoom level, the map center point, and when
// the base tiles should become visible.
var mapGeography = {
        minZoom: 9,
        maxZoom: 17,
        defaultZoom: 10,
        center: [35.988, -78.907]
    };

// Neighborhoods name in your TopoJSON file. This is usually the name of the shapefile
// or geojson file you converted from.
var loadLayer = "census";
var censusFeatures = "blockgroups";
var neighborhoodFeatures = "neighborhoods";
var neighborhoods;
if (loadLayer == "census"){
	neighborhoods = censusFeatures;
}
else{
	neighborhoods = neighborhoodFeatures;
}
var blInitMap = true;
// If you have an additional data layer in your TopoJSON file, name it here.
// Otherwise comment it out.
// var overlay = "istates";

// Number of color breaks/quantiles in the map and bar chart.
// Note the rule is 5 to 7 color breaks on a choropleth map. Don't be
// that guy. Nobody likes that guy.
//
// You will need to monkey about in assets/less/vis.less under
// "chart and map colors" if you change this number. A good guide for color
// breaks is at http://colorbrewer2.org
var colorbreaks = 5;

// we're going to export a few of our vars for the node build/watch process. Done in a try/catch
// so a browser reading this will barf quietly to itself.
try {
    exports.neighborhoodDescriptor = neighborhoodDescriptor;
    exports.gaKey = gaKey;
}
catch(err) {}


// ***********************************************************
// Ye Olde Metric Configuration
//
// Here's the format:
// "m<the metric number>": {
//        "metric"        the metric number
//        "type"          Type of calculation to be performed (and files to fetch). Options are sum, mean, and normalize.
//        "category"      the category of the metric
//        "title"         metric descriptive title
//        "accuracy"      [optional] set true if metric has an accuracy file
//        "label"         [optional] metric unit information
//        "decimals"      [optional] number of decimal places to display (default is 0)
//        "prefix"        [optional] prefix for the number, like '$'
//        "suffix"        [optional] suffix for the number, like '%'
//        "raw_label"     [optional] label for raw number if available (also makes raw number visible)
// }
// ***********************************************************

//COMPASSNOTE - these are the locations and names of the two target layer topojson files
var neighborhoodTOPOJSON = "data/neighborhood.topo.json";
var censusTOPOJSON = "data/census.topo.json";


var activeTOPOJSON;
if (loadLayer == "census"){
	activeTOPOJSON = censusTOPOJSON;
}
else{
	activeTOPOJSON = neighborhoodTOPOJSON;
}
var censusMergeTOPOJSON = "data/merge_cb.json";
var neighborhoodMergeTOPOJSON = "data/merge_nh.json";
var activeMergeJSON;
if (loadLayer == "census"){
	activeMergeJSON = censusMergeTOPOJSON;
}
else{
	activeMergeJSON = neighborhoodMergeTOPOJSON;
}
var censusMetricConfig = {
 "mPOP": {
  "metric": "POP",
  "category": "Demographics",
  "label": "People",
  "title": "Population",
  "decimals": 0,
  "type": "sum"
 },
 "mPOPDENS": {
  "metric": "POPDENS",
  "category": "Demographics",
  "raw_label": "People/Sq Mi",
  "title": "Population Density",
  "decimals": 0,
  "type": "normalize"
 },
 "mPTWHNL": {
  "metric": "PTWHNL",
  "category": "Demographics",
  "suffix": "%",
  "raw_label": "Percent",
  "title": "White/Caucasion",
  "decimals": 0,
  "type": "normalize"
 },
 "mPTBLKNL": {
  "metric": "PTBLKNL",
  "category": "Demographics",
  "suffix": "%",
  "raw_label": "Percent",
  "title": "Black/African American",
  "decimals": 0,
  "type": "normalize"
 },
 "mPTASNL": {
  "metric": "PTASNL",
  "category": "Demographics",
  "suffix": "%",
  "raw_label": "Percent",
  "title": "Asian",
  "decimals": 0,
  "type": "normalize"
 },
 "mPTLAT": {
  "metric": "PTLAT",
  "category": "Demographics",
  "suffix": "%",
  "raw_label": "People",
  "title": "Hispanic/Latino",
  "decimals": 0,
  "type": "normalize"
 },
 "mPTOTHNL": {
  "metric": "PTOTHNL",
  "category": "Demographics",
  "suffix": "%",
  "raw_label": "Percent",
  "title": "Other Race",
  "decimals": 0,
  "type": "normalize"
 },
 "mREDIV": {
  "metric": "REDIV",
  "category": "Demographics",
  "title": "Race/Ethnic Diversity",
  "suffix": "",
  "raw_label": "",
  "decimals": 2,
  "type": "sum"
 },
 "mMEDAGE": {
  "metric": "MEDAGE",
  "accuracy": "true",
  "category": "Demographics",
  "title": "Median Age",
  "raw_label": "years",
  "decimals": 1,
  "type": "sum"
 },
 "mBIKEWK": {
  "metric": "BIKEWK",
  "accuracy": "true",
  "category": "Infrastructure and Amenities",
  "suffix": "%",
  "raw_label": "Percent",
  "title": "Commuting to work by Bicycle",
  "decimals": 1,
  "type": "normalize"
 },
 "mWLKWK": {
  "metric": "WLKWK",
  "accuracy": "true",
  "category": "Infrastructure and Amenities",
  "suffix": "%",
  "raw_label": "Percent",
  "title": "Commuting to work by Foot",
  "decimals": 1,
  "type": "normalize"
 },
 "mWKHOME": {
  "metric": "WKHOME",
  "accuracy": "true",
  "category": "Infrastructure and Amenities",
  "suffix": "%",
  "raw_label": "Percent",
  "title": "Working from Home",
  "decimals": 1,
  "type": "normalize"
 },
 "mMHI": {
  "metric": "MHI",
  "accuracy": "true",
  "category": "Economy",
  "prefix": "$",
  "raw_label": "Dollars",
  "title": "Median Household Income",
  "decimals": 0,
  "type": "sum"
 },
 "mPCI": {
  "metric": "PCI",
  "accuracy": "true",
  "category": "Economy",
  "prefix": "$",
  "raw_label": "Dollars",
  "title": "Per Capita Income",
  "decimals": 0,
  "type": "sum"
 },
 "mPCTSSI": {
  "metric": "PCTSSI",
  "accuracy": "true",
  "category": "Economy",
  "prefix": "$",
  "raw_label": "Dollars",
  "title": "Supplemental Security Income",
  "decimals": 1,
  "type": "normalize"
 },
 "mPCTSSI": {
  "metric": "PCTSSI",
  "accuracy": "true",
  "category": "Economy",
  "prefix": "$",
  "raw_label": "Dollars",
  "title": "Supplemental Security Income",
  "decimals": 1,
  "type": "normalize"
 },
 "mCOR": {
  "metric": "COR",
  "category": "Economy",
  "suffix": "",
  "raw_label": "/sq. mi.",
  "title": "Residential Certificates of Occupancy",
  "decimals": 0,
  "type": "normalize"
 },
 "mCOB": {
  "metric": "COB",
  "category": "Economy",
  "suffix": "",
  "raw_label": "/sq. mi.",
  "title": "Commercial Certificates of Occupancy",
  "decimals": 0,
  "type": "normalize"
 },
 "mPPSF": {
  "metric": "PPSF",
  "category": "Housing",
  "title": "Median Price Per Square Foot",
  "prefix": "$",
  "raw_label": "$/sq. ft.",
  "decimals": 2,
  "type": "sum"
 }
};
var neighborhoodMetricConfig = {
 "mCC45-n": {
  "metric": "CC45-n",
  "category": "Education",
  "suffix": "%",
  "raw_label": "Percent",
  "title": "Child Care Centers with 4 or 5 Star Ratings",
  "decimals": 1,
  "type": "normalize"
 },
 "mCCC-n": {
  "metric": "CCC-n",
  "category": "Education",
  "title": "Child Care Centers",
  "decimals": 1,
  "type": "normalize"
 },
 "mPPSF-n": {
  "metric": "PPSF-n",
  "category": "Housing",
  "prefix": "$",
  "raw_label": "Dollars",
  "title": "Residential Sale Price per Square Foot",
  "decimals": 0,
  "type": "sum"
 }
};
//~*~*~*~*~*TODO change metricConfig in the $(".censusRadio").click and $(".neighborhoodsRadio").click functions. 
var metricConfig;
if (loadLayer == "census"){
	metricConfig = censusMetricConfig;
}
else{
	metricConfig = neighborhoodMetricConfig;
}
 