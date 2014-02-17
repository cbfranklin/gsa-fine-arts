var apiRoot = //'http://159.142.125.32:8080/emuseum/api/',
'http://hvemuseum2.gallerysystems.com/emuseum/api/';

//MOVED ALPHAORDER AND ARTIST CACHE TO ASSETS.JS

$(function() {
    $('#load').show();
    clicks();
    routes();
    $(window).hashchange(function() {
        loading();
        routes();
    });
});

//ROUTING
function routes() {
    //HOME PAGE
    if (window.location.hash === '' ||
        window.location.hash === '#' ||
        window.location.hash === '#/') {
        loadHomePage();
    }
    //INDEXES
    else if (window.location.hash.indexOf('#/collections') !== -1) {
        loadCollectionsIndex();
    } else if (window.location.hash.indexOf('#/artists') !== -1) {
        loadArtists();
    }
    //OVERVIEWS
    else if (window.location.hash.indexOf('#/artwork/') !== -1) {
        loadArtwork();
    } else if (window.location.hash.indexOf('#/artist/') !== -1) {
        loadArtist();
    } else if (window.location.hash.indexOf('#/building/') !== -1) {
        loadBuilding();
    } else if (window.location.hash.indexOf('#/collection/') !== -1) {
        loadCollection();
    }
    //SEARCH
    else if (window.location.hash.indexOf('#/search') !== -1) {
        loadSearch();
    }
    //SEARCH RESULTS
    else if (window.location.hash.indexOf('#/results/artwork') !== -1) {
        var type = 'objects';
        loadResults(type);
    } else if (window.location.hash.indexOf('#/results/artists') !== -1) {
        var type = 'people';
        loadResults(type);
    } else if (window.location.hash.indexOf('#/results/buildings') !== -1) {
        var type = 'buildings';
        loadResults(type);
    } else {
        fail('404', 'Bad Route')
    }

}

//CLICKS
function clicks() {
    //IM NOT SURE THAT ANY OF THESE DO ANYTHING ANYMORE. SHOULD TRANSFER CLICK BINDINGS FROM OTHER FUNCTIONS HERE.
    $('#results').on('click', '.cell img', function() {
        var objID = $(event.srcElement).parent().attr('id');
        window.location.hash = '#/item/' + objID;
    });
    $('#item').on('click', function() {
        $('#item').hide().html('');
        $('#results').fadeIn();
        window.location.hash = '#/results'
    });
}

//ROUTES

//HOME PAGE
function loadHomePage() {
    fail('Home Page', 'No handler function yet.<br><br><img style="width:100%;height:auto;" src="http://i1135.photobucket.com/albums/m628/tonista3/bob-ross.gif">');
}

//SEARCH RESULTS
function loadResults(type) {

    $('#results').html('');

    var hash = window.location.hash.split('?');

    var searchParams = hash[1];

    fetchAllResults(type, searchParams, appendResults);
};

//ARTIST INDEX
function loadArtists() {

    if (artistCache.status === 1) {
        if ($('#artists div').length === 26) {
            $('#load').hide();
            $('#artists').show();
        } else {
            artistsAppend(artistCache);
            $('#load').hide();
        }
    } else {
        for (var i = 0; i < alphaOrder.length; i++) {
            fetchAllResults('people', 'Index=' + alphaOrder[i], artistsHandler);
        };
    }
}

//COLLECTIONS INDEX
function loadCollectionsIndex() {
    var req = apiRoot + 'collections/all';

    console.log(req)

    $.ajax({
        url: req,
        async: true,
        dataType: "jsonp",
        timeout: 2500
    })
        .success(function(json) {
            var collections = json.results;
            var template = $('#templates .collections').html();
            var html = Mustache.to_html(template, {
                collections: collections
            })
            $('#collections').html(html).show();
            $('#load').hide();
        });
};

//COLLECTION DETAIL
function loadCollection() {

    var hash = window.location.hash.split('/');

    var objID = hash[2];

    var req = apiRoot + 'collections/' + objID;

    if (isNaN(parseInt(objID))) {
        fail('This Request is Not Valid.', 'Collection ID must be a number, and should look like this: #/collection/3606.')
    } else {
        console.log(req)
        $.ajax({
            url: req,
            dataType: "jsonp",
            timeout: 2500
        })
            .success(function(json) {
                if (json.total_results === 0) {
                    $('#collection').show();
                    fail('This Collection Could Not Be Found', 'json.total_results === 0');
                } else {
                    var collection = json.results;
                    var template = $('#templates .collection').html();
                    var html = Mustache.to_html(template, collection);
                    $('#collection').html(html);

                    var works = collection.Objects;
                    var template = $('#templates .collection-works').html();
                    var html = Mustache.to_html(template, {
                        works: works
                    });
                    $('#collection').append(html).show();

                    $('#load').hide();
                }
            })
            .error(function(textStatus, error) {
                fail('This Collection Could Not Be Found', error);
            });
    }
}

