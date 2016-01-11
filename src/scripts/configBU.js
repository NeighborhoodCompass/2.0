// Here we have a bunch of configuration nobs.

// Stick your Google Analytics key here
var gaKey = "UA-47136977-1";

// Here's where to put what you are calling your neighborhoods. We call them NPA,
// you might call them NSA or precinct or even something crazy like "neighborhood".
// Shorter is better lest you run into some unintended wrapping text issues.
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
var neighborhoods = "blockgroups";

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

var metricConfig = {
 "m1": {
  "metric": "1",
  "category": "Demographics",
  "label": "People",
  "title": "Population",
  "type": "sum"
 },
 "m2": {
  "metric": "2",
  "category": "Demographics",
  "raw_label": "People/Sq Mi",
  "title": "Population Density",
  "decimals": 0,
  "type": "normalize"
 },
 "m3": {
  "metric": "3",
  "category": "Demographics",
  "suffix": "%",
  "raw_label": "Percent",
  "title": "White/Caucasion",
  "decimals": 0,
  "type": "normalize"
 },
 "m4": {
  "metric": "4",
  "category": "Demographics",
  "suffix": "%",
  "raw_label": "Percent",
  "title": "Black/African American",
  "decimals": 0,
  "type": "normalize"
 },
 "m5": {
  "metric": "5",
  "category": "Demographics",
  "suffix": "%",
  "raw_label": "Percent",
  "title": "Asian",
  "decimals": 0,
  "type": "normalize"
 },
 "m6": {
  "metric": "6",
  "category": "Demographics",
  "suffix": "%",
  "raw_label": "Percent",
  "title": "Hispanic/Latino",
  "decimals": 0,
  "type": "normalize"
 },
 "m7": {
  "metric": "7",
  "category": "Demographics",
  "suffix": "%",
  "raw_label": "Percent",
  "title": "Other Race",
  "decimals": 0,
  "type": "normalize"
 },
 "m8": {
  "metric": "8",
  "category": "Demographics",
  "title": "Race/Ethnic Diversity",
  "decimals": 0,
  "type": "sum"
 },
 "m11": {
  "metric": "11",
  "category": "Demographics",
  "raw_label": "Years",
  "title": "Median Age",
  "decimals": 0,
  "type": "sum"
 },
 "m18": {
  "metric": "18",
  "category": "Infrastructure & Amenities",
  "suffix": "%",
  "raw_label": "Percent",
  "title": "Commuting to work by Bicycle",
  "decimals": 1,
  "type": "normalize"
 },
 "m19": {
  "metric": "19",
  "category": "Infrastructure & Amenities",
  "suffix": "%",
  "raw_label": "Percent",
  "title": "Commuting to work by Foot",
  "decimals": 1,
  "type": "normalize"
 },
 "m20": {
  "metric": "20",
  "category": "Infrastructure & Amenities",
  "suffix": "%",
  "raw_label": "Percent",
  "title": "Working from Home",
  "decimals": 1,
  "type": "normalize"
 },
 "m27": {
  "metric": "27",
  "category": "Economy",
  "prefix": "$",
  "raw_label": "Dollars",
  "title": "Median Household Income",
  "decimals": 1,
  "type": "sum"
 },
 "m28": {
  "metric": "28",
  "category": "Economy",
  "prefix": "$",
  "raw_label": "Dollars",
  "title": "Per Capita Income",
  "decimals": 1,
  "type": "sum"
 },
 "m33": {
  "metric": "33",
  "category": "Economy",
  "prefix": "$",
  "raw_label": "Percent",
  "title": "Supplemental Security Income",
  "decimals": 1,
  "type": "normalize"
 },
 "m34": {
  "metric": "34",
  "category": "Housing",
  "suffix": "%",
  "raw_label": "Dollars",
  "title": "Renter-Occupied Housing",
  "decimals": 1,
  "type": "normalize"
 }
};
