#!/usr/local/bin/node
// Simple CLI tool for dashku widgets

var fs = require('fs')
  , path = require('path')
  , dashku = require('../')
  , optimist = require('optimist')
  , cwd = process.cwd()
  , config
  , html
  , css
  , json
  , script
  , usage = 'Expects a config.json file with { apiKey, dashboardId, widgetId }'
      + '\nand an optional scriptType, and optional apiUrl.'
      + '\nHTML, CSS, test JSON, and script'
      + '\nare saved as `widget.html`, `widget.css`, `widget.json`, and'
      + '\neither `widget.js` or `widget.coffee`'

var argv = optimist.usage(usage + '\nUsage: $0')
  .options('p',
    { alias: 'push'
    , boolean: true
    , describe: 'Push widget to dashku'
    })
  .options('g',
    { alias: 'get'
    , boolean: true
    , describe: 'Get new version of widget from dashku'
    })
  .options('t',
    { alias: 'transmit'
    , boolean: true
    , describe: 'Ping widget with test packet'
    }).argv

try {
  config = JSON.parse(fs.readFileSync(path.join(cwd, 'config.json'), 'utf8'))
} catch (e) {
  optimist.showHelp()
  console.log('Error reading config.json')
  process.exit()
}

dashku.setApiKey(config.apiKey)
if (config.apiUrl) {
  dashku.setApiUrl(config.apiUrl)
}

if (argv.p) {
  html = fs.readFileSync(path.join(cwd, 'widget.html'), 'utf8')
  css = fs.readFileSync(path.join(cwd, 'widget.css'), 'utf8')
  json = fs.readFileSync(path.join(cwd, 'widget.json'), 'utf8')

  if (config.scriptType === 'coffeescript') {
    script = fs.readFileSync(path.join(cwd, 'widget.coffee'), 'utf8')
  } else {
    script = fs.readFileSync(path.join(cwd, 'widget.js'), 'utf8')
  }

  var newWidget =
    { dashboardId: config.dashboardId
    , _id: config.widgetId
    , html: html
    , css: css
    , script: script
    , json: json
    }
  if (config.scriptType) newWidget.scriptType = config.scriptType
  dashku.updateWidget(newWidget, function (res) {
    console.log(res)
  })
} else if (argv.g) {

  dashku.getDashboard(config.dashboardId, function (res) {
    var widget
    res.dashboard.widgets.forEach(function (item) {
      if (item._id === config.widgetId) widget = item
    })
    console.log(widget)
    fs.writeFile('widget.json', widget.json)
    if (widget.scriptType === 'coffeescript') {
      fs.writeFile('widget.coffee', widget.script)
    } else {
      fs.writeFile('widget.js', widget.script)
    }
    fs.writeFile('widget.css', widget.css)
    fs.writeFile('widget.html', widget.html)
  })

} else if (argv.t) {

  json = fs.readFileSync(path.join(cwd, 'widget.json'), 'utf8')

  dashku.transmission(json, function (res) {
    console.log(res)
  })

} else {
  optimist.showHelp()
}

