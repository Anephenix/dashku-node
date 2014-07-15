#!/usr/local/bin/node

'use strict';
// Simple CLI tool for dashku widgets

var fs = require('fs'),
		path = require('path'),
		dashku = require('../'),
		optimist = require('optimist'),
		cc = require('config-chain'),
		cwd = process.cwd(),
		folder = path.basename(cwd),
		html,
		css,
		json,
		script,
		configOpts = [ 'apiKey', 'dashboardId', 'widgetId', 'scriptType', 'apiUrl', 'name', 'snapshotUrl' ],
		usage = 'You can configure ' + configOpts.join(', ') +
		[
		'',
		'by cli argument, specified --config file, ./config.json, (../)+config.json,',
		'or dashku_ env var, in that order. Defaults provided for non-critical options.',
		'HTML, CSS, test JSON, and script',
		'are saved as `widget.html`, `widget.css`, `widget.json`, and',
		'either `widget.js` or `widget.coffee`'
	].join('\n');

var argv = optimist.usage(usage + '\nUsage: $0')
	.options('p',
		{ alias: 'push',
			boolean: true,
			describe: 'Push widget to dashku'
		})
	.options('g',
		{ alias: 'get',
			boolean: true,
			describe: 'Get new version of widget from dashku'
		})
	.options('s',
		{ alias: 'seed',
			boolean: true,
			describe: 'Turn a widget into a seed file for use as a template.'
		})
	.options('c',
		{ alias: 'create',
			boolean: true,
			describe: 'Create a new widget on the remote dashboard.'
		})
	.options('t',
		{ alias: 'transmit',
			boolean: true,
			describe: 'Ping widget with test packet'
		}).argv;

var config = cc( argv,
		argv.config,
		find('config.json'),
		cc.env('dashku_'),
		{ scriptType: 'javascript',
			name: folder,
			snapshotUrl: '/images/widgetTemplates/' + folder + '.png'
		}
	).store;

if (!config.apiKey) {
	optimist.showHelp();
	console.log('Must provide an apiKey: argument, config.json, or dashku_apiKey env var.');
	process.exit();
}

dashku.setApiKey(config.apiKey);
if (config.apiUrl) {
	dashku.setApiUrl(config.apiUrl);
}

if (argv.p) {
	html = fs.readFileSync(path.join(cwd, 'widget.html'), 'utf8');
	css = fs.readFileSync(path.join(cwd, 'widget.css'), 'utf8');
	json = fs.readFileSync(path.join(cwd, 'widget.json'), 'utf8');
	json = conf(json);

	if (config.scriptType === 'coffeescript') {
		script = fs.readFileSync(path.join(cwd, 'widget.coffee'), 'utf8');
	} else {
		script = fs.readFileSync(path.join(cwd, 'widget.js'), 'utf8');
	}

	var newWidget = {
		dashboardId: config.dashboardId,
		name: config.name,
		_id: config.widgetId,
		html: html,
		css: css,
		script: script,
		json: json,
		scriptType: config.scriptType
	};
	dashku.updateWidget(newWidget, function (res) {
		console.log(res.status);
	});
} else if (argv.g) {

	dashku.getDashboards(function (res) {
		var widget;
		res.dashboards.filter(function (db) {
			if (db._id === config.dashboardId) return true;
		})[0].widgets.forEach(function (item) {
			if (item._id === config.widgetId) widget = item;
		});
		console.log(res.status);
		widget.json = scrub(widget.json);
		fs.writeFile('widget.json', widget.json);
		if (widget.scriptType === 'coffeescript') {
			fs.writeFile('widget.coffee', widget.script);
		} else {
			fs.writeFile('widget.js', widget.script);
		}
		fs.writeFile('widget.css', widget.css);
		fs.writeFile('widget.html', widget.html);
		fs.exists(path.join(cwd, 'config.json'), function (exists) {
			var configFile = {};
			if (!exists) {
				configOpts.forEach(function (d) {
					var opt = widget[d] || config[d];
					if (opt !== undefined) configFile[d] = opt;
				});
				fs.writeFile('config.json', JSON.stringify(configFile, null, 2));
			}
		});
	});

} else if (argv.t) {

	json = fs.readFileSync(path.join(cwd, 'widget.json'), 'utf8');
	json = conf(json);

	dashku.transmission(json, function (res) {
		console.log(res.status);
	});

} else if (argv.s) {
	html = fs.readFileSync(path.join(cwd, 'widget.html'), 'utf8');
	css = fs.readFileSync(path.join(cwd, 'widget.css'), 'utf8');
	json = fs.readFileSync(path.join(cwd, 'widget.json'), 'utf8');
	json = conf(json);

	if (config.scriptType === 'coffeescript') {
		script = fs.readFileSync(path.join(cwd, 'widget.coffee'), 'utf8');
	} else {
		script = fs.readFileSync(path.join(cwd, 'widget.js'), 'utf8');
	}

	var seed = 'module.exports =' +
		'\n  name: """' + config.name +
		'"""\n  json: """' + scrub(json) +
		'"""\n  scriptType: """' + config.scriptType +
		'"""\n  script: """' + script +
		'"""\n  html: """' + html +
		'"""\n  css: """' + css +
		'"""\n  snapshotUrl: """' + config.snapshotUrl +
		'"""\n';

	fs.writeFile('seed.coffee', seed);

} else if (argv.c) {
	html = fs.readFileSync(path.join(cwd, 'widget.html'), 'utf8');
	css = fs.readFileSync(path.join(cwd, 'widget.css'), 'utf8');
	json = fs.readFileSync(path.join(cwd, 'widget.json'), 'utf8');
	json = conf(json);

	if (config.scriptType === 'coffeescript') {
		script = fs.readFileSync(path.join(cwd, 'widget.coffee'), 'utf8');
	} else {
		script = fs.readFileSync(path.join(cwd, 'widget.js'), 'utf8');
	}

	var newWidget = {
		dashboardId: config.dashboardId,
		name: config.name,
		html: html,
		css: css,
		script: script,
		json: json,
		scriptType: config.scriptType
	};

	dashku.createWidget(newWidget, function (res) {
		var configFile = {};
		console.log(res.status);
		if (res.widget) {
			if (!config.widgetId) {
				config.widgetId = res.widget._id;
				configOpts.forEach(function (d) {
					var opt = config[d];
					if (opt !== undefined) configFile[d] = opt;
				});
				fs.writeFile('config.json', JSON.stringify(configFile, null, 2));
			} else console.log('Created: ' + res.widget._id);
		}
	});
} else {
	optimist.showHelp();
}

function scrub (example) {
	// scrub the id and api key from widget.json
	example = JSON.parse(example);
	delete example._id;
	delete example.apiKey;
	return JSON.stringify(example, null, 2);
}

function conf (example) {
	// Add the id and api key from config.json
	example = JSON.parse(example);
	example.apiKey = config.apiKey;
	example._id = config.widgetId;
	return JSON.stringify(example, null, 2);
}

function find (name) {
	return find (cwd);
	function find (dir) {
		var file = path.join(dir, name);
		try {
			fs.statSync(file);
			return file;
		} catch (e) {
			if (dir != '/') return find(path.dirname(dir));
		}
	}
}

