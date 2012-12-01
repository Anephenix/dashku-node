assert    = require 'assert'
request   = require 'request'
dashku    = require '../src/dashku'

apiKey    = "6c9fd252-9e00-46bc-8601-159a9671b0dd"
apiUrl    = "http://localhost:3000"

describe 'Dashku', ->

  describe 'setApiKey', ->

    it 'should set the api key for the library', (done) ->

      key = 'a-random-key'
      dashku.setApiKey key, ->
        assert.equal dashku.apiKey, key
        done()

  describe 'setApiUrl', ->

    it 'should set the api url for the library', (done) ->
      url = 'https://localhost'
      dashku.setApiUrl url, ->
        assert.equal dashku.apiUrl, url
        dashku.setApiUrl apiUrl, ->
          done()

  describe "Dashboards", ->

    describe 'getDashboards()', ->

      it "should return an array of dashboard objects", (done) ->

        dashku.setApiKey apiKey, ->
          dashku.getDashboards (response) ->
            assert.equal response.status, 'success'
            assert response.dashboards instanceof Array
            done()

      it "should throw an error if the response fails", (done) ->

        dashku.setApiKey "waa", ->
          dashku.getDashboards (response) ->
            assert.equal response.status, 'failure'
            assert.equal response.reason, "Couldn't find a user with that API key"
            done()

    describe 'getDashboard()', ->

      it "should return a dashboard object, given an id", (done) ->
        dashku.setApiKey apiKey, ->
          dashku.getDashboards (response) ->
            dashboardId = response.dashboards[0]._id
            dashku.getDashboard dashboardId, (response) ->
              assert.equal response.status, 'success'
              assert response.dashboard instanceof Object
              done()

      it "should throw an error if the response fails", (done) ->
        dashku.setApiKey apiKey, ->
          dashboardId = "rubbish"
          dashku.getDashboard dashboardId, (response) ->
            assert.equal response.status, 'failure'
            assert.equal response.reason, "Dashboard not found"
            done()

    describe 'createDashboard()', ->

      it "should return a dashboard object, given attributes", (done) ->
        dashku.setApiKey apiKey, ->
          attributes = 
            name: "My new dashboard"
          dashku.createDashboard attributes, (response) ->
            assert.equal response.status, 'success'
            assert response.dashboard instanceof Object
            assert.equal response.dashboard.name, attributes.name
            done()

      it "should throw an error if the response fails", (done) ->
        dashku.setApiKey "waa", ->
          attributes = 
            name: "My new dashboard"
          dashku.createDashboard attributes, (response) ->
            assert.equal response.status, 'failure'
            assert.equal response.reason, "Couldn't find a user with that API key"
            done()

    describe "updateDashboard()", ->

      it "should return a dashboard object, given attributes", (done) ->
        dashku.setApiKey apiKey, ->
          dashku.getDashboards (response) ->
            dashboardId = dashboard._id for dashboard in response.dashboards when dashboard.name is "My new dashboard"        
            attributes =
              _id: dashboardId
              name: "ZZZ dashboard"
            dashku.updateDashboard attributes, (response) ->
              assert.equal response.status, 'success'
              assert response.dashboard instanceof Object
              assert.equal response.dashboard.name, attributes.name
              done()

      it "should throw an error if the response fails", (done) ->
        attributes =
          _id: "Rubbish"
          name: "ZZZ dashboard"
        dashku.updateDashboard attributes, (response) ->
          assert.equal response.status, 'failure'
          assert.equal response.reason, "Dashboard not found"
          done()

    describe "deleteDashboard()", ->

      it "should return the id of the deleted dashboard", (done) ->
        dashku.getDashboards (response) ->
          dashboardId = dashboard._id for dashboard in response.dashboards when dashboard.name is "ZZZ dashboard"        
          dashku.deleteDashboard dashboardId, (response) ->
            assert.equal response.status, 'success'
            assert.equal response.dashboardId, dashboardId
            done()

      it "should throw an error if the response fails", (done) ->
        dashku.deleteDashboard "Rubbish", (response) ->
          assert.equal response.status, 'failure'
          assert.equal response.reason, "Dashboard not found"
          done()

  describe "Widgets", ->

    describe "createWidget()", ->

      it "should return the widget object", (done) ->
        data = name: "ZZZ dashboard"
        dashku.createDashboard data, (response) ->
          dashboardId = response.dashboard._id
          attributes = 
            dashboardId:  dashboardId
            name:         "My little widgie"
            html:         "<div id='bigNumber'></div>"
            css:          "#bigNumber {\n  padding: 10px;\n  margin-top: 50px;\n  font-size: 36pt;\n  font-weight: bold;\n}"
            script:       "// The widget's html as a jQuery object\nvar widget = this.widget;\n\n// This runs when the widget is loaded\nthis.on('load', function(data){\n  console.log('loaded');\n});\n// This runs when the widget receives a transmission\nthis.on('transmission', function(data){\n  widget.find('#bigNumber').text(data.bigNumber);\n});"
            json:         '{\n  "bigNumber":500\n}'          

          dashku.createWidget attributes, (response) ->
            assert.equal response.status, 'success'
            assert response.widget instanceof Object
            dashku.deleteDashboard dashboardId, (response) ->
              done()

      it "should throw an error if the response fails", (done) ->
        attributes = 
          dashboardId:  "Rubbish"
          name:         "My little widgie"
          html:         "<div id='bigNumber'></div>"
          css:          "#bigNumber {\n  padding: 10px;\n  margin-top: 50px;\n  font-size: 36pt;\n  font-weight: bold;\n}"
          script:       "// The widget's html as a jQuery object\nvar widget = this.widget;\n\n// This runs when the widget is loaded\nthis.on('load', function(data){\n  console.log('loaded');\n});\n// This runs when the widget receives a transmission\nthis.on('transmission', function(data){\n  widget.find('#bigNumber').text(data.bigNumber);\n});"
          json:         '{\n  "bigNumber":500\n}'          

        dashku.createWidget attributes, (response) ->
          assert.equal response.status, 'failure'
          assert.equal response.reason, "dashboard with id Rubbish not found"
          done()

    describe "updateWidget()", ->

      it "should return the updated widget object", (done) ->
        data = name: "ZZZ dashboard"
        dashku.createDashboard data, (response) ->
          dashboardId = response.dashboard._id
          attributes = 
            dashboardId:  dashboardId
            name:         "My little widgie"
            html:         "<div id='bigNumber'></div>"
            css:          "#bigNumber {\n  padding: 10px;\n  margin-top: 50px;\n  font-size: 36pt;\n  font-weight: bold;\n}"
            script:       "// The widget's html as a jQuery object\nvar widget = this.widget;\n\n// This runs when the widget is loaded\nthis.on('load', function(data){\n  console.log('loaded');\n});\n// This runs when the widget receives a transmission\nthis.on('transmission', function(data){\n  widget.find('#bigNumber').text(data.bigNumber);\n});"
            json:         '{\n  "bigNumber":500\n}'          

          dashku.createWidget attributes, (response) ->

            widgetId = response.widget._id

            updatedAttributes = 
              _id:          widgetId
              dashboardId:  dashboardId
              name:         "King Widgie"

            dashku.updateWidget updatedAttributes, (response) ->
              assert response.status is 'success' 
              assert response.widget instanceof Object
              assert response.widget.name is "King Widgie"
              dashku.deleteDashboard dashboardId, (response) ->
                done()

      it "should throw an error if the response fails", (done) ->
        data = name: "ZZZ dashboard"
        dashku.createDashboard data, (response) ->
          dashboardId = response.dashboard._id
          attributes = 
            dashboardId:  dashboardId
            name:         "My little widgie"
            html:         "<div id='bigNumber'></div>"
            css:          "#bigNumber {\n  padding: 10px;\n  margin-top: 50px;\n  font-size: 36pt;\n  font-weight: bold;\n}"
            script:       "// The widget's html as a jQuery object\nvar widget = this.widget;\n\n// This runs when the widget is loaded\nthis.on('load', function(data){\n  console.log('loaded');\n});\n// This runs when the widget receives a transmission\nthis.on('transmission', function(data){\n  widget.find('#bigNumber').text(data.bigNumber);\n});"
            json:         '{\n  "bigNumber":500\n}'          

          dashku.createWidget attributes, (response) ->

            widgetId = response.widget._id

            updatedAttributes = 
              _id:          "WAA"
              dashboardId:  dashboardId
              name:         "King Widgie"

            dashku.updateWidget updatedAttributes, (response) ->
              assert response.status is 'failure'
              assert response.reason is "No widget found with id WAA"
              dashku.deleteDashboard dashboardId, (response) ->
                done()

    describe "deleteWidget()", ->
      
      it "should return the id of the deleted widget", (done) ->
        data = name: "ZZZ dashboard"
        dashku.createDashboard data, (response) ->
          dashboardId = response.dashboard._id
          attributes = 
            dashboardId:  dashboardId
            name:         "My little widgie"
            html:         "<div id='bigNumber'></div>"
            css:          "#bigNumber {\n  padding: 10px;\n  margin-top: 50px;\n  font-size: 36pt;\n  font-weight: bold;\n}"
            script:       "// The widget's html as a jQuery object\nvar widget = this.widget;\n\n// This runs when the widget is loaded\nthis.on('load', function(data){\n  console.log('loaded');\n});\n// This runs when the widget receives a transmission\nthis.on('transmission', function(data){\n  widget.find('#bigNumber').text(data.bigNumber);\n});"
            json:         '{\n  "bigNumber":500\n}'          

          dashku.createWidget attributes, (response) ->
            widgetId = response.widget._id
            dashku.deleteWidget dashboardId, widgetId, (response) ->
              assert.equal response.status, 'success' 
              assert.equal response.widgetId, widgetId
              dashku.deleteDashboard dashboardId, (response) ->
                done()

      it "should throw an error if the response fails", (done) ->
        data = name: "ZZZ dashboard"
        dashku.createDashboard data, (response) ->
          dashboardId = response.dashboard._id
          attributes = 
            dashboardId:  dashboardId
            name:         "My little widgie"
            html:         "<div id='bigNumber'></div>"
            css:          "#bigNumber {\n  padding: 10px;\n  margin-top: 50px;\n  font-size: 36pt;\n  font-weight: bold;\n}"
            script:       "// The widget's html as a jQuery object\nvar widget = this.widget;\n\n// This runs when the widget is loaded\nthis.on('load', function(data){\n  console.log('loaded');\n});\n// This runs when the widget receives a transmission\nthis.on('transmission', function(data){\n  widget.find('#bigNumber').text(data.bigNumber);\n});"
            json:         '{\n  "bigNumber":500\n}'          

          dashku.createWidget attributes, (response) ->
            widgetId = response.widget._id
            dashku.deleteWidget "Waa", widgetId, (response) ->
              assert.equal response.status, 'failure'
              assert.equal response.reason, 'No dashboard found with id Waa'
              dashku.deleteDashboard dashboardId, (response) ->
                done()

    describe "getWidgets()", ->

      it "should return an array of widget objects for a given dashboard" 

      it "should throw an error if the response fails"

    describe "getWidget()", ->

      it "should return a widget object, given a widget id"

      it "should throw an error if the response fails"

  describe 'transmission', ->

    it "should return a success status", (done) ->
      dashku.getDashboards (response) ->
        dash = dashboard for dashboard in response.dashboards when dashboard.widgets.length > 0
        widget = dash.widgets[0]
        data = widget.json
        dashku.transmission data, (response) ->
          assert.equal response.status, 'success'
          done()

    it "should throw an error if the response fails", (done) ->
      dashku.setApiKey 'waa', ->
        dashku.transmission {}, (response) ->
          assert.equal response.status, 'failure'
          assert.equal response.reason, "Couldn't find a user with that API key"          
          done()