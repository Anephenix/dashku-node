[![build status](https://secure.travis-ci.org/paulbjensen/dashku-node.png)](http://travis-ci.org/paulbjensen/dashku-node)
Dashku npm
===========

A wrapper to the [dashku.com](http://dashku.com) API. Now made to work with Dashku open source edition.

Install
---

    npm install dashku

Example Usage
---

Require the library and set your api key.

```javascript

    var dashku = require('dashku');
    dashku.setApiKey('YOUR_API_KEY', function(){
      
      // Fetches your dashboards
      dashku.getDashboards(function(response){
        if (response.status == "success") {
          console.log(response.dashboards);
        }
      });
      
    });

```

NOTE: If you're using Dashku open source edition, make sure to call setApiUrl in order to point the API wrapper to your hosted version of Dashku. 

Available Commands
---

* setApiKey
* setApiUrl
* getDashboards
* getDashboard
* createDashboard
* updateDashboard
* deleteDashboard
* createWidget
* updateWidget
* deleteWidget
* transmission


setApiKey
--

Allows you to provide your api key to the library. This needs to be called before any API request can be made. To get your API key, checkout the API docs in Dashku.

The callback function is optional.

```javascript

    // set the api key, then run your code
    dashku.setApiKey('YOUR_API_KEY', function(){
      // run your code here      
    });
    
    // or alternatively, you can call the command like this:
    dashku.setApiKey('YOUR_API_KEY');

```

setApiUrl
--

Allows you to define the api url to the library. This may come is useful if the API url changes, as it is currently pointing to Dashku.com's ip address.

The callback function is optional.

```javascript

    // set the api url, then run your code
    dashku.setApiUrl('API_URL', function(){
      // run your code here      
    });
    
    // or alternatively, you can call the command like this:
    dashku.setApiUrl('API_URL');

```
    
getDashboards
--

Retrieve all of your dashboards.

```javascript

    dashku.getDashboards(function(response){
    
      // the response object will either be:
      //   {
      //      status: 		'success',
      //      dashboards: 	[…] // an array of dashboard objects
      //   }
      // 
      //   or
      //
      //   {
      //      status: 		'failure',
      //      reason: 		'REASON MESSAGE' // a message explaining what went wrong
      //   }
    
    });

```

getDashboard
--

Retrieves a dashboard, given the id of the dashboard.

```javascript

    dashku.getDashboard('DASHBOARD_ID', function(response){
    
      // the response object will either be:
      //   {
      //      status: 		'success',
      //      dashboard: 	{…} // the dashboard object
      //   }
      // 
      //   or
      //
      //   {
      //      status: 		'failure',
      //      reason: 		'REASON MESSAGE' // a message explaining what went wrong
      //   }
      
    
    });

```

createDashboard
--

Creates a dashboard, given some attributes.

```javascript

    var attributes = {
      name: "Sales dashboard"
    }

    dashku.createDashboard(attributes, function(response){

      // the response object will either be:
      //   {
      //      status: 		'success',
      //      dashboard: 	{…} // the newly-created dashboard object
      //   }
      // 
      //   or
      //
      //   {
      //      status: 		'failure',
      //      reason: 		'REASON MESSAGE' // a message explaining what went wrong
      //   }

    });

```

updateDashboard
--

Updates a dashboard, given some attributes.

```javascript

    var attributes = {
      _id: 'DASHBOARD_ID',
      name: "Account Management"
    }
    
    dashku.updateDashboard(attributes, function(response){
    
      // the response object will either be:
      //   {
      //      status: 		'success',
      //      dashboard: 	{…} // the updated dashboard object
      //   }
      // 
      //   or
      //
      //   {
      //      status: 		'failure',
      //      reason: 		'REASON MESSAGE' // a message explaining what went wrong
      //   }
    
    })

```
    
deleteDashboard
--

Deletes a dashboard, given the id of the dashboard.

```javascript

    dashku.deleteDashboard('DASHBOARD_ID', function(response){

      // the response object will either be:
      //   {
      //      status: 		'success',
      //      dashboardId: 	'…' // the id of the deleted dashboard 
      //   }
      // 
      //   or
      //
      //   {
      //      status: 		'failure',
      //      reason: 		'REASON MESSAGE' // a message explaining what went wrong
      //   }      

    });

```
    
createWidget
--

Creates a widget, given some attributes.

```javascript

	var attributes = {
		dashboardId:  'DASHBOARD_ID',
		name:         "My little widget",
		html:         "<div id='bigNumber'></div>",
		css:          "#bigNumber {\n  padding: 10px;\n  margin-top: 50px;\n  font-size: 36pt;\n  font-weight: bold;\n}",
	    script:       "// The widget's html as a jQuery object\nvar widget = this.widget;\n\n// This runs when the widget is loaded\nthis.on('load', function(data){\n  console.log('loaded');\n});\n// This runs when the widget receives a transmission\nthis.on('transmission', function(data){\n  widget.find('#bigNumber').text(data.bigNumber);\n});",
	    json:         '{\n  "bigNumber":500\n}'
	}
    
    dashku.createWidget(attributes,function(response){
    
      // the response object will either be:
      //   {
      //      status: 	'success',
      //      widget: 	{…} // the newly-created widget 
      //   }
      // 
      //   or
      //
      //   {
      //      status: 		'failure',
      //      reason: 		'REASON MESSAGE' // a message explaining what went wrong
      //   }      
    
    });

```
    
updateWidget
--

Updates an existing widget, given some attributes.


```javascript

	var attributes = {
		dashboardId:  'DASHBOARD_ID',
		_id:		  'WIDGET_ID',	
		name:         "King widget"
	}
    
    dashku.updateWidget(attributes,function(response){
    
      // the response object will either be:
      //   {
      //      status: 	'success',
      //      widget: 	{…} // the updated widget 
      //   }
      // 
      //   or
      //
      //   {
      //      status: 		'failure',
      //      reason: 		'REASON MESSAGE' // a message explaining what went wrong
      //   }      
    
    });

```

deleteWidget
--

Deletes an existing widget, given a dashboard id and widget id

```javascript

    dashku.deleteWidget('DASHBOARD_ID','WIDGET_ID',function(response){
      
      // the response object will either be:
      //   {
      //      status: 		'success',
      //      widgetId: 	'…' // the id of the deleted widget 
      //   }
      // 
      //   or
      //
      //   {
      //      status: 		'failure',
      //      reason: 		'REASON MESSAGE' // a message explaining what went wrong
      //   }
    
    });

```
    
transmission
--

Transmits data to an existing widget, given an object that can be converted to JSON

```javascript

    var data = {
      _id: "WIDGET_ID",
      bigNumber: 500
    }

    dashku.transmission(data, function(response){
    
      // the response object will either be:
      //   {
      //      status: 		'success'
      //   }
      // 
      //   or
      //
      //   {
      //      status: 		'failure',
      //      reason: 		'REASON MESSAGE' // a message explaining what went wrong
      //   }
    
    });

```
   
Copyright
---

&copy; 2012 Anephenix Ltd. Dashku-node is licensed under the MIT License.
