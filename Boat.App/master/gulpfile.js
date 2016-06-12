var gulp = require('gulp'),
    $ = require('gulp-load-plugins')();


// MAIN PATHS
var paths = {
    app: '../app/',
    markup: 'jade/',
    styles: 'less/',
    scripts: 'js/'
}

// SOURCES CONFIG 
var source = {
    scripts: ['../scripts/ai.0.22.9-build00167.js',
              // template modules
              paths.scripts + 'modules/**/*.module.js',
              paths.scripts + 'modules/**/*.js'
    ]
};

// BUILD TARGET CONFIG 
var build = {
    scripts: paths.app + 'js'
};

//merge *.js
gulp.task('scripts-app', function () {
    
    return gulp.src(source.scripts)
            .pipe($.jsvalidate())
            .on('error', handleError)
            .pipe($.if(false, $.sourceMaps.init()))
            .pipe($.concat('app.js'))
            .pipe($.ngAnnotate())
            .on('error', handleError).on('error', handleError)
            .pipe($.if(false, $.uglify({ preserveComments: 'some' })))
            .on('error', handleError)
            .pipe($.if(false, $.sourcemaps.write()))
            .pipe(gulp.dest(build.scripts));
});

// Error handler
function handleError(err) {
    log(err.toString());
    this.emit('end');
}
