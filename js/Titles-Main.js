$(document).ready(function(){
    // we should load from local storage when we get round to it...
    var formerTitles = new Titles.FormerTitlesList([
        new Titles.FormerTitle({title: 'something'})
    ]);
    Titles.start({formerTitles: formerTitles});

    formerTitles.add(new Titles.FormerTitle({title: 'another title'}));
    formerTitles.add(new Titles.FormerTitle({title: 'a final title'}));
});