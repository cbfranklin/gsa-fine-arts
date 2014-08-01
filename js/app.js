var apiRoot = //'http://159.142.125.32:8080/emuseum/api/',
    'https://hvemuseum2.gallerysystems.com/emuseum/api/',

    artistsCache = {
        artists: {
            "a": [],
            "b": [],
            "c": [],
            "d": [],
            "e": [],
            "f": [],
            "g": [],
            "h": [],
            "i": [],
            "j": [],
            "k": [],
            "l": [],
            "m": [],
            "n": [],
            "o": [],
            "p": [],
            "q": [],
            "r": [],
            "s": [],
            "t": [],
            "u": [],
            "v": [],
            "w": [],
            "x": [],
            "y": [],
            "z": []
        },
        "status": [],
        "date": null
    },

    galleriesCache = {
        "galleries": null,
        "date": null
    },

    alphaOrder = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],

    states = {
        "al": "alabama",
        "ak": "alaska",
        "az": "arizona",
        "ar": "arkansas",
        "ca": "california",
        "co": "colorado",
        "ct": "connecticut",
        "dc": "district of columbia",
        "de": "delaware",
        "fl": "florida",
        "ga": "georgia",
        "hi": "hawaii",
        "id": "idaho",
        "il": "illinois",
        "in": "indiana",
        "ia": "iowa",
        "ks": "kansas",
        "ky": "kentucky",
        "la": "louisiana",
        "me": "maine",
        "md": "maryland",
        "ma": "massachusetts",
        "mi": "michigan",
        "mn": "minnesota",
        "ms": "mississippi",
        "mo": "missouri",
        "mt": "montana",
        "ne": "nebraska",
        "nv": "nevada",
        "nh": "new hampshire",
        "nj": "new jersey",
        "nm": "new mexico",
        "ny": "new york",
        "nc": "north carolina",
        "nd": "north dakota",
        "oh": "ohio",
        "ok": "oklahoma",
        "or": "oregon",
        "pa": "pennsylvania",
        "ri": "rhode island",
        "sc": "south carolina",
        "sd": "south dakota",
        "tn": "tennessee",
        "tx": "texas",
        "ut": "utah",
        "vt": "vermont",
        "va": "virginia",
        "wa": "washington",
        "wv": "west virginia",
        "wi": "wisconsin",
        "wy": "wyoming"
    },

    preloadMe = [
        'img/social-media/facebook.png',
        'img/social-media/twitter.png',
        'img/social-media/pinterest.png',
        'img/social-media/email.png',
        'img/social-media/print.png',
        'img/social-media/facebook-active.png',
        'img/social-media/twitter-active.png',
        'img/social-media/pinterest-active.png',
        'img/social-media/email-active.png',
        'img/social-media/print-active.png'
    ],

    isOldIE;

$(function() {
    $('#load').show();
    ie();
    if (isOldIE === true) {
        return;
    }
    /*helloDevs();*/
    preloadImages();
    bindings();
    routes();
    $(window).hashchange(function() {
        $('#fail').hide();
        $('section').hide();
        $('#load').show();
        routes();
    });
});

function helloDevs() {
    console.log(
        ' _______________________________________ \n' +
        '|                                       |\n' +
        '|          Welcome, Developers!         |\n' +
        '|                                       |\n' +
        "|       All JSON requests to GSA's      |\n" +
        '|      Fine Arts API will be logged     |\n' +
        '|          to the console below.        |\n' +
        '|_______________________________________|\n ');
}

function ie() {
    if (navigator.userAgent.indexOf('MSIE 7') > -1 && !$('html').hasClass('ie7')) {
        $('#wrapper').hide();
        $('#compatibility-mode').show();
        isOldIE = true;
        $('#load').hide();
    } else if (navigator.userAgent.indexOf('MSIE 8') > -1) {
        $('#wrapper').hide();
        $('#old-ie').show();
        isOldIE = true;
        $('#load').hide();
    } else {
        $('#old-ie,#compatibility-mode').remove();
    }
}

