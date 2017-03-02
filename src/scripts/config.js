// Here we have a bunch of configuration nobs.

//searching for other configurable items
//There are other configurable items that i have found throughout the project that may be of use. I have peppered
//the application with the following search terms so that these items may be altered as needed. To find these search
//terms, search the entire project for the following words:
//1. Quantile Color Breaks - this is where the color scheme for the map quantiles is stored these values are RGB values
// and are indexed starting a q0 and ending with q4. do not change the number of 'q' values without changing the
//'colorbreaks' variable listed in this file below. Always that q0 is the first instance so if colorbreaks = n then
//the 'q' values should extend from q0 to qn-1.

// Here's where to put what you are calling your neighborhoods. We call them NPA,
// you might call them NSA or precinct or even something crazy like "neighborhood".
// Shorter is better lest you run into some unintended wrapping text issues.
//TODO - set these variables according to selected target layer.
var neighborhoodDefinition = "Census block groups";
var neighborhoodDescriptor = "";

// The URL for your base map tiles.
// Here's a good place to find some:
// http://leaflet-extras.github.io/leaflet-providers/preview/
// Ex: http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png http://tiles.mcmap.org/meckbase/{z}/{x}/{y}.png
//http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg
//http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png
//http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png
//http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
//http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png
// You want to change this - our base tiles only cover Mecklenburg County NC.
var baseTilesURL = "http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png";

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
var censusTractFeatures = "censusTracts";
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

