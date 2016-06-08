var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    markdown = require('gulp-markdown'),
    gutil = require('gulp-util'),
    md2json = require('gulp-markdown-to-json'),
    //gulp-markdown-table-to-json - https://www.npmjs.com/package/gulp-markdown-table-to-json;
    convert_cb = require('gulp-convert'),
    convert_nh = require('gulp-convert'),
    imagemin = require('gulp-imagemin'),
    replace = require('gulp-replace'),
    jsoncombine = require("gulp-jsoncombine"),
    fs = require('fs'),
    del = require('del'),
    config = require('./src/scripts/config.js');


var jsMain = [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/bootstrap/js/transition.js',
    'bower_components/bootstrap/js/button.js',
    'bower_components/bootstrap/js/collapse.js',
    'bower_components/bootstrap/js/dropdown.js',
    'bower_components/bootstrap/js/tooltip.js',
    'bower_components/bootstrap/js/popover.js',
    'bower_components/d3/d3.js',
    'bower_components/leaflet/dist/leaflet.js',
    'bower_components/leaflet.locatecontrol/src/L.Control.Locate.js',
    'bower_components/jquery.scrollTo/jquery.scrollTo.js',
    'bower_components/chosen-build/chosen.jquery.js',
    'bower_components/lodash/lodash.js',
    'bower_components/topojson/topojson.js',
    'bower_components/L.EasyButton/easy-button.js',
    'src/scripts/vendor/log.js',
    'src/scripts/vendor/Object.observe.poly.js',
    'src/scripts/vendor/jquery-ui-1.10.3.custom.min.js',
    'src/scripts/vendor/table2CSV.js',
    'src/scripts/vendor/Chart.js',
    'src/scripts/vendor/typeahead.js',
    'src/scripts/vendor/jquery-tourbus.js',
    'src/scripts/functions/*.js',
    'src/scripts/config.js',
    'src/scripts/main.js'
];

var jsReport = [
    'bower_components/jquery/dist/jquery.js',
    'bower_components/bootstrap/js/button.js',
    'bower_components/leaflet/dist/leaflet.js',
    'bower_components/Leaflet.label/dist/leaflet.label.js',
    'bower_components/topojson/topojson.js',
    'bower_components/lodash/lodash.js',
    'src/scripts/vendor/Chart.js',
    'src/scripts/functions/generics.js',
    'src/scripts/functions/calculations.js',
    'src/scripts/config.js',
    'src/scripts/report.js'
];

// Web server
gulp.task('browser-sync', function() {
    browserSync(['./dist/**/*.css', './dist/**/*.js', './dist/**/*.html'], {
        server: {
            baseDir: "./dist"
        }
    });
});


// Less processing
gulp.task('less', function() {
    return gulp.src(['src/less/main.less', 'src/less/report.less'])
        .pipe(less())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('dist/css'));
});
gulp.task('less-build', function() {
    return gulp.src(['src/less/main.less', 'src/less/report.less'])
        .pipe(less())
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/css'));
});

