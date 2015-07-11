/*global process, console*/
'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');
var merge = require('merge-stream');

var del = require('del');

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

gulp.task('gen', function(cb) {
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
    return merge(
        gulp.src('public/imgs/me-original.png')
            .pipe($.imageResize({
                width: 200,
                height: 200,
                crop: false,
                upscale: false
            }))
            .pipe($.rename('imgs/me.png'))        
            .pipe(gulp.dest('.tmp')),
        gulp.src('public/imgs/me-original.png')
            .pipe($.imageResize({
                width: 400,
                height: 400,
                crop: false,
                upscale: false
            }))
            .pipe($.rename('imgs/me@2x.png'))
            .pipe(gulp.dest('.tmp'))
    );
});

gulp.task('clean:dev', function() {
    del.sync(['.tmp']);
});

gulp.task('clean:dist', function() {
    del.sync(['dist']);
});

gulp.task('imagemin', function() {
    return gulp.src('.tmp/imgs/*')
        // .pipe($.imagemin({
        //     progressive: true,
        //     svgoPlugins: [{
        //         removeViewBox: false
        //     }]
        // }))
        .pipe(gulp.dest('dist/imgs'));
});

gulp.task('copy', function() {
    // return gulp.src(['app/*.txt', 'app/*.ico', 'app/fonts'])
    //     .pipe(gulp.dest('dist'));
})

gulp.task('copyFonts', function() {
    // return gulp.src(['app/fonts/*'])
    //     .pipe(gulp.dest('dist/fonts'));
})

gulp.task('styles', function() {
    return gulp.src(lessFile)
        .pipe($.less())
        .pipe($.autoprefixer({
            browsers: ['last 5 versions']
        }))
        .pipe(gulp.dest('.tmp/css/'))        
        .pipe($.livereload());
});

gulp.task('pages', ['gen'],function(){
  return gulp.src('build/**/*.html')
    .pipe($.injectReload())
    .pipe(gulp.dest('.tmp'))
    .pipe($.livereload());
});

gulp.task('bundle', function() {
    var assets = $.useref.assets({
        searchPath: '{.tmp,node_modules,bower_components}'
    });
    var jsFilter = $.filter(['**/*.js']);
    var cssFilter = $.filter(['**/*.css']);
    var htmlFilter = $.filter(['*.html']);

    return gulp.src('build/**/*.html')
        .pipe(assets)
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(jsFilter)
        .pipe($.uglify())
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.autoprefixer({
            browsers: ['last 5 versions']
        }))
        .pipe($.minifyCss())
        .pipe(cssFilter.restore())
        .pipe(htmlFilter)
        .pipe($.htmlmin({
            collapseWhitespace: true
        }))
        .pipe(htmlFilter.restore())
        .pipe($.revAll({
            ignore: [/^\/favicon.ico$/g, '.html']
        }))
        .pipe($.revReplace())
        .pipe(gulp.dest('dist'))
        .pipe($.size());
});

gulp.task('build', function(callback) {
    runSequence(['clean:dev', 'clean:dist'], [ 'process_images'], ['imagemin', 'styles', 'copy', 'copyFonts', 'gen'],
        ['bundle'], callback);
});

gulp.task('webserver', function() {
    return gulp.src(['.tmp', 'bower_components'])
        .pipe($.webserver({
            host: '0.0.0.0', //change to 'localhost' to disable outside connections
            livereload: false,
            open: false
        }));
});


gulp.task('webserver-dist', function() {
    return gulp.src(['dist'])
        .pipe($.webserver({
            host: '0.0.0.0', //change to 'localhost' to disable outside connections
            port: 8001,
            livereload: false,
            open: true
        }));
});

gulp.task('deploy', function () {
    return gulp.src('dist/**')
        .pipe($.ghPages());
});

gulp.task('serve', function() {
    $.livereload({start: true});
    runSequence('clean:dev', 'styles', 'pages', 'process_images', 'webserver');

    gulp.watch('less/*.less', ['styles']);
    gulp.watch(['_layouts/*.html','_posts/*'], ['pages']);
});