//COMPASSNOTE - these are the locations and names of the two target layer topojson files ###JPK 8/16: added tracts TODO: restructure if/else to trio of options
var neighborhoodTOPOJSON = "data/neighborhood.topo.json";
var censusTOPOJSON = "data/census.topo.json";
var censusTractTOPOJSON = "data/tracts.topo.json";
var activeTOPOJSON;
var censusMergeTOPOJSON = "data/merge_cb.json";
var censusTractsMergeTOPOJSON = "data/merge_tr.json";
var neighborhoodMergeTOPOJSON = "data/merge_nh.json";
var activeMergeJSON;

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
  "raw_label": "People",
  "title": "Population Density",
  "decimals": 0,
  "type": "normalize"
 },
 "mPTWHNL": {
  "metric": "PTWHNL",
  "category": "Demographics",
  "suffix": "%",
  "raw_label": "People",
  "title": "White or Caucasian",
  "decimals": 0,
  "type": "normalize"
 },
 "mPTBLKNL": {
  "metric": "PTBLKNL",
  "category": "Demographics",
  "suffix": "%",
  "raw_label": "People",
  "title": "Black or African American",
  "decimals": 0,
  "type": "normalize"
 },
 "mPTASNL": {
  "metric": "PTASNL",
  "category": "Demographics",
  "suffix": "%",
  "raw_label": "People",
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
  "raw_label": "People",
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
  "type": "normalize"
 },
 "mMEDAGE": {
  "metric": "MEDAGE",
  "accuracy": "true",
  "category": "Demographics",
  "title": "Median Age",
  "decimals": 1,
  "type": "sum"
 },
 "mPTUND18": {
  "metric": "PTUND18",
  "category": "Demographics",
  "title": "Youth Population",
  "suffix": "%",
  "raw_label": "People",
  "decimals": 1,
  "type": "normalize"
 },
 "mPT65Up": {
  "metric": "PT65UP",
  "category": "Demographics",
  "title": "Retirement-Age Population",
  "suffix": "%",
  "raw_label": "People",
  "decimals": 1,
  "type": "normalize"
 },
 "mBIKEWK": {
  "metric": "BIKEWK",
  "accuracy": "true",
  "category": "Infrastructure and Amenities",
  "suffix": "%",
  "raw_label": "people",
  "title": "Commuting to work by Bicycle",
  "decimals": 1,
  "type": "normalize"
 },
 "mWLKWK": {
  "metric": "WLKWK",
  "accuracy": "true",
  "category": "Infrastructure and Amenities",
  "suffix": "%",
  "raw_label": "people",
  "title": "Commuting to work by Foot",
  "decimals": 1,
  "type": "normalize"
 },
 "mWKHOME": {
  "metric": "WKHOME",
  "accuracy": "true",
  "category": "Infrastructure and Amenities",
  "suffix": "%",
  "raw_label": "people",
  "title": "Working from Home",
  "decimals": 1,
  "type": "normalize"
 },
 "mPROXBUS": {
  "metric": "PROXBUS",
  "category": "Infrastructure and Amenities",
  "suffix": "%",
  "raw_label": "households",
  "title": "Homes Near Bus Stops",
  "decimals": 1,
  "type": "normalize"
 },
 "mPROXGR": {
  "metric": "PROXGR",
  "category": "Infrastructure and Amenities",
  "suffix": "%",
  "raw_label": "households",
  "title": "Homes Near Grocery Stores",
  "decimals": 1,
  "type": "normalize"
 },
 "mPROXPH": {
  "metric": "PROXPH",
  "category": "Infrastructure and Amenities",
  "suffix": "%",
  "raw_label": "households",
  "title": "Homes Near Pharmacies",
  "decimals": 1,
  "type": "normalize"
 },
 "mPROXBANK": {
  "metric": "PROXBANK",
  "category": "Infrastructure and Amenities",
  "suffix": "%",
  "raw_label": "households",
  "title": "Homes Near Banks or Credit Unions",
  "decimals": 1,
  "type": "normalize"
 },
 "mMHI": {
  "metric": "MHI",
  "accuracy": "true",
  "category": "Economy",
  "prefix": "$",
  "title": "Median Household Income",
  "decimals": 0,
  "type": "normalize"
 },
 "mPCI": {
  "metric": "PCI",
  "accuracy": "true",
  "category": "Economy",
  "prefix": "$",
  "title": "Per Capita Income",
  "decimals": 0,
  "type": "normalize"
 },
 "mPCTSSI": {
  "metric": "PCTSSI",
  "accuracy": "true",
  "category": "Economy",
  "suffix": "%",
  "raw_label": "people",
  "title": "Supplemental Security Income",
  "decimals": 1,
  "type": "normalize"
 },
 "mCOR": {
  "metric": "COR",
  "category": "Economy",
  "suffix": "",
  "raw_label": "COs",
  "title": "Residential Certificates of Occupancy",
  "decimals": 0,
  "type": "normalize"
 },
 "mCOB": {
  "metric": "COB",
  "category": "Economy",
  "suffix": "",
  "raw_label": "COs",
  "title": "Commercial Certificates of Occupancy",
  "decimals": 0,
  "type": "normalize"
 },
 "mRPMTS": {
  "metric": "RPMTS",
  "category": "Economy",
  "prefix": "$",
  "raw_label": "actual dollars",
  "title": "Residential Building Permit Values Per Sq Mile",
  "decimals": 0,
  "type": "normalize"
 },
 "mCPMTS": {
  "metric": "CPMTS",
  "category": "Economy",
  "prefix": "$",
  "raw_label": "actual dollars",
  "title": "Commercial Building Permit Values Per Sq Mile",
  "decimals": 0,
  "type": "normalize"
 },
 "mLUDIV": {
  "metric": "LUDIV",
  "category": "Economy",
  "suffix": "",
  "title": "Land Use Diversity",
  "decimals": 1,
  "type": "normalize"
 },
 "mPPSF": {
  "metric": "PPSF",
  "category": "Housing",
  "title": "Median Price Per Square Foot",
  "prefix": "$",
  "decimals": 0,
  "type": "normalize"
 },
 "mRAVGYR": {
  "metric": "RAVGYR",
  "category": "Housing",
  "title": "Average Year of Residential Construction",
  "prefix": "",
  "raw_label": "",
  "decimals": 0,
  "type": "normalize"
 },
 "mMEDSV": {
  "metric": "MEDSV",
  "category": "Housing",
  "title": "Median Sale Price",
  "prefix": "$",
  "raw_label": "",
  "decimals": 0,
  "type": "normalize"
 },
 "mREVAL": {
  "metric": "REVAL",
  "category": "Housing",
  "title": "Tax Value Change",
  "suffix": "%",
  "decimals": 1,
  "type": "normalize"
 },
 "mPRUNSD": {
  "metric": "PRUNSD",
  "category": "Housing",
  "title": "Poor or Unsound State of Repair",
  "suffix": "%",
  "raw_label": "dwelling units",
  "decimals": 1,
  "type": "normalize"
 },
 "mRCODE": {
  "metric": "RCODE",
  "category": "Housing",
  "title": "Minimum Housing Code Violations",
  "suffix": "",
  "raw_label": "violations",
  "decimals": 1,
  "type": "normalize"
 },
 "mPCTRENT": {
  "metric": "PCTRENT",
  "accuracy": "true",
  "category": "Housing",
  "title": "Renter-Occupied Housing",
  "suffix": "%",
  "raw_label": "households",
  "decimals": 1,
  "type": "normalize"
 },
 "mUNFRENT": {
  "metric": "UNFRENT",
  "accuracy": "true",
  "category": "Housing",
  "title": "Cost-Burdened Renters",
  "suffix": "%",
  "raw_label": "households",
  "decimals": 1,
  "type": "normalize"
 },
 "mUNFOWN": {
  "metric": "UNFOWN",
  "accuracy": "true",
  "category": "Housing",
  "title": "Cost-Burdened Mortgage Holders",
  "suffix": "%",
  "raw_label": "households",
  "decimals": 1,
  "type": "normalize"
 },
