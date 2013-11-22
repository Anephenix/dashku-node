request         = require 'request'
# Pointing directly to dashku.com's ip address due to DNS issue with hitting dashku.com.
@apiUrl         = "https://dashku.com" 

# Sets the api key used by the client
exports.setApiKey = (value, cb=null) ->
  @apiKey = value
  cb() if cb?

# Sets the api url used by the client
exports.setApiUrl = (value, cb=null) ->
  @apiUrl = value
  cb() if cb?

# returns all of the user's dashboards
exports.getDashboards = (cb) ->
  url     = "#{@apiUrl}/api/dashboards?apiKey=#{@apiKey}"
  headers = accept: "application/json"
  request.get {url,headers}, (err,res,body) ->
    body = JSON.parse body
    if res.statusCode is 200
      cb status: 'success', dashboards: body
    else
      cb body

# returns a dashboard
exports.getDashboard = (id, cb) ->
  url     = "#{@apiUrl}/api/dashboards/#{id}?apiKey=#{@apiKey}"
  headers = accept: "application/json"
  request.get {url, headers}, (err,res,body) ->
    body = JSON.parse body
    if res.statusCode is 200
      cb status: 'success', dashboard: body
    else
      cb body

# creates a dashboard
exports.createDashboard = (body, cb=null) ->
  url     = "#{@apiUrl}/api/dashboards?apiKey=#{@apiKey}"
  json    = true
  request.post {url, body, json}, (err,res,body) ->
    if res.statusCode is 202
      cb status: 'success', dashboard: body
    else
      cb body

# updates a dashboard
exports.updateDashboard = (body, cb=null) ->
  url     = "#{@apiUrl}/api/dashboards/#{body._id}?apiKey=#{@apiKey}"
  json    = true
  request.put {url, body, json}, (err,res,body) ->
    if res.statusCode is 201
      cb status: 'success', dashboard: body
    else
      cb body

# deletes a dashboard
exports.deleteDashboard = (dashboardId, cb=null) ->
  url     = "#{@apiUrl}/api/dashboards/#{dashboardId}?apiKey=#{@apiKey}"
  headers = accept: "application/json"
  method  = "DELETE"
  request.del {method, url, headers}, (err,res,body) ->
    if res.statusCode is 201
      cb JSON.parse body
    else
      cb JSON.parse body

# creates a widget
exports.createWidget = (body, cb=null) ->
  url     = "#{@apiUrl}/api/dashboards/#{body.dashboardId}/widgets?apiKey=#{@apiKey}"
  json    = true
  request.post {url, body, json}, (err,res,body) ->
    if res.statusCode is 202
      cb status: 'success', widget: body
    else
      cb body

# updates a widget
exports.updateWidget = (body, cb=null) ->
  url     = "#{@apiUrl}/api/dashboards/#{body.dashboardId}/widgets/#{body._id}?apiKey=#{@apiKey}"
  json    = true
  request.put {url, body, json}, (err,res,body) ->
    if res.statusCode is 201
      cb status: 'success', widget: body
    else
      cb body

# deletes a widget
exports.deleteWidget = (dashboardId, widgetId, cb=null) ->
  url     = "#{@apiUrl}/api/dashboards/#{dashboardId}/widgets/#{widgetId}?apiKey=#{@apiKey}"
  headers = accept: "application/json"
  method  = "DELETE"
  request {method, url, headers}, (err,res,body) ->
    if res.statusCode is 201
      cb JSON.parse body
    else
      cb JSON.parse body

exports.transmission = (body, cb=null) ->
  url     = "#{@apiUrl}/api/transmission?apiKey=#{@apiKey}"
  json    = true
  request.post {url, body, json}, (err,res,body) ->
    if res.statusCode is 200
      cb status: 'success'
    else
      cb body