//ROUTING
function routes() {
    //HOME PAGE
    if (window.location.hash === '' ||
        window.location.hash === '#' ||
        window.location.hash === '#/') {
        loadHomePage();
    }
    //ARTISTS INDEX
    else if (window.location.hash.indexOf('#/artists') !== -1) {
        loadArtists();
    }
    //GALLERIES
    else if (window.location.hash.indexOf('#/galleries') !== -1) {
        loadGalleries();
    }
    //ABOUT
    else if (window.location.hash.indexOf('#/about') !== -1) {
        loadAbout();
        //OVERVIEWS
    } else if (window.location.hash.indexOf('#/artwork/') !== -1) {
        loadArtwork();
    } else if (window.location.hash.indexOf('#/artist/') !== -1) {
        loadArtist();
    } else if (window.location.hash.indexOf('#/building/') !== -1) {
        loadBuilding();
    } else if (window.location.hash.indexOf('#/gallery') !== -1) {
        loadGallery();
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
    }
    //SEARCH
    else if (window.location.hash.indexOf('#/search') !== -1) {
        loadSearch();
    }
    //LOCATION
    else if (window.location.hash.indexOf('#/location') !== -1) {
        loadLocation();
    } else {
        fail('404', 'Route Not Found. Please double check the URL and try again.')
    }
    scrollToAnchor('wrapper', 0, 0)
}

//CLICKS
function bindings() {
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

    $("img").on('error', function() {
        $(this).unbind("error").attr("src", "broken.gif");
    });
}

//ROUTES

//HOME PAGE
function loadHomePage() {
    animateSplash();
    $('#load').hide();
    $('#home').show();

    function animateSplash() {

        var play = true,
            order = [6, 2, 9, 4, 7, 1, 10, 2, 11, 8, 3],
            interval = 1500, //2000
            pause = 4000,
            fadeInTime = 1800, //2500
            fadeOutTime = 1800, //2500
            itemQueue = [],
            fadeOutQueue = [],
            rotateQueue,
            currentItem;

        rotate();

        $("#home #splash").hover(
            function() {
                //CANCEL ROTATION
                play = false;
                //CLEAR ALL ACTIVE TIMEOUTS
                for (i = 0; i < itemQueue.length; i++) {
                    clearTimeout(itemQueue[i])
                };
                for (i = 0; i < fadeOutQueue.length; i++) {
                    clearTimeout(fadeOutQueue[i])
                };
                clearTimeout(rotateQueue);

                //REORDER ARRAY TO RESUME ROTATION
                var anustart = order.indexOf(currentItem);
                //COOOOOOINCIDENCE!
                var newOrder = [];

                for (i = anustart; i < order.length; i++) {
                    newOrder.push(order[i]);
                }
                for (i = 0; i < anustart; i++) {
                    newOrder.push(order[i])
                };

                order = newOrder;


            },
            function() {
                play = true;
                rotate();
            }
        );

        $('#home #splash > div').hover(
            function() {
                //BRING UP ITEM DETAILS, HIDE ALL OTHERS
                $(this).children('.splash-details').fadeIn().children('p').show();
                $(this).siblings().children('.splash-details').hide().children('p').hide();
            },
            function() {
                $(this).children('.splash-details').hide().children('p').hide();
            }
        );

        function rotate() {
            for (var i = 0; i < order.length; i++) {

                var item = order[i];

                itemQueue[i] = setTimeout(fade, i * interval, item);

                /*IE8 SUPPORT NO LONGER NECESSARY:
                itemQueue[i] = setTimeout((function(item) {
                    return function() {
                        fade(item);
                    };
                })(item), i * interval);

                if (i === order.length - 1) {
                    rotateQueue = setTimeout(function() {
                        rotate();
                    }, (interval * i) + pause);
                };*/

                function fade(item) {
                    if (play === true) {
                        currentItem = item;
                        $('#home #splash .splash-' + item + ' .splash-details').fadeIn(fadeInTime);
                        var fadeOut = setTimeout(function() {
                            if (play === true) {
                                $('#home #splash .splash-' + item + ' .splash-details').fadeOut(fadeOutTime);
                            }
                        }, pause + fadeInTime);

                        fadeOutQueue.push(fadeOut);
                    }
                    /*else {
                        console.log('FADE suppressed ITEM # ' + item);
                    }*/
                }
            }
        }
    };
}

function loadAbout() {
    $('#about').show();
    $('#load').hide();
}

