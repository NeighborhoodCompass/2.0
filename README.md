Neighborhood Compass 2.0 (development).
==========

Durham NC's adaptations of Tobin Bradley's Quality of Life Explorer v2 (https://github.com/tobinbradley/Mecklenburg-County-Quality-of-Life-Dashboard). Changes made here will roll into the Durham Neighborhood Compass (http://compass.durhamnc.gov).

### How to set up the project
*Modified from the Mecklenburg QoL Dashboard Readme*

#### Install node

Install NodeJS by following [the instructions on nodejs.org for your platform](https://nodejs.org/en/).

#### Clone the project locally

Use the `Clone or Download` link on the [Github repo page](https://github.com/NeighborhoodCompass/2.0) to clone locally.

#### Set up the project

I'm using gulp as the build/dev system, because awesome. We'll be using topojson to encode our geography. From inside the project directory, run the following commands.

```
npm install -g gulp topojson
npm install
```

#### Finishing touches

The search function is set up to use Mecklenburg's search API's and won't work for other areas. To swap Mecklenburg's search out for a generic search that will work for any area:

`gulp init`

#### Finally, build the project.

`gulp build`

#### Fire it up!

The default gulp task starts BrowserSync and launches your current web browser to view the site. Live reload is enabled, so changes will automatically refresh in your browser.

`gulp`