// JavaScript
gulp.task('js', function() {
    gulp.src(jsMain)
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/js'));
    return gulp.src(jsReport)
        .pipe(concat('report.js'))
        .pipe(gulp.dest('dist/js'));
});
gulp.task('js-build', function() {
    gulp.src(jsReport)
        .pipe(concat('report.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
    return gulp.src(jsMain)
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

// markdown
gulp.task('markdown_cb', ['clean'], function() {
    return gulp.src('src/data/meta/census/*.md')
        .pipe(markdown())
        .pipe(gulp.dest('dist/data/meta/'));
});
// markdown
gulp.task('markdown_nh', ['clean'], function() {
    return gulp.src('src/data/meta/neighborhood/*.md')
        .pipe(markdown())
        .pipe(gulp.dest('dist/data/meta/'));
});
// CSV to JSON
gulp.task('convert_cb', ['clean'], function() {
    return gulp.src('src/data/metric/census/*.csv')
        .pipe(convert_cb({
            from: 'csv',
            to: 'json'
        }))
        .pipe(gulp.dest('dist/data/metric/'));
        
});
// CSV to JSON
gulp.task('convert_nh', ['clean'], function() {
    return gulp.src('src/data/metric/neighborhood/*.csv')
        .pipe(convert_nh({
            from: 'csv',
            to: 'json'
        }))
        .pipe(gulp.dest('dist/data/metric/'));
        
});

// merge metadata markdown into json. 
//gulp.task('merge-meta_cb', ['clean', 'convert_cb'], function() {
gulp.task('merge-meta_cb', function() {
    gulp.src(['src/data/meta/census/*.md'])
        .pipe(gutil.buffer())
        .pipe(md2json('mergeMeta_cb.json',{
            pedantic: true,
            smartypants: true}))
        .pipe(gulp.dest("dist/data/meta"));
});	
// merge metadata markdown into json. 
// gulp.task('merge-meta_nh', ['clean', 'convert_nh'], function() {
gulp.task('merge-meta_nh', function() {
    gulp.src(['src/data/meta/neighborhood/*.md'])
        .pipe(gutil.buffer())
        .pipe(md2json('mergeMeta_nh.json',{
            sanitize: true}))
        .pipe(gulp.dest("dist/data/meta"));
});	

// merge json
gulp.task('merge-json_cb', ['clean', 'convert_cb'], function() {
    return gulp.src(['dist/data/metric/*.json','!dist/data/metric/*-n.json'])
        .pipe(jsoncombine("merge_cb.json", function(data){ return new Buffer(JSON.stringify(data)); }))
        .pipe(gulp.dest("dist/data"));
    
});
// merge json
gulp.task('merge-json_nh', ['clean', 'convert_nh'], function() {
    return gulp.src("dist/data/metric/*-n.json")
        .pipe(jsoncombine("merge_nh.json", function(data){ return new Buffer(JSON.stringify(data)); }))
        .pipe(gulp.dest("dist/data/"));
});
// image processing
gulp.task('imagemin', function() {
    return gulp.src('src/images/build/*')
        .pipe(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/images'));
});

// cache busting
gulp.task('replace', function() {
    return gulp.src('src/*.html')
        .pipe(replace("{{cachebuster}}", Math.floor((Math.random() * 100000) + 1)))
        .pipe(replace("{{neighborhoodDescriptor}}", config.neighborhoodDescriptor))
        .pipe(replace("{{gaKey}}", config.gaKey))
        .pipe(gulp.dest('dist/'));
});

// watch
gulp.task('watch', function () {
    gulp.watch(['./src/*.html'], ['replace']);
    gulp.watch(['./src/less/**/*.less'], ['less']);
    gulp.watch('src/scripts/**/*.js', ['js']);
});

// rename files for basic setup
gulp.task('init', function() {
    // make sure people don't run this twice and end up with no search.js
    fs.exists('src/scripts/functions/search.js.basic', function(exists) {
        if (exists) {
            console.log("renaming search files...");
            // rename mecklenburg search file to search.js.meck
            fs.rename('src/scripts/functions/search.js', 'src/scripts/functions/search.js.advanced', function(err) {
                if ( err ) { console.log('ERROR: ' + err); }
            });
            // rename default search file to search.js
            fs.rename('src/scripts/functions/search.js.basic', 'src/scripts/functions/search.js', function(err) {
                if ( err ) { console.log('ERROR: ' + err); }
            });
        }
  });
});

// clean junk before build
//~*~*~*~*~*run newly created merge_nh-json prior to creating the call to delete merge_nh.json below. 
gulp.task('clean', function(cb) {
    process.stdout.write('startClean');
    del([
    'dist/data/meta/*.html',
    'dist/data/metric/*.json',
    'dist/data/merge_cb.json',
    'dist/data/meta/mergeMeta_cb.json',
    'dist/data/meta/*.html',
    'dist/data/metric/*.json',
    'dist/data/merge_nh.json',
    'dist/data/meta/mergeMeta_nh.json'
  ], cb);
    process.stdout.write('endClean');
});

// controller tasks
gulp.task('default', ['less', 'js', 'replace', 'watch', 'browser-sync']);
gulp.task('build', ['clean', 'less-build', 'js-build', 'markdown_cb', 'markdown_nh', 'convert_cb', 'convert_nh', 'replace', 'imagemin', 'merge-json_cb', 'merge-json_nh','merge-meta_cb','merge-meta_nh']);
