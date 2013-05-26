'use strict';

Titles.module('Views', function(Views, app, backbone, marionette, $, _){

	app.CurrentTitleView = backbone.Marionette.ItemView.extend({
		template: '#currentTitleTemplate',
		tagName: 'h1',

		initialize: function(){

			this.listenTo(app.vent, 'titles:updated', this.setCurrentTitle);

			this.listenTo(this.model, 'change', this.render);
		},

		setCurrentTitle: function(newTitle){
			this.model.set('title', newTitle.get('title'));
		}
	});


	app.FormerTitleView = backbone.Marionette.ItemView.extend({
		template: "#formerTitlesTemplate",
		tagName: 'li'
	});

	app.FormerTitleComposite = backbone.Marionette.CompositeView.extend({
		template: '#titlesCompositeTemplate',
		itemView: app.FormerTitleView,
		itemViewContainer: 'ul',

		initialize: function(){
			this.listenTo(app.vent, 'titles:updated', this.addTitleToCollection);
		}, 

		elPreviousTitle: null,  // ugh-lee, but it works

		addTitleToCollection: function(newTitle){
			this.collection.add(newTitle);
		},

		appendHtml: function(collectionView, itemView){
			// prepend everything in the collection apart from the latest title
			//if (this.collection.indexOf(itemView.model) != this.collection.length){
			if (this.previousTitle !== null) {
				collectionView.$el.prepend(this.previousTitle);	
			}
			this.previousTitle = itemView.el;
		}
	});

});