function loadSearch() {
    $('#search').show();
    $('#load').hide();

    //BIND SEARCH BUTTONS
    $('#search-for-artwork button').on('click', searchForArtwork);

    $('#search-for-artist button').on('click', searchForArtist);

    $('#search-for-buildings button').on('click', searchForBuildings);

    //PULL CITIES FOR SELECTED STATE
    $('#search').on('change', '#state', function() {
        $('#city').attr('disabled', 'disabled').html('<option value="">Loading Cities...</option>').parent('.selectWrapper').addClass('loading');
        var state = $(this).val();
        $.ajax({
            url: apiRoot + 'search/buildings?State=' + state + '&end=1000',
            dataType: "jsonp",
            timeout: 2500
        })
            .success(function(json) {
                results = json.results;
                if (json.total_results === 0) {
                    noArtwork()
                } else {
                    var cities = [];
                    for (i in results) {
                        if (cities.indexOf(results[i].city) === -1) {
                            cities.push(results[i].city)
                        }
                    }
                    if (cities[0] === undefined) {
                        noArtwork()
                    } else {
                        $('#city').html('<option value="">Select a City</option>')
                        for (i in cities) {
                            if (cities[i] !== undefined) {
                                $('#city').append('<option value="' + cities[i] + '">' + cities[i] + '</option>')
                            }
                        }
                        $('#city').removeAttr('disabled').parent('.selectWrapper').removeClass('loading').removeClass('disabled');
                    }
                }
            })
            .error(function(textStatus, error) {
                noArtwork()
            });

        function noArtwork() {
            $('#city').html('<option value="">No Artwork Found</option>').parent('.selectWrapper').removeClass('loading').addClass('disabled');
        }
    });

    //BIND ENTER KEY
    Mousetrap.bindGlobal(['enter'], function(e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            //internet exploder
            e.returnValue = false;
        }
        if ($('#search-for-artwork input[type=text]').is(":focus")) {
            searchForArtwork()
        }
        if ($('#search-for-artist input[type=text]').is(":focus")) {
            searchForArtist()
        }
        if ($('#search-for-buildings input[type=text]').is(":focus")) {
            searchForBuildings()
        }
    });

    //BUILD SEARCH QUERIES
    function searchForArtwork() {
        var base = '#/results/artwork?keyword=';
        var keywords = $('#keywords-artwork').val().doorknob();
        window.location.href = base + keywords;
    };

    function searchForArtist() {
        var base = '#/results/artists?keyword=';
        var keywords = $('#keywords-artist').val().doorknob();
        window.location.href = base + keywords;
    };

    function searchForBuildings() {
        var base = '#/results/buildings?';
        var parameters = [];

        if ($('#search #building-name').val() !== '' && $('#search #building-name').val() !== undefined) {
            parameters.push('keyword=' + $('#search #building-name').val().doorknob());
        }
        if ($('#search #state ').val() !== '' && $('#search #state').val() !== undefined) {
            parameters.push('State=' + $('#search #state').val());

        }
        if ($('#search #city').val() !== '' && $('#search #city').val() !== undefined) {
            parameters.push('City=' + $('#search #city').val());
        }

        window.location.href = base + parameters.join('&');
    };
};