"mCC45": {
  "metric": "CC45",
  "category": "Education",
  "suffix": "%",
  "title": "Child Care Centers with 4 or 5 Star Ratings",
  "decimals": 1,
  "type": "normalize"
 },
 "mCCC": {
  "metric": "CCC",
  "category": "Education",
  "title": "Child Care Centers",
  "raw_label": "centers",
  "decimals": 1,
  "type": "normalize"
 },
 "mPCTC30": {
  "metric": "PCTC30",
  "accuracy": "true",
  "category": "Environment",
  "title": "Long Commute Times",
  "suffix": "%",
  "raw_label": "commuters",
  "decimals": 1,
  "type": "normalize"
 },
 "mDRALONE": {
  "metric": "DRALONE",
  "accuracy": "true",
  "category": "Environment",
  "title": "Single-Occupancy Commuters",
  "suffix": "%",
  "raw_label": "commuters",
  "decimals": 1,
  "type": "normalize"
 },
 "mKWH": {
  "metric": "KWH",
  "category": "Environment",
  "title": "Avg. Monthly Household Electricity Use",
  "suffix": " kwh",
  "decimals": 1,
  "type": "normalize"
 },
 "mPCTTREE": {
  "metric": "PCTTREE",
  "category": "Environment",
  "title": "Tree Coverage",
  "suffix": "%",
  "decimals": 1,
  "type": "normalize"
 },
 "mPCTIMP": {
  "metric": "PCTIMP",
  "category": "Environment",
  "title": "Impervious Area",
  "suffix": "%",
  "decimals": 1,
  "type": "normalize"
 },
 "mPCTIMP": {
  "metric": "PCTIMP",
  "category": "Environment",
  "title": "Impervious Area",
  "suffix": "%",
  "decimals": 1,
  "type": "normalize"
 },
 "mWCODE": {
  "metric": "WCODE",
  "category": "Environment",
  "title": "Unmaintained Property Violations",
  "suffix": "",
  "raw_label": "violations",
  "decimals": 1,
  "type": "normalize"
 },
 "mVCODE": {
  "metric": "VCODE",
  "category": "Environment",
  "title": "Automotive Code Violations",
  "suffix": "",
  "raw_label": "violations",
  "decimals": 1,
  "type": "normalize"
 },
 "mPTPRIM": {
  "metric": "PTPRIM",
  "category": "Engagement",
  "title": "Primary Election Participation",
  "suffix": "%",
  "raw_label": "voters",
  "decimals": 1,
  "type": "normalize"
 },
 "mV_SQM": {
  "metric": "V_SQM",
  "category": "Safety",
  "title": "Violent Crimes per Square Mile",
  "suffix": "",
  "raw_label": "incidents",
  "decimals": 1,
  "type": "normalize"
 },
 "mP_SQM": {
  "metric": "P_SQM",
  "category": "Safety",
  "title": "Property Crimes per Square Mile",
  "suffix": "",
  "raw_label": "incidents",
  "decimals": 1,
  "type": "normalize"
 },
  "mD_SQM": {
  "metric": "D_SQM",
  "category": "Safety",
  "title": "Drug Crimes per Square Mile",
  "suffix": "",
  "raw_label": "incidents",
  "decimals": 1,
  "type": "normalize"
 }
};

var neighborhoodMetricConfig = {
 "mRPMTS-n": {
  "metric": "RPMTS-n",
  "category": "Economy",
  "prefix": "$",
  "raw_label": "actual dollars",
  "title": "Residential Building Permit Values Per Sq Mile",
  "decimals": 0,
  "type": "normalize"
 },
 "mCPMTS-n": {
  "metric": "CPMTS-n",
  "category": "Economy",
  "prefix": "$",
  "raw_label": "actual dollars",
  "title": "Commercial Building Permit Values Per Sq Mile",
  "decimals": 0,
  "type": "normalize"
 },
 "mCC45-n": {
  "metric": "CC45-n",
  "category": "Education",
  "suffix": "%",
  "title": "Child Care Centers with 4 or 5 Star Ratings",
  "decimals": 1,
  "type": "normalize"
 },
 "mCCC-n": {
  "metric": "CCC-n",
  "category": "Education",
  "title": "Child Care Centers per Square Mile",
  "raw_label": "centers",
  "decimals": 1,
  "type": "normalize"
 },
// "mPPSF-n": {
//  "metric": "PPSF-n",
//  "category": "Housing",
//  "prefix": "$",
//  "raw_label": "Dollars",
//  "title": "Residential Sale Price per Square Foot",
//  "decimals": 0,
//  "type": "sum"
// },
 "mREVAL-n": {
  "metric": "REVAL-n",
  "category": "Housing",
  "title": "Tax Value Change",
  "suffix": "%",
  "raw_label": "",
  "decimals": 1,
  "type": "normalize"
 },
 "mV_SQM-n": {
  "metric": "V_SQM-n",
  "category": "Safety",
  "title": "Crimes with a Violent Component",
  "suffix": "",
  "raw_label": "",
  "decimals": 1,
  "type": "normalize"
 },
 "mP_SQM-n": {
  "metric": "P_SQM-n",
  "category": "Safety",
  "title": "Crimes Involving Property",
  "suffix": "",
  "raw_label": "",
  "decimals": 1,
  "type": "normalize"
 },
 "mD_SQM-n": {
  "metric": "D_SQM-n",
  "category": "Safety",
  "title": "Drug-Related Crimes",
  "suffix": "",
  "raw_label": "",
  "decimals": 1,
  "type": "normalize"
 }
};

