var gulp = require('gulp'); 
var minify = require('gulp-uglify');
var watch = require('gulp-watch');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var connect = require('gulp-connect');
var settings = require('./package.json').settings;
var source = "javascript:(function(){var newScript = document.createElement('script');newScript.src='<%=protocol%>://localhost:<%=port%>/<%=js%>?hoge='+ Math.random();document.body.appendChild(newScript);})();";
var fs = require('fs');
gulp.task("bookmarklet",function(){
	gulp.src([settings.src+"/*.js"])
        .pipe(minify())
        .pipe(replace('!function','javascript:(function'))
        .pipe(replace('\}\(\);','})();'))
        .pipe(gulp.dest(settings.dest))
});
gulp.task("default",function(){
	if(settings.https){
		connect.server({
			root:settings.dest,
			port:settings.port,
			https:true
		});
	}else{
		connect.server({
			root:settings.dest,
			port:settings.port
		});
	}
	var string = source.replace("<%=port%>",settings.port);
	string = string.replace("<%=js%>",settings.js);
	var protocol = settings.https ? "https" : "http";
	string = string.replace("<%=protocol%>",protocol);
	fs.writeFile('bookmarklet.js',string);
    watch(settings.src+"/*.js",function(){
    	gulp.start("bookmarklet");
    });
});