function loadLocation() {
    $('#location').show();
    $('#load').hide();
    var mapWidth = $('#location').width();
    var mapHeight = mapWidth * 0.75;
    $('#map').css({
        width: mapWidth,
        height: mapHeight
    });
    $('#map').usmap({
        stateHoverAnimation: 0,
        stateStyles: {
            fill: '#C8E5F2',
            stroke: '#7C97AD'
        },
        stateHoverStyles: {
            fill: '#ea3239',
            stroke: '#911D21'
        },
        labelBackingStyles: {
            fill: '#C8E5F2',
            stroke: '#7C97AD'
        },
        labelTextStyles: {
            fill: 'black'
        },
        labelBackingHoverStyles: {
            fill: '#ea3239',
            stroke: '#911D21'
        },
        'click': function(event, data) {
            $('#location #state option[value="' + data.name + '"]').attr("selected", "selected");
            browseByState(data.name);
        }
    });

    $('#location').on('change', '#state', function() {
        $("#map > svg > path").each(function() {
            $(this).css('fill', '');
        });
        var state = $(this).val();
        $('#' + state).css('fill', 'red');
        browseByState(state);
    });

    function browseByState(state) {
        $('#location .selectWrapper').addClass('loading');
        $("#map > svg > path").each(function() {
            $(this).css('fill', '');
        });
        $('#' + state).css('fill', 'red');
        $('#location #results-location').html('').hide();
        var req = apiRoot + 'search/buildings?State=' + state + '&end=1000'
        console.log('JSON request: ' + req)
        $.ajax({
            url: req,
            dataType: "jsonp",
            timeout: 2500
        })
            .success(function(json) {
                var results = json.results;
                if (json.total_results === 0 || json === undefined) {
                    var html = '<h3>Buildings in ' + states[json.search_value[0].value.toLowerCase()].titleCase() + '<span style="float:right" class="label label-default label-danger">0</span></h3><h4>No Buildings Found</h4>'
                    $('#location #results-location').html(html).show();
                } else {
                    var locations = [];
                    for (i in results) {
                        var hasCity = false,
                            cityIndex = null;
                        for (j in locations) {
                            if (locations[j].city === results[i].city) {
                                hasCity = true;
                                cityIndex = j;
                            }
                        }
                        if (!hasCity) {
                            var city = {
                                city: results[i].city,
                                buildings: [
                                    results[i]
                                ]
                            };
                            locations.push(city);
                        } else {
                            if (cityIndex !== 'last') {
                                //IE PROBLEM
                                locations[cityIndex].buildings.push(results[i]);
                            }
                        }
                    }

                    /*locations[0].buildings.sort(function(a, b) {
                        return a.building.toLowerCase().localeCompare(b.building.toLowerCase());
                    });*/

                    for (i = 0; i < locations.length; i++) {
                        locations[i].buildings.sort(function(a, b) {
                            return a.building.toLowerCase().localeCompare(b.building.toLowerCase());
                        });
                    }

                    var state = states[results[0].state.toLowerCase()].titleCase();

                    var template = $('#templates .results-location').html();
                    var html = Mustache.to_html(template, {
                        locations: locations,
                        state: state,
                        total: json.total_results
                    });

                    $('#location #results-location').html(html).show();

                    $('.results-location-header').sticky();
                }
                $('#location .selectWrapper').removeClass('loading')
                scrollToAnchor('results-location');
            })
            .error(function(textStatus, error) {
                var html = '<h3>Buildings<span style="float:right" class="label label-default label-danger">0</span></h3><h4>Server Error: No Buildings Found</h4>';
                $('#location #results-location').html(html).show().scrollToAnchor();
                $('#location .selectWrapper').removeClass('loading')
            });
    }
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
    $('#load').show();
    /*if (localStorage['fineArtsDB_artistsCache']) {
        if ($('#artists div').length === 26) {
            console.log('ARTISTS: DOM is preserved. No Action.')
            $('#load').hide();
            $('#artists').show();
            artistsReady();
        } else {
            artistsAppend(JSON.parse(localStorage['artistsCache']));
            console.log('ARTISTS: artistsCache exists in localStorage.')
            artistsReady();
        }
    } else {*/
    console.log('ARTISTS: No artistsCache, pulling from API.')
    for (var i = 0; i < alphaOrder.length; i++) {
        fetchAllResults('people', 'Index=' + alphaOrder[i], artistsHandler);
    };
    //}
}

function artistsReady() {

    $('#artists').show();
    //LIVE FILTER
    $('#artists').liveFilter('#filter', '.artist', {
        filterChildSelector: 'a',
        filter: function(el, val) {
            val = val.replace(/,/g, '');
            var regex = new RegExp('((?:[a-z][a-z]+)) ');
            if (regex.test(val)) {
                valarray = val.split(' ');
                var regex2 = '(?=.*{{first}}).*?(?=.*{{second}})';
                regex2 = regex2.replace(/\{\{first\}\}/g, valarray[0]).replace(/\{\{second\}\}/g, valarray[1]);
                var regex2 = new RegExp(regex2, 'i');
                return regex2.test($(el).text());
            } else {
                return $(el).text().toUpperCase().indexOf(val.toUpperCase()) >= 0;
            }
        },
        after: function() {
            for (i = 0; i < 26; i++) {
                if ($('#artists-index div').eq(i).find('.artist:not(.hidden)').length === 0) {
                    $('#artists-index  div').eq(i).hide();
                } else {
                    $('#artists-index div').eq(i).show();
                }
            }
        }
    });
    $('#load').hide()

    //BROWSE WITH SELECT MENU
    $('#selectAlphaWrapper select').change(function() {
        //$('#filter').liveFilterClear();

        var val = $(this).val();

        scrollToAnchor(val, -200)
    });

    $('#artists-search').sticky();
}

//GALLERIES
function loadGalleries() {
    //IF IN MEMORY
    /*    if (galleriesCache !== null) {
        galleriesHandler(galleriesCache);
    } else {
        //IF IN LOCALSTORAGE
        if (localStorage['fineArtsDB_galleriesCache']) {
            galleriesCache = JSON.parse(localStorage['fineArtsDB_galleriesCache']);
            galleriesHandler(galleriesCache);
        } else {*/
    //IF NEITHER
    var req = apiRoot + 'collections/all';

    console.log('JSON request: ' + req)

    $.ajax({
        url: req,
        async: true,
        dataType: "jsonp",
        timeout: 10000
    })
        .success(function(json) {
            galleriesHandler(json.results);
            galleriesCache = json.results;
            localStorage.setItem('fineArtsDB_galleriesCache', JSON.stringify(galleriesCache));

        })
        .error(fail);
    //}
    //}
};