var censusTractMetricConfig = {
    "mBACH-t": {
      "metric": "BACH-t",
      "category": "Education",
      "suffix": "%",
      "raw_label": "Percent",
      "title": "Percent Adults with at least a Bachelor's Degree",
      "decimals": 1,
      "type": "normalize"
 },
    "mPOP-t": {
      "metric": "POP-t",
      "category": "Demographics",
      "label": "People",
      "title": "Population",
      "decimals": 0,
      "type": "sum"
 },
    "mPTWHNL-t": {
      "metric": "PTWHNL-t",
      "category": "Demographics",
      "suffix": "%",
      "raw_label": "People",
      "title": "White or Caucasian",
      "decimals": 0,
      "type": "normalize"
 },
    "mPTBLKNL-t": {
      "metric": "PTBLKNL-t",
      "category": "Demographics",
      "suffix": "%",
      "raw_label": "People",
      "title": "Black or African American",
      "decimals": 0,
      "type": "normalize"
 },
    "mPTHISP-t": {
      "metric": "PTHISP-t",
      "category": "Demographics",
      "suffix": "%",
      "raw_label": "People",
      "title": "Latino or Hispanic",
      "decimals": 0,
      "type": "normalize"
 },
    "mPTASNL-t": {
      "metric": "PTASNL-t",
      "category": "Demographics",
      "suffix": "%",
      "raw_label": "People",
      "title": "Asian",
      "decimals": 0,
      "type": "normalize"
 },
    "mMEDINC-t": {
      "metric": "MEDINC-t",
      "category": "Economy",
      "prefix": "$",
      "raw_label": "",
      "title": "Median Household Income",
      "decimals": 0,
      "type": "normalize"
 },
    "mMEDHV-t": {
      "metric": "MEDHV-t",
      "category": "Housing",
      "title": "Median Home Value",
      "prefix": "$",
      "raw_label": "",
      "decimals": 0,
      "type": "normalize"
 },
    "mHMINC-t": {
      "metric": "HMINC-t",
      "category": "Housing",
      "title": "Median Homebuyer Income",
      "prefix": "$",
      "raw_label": "",
      "decimals": 0,
      "type": "normalize"
 },
    "mMEDGRENT-t": {
      "metric": "MEDGRENT-t",
      "accuracy": "true",
      "category": "Housing",
      "title": "Median Gross Rent",
      "prefix": "$",
      "raw_label": "",
      "decimals": 0,
      "type": "normalize"
 },
    "mBACH-t": {
      "metric": "BACH-t",
      "category": "Education",
      "title": "Bachelor's Degree or More",
      "suffix": "%",
      "raw_label": "",
      "decimals": 0,
      "type": "normalize"
 }
}

//~*~*~*~*~*TODO change metricConfig in the $(".censusRadio").click and $(".neighborhoodsRadio").click functions.
var metricConfig,
    neighborhoods;

/**
 * Initialize metricConfig and neighborhoods variables based on the target layer.
 */
var setMetricAndNeighborhoodConfig = function(layer) {
    if (layer == "census") {
        metricConfig = censusMetricConfig;
        neighborhoods = censusFeatures;
        activeTOPOJSON = censusTOPOJSON;
        activeMergeJSON = censusMergeTOPOJSON;
    }
    else if (layer == "censusTracts") {
        metricConfig = censusTractMetricConfig;
        neighborhoods = censusTractFeatures;
        activeTOPOJSON = censusTractTOPOJSON;
        activeMergeJSON = censusTractsMergeTOPOJSON;
    }
    else if (layer == "neighborhoods" || layer == "neighborhood") {
        metricConfig = neighborhoodMetricConfig;
        neighborhoods = neighborhoodFeatures;
        activeTOPOJSON = neighborhoodTOPOJSON;
        activeMergeJSON = neighborhoodMergeTOPOJSON;
    }
}

// @todo: Remove this call after refactoring main.js
setMetricAndNeighborhoodConfig(loadLayer);
