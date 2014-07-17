'use strict';



// Dependencies
//
var assert    = require('assert'),
		dashku    = require('../lib/dashku'),
		fs				= require('fs');



// These are the variables we use to interact with the
// user and the API - TODO - get these programmatically.
//
var apiKey, apiUrl;



describe('Dashku', function () {


	before(function (done) {

		apiUrl = 'http://localhost:3000';

		var filePath = '/tmp/testUser.json';
		fs.exists(filePath, function (exists) {

			if (!exists) {

				done(new Error('please run the generateTestUser script with TEST_USER_PATH=/tmp as an environment variable'));

			} else {

				fs.readFile(filePath, function (err, data) {

					if (err) { return done(err); }

					apiKey = JSON.parse(data).apiKey;

					done(err);

				});

			}

		});

	});



	describe('setApiKey', function () {

		it('should set the api key for the library', function (done) {

			var key = 'a-random-key';
			dashku.setApiKey(key, function () {
				assert.equal(dashku.apiKey, key);
				done();
			});

		});


	});


	describe('setApiUrl', function () {

		it('should set the api url for the library', function (done) {

			var url = 'https://localhost';
			dashku.setApiUrl(url, function () {
				assert.equal(dashku.apiUrl, url);
				dashku.setApiUrl(apiUrl, done);
			});

		});

	});

	describe('Dashboards', function () {

		describe('createDashboard()', function () {

			it('should return a dashboard object, given attributes', function (done) {
				dashku.setApiKey(apiKey, function () {

					var attributes = {
						name: 'My new dashboard'
					};
					dashku.createDashboard(attributes, function (response) {
						assert.equal(response.status, 'success');
						assert(response.dashboard instanceof Object);
						assert.equal(response.dashboard.name, attributes.name);
						done();
					});

				});

			});

			it('should throw an error if the response fails', function (done) {
				dashku.setApiKey('waa', function () {

					var attributes = {
						name: 'My new dashboard'
					};
					dashku.createDashboard(attributes, function (response) {

						assert.equal(response.status, 'failure');
						assert.equal(response.reason, 'Couldn\'t find a user with that API key');
						done();

					});

				});

			});

		});


		describe('getDashboards()', function () {

			it('should return an array of dashboard objects', function (done) {

				dashku.setApiKey(apiKey, function () {
					dashku.getDashboards(function (response) {
						assert.equal(response.status, 'success');
						assert(response.dashboards instanceof Array);
						done();
					});
				});

			});

			it('should throw an error if the response fails', function (done) {

				dashku.setApiKey('waa', function () {
					dashku.getDashboards(function (response) {
						assert.equal(response.status, 'failure');
						assert.equal(response.reason, 'Couldn\'t find a user with that API key');
						done();
					});
				});

			});

		});

		describe('getDashboard()', function () {

			it('should return a dashboard object, given an id', function (done) {
				dashku.setApiKey(apiKey, function () {
					dashku.getDashboards(function (response) {
						var dashboardId = response.dashboards[0]._id;
						dashku.getDashboard(dashboardId, function (response) {
							assert.equal(response.status, 'success');
							assert(response.dashboard instanceof Object);
							done();
						});
					});
				});
			});

			it('should throw an error if the response fails', function (done) {
				dashku.setApiKey(apiKey, function () {
					var dashboardId = 'rubbish';
					dashku.getDashboard(dashboardId, function (response) {
						assert.equal(response.status, 'failure');
						assert.equal(response.reason, 'Dashboard not found');
						done();
					});
				});
			});

		});

		describe('updateDashboard()', function () {

			it('should return a dashboard object, given attributes', function (done) {

				dashku.setApiKey(apiKey, function () {

					dashku.getDashboards(function (response) {

						var dashboardId;

						response.dashboards.forEach(function (dashboard) { if (dashboard.name === 'My new dashboard') { dashboardId = dashboard._id;}  });

						var attributes = {
							_id: dashboardId,
							name: 'ZZZ dashboard'
						};

						dashku.updateDashboard(attributes, function (response) {

							assert.equal(response.status, 'success');
							assert(response.dashboard instanceof Object);
							assert.equal(response.dashboard.name, attributes.name);
							done();

						});

					});


				});

			});

			it('should throw an error if the response fails', function (done) {

				var attributes = {
					_id: 'Rubbish',
					name: 'ZZZ dashboard'
				};

				dashku.updateDashboard(attributes, function (response) {

					assert.equal(response.status, 'failure');
					assert.equal(response.reason, 'Dashboard not found');
					done();

				});

			});

		});


		describe('deleteDashboard()', function () {



			before(function (done) {

				var attributes = {
					name: 'My new dashboard'
				};
				dashku.createDashboard(attributes, function (response) {
					assert.equal(response.status, 'success');
					dashku.createDashboard({name: 'bob'}, function (response) {
						assert.equal(response.status, 'success');
						done();
					});
				});

			});



			it('should return the id of the deleted dashboard', function (done) {

				dashku.getDashboards(function (response) {

					var dashboardId;

					response.dashboards.forEach(function (dashboard) { if (dashboard.name === 'ZZZ dashboard') {dashboardId = dashboard._id;} });

					dashku.deleteDashboard(dashboardId, function (response) {
						assert.equal(response.status, 'success');
						assert.equal(response.dashboardId, dashboardId);
						done();
					});

				});

			});

			it('should throw an error if the response fails', function (done) {

				dashku.deleteDashboard('Rubbish', function (response) {

					assert.equal(response.status, 'failure');
					assert.equal(response.reason, 'Dashboard not found');
					done();

				});

			});

		});

	});



	describe('Widgets', function () {


		describe('createWidget()', function () {


			it('should return the widget object', function (done) {

				var data = {name: 'ZZZ dashboard'};
				dashku.createDashboard(data, function (response) {

					var dashboardId = response.dashboard._id;
					var attributes = {
						dashboardId:  dashboardId,
						name:         'My little widgie',
						html:         '<div id=\'bigNumber\'></div>',
						css:          '#bigNumber {\n  padding: 10px;\n  margin-top: 50px;\n  font-size: 36pt;\n  font-weight: bold;\n}',
						script:       '// The widget\'s html as a jQuery object\nvar widget = this.widget;\n\n// This runs when the widget is loaded\nthis.on(\'load\', function(data){\n  console.log(\'loaded\');\n});\n// This runs when the widget receives a transmission\nthis.on(\'transmission\', function(data){\n  widget.find(\'#bigNumber\').text(data.bigNumber);\n});',
						json:         '{\n  "bigNumber":500\n}'
					};

					dashku.createWidget(attributes, function (response) {

						assert.equal(response.status, 'success');
						assert(response.widget instanceof Object);
						dashku.deleteDashboard(dashboardId, function () {
							done();
						});

					});

				});

			});

			it('should throw an error if the response fails', function (done) {

				var attributes = {

					dashboardId:  'Rubbish',
					name:         'My little widgie',
					html:         '<div id=\'bigNumber\'></div>',
					css:          '#bigNumber {\n  padding: 10px;\n  margin-top: 50px;\n  font-size: 36pt;\n  font-weight: bold;\n}',
					script:       '// The widget\'s html as a jQuery object\nvar widget = this.widget;\n\n// This runs when the widget is loaded\nthis.on(\'load\', function(data){\n  console.log(\'loaded\');\n});\n// This runs when the widget receives a transmission\nthis.on(\'transmission\', function(data){\n  widget.find(\'#bigNumber\').text(data.bigNumber);\n});',
					json:         '{\n  "bigNumber":500\n}'

				};

				dashku.createWidget(attributes, function (response) {

					assert.equal(response.status, 'failure');
					assert.equal(response.reason, 'dashboard with id Rubbish not found');
					done();

				});

			});

		});


		describe('updateWidget()', function () {

			it('should return the updated widget object', function (done) {

				var data = { name: 'ZZZ dashboard'};
				dashku.createDashboard(data, function (response) {

					var dashboardId = response.dashboard._id;

					var attributes = {
						dashboardId:  dashboardId,
						name:         'My little widgie',
						html:         '<div id=\'bigNumber\'></div>',
						css:          '#bigNumber {\n  padding: 10px;\n  margin-top: 50px;\n  font-size: 36pt;\n  font-weight: bold;\n}',
						script:       '// The widget\'s html as a jQuery object\nvar widget = this.widget;\n\n// This runs when the widget is loaded\nthis.on(\'load\', function(data){\n  console.log(\'loaded\');\n});\n// This runs when the widget receives a transmission\nthis.on(\'transmission\', function(data){\n  widget.find(\'#bigNumber\').text(data.bigNumber);\n});',
						json:         '{\n  "bigNumber":500\n}'
					};

					dashku.createWidget(attributes, function (response) {

						var widgetId = response.widget._id;

						var updatedAttributes = {
							_id:          widgetId,
							dashboardId:  dashboardId,
							name:         'King Widgie'
						};

						dashku.updateWidget(updatedAttributes, function (response) {

							assert(response.status === 'success');
							assert(response.widget instanceof Object);
							assert(response.widget.name === 'King Widgie');
							dashku.deleteDashboard(dashboardId, function () {
								done();
							});

						});

					});

				});

			});


			it('should throw an error if the response fails', function (done) {

				var data = {name: 'ZZZ dashboard'};
				dashku.createDashboard(data, function (response) {

					var dashboardId = response.dashboard._id;
					var attributes = {
						dashboardId:  dashboardId,
						name:         'My little widgie',
						html:         '<div id=\'bigNumber\'></div>',
						css:          '#bigNumber {\n  padding: 10px;\n  margin-top: 50px;\n  font-size: 36pt;\n  font-weight: bold;\n}',
						script:       '// The widget\'s html as a jQuery object\nvar widget = this.widget;\n\n// This runs when the widget is loaded\nthis.on(\'load\', function(data){\n  console.log(\'loaded\');\n});\n// This runs when the widget receives a transmission\nthis.on(\'transmission\', function(data){\n  widget.find(\'#bigNumber\').text(data.bigNumber);\n});',
						json:         '{\n  "bigNumber":500\n}'
					};

					dashku.createWidget(attributes, function () {

						var updatedAttributes = {
							_id:          'WAA',
							dashboardId:  dashboardId,
							name:         'King Widgie'
						};

						dashku.updateWidget(updatedAttributes, function (response) {
							assert(response.status === 'failure');
							assert(response.reason === 'No widget found with id WAA');
							dashku.deleteDashboard(dashboardId, function () {
								done();
							});
						});

					});

				});

			});

		});

		describe('deleteWidget()', function () {


			it('should return the id of the deleted widget', function (done) {

				var data = {name: 'ZZZ dashboard'};
				dashku.createDashboard(data, function (response) {

					var dashboardId = response.dashboard._id;
					var attributes = {
						dashboardId:  dashboardId,
						name:         'My little widgie',
						html:         '<div id=\'bigNumber\'></div>',
						css:          '#bigNumber {\n  padding: 10px;\n  margin-top: 50px;\n  font-size: 36pt;\n  font-weight: bold;\n}',
						script:       '// The widget\'s html as a jQuery object\nvar widget = this.widget;\n\n// This runs when the widget is loaded\nthis.on(\'load\', function(data){\n  console.log(\'loaded\');\n});\n// This runs when the widget receives a transmission\nthis.on(\'transmission\', function(data){\n  widget.find(\'#bigNumber\').text(data.bigNumber);\n});',
						json:         '{\n  "bigNumber":500\n}'
					};

					dashku.createWidget(attributes, function (response) {
						var widgetId = response.widget._id;
						dashku.deleteWidget(dashboardId, widgetId, function (response) {
							assert.equal(response.status, 'success');
							assert.equal(response.widgetId, widgetId);
							dashku.deleteDashboard(dashboardId, function () {
								done();
							});
						});
					});

				});

			});


			it('should throw an error if the response fails', function (done) {

				var data = {name: 'ZZZ dashboard'};
				dashku.createDashboard(data, function (response) {

					var dashboardId = response.dashboard._id;
					var attributes = {
						dashboardId:  dashboardId,
						name:         'My little widgie',
						html:         '<div id=\'bigNumber\'></div>',
						css:          '#bigNumber {\n  padding: 10px;\n  margin-top: 50px;\n  font-size: 36pt;\n  font-weight: bold;\n}',
						script:       '// The widget\'s html as a jQuery object\nvar widget = this.widget;\n\n// This runs when the widget is loaded\nthis.on(\'load\', function(data){\n  console.log(\'loaded\');\n});\n// This runs when the widget receives a transmission\nthis.on(\'transmission\', function(data){\n  widget.find(\'#bigNumber\').text(data.bigNumber);\n});',
						json:         '{\n  "bigNumber":500\n}'
					};

					dashku.createWidget(attributes, function (response) {

						var widgetId = response.widget._id;
						dashku.deleteWidget('Waa', widgetId, function (response) {

							assert.equal(response.status, 'failure');
							assert.equal(response.reason, 'No dashboard found with id Waa');
							dashku.deleteDashboard(dashboardId, function () {
								done();
							});

						});

					});


				});


			});

		});


		describe('getWidgets()', function () {

			it('should return an array of widget objects for a given dashboard');

			it('should throw an error if the response fails');

		});

		describe('getWidget()', function () {

			it('should return a widget object, given a widget id');

			it('should throw an error if the response fails');

		});

	});

	describe('transmission', function () {

		before(function (done) {

			dashku.getDashboards(function (response) {

				var dash = response.dashboards[response.dashboards.length-1];

				var dashboardId = dash._id;
				
				var attributes = {
					dashboardId:  dashboardId,
					name:         'My little widgie',
					html:         '<div id=\'bigNumber\'></div>',
					css:          '#bigNumber {\n  padding: 10px;\n  margin-top: 50px;\n  font-size: 36pt;\n  font-weight: bold;\n}',
					script:       '// The widget\'s html as a jQuery object\nvar widget = this.widget;\n\n// This runs when the widget is loaded\nthis.on(\'load\', function(data){\n  console.log(\'loaded\');\n});\n// This runs when the widget receives a transmission\nthis.on(\'transmission\', function(data){\n  widget.find(\'#bigNumber\').text(data.bigNumber);\n});',
					json:         '{\n  "bigNumber":500\n}'
				};

				dashku.createWidget(attributes, function (response) {

					assert.equal(response.status, 'success');
					assert(response.widget instanceof Object);
					done();

				});

			});

		});


		it('should return a success status', function (done) {

			dashku.getDashboards(function (response) {

				var dash;

				response.dashboards.forEach(function (dashboard) { if (dashboard.widgets.length > 0) { dash = dashboard; } });

				var widget = dash.widgets[0];

				var data = widget.json;

				dashku.transmission(data, function (response) {
					assert.equal(response.status, 'success');
					done();
				});

			});

		});

		it('should throw an error if the response fails', function (done) {
			dashku.setApiKey('waa', function () {
				dashku.transmission({}, function (response) {

					assert.equal(response.status, 'failure');
					assert.equal(response.reason, 'Couldn\'t find a user with that API key');
					done();

				});

			});

		});

	});

});