function galleriesHandler(galleries) {
    for (i in galleries) {
        if (galleries[i].fileName) {
            galleries[i].fileName = formatImagePath(galleries[i].fileName);
        }
    }
    galleries.sort(function(a, b) {
        return a.collection.toLowerCase().localeCompare(b.collection.toLowerCase());
    });
    for (i in galleries) {
        galleries[i].primaryImage = galleries[i].primaryImage
    }
    var template = $('#templates .galleries').html();
    var html = Mustache.to_html(template, {
        galleries: galleries
    })
    $('#galleries').html(html).show();
    $('#load').hide();
}

//GALLERY DETAIL
function loadGallery() {

    //GALLERY ID
    var hash = window.location.hash.split('/');
    var objID = hash[2];

    //IF IN MEMORY
    if (galleriesCache !== null) {
        var gallery = galleriesCache.filter(function(obj) {
            return obj.id == objID;
        });
        galleryHandler(gallery[0]);
    } else {
        //IF IN LOCALSTORAGE
        if (localStorage['fineArtsDB_galleriesCache']) {
            galleriesCache = JSON.parse(localStorage['fineArtsDB_galleriesCache']);
            var gallery = galleriesCache.filter(function(obj) {
                return obj.id == objID;
            });
            galleryHandler(gallery[0]);
        } else {
            //IF NEITHER, ITS JSON TIME
            var req = apiRoot + 'collections/all';

            console.log('JSON request: ' + req)

            $.ajax({
                url: req,
                async: true,
                dataType: "jsonp",
                timeout: 10000
            })
                .success(function(json) {

                    galleriesCache = json.results;
                    localStorage.setItem('fineArtsDB_galleriesCache', JSON.stringify(galleriesCache));

                    var gallery = galleriesCache.filter(function(obj) {
                        return obj.id == objID;
                    });
                    galleryHandler(gallery[0]);
                })
                .error(fail);
        }
    }
}

function galleryHandler(gallery) {
    gallery.Objects.sort(imagesFirst);

    var totalImages = 0;
    for (i in gallery.Objects) {
        if (gallery.Objects[i].primaryImage) {
            gallery.Objects[i].primaryImage = formatImagePath(gallery.Objects[i].primaryImage);
            totalImages += 1;
        }
    }

    var total = gallery.Objects.length;


    var template = $('#templates .gallery').html();
    var html = Mustache.to_html(template, {
        gallery: gallery,
        total: total,
        totalImages: totalImages
    });
    $('#gallery').html(html).show();
    $('.leftCol nav h2').on('click', function() {
        if ($(this).attr('id')) {
            var val = $(this).attr('id').replace('nav-', '');
            scrollToAnchor(val);
        }
    });
    $('.leftCol nav').stick_in_parent({
        parent: $('.row')
    });
    $('#load').hide();
}

