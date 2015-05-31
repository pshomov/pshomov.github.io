/*global process, console*/
'use strict';
var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefix = require('gulp-autoprefixer'),
    refresh = require('gulp-livereload'),
    connect = require('gulp-connect'),
    rename = require("gulp-rename"),
    imageResize = require('gulp-image-resize'),
    clean = require('gulp-clean');
var lr = require('tiny-lr'),
    server = lr();

var Metalsmith = require('metalsmith'),
    drafts = require('metalsmith-drafts'),
    markdown = require('metalsmith-markdown'),
    templates = require('metalsmith-templates'),
    builddate = require('metalsmith-build-date'),
    collections = require('metalsmith-collections'),
    feed = require('metalsmith-feed-js'),
    permalinks = require('metalsmith-permalinks');

var dev = process.env.DEV;
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
    var noop = function(files, metalsmith, done) {
        done();
    };
    var duplicate = function(files, metalsmith, done) {

        for (var file in files) {
            files[file].contentz = files[file].contents;
        }

        done();
    };
    var testContent = function(files, metalsmith, done) {

        for (var i = 0; i < 10; i++) {
            var content = {};
            content.title = 'Lorem ipsum '+i.toString();
            content.date = new Date();
            content.draft = false;
            content.collection = 'articles';
            content.contents = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error, harum, necessitatibus, similique aperiam consectetur officiis labore tenetur iste odio cumque sed blanditiis quia eos nostrum adipisci facere pariatur dolorem natus.';
            content.contentz = content.contents;
            files['posts/lorem'+i.toString()+'.md'] = content;
        }

        done();
    };

    console.log("Regenerating posts");
    new Metalsmith(__dirname)
        .metadata({
            site: {
              title: 'Petar\'s blog',
              url: 'http://pshomov.github.io',
              author: 'Petar Shomov'
            }            
        })
        .source('_posts')
        .destination('build')
        .use(dev ? testContent : noop)
        .use(drafts())
        .use(builddate())
        .use(collections({
            articles: {
                pattern: '*.md',
                sortBy: 'date',
                reverse: true
            }
        }))
        .use(markdown())
        .use(duplicate)
        .use(permalinks(':title'))
        .use(feed({collection: 'articles'}))
        .use(function (files, metalsmith, done) {
            files['atom.xml'] = {
                template: 'atom.html',
                contents: new Buffer('')
            };
            done();
        })
        .use(templates({
            engine: 'swig',
            directory: '_layouts',
            cache: false
        }))
        .build(cb);
});

gulp.task('process_images', function(){
    gulp.src('public/imgs/me-original.png')
        .pipe(imageResize({
            width: 200,
            height: 200,
            crop: false,
            upscale: false
        }))
        .pipe(rename('imgs/me.png'))        
        .pipe(gulp.dest('_site'));
    gulp.src('public/imgs/me-original.png')
        .pipe(imageResize({
            width: 400,
            height: 400,
            crop: false,
            upscale: false
        }))
        .pipe(rename('imgs/me@2x.png'))
        .pipe(gulp.dest('_site'));
});
gulp.task('repackage', ['gen', 'process_images'], function() {
    gulp.src('build/**/*')
        .pipe(gulp.dest('_site'));
    gulp.src('bower_components/**/*')
        .pipe(gulp.dest('_site'));
});

gulp.task('content', ['repackage', 'styles']);
gulp.task('connect', function() {
    connect.server({
        root: '_site',
        port: 80
    });
});

gulp.task('default', ['content', 'connect'], function() {
    server.listen(35649, function(err) {
        if (err) {
            return console.log(err);
        }

        gulp.watch(['_posts/**/*.md', 'public/**/*', '_layouts/**/*'], ['content']);
        gulp.watch('less/**/*', ['content']);
    });
});