'use strict';

var Titles = window.Titles || {};

Titles.App = new Backbone.Marionette.Application();

Titles.App.addRegions({
	mainRegion: "#titleRegion"
});

Titles.FormerTitle = Backbone.Model.extend({});

Titles.FormerTitlesList = Backbone.Collection.extend({
	model: Titles.FormerTitle,

	initialize: function(){
		this.listenTo(this, 'add', function(newTitle){
			Titles.App.vent.trigger('titles:updated', newTitle);
		});
	}
});

// views -------------------------------------

Titles.CurrentTitleView = Backbone.Marionette.ItemView.extend({
	template: '#currentTitleTemplate',
	tagName: 'h1',

	initialize: function(){
		var self = this;

		this.listenTo(Titles.App.vent, 'titles:updated', function(newTitle){
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

		this.listenTo(Titles.App.vent, 'titles:updated', function(newTitle){
			self.collection.add(newTitle);
		});
	}, 
	elPreviousTitle: null,  // ugh-lee, but it works
	appendHtml: function(collectionView, itemView){
		// prepend everything in the collection apart from the latest title
		//if (this.collection.indexOf(itemView.model) != this.collection.length){
		if (this.previousTitle !== null) {
			collectionView.$el.prepend(this.previousTitle);	
		}
		this.previousTitle = itemView.el;
	}
});

Titles.TitlesLayout = Backbone.Marionette.Layout.extend({
	template: '#titlesLayout',
	regions: {
		// need to investigate if these selectors are scoped to the template...
		header: 'header',
		formerTitles: 'section'
	},

	events: {
		'blur #newTitle': 'updateTitle'
	},

	updateTitle: function(ev){
		Titles.App.vent.trigger('titles:updated', 
			new Titles.FormerTitle({title: ev.currentTarget.value}));
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