//ARTWORK DETAIL
function loadArtwork() {

    var hash = window.location.hash.split('/');

    var objID = hash[2];

    var req = apiRoot + 'id/objects/' + objID;

    if (isNaN(parseInt(objID))) {
        fail('This Request is Not Valid.', 'Artwork ID must be a number, and should look like this: #/artwork/3606.')
    } else {
        console.log('JSON request: ' + req)
        $.ajax({
            url: req,
            dataType: "jsonp",
            timeout: 2500
        })
            .success(function(json) {
                artwork = json.results;
                if (json.total_results === 0) {
                    fail('This Artwork Could Not Be Found', 'We should confirm that it\'s in the API.');
                } else {
                    var template = $('#templates .artwork').html();

                    //TEXT TYPE INTERPRETATION
                    if (artwork.ObjTextEntries) {
                        if (isArray(artwork.ObjTextEntries)) {
                            var interpretation = artwork.ObjTextEntries.filter(function(obj) {
                                return obj.textType == 'Interpretation';
                            });
                            if (interpretation.length > 0) {
                                interpretation = interpretation[0].textEntry;
                            }
                        } else {
                            if (artwork.ObjTextEntries.hasOwnProperty('Interpretation')) {
                                var interpretation = artwork.ObjTextEntries.textEntry;
                            }
                        }
                    }

                    if (artwork.ObjMedia) {
                        if (isArray(artwork.ObjMedia)) {
                            if (artwork.ObjMedia[0].copyright) {
                                artwork.photoCredit = artwork.ObjMedia[0].copyright;
                            }
                        } else {
                            if (artwork.ObjMedia.copyright) {
                                artwork.photoCredit = artwork.ObjMedia.copyright;
                            }
                        }
                    }

                    //RELATED ARTWORK
                    var artistRelated = [],
                        siteRelated = [],
                        collectionRelated = [];

                    if (artwork.artistRelatedObjects) {
                        if (!isArray(artwork.artistRelatedObjects)) {
                            var aro = artwork.artistRelatedObjects;
                            artwork.artistRelatedObjects = [];
                            artwork.artistRelatedObjects.push(aro);
                        }
                        artistRelated = artwork.artistRelatedObjects;
                    }

                    if (artwork.siteRelatedObjects) {
                        if (!isArray(artwork.siteRelatedObjects)) {
                            var sro = artwork.siteRelatedObjects;
                            artwork.siteRelatedObjects = [];
                            artwork.siteRelatedObjects.push(sro);
                        }
                        siteRelated = artwork.siteRelatedObjects;
                    }

                    if (artwork.Collections) {
                        if (!isArray(artwork.Collections)) {
                            var c = artwork.Collections;
                            artwork.Collections = [];
                            artwork.Collections.push(c);
                        }
                        for (i in artwork.Collections) {
                            if (!isArray(artwork.Collections[i].objects)) {
                                var aco = artwork.Collections[i].objects;
                                artwork.Collections[i].objects = [];
                                artwork.Collections[i].objects.push(aco);
                            }
                            collectionRelated.concat(artwork.Collections[i].objects)
                        }
                        //collectionRelated = artwork.Collections.objects;
                    }

                    //CONCAT INTO ONE ARRAY
                    var relatedWorks = [];
                    relatedWorks = relatedWorks.concat(artistRelated, siteRelated, collectionRelated);
                    if (relatedWorks.length > 0) {
                        //REMOVE THOSE WITHOUT IMAGES
                        relatedWorks = relatedWorks.filter(hasImage);
                    }
                    if (relatedWorks.length > 8) {
                        relatedWorks.splice(8, relatedWorks.length)
                    }
                    var hasRelated = (relatedWorks.length > 0);
                    if (artwork.ObjMedia) {
                        var additional = [];
                        if (!isArray(artwork.ObjMedia)) {
                            if (artwork.ObjMedia.primaryDisplay === 1) {
                                additional = null;
                            }
                        } else {
                            for (i in artwork.ObjMedia) {
                                if (artwork.ObjMedia[i].primaryDisplay !== 1) {
                                    additional.push(artwork.ObjMedia[i]);
                                }
                            }
                        }
                        var hasAdditional = (artwork.ObjMedia.length > 0);
                    }
                    //var template = $('#templates .artwork-works').html();

                    //FORMAT IMAGE FILENAMES
                    if (hasRelated) {
                        for (i in relatedWorks) {
                            if (relatedWorks[i].primaryImage) {
                                relatedWorks[i].primaryImage = formatImagePath(relatedWorks[i].primaryImage);
                            }
                        }
                    }

                    if (hasAdditional) {
                        for (i in additional) {
                            if (additional[i].fileName) {
                                additional[i].fileName = formatImagePath(additional[i].fileName);
                            }
                        }
                    }

                    if (artwork.primaryImage) {
                        artwork.primaryImage = formatImagePath(artwork.primaryImage);
                    } else {
                        if (hasAdditional) {
                            artwork.primaryImage = formatImagePath(additional[0].fileName);
                            additional.splice(0, 1);
                        }
                    }


                    var html = Mustache.to_html(template, {
                        artwork: artwork,
                        interpretation: interpretation,
                        related: relatedWorks,
                        hasRelated: hasRelated,
                        additional: additional,
                        hasAdditional: hasAdditional
                    });
                    $('#artwork').html(html).show();

                    $('.leftCol nav').stick_in_parent({
                        parent: $('.row')
                    });
                    $('.leftCol nav h2').on('click', function() {
                        if ($(this).attr('id')) {
                            var val = $(this).attr('id').replace('nav-', '');
                            scrollToAnchor(val);
                        }
                    });
                    //SWAP FEATURED IMAGE AREA ON CLICK
                    $('#additional-images a').on('click', function(event) {
                        var display = $(this).attr('href');
                        var large = display.replace('/display', '/large')
                        $('img.featured').attr('src', display).parent('a').attr('href', large);
                        $('.click-to-enlarge').attr('href', large);
                        if ($(this).attr('data-credit')) {
                            $('.photo-credit span').text($(this).attr('data-credit'));
                        }
                        $('#artwork-overview').scrollToAnchor();
                        event.preventDefault();
                    });

                    $('#load').hide();
                }
            })
            .error(function(request, status, error) {
                fail('This Artwork Could Not Be Found', status);
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

        console.log('JSON request: ' + req)

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
                    //var template = $('#templates .artist').html();
                    //var html = Mustache.to_html(template, artist);
                    //$('#artist').html(html);

                    //RELATED ARTWORK
                    var works = artist.Objects;
                    if (artist.PeopleTextEntries) {
                        var pte = artist.PeopleTextEntries;
                        console.log(pte)
                        //Is PTE an object (1 result only), or an array (multiple results)
                        if (isArray(pte)) {
                            for (i in pte) {
                                if (pte[i].textType.indexOf('Web') > -1) {
                                    var artistInfo = pte[i].textEntry;
                                }
                            }
                        }
                        //motherfuckers...
                        else {
                            if (pte.textType.indexOf('Web') > -1) {
                                var artistInfo = pte[i].textEntry;
                            }
                        }
                    }
                    //GAH
                    if (!isArray(works)) {
                        var work = works;
                        var works = [];
                        works.push(work);
                    }
                    for (i in works) {
                        if (works[i].primaryImage) {
                            works[i].primaryImage = formatImagePath(works[i].primaryImage);
                        }
                    }

                    var template = $('#templates .artist').html();
                    var html = Mustache.to_html(template, {
                        artist: artist,
                        works: works,
                        artistInfo: artistInfo
                    });
                    $('#artist').html(html).show();

                    $('.leftCol nav').stick_in_parent({
                        parent: $('.row')
                    });
                    $('.leftCol nav h2').on('click', function() {
                        var val = $(this).attr('id').replace('nav-', '');
                        scrollToAnchor(val);
                    });
                    $('#load').hide();
                }
            })
            .error(function(textStatus, error) {
                fail('This Artist Could Not Be Found', error);
            });
    }
}

