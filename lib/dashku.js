'use strict';



// Dependencies
//
var request         = require('request');






module.exports = {

	apiUrl: 'https://dashku.com',
	apiKey: 'null',



	// Sets the api key used by the client
	setApiKey: function (value, cb) {
		this.apiKey = value;
		if (typeof cb === 'function') { cb(); }
	},



	// Sets the api url used by the client
	setApiUrl: function (value, cb) {
		this.apiUrl = value;
		if (typeof cb === 'function') { cb(); }
	},



	// returns all of the user's dashboards
	getDashboards: function (cb) {

		var url     = this.apiUrl + '/api/dashboards?apiKey=' + this.apiKey;
		var headers = {accept: 'application/json'};
		request.get({url:url,headers:headers}, function (err,res,body) {

			var b = JSON.parse(body);
			if (res.statusCode === 200) {
				cb({status: 'success', dashboards: b});
			} else {
				cb(b);
			}

		});

	},



	// returns a dashboard
	getDashboard: function (id, cb) {

		var url     = this.apiUrl + '/api/dashboards/' + id + '?apiKey=' + this.apiKey;
		var headers = {accept: 'application/json'};
		request.get({url:url,headers:headers}, function (err,res,body) {

			var b = JSON.parse(body);
			if (res.statusCode === 200) {
				cb({status: 'success', dashboard: b});
			} else {
				cb(b);
			}

		});

	},



	// creates a dashboard
	createDashboard: function (body, cb) {

		var url     = this.apiUrl + '/api/dashboards?apiKey=' + this.apiKey;
		var json    = true;
		request.post({url:url, body:body, json:json}, function (err,res,body) {

			if (res.statusCode === 202) {
				cb({status: 'success', dashboard: body});
			} else {
				cb(body);
			}

		});

	},



	// updates a dashboard
	updateDashboard: function (body, cb) {

		var url     = this.apiUrl + '/api/dashboards/' + body._id + '?apiKey=' + this.apiKey;
		var json    = true;
		request.put({url:url, body:body, json:json}, function (err,res,body) {

			if (res.statusCode === 201) {
				cb({status: 'success', dashboard: body});
			} else {
				cb(body);
			}

		});

	},



	// deletes a dashboard
	deleteDashboard: function (dashboardId, cb) {

		var url     = this.apiUrl + '/api/dashboards/' + dashboardId + '?apiKey=' + this.apiKey;
		var headers = {accept: 'application/json'};
		var method  = 'DELETE';
		request.del({method:method, url:url, headers:headers}, function (err,res,body) {
			if (res.statusCode === 201) {
				cb(JSON.parse(body));
			} else {
				cb(JSON.parse(body));
			}
		});

	},



	// creates a widget
	createWidget: function (body, cb) {

		var url     = this.apiUrl + '/api/dashboards/' + body.dashboardId + '/widgets?apiKey=' + this.apiKey;
		var json    = true;
		request.post({url:url, body:body, json:json}, function (err,res,body) {

			if (res.statusCode === 202) {
				cb({status: 'success', widget: body});
			} else {
				cb(body);
			}

		});

	},



	// updates a widget
	updateWidget: function (body, cb) {

		var url     = this.apiUrl + '/api/dashboards/' + body.dashboardId + '/widgets/' + body._id + '?apiKey=' + this.apiKey;
		var json    = true;
		request.put({url:url, body:body, json:json}, function (err,res,body) {
			if (res.statusCode === 201) {
				cb({status: 'success', widget: body});
			} else {
				cb(body);
			}
		});

	},



	// deletes a widget
	deleteWidget: function (dashboardId, widgetId, cb) {

		var url     = this.apiUrl + '/api/dashboards/' + dashboardId + '/widgets/' + widgetId + '?apiKey=' + this.apiKey;
		var headers = {accept: 'application/json'};
		var method  = 'DELETE';
		request({method:method, url:url, headers:headers}, function (err,res,body) {

			if (res.statusCode === 201) {
				cb(JSON.parse(body));
			} else {
				cb(JSON.parse(body));
			}

		});

	},



	transmission: function (body, cb) {

		var url     = this.apiUrl + '/api/transmission?apiKey=' + this.apiKey;
		var json    = true;
		request.post({url:url, body:body, json:json}, function (err,res,body) {

			if (res.statusCode === 200) {
				cb({status: 'success'});
			} else {
				cb(body);
			}

		});

	}

};