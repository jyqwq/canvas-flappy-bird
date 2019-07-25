var gp = require('gulp');
var concat = require('gulp-concat');
var uglify=require('gulp-uglify');

gp.task('hebing', done => {
    gp.src(['js/*.js']).pipe(concat('main.js')).pipe(gp.dest('./dist'));
    done()
});