//BUILDING DETAIL
function loadBuilding() {

    var hash = window.location.hash.split('/');

    var buildingID = hash[2];

    var req = apiRoot + 'id/buildings/' + buildingID;

    console.log('JSON request: ' + req)

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

                    //RELATED ARTWORK
                    var works = building.Objects;

                    works.sort(function(a, b) {
                        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
                    });
                    //Buildings Artwork is stored in array "Objects",
                    //unless there's only ONE work of art, in which case Objects IS that artwork entry...lovely.
                    if (works.length > 0 || works.hasOwnProperty('id')) {
                        var hasWorks = true;
                    }

                    var template = $('#templates .building').html();
                    var html = Mustache.to_html(template, {
                        building: building,
                        works: works,
                        hasWorks: hasWorks
                    });
                    $('#building').html(html).show();

                    $('.leftCol nav').stick_in_parent({
                        parent: $('.row')
                    });
                    $('.leftCol nav h2').on('click', function() {
                        var val = $(this).attr('id').replace('nav-', '');
                        scrollToAnchor(val);
                    });

                    $('#load').hide();
                }
            })
            .error(function(textStatus, error) {
                fail('This Building Could Not Be Found', error);
            });
    }
}



//ROUTE HELPERS

//FETCHES all results for a search query, then routes them
function fetchAllResults(searchType, searchParams, handler) {

    var req = apiRoot + 'search/' + searchType + '?' + searchParams + '&end=1000';

    console.log('JSON request: ' + req)

    $.ajax({
        url: req,
        async: true,
        dataType: "jsonp",
        timeout: 10000
    })
        .success(function(json) {
            handler(json, searchType);
        })
        .error(function(textStatus, error) {
            fail('Server Connection Timed Out');
        });
};

//CACHES all artists, Saves as local storage
function artistsHandler(json) {
    for (var i = 0; i < json.total_results; i++) {
        var item = json.results[i]
        addValue(artistsCache, item.index.toLowerCase(), item);
    };

    artistsCache.status.push(json.results[0].index);
    if (artistsCache.status.length === 26) {
        console.log('DONE')
        //delete artistsCache.status;
        //console.log(artistsCache)
        artistsAppend(artistsCache);
        //var stringified = JSON.stringify(artistsCache);
        //localStorage.setItem('fineArtsDB_artistsCache', stringified);
    }
}

