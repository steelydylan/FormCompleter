const gulp = require('gulp');
const minify = require('gulp-uglify');
const watch = require('gulp-watch');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const connect = require('gulp-connect');
const settings = require('./package.json').settings;
const source = "javascript:(function(){var newScript = document.createElement('script');newScript.src='<%=protocol%>://localhost:<%=port%>/<%=js%>?hoge='+ Math.random();document.body.appendChild(newScript);})();";
const fs = require('fs');

gulp.task("default", function () {
  let string = source.replace("<%=port%>", settings.port);
  const protocol = settings.https ? "https" : "http";

	if (settings.https) {
		connect.server({
			root: settings.dist,
			port: settings.port,
			https: true
		});
	} else {
		connect.server({
			root: settings.dist,
			port: settings.port
		});
	}
	
	string = string.replace("<%=js%>", settings.js);
	string = string.replace("<%=protocol%>", protocol);
	fs.writeFile('bookmarklet.js', string);
});