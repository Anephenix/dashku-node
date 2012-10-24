#!/usr/local/bin/node
// Simple CLI tool for dashku widgets

var fs = require('fs')
  , path = require('path')
  , dashku = require('../')
  , optimist = require('optimist')
  , cwd = process.cwd()
  , folder = path.basename(cwd)
  , config
  , html
  , css
  , json
  , script
  , usage = 'Expects a config.json file with { apiKey, dashboardId, widgetId }'
      + '\nand optional { scriptType, apiUrl, name, snapshortUrl }.'
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
  .options('s',
    { alias: 'seed'
    , boolean: true
    , describe: 'Turn a widget into a seed file for use as a template.'
    })
  .options('c',
    { alias: 'create'
    , boolean: true
    , describe: 'Create a new widget on the remote dashboard.'
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

// Fill in defaults for config
if (!config.name) config.name = folder
if (!config.scriptType) config.scriptType = 'javascript'
if (!config.snapshotUrl) {
  config.snapshotUrl = '/images/widgetTemplates/' + folder + '.png'
}

dashku.setApiKey(config.apiKey)
if (config.apiUrl) {
  dashku.setApiUrl(config.apiUrl)
}

if (argv.p) {
  html = fs.readFileSync(path.join(cwd, 'widget.html'), 'utf8')
  css = fs.readFileSync(path.join(cwd, 'widget.css'), 'utf8')
  json = fs.readFileSync(path.join(cwd, 'widget.json'), 'utf8')
  json = conf(json)

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
    , scriptType: config.scriptType
    }
  dashku.updateWidget(newWidget, function (res) {
    console.log(res.status)
  })
} else if (argv.g) {

  dashku.getDashboards(function (res) {
    var widget
    res.dashboards.filter(function (db) {
      if (db._id === config.dashboardId) return true
    })[0].widgets.forEach(function (item) {
      if (item._id === config.widgetId) widget = item
    })
    console.log(res.status)
    widget.json = scrub(widget.json)
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
  json = conf(json)

  dashku.transmission(json, function (res) {
    console.log(res.status)
  })

} else if (argv.s) {
  html = fs.readFileSync(path.join(cwd, 'widget.html'), 'utf8')
  css = fs.readFileSync(path.join(cwd, 'widget.css'), 'utf8')
  json = fs.readFileSync(path.join(cwd, 'widget.json'), 'utf8')
  json = conf(json)

  if (config.scriptType === 'coffeescript') {
    script = fs.readFileSync(path.join(cwd, 'widget.coffee'), 'utf8')
  } else {
    script = fs.readFileSync(path.join(cwd, 'widget.js'), 'utf8')
  }

  var seed = 'module.exports ='
    + "\n  name: '''" + config.name
    + "'''\n  json: '''" + scrub(json)
    + "'''\n  scriptType: '''" + config.scriptType
    + "'''\n  script: '''" + script
    + "'''\n  html: '''" + html
    + "'''\n  css: '''" + css
    + "'''\n  snapshotUrl: '''" + config.snapshotUrl
    + "'''\n"

  fs.writeFile('seed.coffee', seed)

} else if (argv.c) {
  html = fs.readFileSync(path.join(cwd, 'widget.html'), 'utf8')
  css = fs.readFileSync(path.join(cwd, 'widget.css'), 'utf8')
  json = fs.readFileSync(path.join(cwd, 'widget.json'), 'utf8')
  json = conf(json)

  if (config.scriptType === 'coffeescript') {
    script = fs.readFileSync(path.join(cwd, 'widget.coffee'), 'utf8')
  } else {
    script = fs.readFileSync(path.join(cwd, 'widget.js'), 'utf8')
  }

  var newWidget =
    { dashboardId: config.dashboardId
    , name: config.name
    , html: html
    , css: css
    , script: script
    , json: json
    , scriptType: config.scriptType
    }

  dashku.createWidget(newWidget, function (res) {
    if (!config.widgetId) {
      config.widgetId = res.widget._id
      fs.writeFile('config.json', JSON.stringify(config, null, 2))
    } else console.log('Created: ' + res.widget._id)
    console.log(res.status)
  })
}else {
  optimist.showHelp()
}

function scrub (example) {
    // scrub the id and api key from widget.json
    example = JSON.parse(example)
    delete example._id
    delete example.apiKey
    return JSON.stringify(example, null, 2)
}

function conf (example) {
  // Add the id and api key from config.json
  example = JSON.parse(example)
  example.apiKey = config.apiKey
  example._id = config.widgetId
  return JSON.stringify(example, null, 2)
}