//APPENDS artists to Artist Index, and preps next letter append on scroll function.
function artistsAppend(source) {
    $('#fail,#load').hide();

    for (var i = 0; i < Object.size(source) - 1; i++) {
        $('#artists #artists-index').show().append('<div id="' + source[alphaOrder[i]][0].index.toLowerCase() + '"><h3>' + source[alphaOrder[i]][0].index + '</h3><ul></ul>')
        for (var j = 0; j < source[alphaOrder[i]].length; j++) {
            if (source[alphaOrder[i]][j].lastName && source[alphaOrder[i]][j].firstName) {
                var name = '<strong>' + source[alphaOrder[i]][j].lastName + '</strong> ' + source[alphaOrder[i]][j].firstName;
            } else {
                var name = '<strong>' + source[alphaOrder[i]][j].displayName + '</strong>';
            }
            $('#artists #' + alphaOrder[i] + ' ul').append('<li class="artist"><a href="' + '#/artist/' + source[alphaOrder[i]][j].id + '">' + name + '</a></li>');
        };
        if (i === 25) {
            artistsReady();
        }
    };
}


//CACHES any result -- UNUSED
function cacheResults(item) {
    resultsCache.push(item);
}

//APPENDS search results
function appendResults(json, type) {
    console.log(type)
    var results = json.results;
    if (json.results.length !== 0) {
        //SORT RESULTS WITH IMAGES FIRST
        if (results.length > 1) {
            if (type === 'objects') {
                results.sort(imagesFirst);
                //SORT ALPHA BY TITLE
                results = results.sort(function(a, b) {
                    if (a.title && b.title) {
                        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
                    }
                });
            }
            if (type === 'people') {
                results = results.sort(function(a, b) {
                    if (a.lastName && b.lastName) {
                        return a.lastName.toLowerCase().localeCompare(b.lastName.toLowerCase());
                    }
                });
            }
            if (type === 'buildings') {
                for (i in results) {
                    if (results[i].building == undefined) {
                        results.splice(i, 1)
                    }
                }
                results = results.sort(function(a, b) {
                    if (a.building && b.building) {
                        return a.building.toLowerCase().localeCompare(b.building.toLowerCase());
                    }
                });

            }
        }

        //GET SEARCH PARAMETERS AS OBJECT
        var searchParams = window.location.hash.split('?')[1].split("&").map(function(n) {
            return n = n.split("="), this[n[0]] = n[1], this
        }.bind({}))[0];

        var yourQuery = null;

        //BUILD STRING SUMMARY FOR QUERY
        if (searchParams.keyword && searchParams.City && searchParams.State) {
            yourQuery = '"' + searchParams.keyword + '" in ' + searchParams.City + ', ' + searchParams.State;
        }
        if (!searchParams.keyword && searchParams.City && searchParams.State) {
            yourQuery = searchParams.City + ', ' + searchParams.State;
        }
        if (!searchParams.keyword && !searchParams.City && searchParams.State) {
            yourQuery = states[searchParams.state.toLowerCase()].titleCase();
        }
        if (searchParams.keyword && !searchParams.City && searchParams.State) {
            yourQuery = '"' + searchParams.keyword + '" in ' + searchParams.states[searchParams.State.toLowerCase()].titleCase();
        }
        if (searchParams.keyword && !searchParams.City && !searchParams.State) {
            yourQuery = '"' + searchParams.keyword + '"'
        }
        yourQuery = yourQuery.replace('%20', ' ')

        var totalImages = 0;
        //FORMAT IMAGE PATHS
        for (i in results) {
            if (results[i].primaryImage) {
                results[i].primaryImage = formatImagePath(results[i].primaryImage);
                totalImages += 1;
            }
        }

        var highEnd = 200;
        if (json.total_results > highEnd) {
            var over9000 = true;
        }


        var template = $('#templates .results-' + type).html();
        var html = Mustache.to_html(template, {
            results: results,
            total: json.total_results,
            over9000: over9000,
            highEnd: highEnd,
            yourQuery: yourQuery
        });
        $('#results').html(html).show();
        $('#load').hide();

        $('#results h1').sticky();
    } else {
        $('#results').html('<h1>Search Results</h1><h2>No Results Found.</h2>').show();
        $('#load').hide();
    }
}





//ERROR REPORT
function fail(message, description) {
    if (message === undefined) {
        var message = 'ERROR';
    }
    if (description === undefined) {
        var description = 'Probably an issue reaching the API';
    }
    $('#fail').html('').append('<h3>' + message + '</h3>').append('<p>' + description + '</p>').show();
    $('#load,section').hide();
};