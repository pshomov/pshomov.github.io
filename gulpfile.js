/*global process, console*/
'use strict';
var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefix = require('gulp-autoprefixer'),
    refresh = require('gulp-livereload'),
    clean = require('gulp-clean');
var lr = require('tiny-lr'),
    server = lr();

var Metalsmith = require('metalsmith'),
    drafts = require('metalsmith-drafts'),
    markdown = require('metalsmith-markdown'),
    templates = require('metalsmith-templates'),
    collections = require('metalsmith-collections'),
    permalinks = require('metalsmith-permalinks');


var lessFile = 'less/site.less';
gulp.task('styles', ['clean'], function() {
    return gulp.src(lessFile)
        .pipe(less())
        .on('error', function(err) {
            console.log(err);
            // if (!noFail) {process.exit(12);}
        })
        .pipe(autoprefix("last 1 version"))
        .pipe(gulp.dest('_site/css/'));
});


gulp.task('clean', function(cb) {
    gulp.src(['_site/*', 'build/*'], {
        read: false
    }).pipe(clean()).on('end', cb).on('error', cb);
});

gulp.task('gen', ['clean'], function(cb) {
    console.log("Regenerating posts");
    new Metalsmith(__dirname)
        .source('_posts')
        .destination('build')
        .use(drafts())
        .use(collections({
            articles: {
                pattern: '*.md',
                sortBy: 'date',
                reverse: true
            }
        }))
        .use(markdown())
        .use(permalinks(':title'))
        .use(templates({
            engine: 'swig',
            directory: '_layouts',
            cache: false
        }))
        .build(function (err) {
            cb();
        });
});

gulp.task('repackage', ['gen'], function() {
    gulp.src('build/**/*')
        .pipe(gulp.dest('_site'));
    gulp.src('public/**/*')
        .pipe(gulp.dest('_site'));
});

gulp.task('content', ['repackage', 'styles']);

gulp.task('default', ['content'], function() {
    server.listen(35649, function(err) {
        if (err) {
            return console.log(err);
        }

        gulp.watch(['_posts/**/*.md', 'public/**/*', '_layouts/**/*'], ['content']);
        gulp.watch('less/**/*', ['content']);
    });
});