'use strict';

Titles.module('Models', function(Models, app, backbone, Marionette, $, _){

	app.FormerTitle = backbone.Model.extend({});

	app.FormerTitlesList = backbone.Collection.extend({
		model: app.FormerTitle,

		initialize: function(){
			this.listenTo(this, 'add', function(newTitle){
				app.vent.trigger('titles:updated', newTitle);
			});
		}
	});

});