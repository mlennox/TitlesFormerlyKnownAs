'use strict';

Titles.module('Layout', function(Layout,app, backbone, Marionette, $, _){
    app.TitlesLayout = backbone.Marionette.Layout.extend({
        template: '#titlesLayout',
        regions: {
            // need to investigate if these selectors are scoped to the template...
            header: 'header',
            formerTitles: 'section'
        },

        events: {
            'submit form': 'updateTitle'
        },

        updateTitle: function(ev){
            var elInput = $('input', ev.currentTarget);

            if (elInput.val() === '') {
                return;
            }

            var newTitle = new app.FormerTitle({title: elInput.val()});
            elInput.val('');

            app.vent.trigger('titles:updated', newTitle);

            ev.preventDefault();
        }
    });
});

