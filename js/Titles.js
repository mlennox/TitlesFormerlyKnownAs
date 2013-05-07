'use strict';

// the collection will hold all the previous titles
// the most recent addition is the current title and as such won't be shown in the list
// the most recent title will be shown as the title of the page
// we'll be using Backbone model, inside a Marionette collection
// the displayed list will use a Marionette ItemView
// and the title will be updated through the use of a Marionette CompositeView

var Titles = window.Titles || {};

Titles.App = new Backbone.Marionette.Application();

Titles.App.addRegions({
	mainRegion: "#titleRegion"
});

Titles.FormerTitle = Backbone.Model.extend({});

Titles.FormerTitlesList = Backbone.Collection.extend({
	model: Titles.FormerTitle,
	initialize: function(){
		this.on
	}
});

// views -------------------------------------

Titles.CurrentTitleView = Backbone.Marionette.ItemView.extend({
	template: '#currentTitleTemplate',
	tagName: 'h1',

	initialize: function(){
		

		var self = this;
		Titles.App.vent.on('titles:updated', function(newTitle){
			self.model.set('title', newTitle.get('title'));
		});

		this.listenTo(this.model, 'change', function(){
			self.render()
		});
	}
});


Titles.FormerTitleView = Backbone.Marionette.ItemView.extend({
	template: "#formerTitlesTemplate",
	tagName: 'li'
});

Titles.FormerTitleComposite = Backbone.Marionette.CompositeView.extend({
	template: '#titlesCompositeTemplate',
	itemView: Titles.FormerTitleView,
	itemViewContainer: 'ul',

	initialize: function(){
		var self = this;
		this.listenTo(this.collection, "add", function(updatedTitle){
			Titles.App.vent.trigger('titles:updated', updatedTitle);
		});
	}
});

Titles.TitlesLayout = Backbone.Marionette.Layout.extend({
	template: '#titlesLayout',
	regions: {
		header: '#currentTitle', // can I just use a selector?
		formerTitles: '#formerTitles'
	}
});


// app -------------------------------------

Titles.App.addInitializer(function(options){
	var titlesLayout = new Titles.TitlesLayout();
	titlesLayout.render();
	Titles.App.mainRegion.show(titlesLayout);

	var formerTitleCompositeView = new Titles.FormerTitleComposite({
		collection: options.formerTitles
	});
	var currentTitle = new Titles.FormerTitle({ 
		title: Titles.FindCurrentTitle(options.formerTitles)
	});
	var currentTitleView = new Titles.CurrentTitleView({model: currentTitle});

	titlesLayout.header.show(currentTitleView);
	titlesLayout.formerTitles.show(formerTitleCompositeView);
});

Titles.FindCurrentTitle = function(titles){
	return titles.at(titles.length-1).get('title')
};

// let's start it!

$(document).ready(function(){
	// we should load from local storage when we get round to it...
	var formerTitles = new Titles.FormerTitlesList([
		new Titles.FormerTitle({title: 'something'})
	]);
	Titles.App.start({formerTitles: formerTitles});

	formerTitles.add(new Titles.FormerTitle({title: 'another title'}));
	formerTitles.add(new Titles.FormerTitle({title: 'a final title'}));
});