//ARTWORK DETAIL
function loadArtwork() {

    var hash = window.location.hash.split('/');

    var objID = hash[2];

    var req = apiRoot + 'id/objects/' + objID;

    if (isNaN(parseInt(objID))) {
        fail('This Request is Not Valid.', 'Artwork ID must be a number, and should look like this: #/artwork/3606.')
    } else {
        console.log(req)
        $.ajax({
            url: req,
            dataType: "jsonp",
            timeout: 2500
        })
            .success(function(json) {
                artwork = json.results;
                if (json.total_results === 0) {
                    $('#artwork').show();
                    fail('This Artwork Could Not Be Found', 'We should confirm that it\'s in the API.');
                } else {
                    var template = $('#templates .artwork').html();
                    var html = Mustache.to_html(template, artwork);
                    $('#artwork').html(html).show();
                    $('#load').hide();
                }
            })
            .error(function(textStatus, error) {
                fail('This Collection Could Not Be Found', error);
            });
    }
}

//ARTIST DETAIL
function loadArtist() {

    var hash = window.location.hash.split('/');

    var artistID = hash[2];

    var req = apiRoot + 'id/people/' + artistID;

    if (isNaN(parseInt(artistID))) {
        fail('This Request is Not Valid.', 'Artist ID must be a number, and should look like this: #/artist/3606.')
    } else {

        console.log(req)

        $.ajax({
            url: req,
            dataType: "jsonp",
            timeout: 2500
        })
            .success(function(json) {
                artist = json.results;
                if (json.total_results === 0) {
                    $('#artist').show();
                    fail('This Artist Could Not Be Found', 'We should confirm that it\'s in the API.');
                } else {
                    //MUSTACHE FOR ARTIST METADATA
                    var template = $('#templates .artist').html();
                    var html = Mustache.to_html(template, artist);
                    $('#artist').html(html);

                    //OTHER WORKS BT ARTIST
                    var req = apiRoot + 'search/objects?ArtistID=' + artistID;
                    console.log(req)
                    $.ajax({
                        url: req,
                        dataType: "jsonp",
                        timeout: 2500
                    })
                        .success(function(json) {
                            var works = json.results;
                            var template = $('#templates .artist-works').html();
                            var html = Mustache.to_html(template, {
                                works: works
                            });
                            $('#artist').append(html).show();
                            $('#load').hide();
                        });
                }
            })
            .error(function(textStatus, error) {
                fail('This Collection Could Not Be Found', error);
            });
    }
}

//BUILDING DETAIL
function loadBuilding() {

    var hash = window.location.hash.split('/');

    var buildingID = hash[2];

    var req = apiRoot + 'id/buildings/' + buildingID;

    console.log(req)

    if (isNaN(parseInt(buildingID))) {
        fail('This Request is Not Valid.', 'Building ID must be a number, and should look like this: #/building/3606.')
    } else {
        $.ajax({
            url: req,
            dataType: "jsonp",
            timeout: 2500
        })
            .success(function(json) {
                building = json.results;
                if (json.total_results === 0) {
                    $('#building').show();
                    fail('This Building Could Not Be Found', 'We should confirm that it\'s in the API.');
                } else {
                    var building = json.results;
                    var template = $('#templates .building').html();
                    var html = Mustache.to_html(template, building);
                    $('#building').html(html).show();
                    $('#load').hide();
                }
            })
            .error(function(textStatus, error) {
                fail('This Collection Could Not Be Found', error);
            });
    }
}



//ROUTE HELPERS

//FETCHES all results for a search query, then routes them
function fetchAllResults(searchType, searchParams, handler) {

    var req = apiRoot + 'search/' + searchType + '?' + searchParams + '&end=1000';

    console.log(req)

    $.ajax({
        url: req,
        async: true,
        dataType: "jsonp",
        timeout: 10000
    })
        .success(function(json) {
            handler(json, searchType);
        });
};

//CACHES all artists, Saves as local storage
function artistsHandler(json) {
    for (var i = 0; i < json.total_results; i++) {
        var item = json.results[i]
        addValue(artistCache, item.index.toLowerCase(), item);
        console.log(item.index)
    };

    artistCache.status.push(json.results[0].index);
    if (artistCache.status.length === 26) {
        console.log('DONE')
        artistCache.status = 1;
        artistsAppend(artistCache);
        localStorage.setItem('artistCache', JSON.stringify(artistCache));
    }
}

//APPENDS artists to Artist Index, and preps next letter append on scroll function.
function artistsAppend(source) {
    $('#fail,#load').hide();
    $('#artists').show();

    for (var i = 0; i < Object.size(source) - 1; i++) {
        $('#artists').show().append('<div id="' + source[alphaOrder[i]][0].index.toLowerCase() + '"><h3>' + source[alphaOrder[i]][0].index + '</h3><ul></ul>')
        for (var j = 0; j < source[alphaOrder[i]].length; j++) {
            $('#artists #' + alphaOrder[i] + ' ul').append('<li><a href="' + '#/artist/' + source[alphaOrder[i]][j].id + '">' + source[alphaOrder[i]][j].displayName + '</a></li>');
        };
    };
}

//CACHES any result -- UNUSED
function cacheResults(item) {
    resultsCache.push(item);
}

function loading() {
    $('#fail').hide();
    $('section').hide();
    $('#load').show();
}

//APPENDS search results
function appendResults(json, type) {
    console.log('APPEND RESULTS', type)
    var results = json.results;
    var template = $('#templates .results-' + type).html();
    var html = Mustache.to_html(template, {
        results: results
    });
    $('#results').html(html).show();
    $('#load').hide();
}

//ERROR REPORT
function fail(message, description) {
    if (message === null) {
        message = 'ERROR';
    }
    if (description === null) {
        description === '';
    }
    $('#fail').html('').append('<h3>' + message + '</h3>').append('<p>' + description + '</p>').show();
    $('#load').hide();
}