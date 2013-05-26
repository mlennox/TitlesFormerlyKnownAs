'use strict';

var Titles = window.Titles || {};

Titles = new Backbone.Marionette.Application();

Titles.addRegions({
    mainRegion: "#titleRegion"
});

Titles.addInitializer(function(options){

	var titlesLayout = new Titles.TitlesLayout();
	titlesLayout.render();
	Titles.mainRegion.show(titlesLayout);

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
	return titles.at(titles.length-1).get('title');
};